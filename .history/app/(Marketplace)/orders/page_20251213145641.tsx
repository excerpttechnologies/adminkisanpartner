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
  SelectChangeEvent,
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
  FilterList,
  Refresh,
  Search,
  MoreVert,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- TYPE DEFINITIONS ---------------- */
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

/* ---------------- MOCK DATA ---------------- */
const initialRows: OrderRow[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  date: `2025-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
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
  /* ---------------- STATE MANAGEMENT ---------------- */
  const [rows, setRows] = useState<OrderRow[]>(initialRows);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "All">("All");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const [loading, setLoading] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuRow, setActionMenuRow] = useState<OrderRow | null>(null);

  /* ---------------- FILTERED AND PAGINATED DATA ---------------- */
  const filteredRows = rows.filter(row => {
    const matchesSearch = 
      row.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.orderBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || row.payment === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ---------------- SELECTION HANDLERS ---------------- */
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedRows.map(row => row.id);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else {
      newSelected = selectedRows.filter(rowId => rowId !== id);
    }

    setSelectedRows(newSelected);
  };

  const isRowSelected = (id: number) => selectedRows.includes(id);
  const isAllSelected = paginatedRows.length > 0 && selectedRows.length === paginatedRows.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < paginatedRows.length;

  /* ---------------- CRUD OPERATIONS ---------------- */
  const handleEdit = (row: OrderRow) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleSaveEdit = () => {
    if (selectedRow) {
      setRows(rows.map(row => row.id === selectedRow.id ? selectedRow : row));
      setOpenEdit(false);
      showSnackbar("Order updated successfully!", "success");
    }
  };

  const handleDelete = (row: OrderRow) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      setRows(rows.filter(row => row.id !== selectedRow.id));
      setOpenDelete(false);
      showSnackbar("Order deleted successfully!", "success");
    }
  };

  const confirmBulkDelete = () => {
    setRows(rows.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setOpenBulkDelete(false);
    showSnackbar(`${selectedRows.length} orders deleted successfully!`, "success");
  };

  /* ---------------- EXPORT FUNCTIONS ---------------- */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
    showSnackbar("Exported to Excel successfully!", "success");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Date", "Crop", "Farmer", "Order By", "Status", "Payment", "Amount", "Quantity"]],
      body: filteredRows.map(row => [
        row.id,
        row.date,
        row.crop,
        row.farmer,
        row.orderBy,
        row.status,
        row.payment,
        `$${row.amount}`,
        row.quantity
      ]),
    });
    doc.save("orders.pdf");
    showSnackbar("Exported to PDF successfully!", "success");
  };

  const copyToClipboard = () => {
    const text = filteredRows
      .map(row => `${row.id}\t${row.date}\t${row.crop}\t${row.farmer}\t${row.orderBy}\t${row.status}\t${row.payment}\t${row.amount}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    showSnackbar("Copied to clipboard!", "success");
  };

  /* ---------------- UI HELPERS ---------------- */
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending": return "warning";
      case "Processing": return "info";
      case "Delivered": return "success";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  const getPaymentColor = (payment: PaymentStatus) => {
    switch (payment) {
      case "Pending": return "warning";
      case "Paid": return "success";
      case "Failed": return "error";
      default: return "default";
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setRows(initialRows);
      setSearchTerm("");
      setStatusFilter("All");
      setPaymentFilter("All");
      setSelectedRows([]);
      setLoading(false);
      showSnackbar("Data refreshed successfully!", "success");
    }, 500);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, row: OrderRow) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuRow(row);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuRow(null);
  };

  return (
    <Box p={3}>
      {/* HEADER WITH STATS */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Orders Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {filteredRows.length} orders • Selected: {selectedRows.length}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Refresh"}
        </Button>
      </Stack>

      {/* FILTERS AND SEARCH BAR */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search crops, farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} /> }}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Payment</InputLabel>
            <Select
              value={paymentFilter}
              label="Payment"
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "All")}
            >
              <MenuItem value="All">All Payments</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* ACTION BUTTONS WITH BULK DELETE */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1}>
            <Tooltip title="Copy to clipboard">
              <Button size="small" startIcon={<ContentCopy />} onClick={copyToClipboard}>
                Copy
              </Button>
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button size="small" startIcon={<TableChart />} onClick={exportToExcel}>
                Excel
              </Button>
            </Tooltip>
            <Tooltip title="Export to CSV">
              <Button size="small" startIcon={<FileDownload />} onClick={exportToExcel}>
                CSV
              </Button>
            </Tooltip>
            <Tooltip title="Export to PDF">
              <Button size="small" startIcon={<PictureAsPdf />} onClick={exportToPDF}>
                PDF
              </Button>
            </Tooltip>
            <Tooltip title="Print">
              <Button size="small" startIcon={<Print />} onClick={() => window.print()}>
                Print
              </Button>
            </Tooltip>
          </Stack>
          
          {selectedRows.length > 0 && (
            <Tooltip title="Delete selected">
              <Button
                size="small"
                color="error"
                variant="contained"
                startIcon={<DeleteForever />}
                onClick={() => setOpenBulkDelete(true)}
              >
                Delete ({selectedRows.length})
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Paper>

      {/* TABLE */}
      <TableContainer  component={Paper} sx={{ position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Table size="small">
          <TableHead sx={{ background: "linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isSomeSelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Sr</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Crop Detail</TableCell>
              <TableCell>Order By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={isRowSelected(row.id)}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isRowSelected(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {row.crop}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Farmer: {row.farmer} • Qty: {row.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.orderBy}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={getStatusColor(row.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.payment}
                      size="small"
                      color={getPaymentColor(row.payment)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="success.main">
                      ${row.amount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, row)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No orders found. Try adjusting your search or filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION CONTROLS */}
      {filteredRows.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredRows.length)} of {filteredRows.length} entries
              </Typography>
              <FormControl size="small">
                <Select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {rowsPerPageOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option} per page
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </Stack>
        </Paper>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Edit Order #{selectedRow?.id}</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Crop"
              fullWidth
              value={selectedRow?.crop || ''}
              onChange={(e) => setSelectedRow(prev => prev ? { ...prev, crop: e.target.value } : null)}
            />
            <TextField
              label="Farmer"
              fullWidth
              value={selectedRow?.farmer || ''}
              onChange={(e) => setSelectedRow(prev => prev ? { ...prev, farmer: e.target.value } : null)}
            />
            <TextField
              label="Order By"
              fullWidth
              value={selectedRow?.orderBy || ''}
              onChange={(e) => setSelectedRow(prev => prev ? { ...prev, orderBy: e.target.value } : null)}
            />
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedRow?.status || ''}
                  label="Status"
                  onChange={(e) => setSelectedRow(prev => prev ? { ...prev, status: e.target.value as OrderStatus } : null)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={selectedRow?.payment || ''}
                  label="Payment"
                  onChange={(e) => setSelectedRow(prev => prev ? { ...prev, payment: e.target.value as PaymentStatus } : null)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* SINGLE DELETE DIALOG */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete order #{selectedRow?.id}?
          </Alert>
          <Typography variant="body2">
            Crop: <strong>{selectedRow?.crop}</strong><br />
            Farmer: {selectedRow?.farmer}<br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* BULK DELETE DIALOG */}
      <Dialog open={openBulkDelete} onClose={() => setOpenBulkDelete(false)}>
        <DialogTitle>Delete Selected Orders</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            You are about to delete {selectedRows.length} order(s)
          </Alert>
          <Typography variant="body2">
            This will permanently remove the selected orders from the system.
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmBulkDelete}>
            Delete All Selected
          </Button>
        </DialogActions>
      </Dialog>

      {/* ACTION MENU */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => {
          if (actionMenuRow) {
            handleEdit(actionMenuRow);
            handleActionMenuClose();
          }
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          if (actionMenuRow) {
            handleDelete(actionMenuRow);
            handleActionMenuClose();
          }
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}