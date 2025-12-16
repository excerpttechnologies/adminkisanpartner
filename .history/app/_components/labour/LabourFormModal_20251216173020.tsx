"use client";

import { Modal } from "@mui/material";
import { useState } from "react";
import { FaUser, FaPhone, FaCalendarAlt, FaUserFriends, FaSeedling, FaTools, FaMapMarkerAlt, FaMapPin } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultData?: any;
}

export default function LabourFormModal({
  open,
  onClose,
  onSubmit,
  defaultData,
}: Props) {
  const [form, setForm] = useState({
    farmer: {
      name: defaultData?.farmer?.name || "",
      mobile: defaultData?.farmer?.mobile || "",
      address: defaultData?.farmer?.address || "",
      state: defaultData?.farmer?.state || "",
    },
    requiredDate: defaultData?.requiredDate?.slice(0, 10) || "",
    male: defaultData?.male || "",
    female: defaultData?.female || "",
    crop: defaultData?.crop || "",
    work: defaultData?.work || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("farmer.")) {
      const field = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        farmer: {
          ...prev.farmer,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      male: Number(form.male) || 0,
      female: Number(form.female) || 0,
    };
console.log(payload)
    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white rounded-xl w-[95%] max-w-lg max-h-[90vh] overflow-y-auto p-5 mx-auto mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">New Labour Request</h2>

        <div className="space-y-4">
          {/* Farmer Details */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUser className="text-gray-500" />
              Farmer Details
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  name="farmer.name"
                  placeholder="Farmer Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={form.farmer.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="farmer.mobile"
                  placeholder="Mobile Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={form.farmer.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Farmer Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaMapMarkerAlt className="text-gray-500" />
              Farmer Address
            </label>
            <div className="space-y-3">
              <input
                name="farmer.address"
                placeholder="Full Address"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={form.farmer.address}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="farmer.state"
                  placeholder="State"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={form.farmer.state}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Required Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaCalendarAlt className="text-gray-500" />
              Required Date
            </label>
            <input
              type="date"
              name="requiredDate"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={form.requiredDate}
              onChange={handleChange}
            />
          </div>

          {/* Workers Count */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUserFriends className="text-gray-500" />
              Workers Required
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  name="male"
                  type="number"
                  placeholder="Male Workers"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={form.male}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div>
                <input
                  name="female"
                  type="number"
                  placeholder="Female Workers"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={form.female}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Crop & Work */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaSeedling className="text-gray-500" />
              Crop & Work Details
            </label>
            <div className="space-y-3">
              <input
                name="crop"
                placeholder="Crop Name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={form.crop}
                onChange={handleChange}
              />
              <input
                name="work"
                placeholder="Work Type (e.g., Harvesting, Weeding)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={form.work}
                onChange={handleChange}
              />
            </div>
          </div>

         
          {/* Notes */}
          
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
    </Modal>
  );
}