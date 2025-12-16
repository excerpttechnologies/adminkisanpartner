"use client";

import { Modal } from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultData?: any;
}

export default function OrderFormModal({
  open,
  onClose,
  onSubmit,
  defaultData,
}: Props) {
  const [form, setForm] = useState({
    orderId: defaultData?.orderId || "",
    cropName: defaultData?.cropDetail?.cropName || "",
    category: defaultData?.cropDetail?.category || "",
    farmer: defaultData?.farmer || "",
    trader: defaultData?.trader || "",
    adminStatus: defaultData?.status?.admin || "Pending",
    farmerStatus: defaultData?.status?.farmer || "Pending",
    deliveryDate: defaultData?.delivery?.date?.slice(0, 10) || "",
    deliveryTime: defaultData?.delivery?.time || "",
    paymentStatus: defaultData?.payment?.status || "Pending",
    paymentId: defaultData?.payment?.paymentId || "",
    payDate: defaultData?.payment?.payDate?.slice(0, 10) || "",
    bidPrice: defaultData?.bid?.price || "",
    bidQuantity: defaultData?.bid?.quantity || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const payload = {
      orderId: form.orderId,
      cropDetail: {
        cropName: form.cropName,
        category: form.category,
      },
      farmer: form.farmer,
      trader: form.trader,
      status: {
        admin: form.adminStatus,
        farmer: form.farmerStatus,
      },
      delivery: {
        date: form.deliveryDate,
        time: form.deliveryTime,
      },
      payment: {
        status: form.paymentStatus,
        paymentId: form.paymentId,
        payDate: form.payDate,
      },
      bid: {
        price: Number(form.bidPrice),
        quantity: Number(form.bidQuantity),
      },
    };

    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white rounded-xl w-[420px]* max-h-[90vh] overflow-y-auto p-5 mx-auto mt-20 space-y-3">

        <h2 className="text-lg font-semibold">Order Form</h2>

        <input name="orderId" placeholder="Order ID"
          className="input" value={form.orderId} onChange={handleChange} />

        <input name="cropName" placeholder="Crop Name"
          className="input" value={form.cropName} onChange={handleChange} />

        <input name="category" placeholder="Category"
          className="input" value={form.category} onChange={handleChange} />

        <input name="farmer" placeholder="Farmer ID"
          className="input" value={form.farmer} onChange={handleChange} />

        <input name="trader" placeholder="Trader ID"
          className="input" value={form.trader} onChange={handleChange} />

        {/* STATUS */}
        <select name="adminStatus" className="input" value={form.adminStatus} onChange={handleChange}>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select name="farmerStatus" className="input" value={form.farmerStatus} onChange={handleChange}>
          <option>Pending</option>
          <option>Agreed</option>
        </select>

        {/* DELIVERY */}
        <input type="date" name="deliveryDate"
          className="input" value={form.deliveryDate} onChange={handleChange} />

        <input type="time" name="deliveryTime"
          className="input" value={form.deliveryTime} onChange={handleChange} />

        {/* PAYMENT */}
        <select name="paymentStatus" className="input" value={form.paymentStatus} onChange={handleChange}>
          <option>Pending</option>
          <option>Paid</option>
        </select>

        <input name="paymentId" placeholder="Payment ID"
          className="input" value={form.paymentId} onChange={handleChange} />

        <input type="date" name="payDate"
          className="input" value={form.payDate} onChange={handleChange} />

        {/* BID */}
        <input name="bidPrice" type="number" placeholder="Bid Price"
          className="input" value={form.bidPrice} onChange={handleChange} />

        <input name="bidQuantity" type="number" placeholder="Quantity"
          className="input" value={form.bidQuantity} onChange={handleChange} />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Save</button>
        </div>
      </div>
    </Modal>
  );
}
