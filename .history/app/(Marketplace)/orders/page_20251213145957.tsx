"use client";

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
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy,
  TableChart,
  PictureAsPdf,
  Print,
} from "@mui/icons-material";

import { useState } from "react";

/* ---------------- MOCK DATA ---------------- */
const rows = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  date: "2025-12-02",
  crop: "Tomato",
  farmer: "Abhishek",
  orderBy: "CHETHAN",
  status: "Pending",
  payment: "Pending",
}));

const rowsPerPage = 8;

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box p={3}>
      {/* TITLE */}
      <Box mb={2}>
        <h2 className="text-lg font-semibold">Orders</h2>
      </Box>

      {/* ACTION BUTTONS */}
      <Stack direction="row" spacing={1} mb={2}>
        <Button size="small" startIcon={<ContentCopy />}>Copy</Button>
        <Button size="small" startIcon={<TableChart />}>Excel</Button>
        <Button size="small">CSV</Button>
        <Button size="small" startIcon={<PictureAsPdf />}>PDF</Button>
        <Button size="small" startIcon={<Print />}>Print</Button>
      </Stack>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ background: "#f3f4f6" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Sr</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Crop Detail</TableCell>
              <TableCell>Order By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, i) => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <div className="text-blue-600">{row.crop}</div>
                  <div className="text-xs text-gray-500">
                    Farmer : {row.farmer}
                  </div>
                </TableCell>
                <TableCell>{row.orderBy}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color="warning"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.payment}
                    size="small"
                    color="error"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(row)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <Stack alignItems="flex-end" mt={2}>
        <Pagination
          count={Math.ceil(rows.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent className="space-y-3 mt-2">
          <TextField
            label="Crop"
            fullWidth
            defaultValue={selectedRow?.crop}
          />
          <TextField
            label="Status"
            fullWidth
            defaultValue={selectedRow?.status}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
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
          <Button color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
