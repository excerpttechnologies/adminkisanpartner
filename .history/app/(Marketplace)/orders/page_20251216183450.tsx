/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaFileInvoice,
  FaMoneyCheckAlt,
  FaTruck,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaLessThanEqual,
} from "react-icons/fa";
import {
  Box,
  Modal,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import OrderFormModal from "@/app/_components/order/OrderFormModal";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface Order {
  _id: string;
  orderId: string;
  cropDetail: {
    cropName: string;
    category: string;
  };
  farmer: { name?: string } | string;
  trader: { name?: string } | string;
  status: {
    admin: "Pending" | "Approved" | "Rejected";
    farmer: "Pending" | "Approved" | "Rejected";
  };
  delivery: {
    date: string;
    time: string;
  };
  payment: {
    status: "Pending" | "Completed" | "Failed";
    paymentId: string;
    payDate: string;
    slip?: string;
  };
  bid?: {
    price: number;
    quantity: number;
    unit?: string;
  };
  createdAt: string;
}

/* ================= MODAL STYLE ================= */

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

/* ================= COMPONENT ================= */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading,setLoading]=useState(false)
  
  const tableRef = useRef<HTMLDivElement | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const pathname=usePathname()

  /* ================= GET ORDERS ================= */

  const getOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/order", {
        params: {
          search,
          status: status === "All" ? undefined : status,
          date: date || undefined,
          page,
          limit: 10,
        },
      });

      setOrders(res.data.data);
      setTotalPages(res.data.totalPages || 1);
      setTotalOrders(res.data.total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false)
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getOrders();
  }, [search, status, date, page,pathname]);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!currentOrder) return;
     setLoading(true)
     setEditOpen(false)
    await axios.put(`/api/order/${currentOrder._id}`, {
      status: currentOrder.status,
    });

    setLoading(false);
    getOrders();
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!currentOrder) return;
     setLoading(true)
     setDeleteOpen(false)
    await axios.delete(`/api/order/${currentOrder._id}`);
    setLoading(false);
    getOrders();
  };

  /* ================= CREATE ORDER ================= */

  const handleCreateOrder = async (data: any) => {
    try {
      setLoading(true)
      const res = await axios.post('/api/order', data);
      console.log("Order created:", res.data);
      setAddOpen(false);
      setLoading(false)
      getOrders();
      toast.success("Order created successfully!");
    } catch (error: any) {
      console.error("Error creating order:", error);
      setLoading(false)
      toast.error(`Failed to create order: ${error.response?.data?.message || error.message}`);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const handleCopyToClipboard = async () => {
    const headers = ["Sr.", "Order ID", "Date", "Crop", "Category", "Farmer", "Status", "Delivery Date", "Payment Status", "Bid Price", "Quantity", "Total Amount"];
    
    const csvContent = [
      headers.join("\t"),
      ...orders.map((order, index) => [
        index + 1 + (page - 1) * 10,
        order.orderId,
        new Date(order.createdAt).toLocaleDateString(),
        order.cropDetail.cropName,
        order.cropDetail.category,
        typeof order.farmer === "string" ? order.farmer : order.farmer?.name,
        order.status.admin,
        order.delivery.date,
        order.payment.status,
        order.bid?.price || 0,
        order.bid?.quantity || 0,
        (order.bid?.price || 0) * (order.bid?.quantity || 0),
      ].join("\t"))
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(csvContent);
      alert("Orders copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = orders.map((order, index) => ({
      "Sr.": index + 1 + (page - 1) * 10,
      "Order ID": order.orderId,
      "Date": new Date(order.createdAt).toLocaleDateString(),
      "Crop": order.cropDetail.cropName,
      "Category": order.cropDetail.category,
      "Farmer": typeof order.farmer === "string" ? order.farmer : order.farmer?.name,
      "Status": order.status.admin,
      "Delivery Date": order.delivery.date,
      "Delivery Time": order.delivery.time,
      "Payment Status": order.payment.status,
      "Payment ID": order.payment.paymentId,
      "Bid Price": order.bid?.price || 0,
      "Quantity": order.bid?.quantity || 0,
      "Unit": order.bid?.unit || "kg",
      "Total Amount": (order.bid?.price || 0) * (order.bid?.quantity || 0),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportCSV = () => {
    const headers = ["Sr.", "Order ID", "Date", "Crop", "Category", "Farmer", "Status", "Delivery Date", "Payment Status", "Bid Price", "Quantity", "Total Amount"];
    
    const csvContent = [
      headers.join(","),
      ...orders.map((order, index) => [
        index + 1 + (page - 1) * 10,
        `"${order.orderId}"`,
        `"${new Date(order.createdAt).toLocaleDateString()}"`,
        `"${order.cropDetail.cropName}"`,
        `"${order.cropDetail.category}"`,
        `"${typeof order.farmer === "string" ? order.farmer : order.farmer?.name}"`,
        `"${order.status.admin}"`,
        `"${order.delivery.date}"`,
        `"${order.payment.status}"`,
        order.bid?.price || 0,
        order.bid?.quantity || 0,
        (order.bid?.price || 0) * (order.bid?.quantity || 0),
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders Management Report", 14, 16);
    
    const tableColumn = ["Sr.", "Order ID", "Crop", "Farmer", "Status", "Amount"];
    const tableRows:any = orders.map((order, index) => [
      index + 1 + (page - 1) * 10,
      order.orderId,
      order.cropDetail.cropName,
      typeof order.farmer === "string" ? order.farmer : order.farmer?.name,
      order.status.admin,
      `$${(order.bid?.price || 0) * (order.bid?.quantity || 0)}`
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  /* ================= FIXED PRINT FUNCTION ================= */
  
  const handlePrint = () => {
    if (orders.length === 0) {
      alert("No orders to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orders Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .header-info {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
          }
          .status-approved {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .payment-completed {
            background-color: #d1fae5;
            color: #065f46;
          }
          .payment-failed {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .payment-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .total-amount {
            font-weight: bold;
            color: #059669;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            @page {
              size: landscape;
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📦 Orders Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Orders: ${totalOrders} | Showing: ${orders.length} orders</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Crop</th>
              <th>Category</th>
              <th>Farmer</th>
              <th>Status</th>
              <th>Delivery Date</th>
              <th>Delivery Time</th>
              <th>Payment</th>
              <th>Bid Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((order, index) => {
              const statusClass = `status-${order.status.admin.toLowerCase()}`;
              const paymentClass = `payment-${order.payment.status.toLowerCase()}`;
              const deliveryDate = new Date(order.delivery.date).toLocaleDateString();
              const orderDate = new Date(order.createdAt).toLocaleDateString();
              
              return `
                <tr>
                  <td>${index + 1 + (page - 1) * 10}</td>
                  <td><strong>${order.orderId}</strong></td>
                  <td>${orderDate}</td>
                  <td>
                    <div><strong>${order.cropDetail.cropName}</strong></div>
                    <div style="color: #6b7280; font-size: 11px;">${order.cropDetail.category}</div>
                  </td>
                  <td>${order.cropDetail.category}</td>
                  <td>${typeof order.farmer === "string" ? order.farmer : order.farmer?.name || 'N/A'}</td>
                  <td><span class="status-badge ${statusClass}">${order.status.admin}</span></td>
                  <td>${deliveryDate}</td>
                  <td>${order.delivery.time}</td>
                  <td><span class="status-badge ${paymentClass}">${order.payment.status}</span></td>
                  <td>$${order.bid?.price || 0}</td>
                  <td>${order.bid?.quantity || 0}</td>
                  <td class="total-amount">$${(order.bid?.price || 0) * (order.bid?.quantity || 0)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  /* ================= INVOICE & PAYMENT ================= */

  const handleGenerateInvoice = () => {
    setInvoiceOpen(true);
  };

  const handleProcessPayment = () => {
    setPaymentOpen(true);
  };

  /* ================= FORMAT FUNCTIONS ================= */

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = (order: Order) => {
    return (order.bid?.price || 0) * (order.bid?.quantity || 0);
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Header Section */}
      {
      loading && orders.length === 0 &&<div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73]  z-[100] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
     }
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all marketplace orders. {totalOrders} orders found.
          </p>
        </div>
        <button 
          onClick={() => setAddOpen(true)} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        >
          + Add New Order
        </button>
      </div>

      <OrderFormModal 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        onSubmit={handleCreateOrder}
      />

      {/* Export Buttons Section */}
      <div className="flex flex-wrap gap-[.6rem] text-sm mb-3 bg-white p-[.6rem] text-sm rounded shadow">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
          >
            <btn.icon className="text-sm" />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded shadow p-[.6rem] text-sm md:p-6 mb-6">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap  md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Crop, Farmer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
            <button
              onClick={() => {
                setSearch("");
                setStatus("All");
                setDate("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={() => getOrders()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow" ref={tableRef}>
        <table className="min-w-full">
          <thead className="border-b border-zinc-200">
            <tr className="*:text-zinc-800">
              <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Date</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Crop Detail</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Order By</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Delivery</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Payment</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Bid & Offer</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Invoice</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Final Payment</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-[.6rem] text-sm">{index + 1 + (page - 1) * 10}</td>
                <td className="p-[.6rem] text-sm font-medium">
                  {formatDate(order.createdAt)}
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="font-semibold">{order.cropDetail.cropName}</div>
                  <div className="text-gray-500 text-xs">{order.cropDetail.category}</div>
                </td>
                <td className="p-[.6rem] text-sm">
                  {typeof order.farmer === "string" ? order.farmer : order.farmer?.name}
                </td>
                <td className="p-[.6rem] text-sm">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                    ${order.status.admin === "Approved" ? "bg-green-100 text-green-800" :
                      order.status.admin === "Rejected" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"}`}>
                    {order.status.admin}
                  </span>
                </td>
                <td className="p-[.6rem] text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <FaTruck className="text-gray-400" />
                    <span>{formatDate(order.delivery.date)} {order.delivery.time}</span>
                  </div>
                </td>
                <td className="p-[.6rem] text-sm">
                  <span className={`px-2 py-1 rounded text-sm font-medium
                    ${order.payment.status === "Completed" ? "bg-green-100 text-green-800" :
                      order.payment.status === "Failed" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"}`}>
                    {order.payment.status}
                  </span>
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="font-semibold text-green-700">
                    ${order.bid?.price || 0} × {order.bid?.quantity || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: ${calculateTotal(order)}
                  </div>
                </td>
                <td className="p-[.6rem] text-sm">
                  <button
                    onClick={() => {
                      setCurrentOrder(order);
                      handleGenerateInvoice();
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Generate Invoice"
                  >
                    <FaFileInvoice />
                  </button>
                </td>
                <td className="p-[.6rem] text-sm">
                  <button
                    onClick={() => {
                      setCurrentOrder(order);
                      handleProcessPayment();
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Process Payment"
                  >
                    <FaMoneyCheckAlt />
                  </button>
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="flex gap-[.6rem] text-sm">
                    <button
                      onClick={() => {
                        setCurrentOrder(order);
                        setViewOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentOrder(order);
                        setEditOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Order"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentOrder(order);
                        setDeleteOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Order"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (visible only on small devices) */}
      <div className="lg:hidden space-y-2 p-[.6rem] text-sm">
        {orders.map((order, index) => (
          <div key={order._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-bold text-gray-800">#{order.orderId}</span>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold
                  ${order.status.admin === "Approved" ? "bg-green-100 text-green-800" :
                    order.status.admin === "Rejected" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"}`}>
                  {order.status.admin}
                </span>
              </div>
              <div className="flex gap-[.6rem] text-sm">
                <button onClick={() => { setCurrentOrder(order); setViewOpen(true); }} className="p-1.5 text-blue-600">
                  <FaEye />
                </button>
                <button onClick={() => { setCurrentOrder(order); setEditOpen(true); }} className="p-1.5 text-green-600">
                  <FaEdit />
                </button>
                <button onClick={() => { setCurrentOrder(order); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Crop</div>
                <div className="font-medium">{order.cropDetail.cropName}</div>
                <div className="text-xs text-gray-500">{order.cropDetail.category}</div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Farmer</div>
                  <div>{typeof order.farmer === "string" ? order.farmer : order.farmer?.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div>{formatDate(order.createdAt)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Delivery</div>
                  <div className="text-xs">{formatDate(order.delivery.date)} {order.delivery.time}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payment</div>
                  <div className={`text-xs font-medium
                    ${order.payment.status === "Completed" ? "text-green-700" :
                      order.payment.status === "Failed" ? "text-red-700" :
                      "text-yellow-700"}`}>
                    {order.payment.status}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Bid & Offer</div>
                  <div className="text-sm">
                    ${order.bid?.price || 0} × {order.bid?.quantity || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-bold text-green-700">${calculateTotal(order)}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => { setCurrentOrder(order); handleGenerateInvoice(); }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-700 rounded text-sm"
                >
                  <FaFileInvoice /> Invoice
                </button>
                <button
                  onClick={() => { setCurrentOrder(order); handleProcessPayment(); }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-50 text-green-700 rounded text-sm"
                >
                  <FaMoneyCheckAlt /> Payment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button onClick={getOrders} className="border border-green-300 text-sm rounded p-1 mt-2 px-3 cursor-pointer bg-green-300 text-white">relode</button>
        </div>
      )}

      {/* Material-UI Pagination */}
      {orders.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between rounded items-center mt-5 gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (page - 1) * 10}-{Math.min(page * 10, totalOrders)}</span> of{" "}
            <span className="font-semibold">{totalOrders}</span> orders
          </div>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            Update Order #{currentOrder?.orderId}
          </Typography>
          <br />
          <FormControl fullWidth className="mt-4">
            <InputLabel>Admin Status</InputLabel>
            <Select
              value={currentOrder?.status.admin || ""}
              label="Admin Status"
              onChange={(e) =>
                setCurrentOrder((prev: any) => ({
                  ...prev,
                  status: { ...prev.status, admin: e.target.value },
                }))
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <br />
          <div className="mt-5">
            <FormControl fullWidth >
            <InputLabel>Farmer Status</InputLabel>
            <Select
              value={currentOrder?.status.farmer || ""}
              label="Farmer Status"
              onChange={(e) =>
                setCurrentOrder((prev: any) => ({
                  ...prev,
                  status: { ...prev.status, farmer: e.target.value },
                }))
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save Changes
            </Button>
          </div>
        </Box>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <Typography variant="h6" className="mb-2">
              Delete Order #{currentOrder?.orderId}?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete the order for "{currentOrder?.cropDetail.cropName}"? 
              This action cannot be undone.
            </Typography>
            <div className="flex justify-center gap-[.6rem] text-sm">
              <Button onClick={() => setDeleteOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={modalStyle}>
          {currentOrder && (
            <>
              <Typography variant="h6" className="mb-6">
                Order Details #{currentOrder.orderId}
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Order Date</div>
                    <div className="font-medium">{formatDate(currentOrder.createdAt)}</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${currentOrder.status.admin === "Approved" ? "bg-green-100 text-green-700" :
                          currentOrder.status.admin === "Rejected" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"}`}>
                        {currentOrder.status.admin}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Crop Details</div>
                  <div className="font-medium">{currentOrder.cropDetail.cropName}</div>
                  <div className="text-sm text-gray-600">{currentOrder.cropDetail.category}</div>
                </div>
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Farmer</div>
                    <div>{typeof currentOrder.farmer === "string" ? currentOrder.farmer : currentOrder.farmer?.name}</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Trader</div>
                    <div>{typeof currentOrder.trader === "string" ? currentOrder.trader : currentOrder.trader?.name}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Delivery Schedule</div>
                  <div>{formatDate(currentOrder.delivery.date)} at {currentOrder.delivery.time}</div>
                </div>
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Payment</div>
                    <div className={`font-medium
                      ${currentOrder.payment.status === "Completed" ? "text-green-700" :
                        currentOrder.payment.status === "Failed" ? "text-red-700" :
                        "text-yellow-700"}`}>
                      {currentOrder.payment.status}
                    </div>
                    {currentOrder.payment.paymentId && (
                      <div className="text-xs text-gray-500">ID: {currentOrder.payment.paymentId}</div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Bid Amount</div>
                    <div className="font-bold text-green-700 text-lg">
                      ${calculateTotal(currentOrder)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentOrder.bid?.quantity || 0} units at ${currentOrder.bid?.price || 0}/unit
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setViewOpen(false)} variant="contained">
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}