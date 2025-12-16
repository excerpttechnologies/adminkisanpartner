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
  Drawer,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Badge,
  Fade,
  Zoom,
  Fab,
  Hidden,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Tabs,
  Tab,
  AppBar,
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
  Add,
  ViewList,
  ViewModule,
  Menu as MenuIcon,
  Close,
  ArrowUpward,
  ArrowDownward,
  Sort,
  Download,
  Visibility,
  GridView,
  Reorder,
  FilterAlt,
  ClearAll,
  Tune,
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
  location: string;
}

type OrderStatus = OrderRow["status"];
type PaymentStatus = OrderRow["payment"];

/* ---------------- MOCK DATA ---------------- */
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
  location: ["Farm A", "Farm B", "Farm C", "Farm D"][i % 4],
}));

const rowsPerPageOptions = [4, 8, 12, 16];

export default function OrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "crop">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState(0);

  /* ---------------- FILTERED, SORTED AND PAGINATED DATA ---------------- */
  const filteredRows = rows
    .filter((row) => {
      const matchesSearch =
        row.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.orderBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || row.status === statusFilter;
      const matchesPayment = paymentFilter === "All" || row.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else {
        return sortOrder === "asc" ? a.crop.localeCompare(b.crop) : b.crop.localeCompare(a.crop);
      }
    });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  /* ---------------- SELECTION HANDLERS ---------------- */
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedRows.map((row) => row.id);
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
      newSelected = selectedRows.filter((rowId) => rowId !== id);
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
      setRows(rows.map((row) => (row.id === selectedRow.id ? selectedRow : row)));
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
      setRows(rows.filter((row) => row.id !== selectedRow.id));
      setOpenDelete(false);
      showSnackbar("Order deleted successfully!", "success");
    }
  };

  const confirmBulkDelete = () => {
    setRows(rows.filter((row) => !selectedRows.includes(row.id)));
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
      head: [["ID", "Date", "Crop", "Farmer", "Order By", "Status", "Payment", "Amount", "Quantity", "Location"]],
      body: filteredRows.map((row) => [
        row.id,
        row.date,
        row.crop,
        row.farmer,
        row.orderBy,
        row.status,
        row.payment,
        `$${row.amount}`,
        row.quantity,
        row.location,
      ]),
    });
    doc.save("orders.pdf");
    showSnackbar("Exported to PDF successfully!", "success");
  };

  const copyToClipboard = () => {
    const text = filteredRows.map((row) => `${row.id}\t${row.date}\t${row.crop}\t${row.farmer}\t${row.orderBy}\t${row.status}\t${row.payment}\t${row.amount}`).join("\n");
    navigator.clipboard.writeText(text);
    showSnackbar("Copied to clipboard!", "success");
  };

  /* ---------------- UI HELPERS ---------------- */
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Processing":
        return "info";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentColor = (payment: PaymentStatus) => {
    switch (payment) {
      case "Pending":
        return "warning";
      case "Paid":
        return "success";
      case "Failed":
        return "error";
      default:
        return "default";
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

  const handleSort = (field: "date" | "amount" | "crop") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setSortBy("date");
    setSortOrder("desc");
  };

  /* ---------------- RESPONSIVE COMPONENTS ---------------- */
  const MobileCardView = ({ row }: { row: OrderRow }) => (
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              #{row.id} • {row.crop}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.date} • {row.location}
            </Typography>
          </Box>
          <Checkbox
            size="small"
            checked={isRowSelected(row.id)}
            onChange={() => handleSelectRow(row.id)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          />
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Farmer
            </Typography>
            <Typography variant="body2">{row.farmer}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Ordered By
            </Typography>
            <Typography variant="body2">{row.orderBy}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body2">{row.quantity} units</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="success.main">
              ${row.amount}
            </Typography>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label={row.status} size="small" color={getStatusColor(row.status)} />
          <Chip label={row.payment} size="small" color={getPaymentColor(row.payment)} />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(row)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  const TabletGridView = () => (
    <Grid container spacing={2}>
      {paginatedRows.map((row) => (
        <Grid item xs={12} sm={6} md={4} key={row.id}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Badge badgeContent={row.id} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: 10 } }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                    {row.crop.charAt(0)}
                  </Avatar>
                </Badge>
                <Checkbox
                  size="small"
                  checked={isRowSelected(row.id)}
                  onChange={() => handleSelectRow(row.id)}
                />
              </Stack>

              <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
                {row.crop}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.date} • {row.location}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="body2" paragraph>
                <strong>Farmer:</strong> {row.farmer}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Ordered By:</strong> {row.orderBy}
              </Typography>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body2">{row.quantity}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ${row.amount}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
              <Stack direction="row" spacing={1}>
                <Chip label={row.status} size="small" color={getStatusColor(row.status)} />
                <Chip label={row.payment} size="small" color={getPaymentColor(row.payment)} />
              </Stack>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => handleEdit(row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* FLOATING ACTION BUTTON FOR MOBILE */}
      {isMobile && (
        <Zoom in={true}>
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
            onClick={() => setFilterDrawerOpen(true)}
          >
            <FilterList />
          </Fab>
        </Zoom>
      )}

      {/* MOBILE FILTER DRAWER */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 300 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Filters & Sort</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Stack>

          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "action.active" }} /> }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}>
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel>Payment</InputLabel>
            <Select value={paymentFilter} label="Payment" onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "All")}>
              <MenuItem value="All">All Payments</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom>
            Sort By
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Button
              size="small"
              variant={sortBy === "date" ? "contained" : "outlined"}
              onClick={() => handleSort("date")}
              endIcon={sortBy === "date" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : <Sort />}
              fullWidth
            >
              Date
            </Button>
            <Button
              size="small"
              variant={sortBy === "amount" ? "contained" : "outlined"}
              onClick={() => handleSort("amount")}
              endIcon={sortBy === "amount" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : <Sort />}
              fullWidth
            >
              Amount
            </Button>
          </Stack>

          <Button fullWidth variant="outlined" startIcon={<ClearAll />} onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Drawer>

      {/* HEADER SECTION */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
          <Box>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom={isMobile}>
              Orders Management
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Total: {filteredRows.length} • Selected: {selectedRows.length}
              </Typography>
              {selectedRows.length > 0 && (
                <Chip
                  label={`${selectedRows.length} selected`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  onDelete={() => setSelectedRows([])}
                  deleteIcon={<Close />}
                />
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {!isMobile && (
              <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading} size="small">
                {loading ? <CircularProgress size={20} /> : "Refresh"}
              </Button>
            )}
            <IconButton onClick={handleRefresh} disabled={loading} size="small">
              {loading ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
            <Hidden smDown>
              <Divider orientation="vertical" flexItem />
              <IconButton size="small" onClick={() => setViewMode("table")} color={viewMode === "table" ? "primary" : "default"}>
                <ViewList />
              </IconButton>
              <IconButton size="small" onClick={() => setViewMode("grid")} color={viewMode === "grid" ? "primary" : "default"}>
                <GridView />
              </IconButton>
            </Hidden>
            {isMobile && (
              <IconButton onClick={() => setFilterDrawerOpen(true)}>
                <FilterList />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* SEARCH AND FILTERS (DESKTOP) */}
        {!isMobile && (
          <Fade in={true}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <TextField
                size="small"
                placeholder="Search crops, farmers, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "action.active" }} /> }}
                sx={{ flex: 1 }}
              />
              <Stack direction="row" spacing={1}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}>
                    <MenuItem value="All">All Status</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Payment</InputLabel>
                  <Select value={paymentFilter} label="Payment" onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "All")}>
                    <MenuItem value="All">All Payments</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip title="Clear all filters">
                  <IconButton size="small" onClick={clearFilters}>
                    <ClearAll />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Fade>
        )}
      </Paper>

      {/* ACTION BUTTONS WITH BULK DELETE */}
      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Tooltip title="Copy to clipboard">
              <Button size="small" startIcon={<ContentCopy />} onClick={copyToClipboard} sx={{ mb: { xs: 1, sm: 0 } }}>
                <Hidden xsDown>Copy</Hidden>
              </Button>
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button size="small" startIcon={<TableChart />} onClick={exportToExcel} sx={{ mb: { xs: 1, sm: 0 } }}>
                <Hidden xsDown>Excel</Hidden>
              </Button>
            </Tooltip>
            <Tooltip title="Export to CSV">
              <Button size="small" startIcon={<FileDownload />} onClick={exportToExcel} sx={{ mb: { xs: 1, sm: 0 } }}>
                <Hidden xsDown>CSV</Hidden>
              </Button>
            </Tooltip>
            <Tooltip title="Export to PDF">
              <Button size="small" startIcon={<PictureAsPdf />} onClick={exportToPDF} sx={{ mb: { xs: 1, sm: 0 } }}>
                <Hidden xsDown>PDF</Hidden>
              </Button>
            </Tooltip>
            <Tooltip title="Print">
              <Button size="small" startIcon={<Print />} onClick={() => window.print()} sx={{ mb: { xs: 1, sm: 0 } }}>
                <Hidden xsDown>Print</Hidden>
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
                sx={{ mt: { xs: 1, sm: 0 } }}
              >
                Delete ({selectedRows.length})
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Paper>

      {/* SORT CONTROLS */}
      {!isMobile && (
        <Paper sx={{ p: 1, mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Sort by:
            </Typography>
            <Button
              size="small"
              variant={sortBy === "date" ? "contained" : "outlined"}
              onClick={() => handleSort("date")}
              endIcon={sortBy === "date" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : <Sort />}
            >
              Date
            </Button>
            <Button
              size="small"
              variant={sortBy === "amount" ? "contained" : "outlined"}
              onClick={() => handleSort("amount")}
              endIcon={sortBy === "amount" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : <Sort />}
            >
              Amount
            </Button>
            <Button
              size="small"
              variant={sortBy === "crop" ? "contained" : "outlined"}
              onClick={() => handleSort("crop")}
              endIcon={sortBy === "crop" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : <Sort />}
            >
              Crop
            </Button>
          </Stack>
        </Paper>
      )}

      {/* DATA VIEW */}
      <Box sx={{ position: "relative", mb: 2 }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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

        {/* MOBILE VIEW - CARD LIST */}
        {isMobile ? (
          <Box>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => <MobileCardView key={row.id} row={row} />)
            ) : (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No orders found. Try adjusting your search or filters.</Typography>
              </Paper>
            )}
          </Box>
        ) : viewMode === "table" ? (
          /* DESKTOP/TABLET TABLE VIEW */
          <TableContainer component={Paper}>
            <Table size={isTablet ? "small" : "medium"}>
              <TableHead sx={{ background: "linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox indeterminate={isSomeSelected} checked={isAllSelected} onChange={handleSelectAll} />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Crop Detail</TableCell>
                  <TableCell>Order By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Amount</TableCell>
                  {!isTablet && <TableCell>Location</TableCell>}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row) => (
                    <TableRow key={row.id} hover selected={isRowSelected(row.id)} sx={{ "&:hover": { backgroundColor: "action.hover" } }}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isRowSelected(row.id)} onChange={() => handleSelectRow(row.id)} />
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
                        <Chip label={row.status} size="small" color={getStatusColor(row.status)} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip label={row.payment} size="small" color={getPaymentColor(row.payment)} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">
                          ${row.amount}
                        </Typography>
                      </TableCell>
                      {!isTablet && <TableCell>{row.location}</TableCell>}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(row)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isTablet ? 9 : 10} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">No orders found. Try adjusting your search or filters.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* GRID VIEW FOR TABLETS */
          <TabletGridView />
        )}
      </Box>

      {/* PAGINATION CONTROLS */}
      {filteredRows.length > 0 && (
        <Paper sx={{ p: { xs: 1, sm: 2 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2 }} alignItems="center">
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
                  {rowsPerPageOptions.map((option) => (
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
              size={isMobile ? "small" : "medium"}
              showFirstButton={!isMobile}
              showLastButton={!isMobile}
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={isMobile ? 1 : 2}
            />
          </Stack>
        </Paper>
      )}

      {/* DIALOGS AND MENUS (Same as before but with responsive adjustments) */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Edit Order #{selectedRow?.id}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Crop" fullWidth value={selectedRow?.crop || ""} onChange={(e) => setSelectedRow((prev) => (prev ? { ...prev, crop: e.target.value } : null))} />
            <TextField label="Farmer" fullWidth value={selectedRow?.farmer || ""} onChange={(e) => setSelectedRow((prev) => (prev ? { ...prev, farmer: e.target.value } : null))} />
            <TextField label="Order By" fullWidth value={selectedRow?.orderBy || ""} onChange={(e) => setSelectedRow((prev) => (prev ? { ...prev, orderBy: e.target.value } : null))} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedRow?.status || ""}
                  label="Status"
                  onChange={(e) => setSelectedRow((prev) => (prev ? { ...prev, status: e.target.value as OrderStatus } : null))}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Payment</InputLabel>
                <Select
                  value={selectedRow?.payment || ""}
                  label="Payment"
                  onChange={(e) => setSelectedRow((prev) => (prev ? { ...prev, payment: e.target.value as PaymentStatus } : null))}
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
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "right" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}