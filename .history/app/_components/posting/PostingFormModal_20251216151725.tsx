"use client";

import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function PostingFormModal({
  open,
  onClose,
  onSubmit,
  defaultData,
}: Props) {
  const [form, setForm] = useState({
    date: defaultData?.date ? new Date(defaultData.date) : new Date(),
    title: defaultData?.title || "",
    category: defaultData?.category || "",
    item: defaultData?.item || "",
    seedType: defaultData?.seedType || "undefined",
    acres: defaultData?.acres || "",
    postedBy: {
      name: defaultData?.postedBy?.name || "",
      mobile: defaultData?.postedBy?.mobile || "",
    },
    status: defaultData?.status || "Pending",
  });

  // Reset form when defaultData changes
  useEffect(() => {
    if (defaultData) {
      setForm({
        date: defaultData?.date ? new Date(defaultData.date) : new Date(),
        title: defaultData?.title || "",
        category: defaultData?.category || "",
        item: defaultData?.item || "",
        seedType: defaultData?.seedType || "undefined",
        acres: defaultData?.acres || "",
        postedBy: {
          name: defaultData?.postedBy?.name || "",
          mobile: defaultData?.postedBy?.mobile || "",
        },
        status: defaultData?.status || "Pending",
      });
    }
  }, [defaultData]);

  const handleSubmit = () => {
    // Validate required fields
    if (!form.title || !form.category || !form.item || !form.acres || 
        !form.postedBy.name || !form.postedBy.mobile) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(form.postedBy.mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const payload = {
      date: form.date.toISOString(),
      title: form.title,
      category: form.category,
      item: form.item,
      seedType: form.seedType,
      acres: form.acres,
      postedBy: {
        name: form.postedBy.name,
        mobile: form.postedBy.mobile,
      },
      status: form.status,
    };

    onSubmit(payload);
  };

  const handleReset = () => {
    setForm({
      date: new Date(),
      title: "",
      category: "",
      item: "",
      seedType: "undefined",
      acres: "",
      postedBy: {
        name: "",
        mobile: "",
      },
      status: "Pending",
    });
  };

  // Available categories
  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Spices",
    "Pulses",
    "Oil Seeds",
    "Fiber Crops",
    "Sugarcane",
    "Medicinal Plants",
    "Other"
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-3 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {defaultData ? "Edit Posting" : "New Posting"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {/* Date Field */}
          <div>
            <Typography variant="body2" className="mb-1 text-gray-700 font-medium">
              Date *
            </Typography>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <DatePicker
                selected={form.date}
                onChange={(date: Date | null) => date && setForm({...form, date})}
                className="w-full px-3 py-2 outline-none"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
              />
            </div>
          </div>

          {/* Title Field */}
          <div className="m"><TextField
            label="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
            size="small"
            required
            placeholder="e.g., Organic Wheat Harvest"
          />
</div>
          {/* Category Field */}
          <FormControl fullWidth size="small" required>
            <InputLabel>Category *</InputLabel>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              label="Category *"
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Item Field */}
          <TextField
            label="Item / Crop Name *"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            fullWidth
            size="small"
            required
            placeholder="e.g., Wheat, Rice, Tomato"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Seed Type */}
            <FormControl fullWidth size="small">
              <InputLabel>Seed Type</InputLabel>
              <Select
                value={form.seedType}
                onChange={(e) => setForm({ ...form, seedType: e.target.value })}
                label="Seed Type"
              >
                <MenuItem value="undefined">Not Specified</MenuItem>
                <MenuItem value="Seed">Seed</MenuItem>
              </Select>
            </FormControl>

            {/* Acres Field */}
            <TextField
              label="Acres / Area *"
              value={form.acres}
              onChange={(e) => setForm({ ...form, acres: e.target.value })}
              size="small"
              required
              placeholder="e.g., 5 Acres, 2 Hectares"
            />
          </div>

          {/* Farmer Details */}
          <div className="border-t pt-4">
            <Typography variant="subtitle2" className="mb-3 text-gray-700 font-semibold">
              Farmer Details *
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Farmer Name *"
                value={form.postedBy.name}
                onChange={(e) => setForm({
                  ...form,
                  postedBy: { ...form.postedBy, name: e.target.value }
                })}
                size="small"
                required
                placeholder="Full name"
              />
              <TextField
                label="Mobile Number *"
                value={form.postedBy.mobile}
                onChange={(e) => setForm({
                  ...form,
                  postedBy: { ...form.postedBy, mobile: e.target.value }
                })}
                size="small"
                required
                placeholder="10-digit number"
                inputProps={{ maxLength: 10 }}
              />
            </div>
          </div>

          {/* Status Field */}
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
            </Select>
          </FormControl>

          {/* Form Validation Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <Typography variant="caption" className="text-blue-700">
              * Required fields
            </Typography>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t sticky bottom-0 bg-white">
          <div>
            {!defaultData && (
              <Button 
                onClick={handleReset} 
                variant="text" 
                size="small"
                className="text-gray-600"
              >
                Clear Form
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onClose} 
              variant="outlined"
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              className="min-w-[100px] bg-green-600 hover:bg-green-700"
            >
              {defaultData ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}