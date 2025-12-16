"use client";

import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultData?: any;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
};

export default function PostingFormModal({
  open,
  onClose,
  onSubmit,
  defaultData,
}: Props) {
  const [form, setForm] = useState({
    title: defaultData?.title || "",
    category: defaultData?.category || "Fruits",
    item: defaultData?.item || "",
    seed: defaultData?.seed || "",
    acres: defaultData?.acres || "",
    postedBy: {
      name: defaultData?.postedBy?.name || "",
      id: defaultData?.postedBy?.id || "",
    },
    status: defaultData?.status || "Pending",
    description: defaultData?.description || "",
    location: defaultData?.location || "",
    price: defaultData?.price || "",
    contactPhone: defaultData?.contactPhone || "",
  });

  const handleSubmit = () => {
    const payload = {
      ...form,
      price: form.price ? Number(form.price) : undefined,
    };
    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {defaultData ? "Edit Posting" : "New Posting"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-3">
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
            size="small"
            required
          />

          <FormControl fullWidth size="small" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              label="Category"
            >
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Grains">Grains</MenuItem>
              <MenuItem value="Spices">Spices</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Item"
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              size="small"
              required
            />
            <TextField
              label="Seed"
              value={form.seed}
              onChange={(e) => setForm({ ...form, seed: e.target.value })}
              size="small"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Acres"
              value={form.acres}
              onChange={(e) => setForm({ ...form, acres: e.target.value })}
              size="small"
              required
            />
            <TextField
              label="Price ($)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              size="small"
            />
          </div>

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Farmer Name"
              value={form.postedBy.name}
              onChange={(e) => setForm({
                ...form,
                postedBy: { ...form.postedBy, name: e.target.value }
              })}
              size="small"
              required
            />
            <TextField
              label="Farmer ID"
              value={form.postedBy.id}
              onChange={(e) => setForm({
                ...form,
                postedBy: { ...form.postedBy, id: e.target.value }
              })}
              size="small"
              required
            />
          </div>

          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            fullWidth
            size="small"
          />

          <TextField
            label="Contact Phone"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            fullWidth
            size="small"
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
            size="small"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {defaultData ? "Update" : "Create"} Posting
          </Button>
        </div>
      </Box>
    </Modal>
  );
}