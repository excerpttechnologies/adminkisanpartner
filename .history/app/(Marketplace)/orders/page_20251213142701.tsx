"use client";

import { useState } from "react";
import {
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

const orders = [
  { id: 1, date: "2024-07-20", crop: "Organic Wheat", orderedBy: "John Doe (Farmer)", status: "Delivered", delivery: "123 Farm Rd", payment: "Card", amount: 120 },
  { id: 2, date: "2024-07-19", crop: "Tomatoes", orderedBy: "AgroSupply (Agent)", status: "Processing", delivery: "456 Market St", payment: "Bank", amount: 90 },
  { id: 3, date: "2024-07-18", crop: "Potatoes", orderedBy: "Jane Smith", status: "Pending", delivery: "789 Green Ln", payment: "Cash", amount: 75 },
  { id: 4, date: "2024-07-17", crop: "Corn", orderedBy: "Robert Johnson", status: "Delivered", delivery: "101 Harvest Ave", payment: "Card", amount: 150 },
  { id: 5, date: "2024-07-16", crop: "Rice", orderedBy: "Green Fields Co.", status: "Processing", delivery: "202 Valley Rd", payment: "Bank", amount: 200 },
  { id: 6, date: "2024-07-15", crop: "Soybeans", orderedBy: "Mike Wilson", status: "Cancelled", delivery: "303 Prairie Ln", payment: "Cash", amount: 85 },
  { id: 7, date: "2024-07-14", crop: "Carrots", orderedBy: "Fresh Produce Inc.", status: "Delivered", delivery: "404 Garden St", payment: "Card", amount: 95 },
  { id: 8, date: "2024-07-13", crop: "Lettuce", orderedBy: "Sarah Brown", status: "Pending", delivery: "505 Farm Ln", payment: "Bank", amount: 60 },
  { id: 9, date: "2024-07-12", crop: "Apples", orderedBy: "Orchard King", status: "Processing", delivery: "606 Orchard Rd", payment: "Card", amount: 175 },
  { id: 10, date: "2024-07-11", crop: "Berries", orderedBy: "Berry Farm Co.", status: "Delivered", delivery: "707 Berry Ln", payment: "Cash", amount: 110 },
  { id: 11, date: "2024-07-10", crop: "Peppers", orderedBy: "Spicy Foods LLC", status: "Processing", delivery: "808 Spice Rd", payment: "Bank", amount: 130 },
  { id: 12, date: "2024-07-09", crop: "Onions", orderedBy: "Vegetable Supply", status: "Delivered", delivery: "909 Root St", payment: "Card", amount: 70 },
];

export default function OrdersPage() {
  /* ================= PAGINATION STATE ================= */
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /* ================= PAGINATION CALCULATIONS ================= */
  const totalRows = orders.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  /* ================= HANDLERS ================= */
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1); // Reset to first page when rows per page changes
  };

  /* ================= EXPORT FUNCTIONS ================= */
  const copyData = () => {
    const text = orders
      .map((o) => `${o.id}\t${o.date}\t${o.crop}\t${o.orderedBy}\t${o.status}\t${o.amount}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Date", "Crop", "Ordered By", "Status", "Amount"]],
      body: orders.map((o) => [o.id, o.date, o.crop, o.orderedBy, o.status, `$${o.amount}`]),
    });
    doc.save("orders.pdf");
  };

  const printTable = () => {
    window.print();
  };

  /* ================= STATUS CHIP STYLING ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "warning";
      case "Pending":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="medium" gutterBottom>
        Orders Management
      </Typography>

      {/* EXPORT BUTTONS */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Export Options
          </Typography>
          <ButtonGroup variant="outlined" sx={{ flexWrap: "wrap", gap: 1 }}>
            <Button startIcon={<FaCopy />} onClick={copyData}>
              Copy
            </Button>
            <Button startIcon={<FaFileExcel />} onClick={exportExcel} color="success">
              Excel
            </Button>
            <Button startIcon={<FaFileCsv />} onClick={exportCSV} color="secondary">
              CSV
            </Button>
            <Button startIcon={<FaFilePdf />} onClick={exportPDF} color="error">
              PDF
            </Button>
            <Button startIcon={<FaPrint />} onClick={printTable}>
              Print
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card sx={{ mb: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Crop</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ordered By</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.crop}</TableCell>
                  <TableCell>{order.orderedBy}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">${order.amount}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* PAGINATION CONTROLS */}
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
            {/* ROWS PER PAGE SELECTOR */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows} orders
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rows per page</InputLabel>
                <Select value={rowsPerPage} label="Rows per page" onChange={handleRowsPerPageChange}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* PAGINATION COMPONENT */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
              size="medium"
            />

            {/* PAGE NAVIGATION BUTTONS */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                size="small"
              >
                <FaChevronLeft />
              </IconButton>
              <Typography variant="body2" sx={{ px: 2 }}>
                Page {page} of {totalPages}
              </Typography>
              <IconButton
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                size="small"
              >
                <FaChevronRight />
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          button, .MuiCard-root:first-of-type, .MuiCard-root:last-of-type {
            display: none !important;
          }
          .MuiTableContainer-root {
            box-shadow: none !important;
          }
        }
      `}</style>
    </Box>
  );
}