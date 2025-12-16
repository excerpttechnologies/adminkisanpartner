/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { FaCopy, FaFileExcel, FaFileCsv, FaFilePdf, FaPrint, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from "react-icons/fa";
import { Box, Modal, TextField, Button, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { useReactToPrint } from "react-to-print";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import OrderFormModal from "@/app/_components/order/OrderFormModal";
import axios from "axios";

type OrderStatus = "Pending" | "Processing" | "Delivered";


interface Order {
  id: number;
  date: string;
  crop: string;
  orderedBy: string;
  status: OrderStatus;
  delivery: string;
  payment: string;
  amount: string;
}

// Initial orders data
const initialOrders: Order[] = [
  {
    id: 1,
    date: "2024-07-20",
    crop: "Organic Wheat (50kg bags)",
    orderedBy: "John Doe (Farmer)",
    status: "Delivered",
    delivery: "123 Farm Rd, Ruralville, ETA",
    payment: "Card (TXN2345)",
    amount: "$120",
  },
  {
    id: 2,
    date: "2024-07-19",
    crop: "Fresh Tomatoes (20kg)",
    orderedBy: "AgroSupply Co. (Agent)",
    status: "Processing",
    delivery: "456 Market St, City, ETA",
    payment: "Bank Transfer (TXN2346)",
    amount: "$90",
  },
  {
    id: 3,
    date: "2024-07-18",
    crop: "Red Potatoes (30kg)",
    orderedBy: "Jane Smith (Farmer)",
    status: "Pending",
    delivery: "789 Green Ln, Village",
    payment: "Cash",
    amount: "$75",
  },
  {
    id: 4,
    date: "2024-07-17",
    crop: "Sweet Corn (100kg)",
    orderedBy: "Green Valley Farms",
    status: "Delivered",
    delivery: "321 Harvest Ave, Farmville",
    payment: "Card (TXN2347)",
    amount: "$250",
  },
  {
    id: 5,
    date: "2024-07-16",
    crop: "Organic Carrots (40kg)",
    orderedBy: "Healthy Foods Inc.",
    status: "Processing",
    delivery: "654 Nutrition St, Health City",
    payment: "Bank Transfer (TXN2348)",
    amount: "$110",
  },
];

// Modal style configuration[citation:9]
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

export default function OrdersPage() {
  // State management
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [addOpen,setaddOpen]=useState(false)


  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      searchTerm === "" ||
      order.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "All" || 
      order.status === statusFilter;
    
    const matchesDate = 
      dateFilter === "" || 
      order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Edit order functionality
  const handleEditClick = (order:any) => {
    setCurrentOrder(order);
    setEditForm({ ...order });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
   
    setEditModalOpen(false);
    setCurrentOrder(null);
    setEditForm({});
  };

  // Delete order functionality
  const handleDeleteClick = (order:any) => {
    setCurrentOrder(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setOrders(prev => prev.filter(order => order.id !== currentOrder.id));
    setDeleteModalOpen(false);
    setCurrentOrder(null);
  };

  // View order details
  const handleViewClick = (order:any) => {
    setCurrentOrder(order);
    setViewModalOpen(true);
  };

  // Export functionality
  const handleCopyToClipboard = async () => {
    const text = filteredOrders.map(order => 
      Object.values(order).join('\t')
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      alert("Orders copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(filteredOrders.map(order => ({
      ID: order.id,
      Date: order.date,
      Crop: order.crop,
      "Ordered By": order.orderedBy,
      Status: order.status,
      Delivery: order.delivery,
      Payment: order.payment,
      Amount: order.amount
    })));
    
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Date", "Crop", "Ordered By", "Status", "Delivery", "Payment", "Amount"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.id,
        `"${order.date}"`,
        `"${order.crop}"`,
        `"${order.orderedBy}"`,
        `"${order.status}"`,
        `"${order.delivery}"`,
        `"${order.payment}"`,
        `"${order.amount}"`
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
    
    const tableColumn = ["ID", "Date", "Crop", "Ordered By", "Status", "Amount"];
    const tableRows = filteredOrders.map(order => [
      order.id,
      order.date,
      order.crop,
      order.orderedBy,
      order.status,
      order.amount
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

  const handlePrint = useReactToPrint({
  contentRef: tableRef,
  documentTitle: "Orders Report",
});



  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDateFilter("");
  };

  const handleSubmit=async(data:any)=>{
   const res=await axios.post('/api/order',{data})
   console.log(res.data)
  }
  return (
    <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto  min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600 mt-2">
          Overview and detailed management of all marketplace orders. {filteredOrders.length} orders found.
        </p>
        </div>
        <button onClick={()=>setaddOpen(!addOpen)} className="bg-green-500 text-white w-32 h-12 rounded">Add new</button>
      </div>

      {/* <Modal  open={open}>
        <div className="min-w-80 h-fit p-4 *:h-12 *:w-full">
            
        </div>
      </Modal> */}
      <OrderFormModal open={addOpen} onClose={()=>setaddOpen(false)} onSubmit={handleSubmit}/>

      {/* Filters Section */}
      <div className="bg-white rounded shadow p-[.6rem] text-sm md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[.6rem] text-sm items-end">
          {/* Search Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Crop, Farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
            <button
              onClick={handleResetFilters}
              className="flex-1 px-4 py-3 border border-gray-300  rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={() => {}} // Filter is applied automatically
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-[.6rem] text-sm mb-6 bg-white p-[.6rem] text-sm rounded shadow">
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

      {/* Table Section */}
      <div className="bg-white rounded shadow " ref={tableRef}>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead className=" border-b border-zinc-200">
              <tr className="*:text-zinc-800">
                <th className="p-[.6rem] text-sm text-left  font-semibold">Sr.</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Date</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Crop Detail</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Ordered By</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Status</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Delivery</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Payment</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Amount</th>
                <th className="p-[.6rem] text-sm text-left  font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, i) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-[.6rem] text-sm">{i + 1}</td>
                  <td className="p-[.6rem] text-sm font-medium">{order.date}</td>
                  <td className="p-[.6rem] text-sm">
                    <div className="font-semibold text-gray-500">{order.crop}</div>
                  </td>
                  <td className="p-[.6rem] text-sm">{order.orderedBy}</td>
                  <td className="p-[.6rem] text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                      ${order.status === "Delivered" ? "bg-green-100 text-green-800" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-[.6rem] text-sm text-sm text-gray-700">{order.delivery}</td>
                  <td className="p-[.6rem] text-sm">
                    <span className="px-2 py-1 bg-gray-100  rounded text-sm">
                      {order.payment}
                    </span>
                  </td>
                  <td className="p-[.6rem] text-sm font-bold text-green-700">{order.amount}</td>
                  <td className="p-[.6rem] text-sm">
                    <div className="flex gap-[.6rem] text-sm">
                      <button
                        onClick={() => handleViewClick(order)}
                        className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditClick(order)}
                        className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Order"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order)}
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

        {/* Mobile Cards */}
        <div className="lg:hidden  space-y-4 p-[.6rem] text-sm">
          {filteredOrders.map((order, i) => (
            <div key={order.id} className=" rounded p-[.6rem] text-sm border border-zinc-200 shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-bold text-gray-800">#{order.id}</span>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold
                    ${order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-[.6rem] text-sm">
                  <button onClick={() => handleViewClick(order)} className="p-1.5 text-blue-600">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEditClick(order)} className="p-1.5 text-green-600">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteClick(order)} className="p-1.5 text-red-600">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-500">Crop</div>
                  <div className="font-medium">{order.crop}</div>
                </div>
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div>
                    <div className="text-sm text-gray-500">Ordered By</div>
                    <div>{order.orderedBy}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div>{order.date}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div>
                    <div className="text-sm text-gray-500">Payment</div>
                    <div className="text-sm">{order.payment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-bold text-green-700">{order.amount}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold  mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between rounded items-center mt-5 gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">1-{filteredOrders.length}</span> of{" "}
            <span className="font-semibold">{filteredOrders.length}</span> orders
          </div>
          <div className="flex gap-[.6rem] text-sm">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal[citation:1][citation:9] */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Fade in={editModalOpen}>
          <Box sx={modalStyle}>
            <Typography id="edit-modal-title" variant="h6" component="h2" className="mb-4">
              Edit Order #{currentOrder?.id}
            </Typography>
            <div className="space-y-4 mt-2 flex flex-col gap-y-4">
              <TextField
                fullWidth
                label="Crop Detail"
                value={editForm.crop || ""}
                onChange={(e) => setEditForm({...editForm, crop: e.target.value})}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Ordered By"
                value={editForm.orderedBy || ""}
                onChange={(e) => setEditForm({...editForm, orderedBy: e.target.value})}
                variant="outlined"
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status || ""}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Delivery Address"
                value={editForm.delivery || ""}
                onChange={(e) => setEditForm({...editForm, delivery: e.target.value})}
                variant="outlined"
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label="Amount"
                value={editForm.amount || ""}
                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                variant="outlined"
              />
            </div>
            <div className="flex justify-end gap-[.6rem] text-sm mt-6">
              <Button
                onClick={() => setEditModalOpen(false)}
                variant="outlined"
                className=""
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Save Changes
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>

      {/* Delete Confirmation Modal[citation:5] */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-modal-title"
      >
        <Fade in={deleteModalOpen}>
          <Box sx={modalStyle}>
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <Typography id="delete-modal-title" variant="h6" component="h2" className="mb-2">
                Delete Order #{currentOrder?.id}?
              </Typography>
              <Typography className="text-gray-600 mb-6">
                Are you sure you want to delete the order for "{currentOrder?.crop}"? 
                This action cannot be undone.
              </Typography>
              <div className="flex justify-center gap-[.6rem] text-sm">
                <Button
                  onClick={() => setDeleteModalOpen(false)}
                  variant="outlined"
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  className="bg-red-600 hover:bg-red-700 px-8"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        aria-labelledby="view-modal-title"
      >
        <Fade in={viewModalOpen}>
          <Box sx={modalStyle}>
            {currentOrder && (
              <>
                <Typography id="view-modal-title" variant="h6" component="h2" className="mb-6">
                  Order Details #{currentOrder.id}
                </Typography>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-medium">{currentOrder.date}</div>
                    </div>
                    <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                      <div className="text-sm text-gray-500">Status</div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-medium
                          ${currentOrder.status === "Delivered" ? "bg-green-100 text-green-700" :
                            currentOrder.status === "Processing" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"}`}>
                          {currentOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Crop</div>
                    <div className="font-medium">{currentOrder.crop}</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Ordered By</div>
                    <div>{currentOrder.orderedBy}</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Delivery Address</div>
                    <div>{currentOrder.delivery}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                      <div className="text-sm text-gray-500">Payment Method</div>
                      <div>{currentOrder.payment}</div>
                    </div>
                    <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="font-bold text-green-700 text-lg">{currentOrder.amount}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setViewModalOpen(false)}
                    variant="contained"
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}