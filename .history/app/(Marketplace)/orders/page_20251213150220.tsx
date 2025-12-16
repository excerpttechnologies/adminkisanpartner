"use client";

import { FaCopy, FaFileExcel, FaFileCsv, FaFilePdf, FaPrint } from "react-icons/fa";

const orders = [
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
];

export default function OrdersPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Orders Management</h1>
        <p className="text-sm text-gray-500">
          Overview and detailed management of all marketplace orders.
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search by Order ID, Crop, Farmer..."
          className="border rounded px-3 py-2 text-sm"
        />
        <select className="border rounded px-3 py-2 text-sm">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Delivered</option>
        </select>
        <input type="date" className="border rounded px-3 py-2 text-sm" />
        <button className="bg-green-600 text-white rounded px-4 py-2 text-sm">
          Filter
        </button>
      </div>

      {/* EXPORT BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-3 bg-white p-3">
        {[
          { label: "Copy", icon: FaCopy },
          { label: "Excel", icon: FaFileExcel },
          { label: "CSV", icon: FaFileCsv },
          { label: "PDF", icon: FaFilePdf },
          { label: "Print", icon: FaPrint },
        ].map((btn, i) => (
          <button
            key={i}
            className="flex items-center gap-2 border bg-white px-3 py-2 rounded text-sm shadow hover:bg-gray-100"
          >
            <btn.icon />
            {btn.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Sr.</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Crop Detail</th>
              <th className="p-3 text-left">Ordered By</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Delivery</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">{order.crop}</td>
                <td className="p-3">{order.orderedBy}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.delivery}</td>
                <td className="p-3">{order.payment}</td>
                <td className="p-3 font-semibold">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end mt-4 gap-2 text-sm">
        <button className="border px-3 py-1 rounded">Previous</button>
        <button className="border px-3 py-1 rounded bg-green-600 text-white">
          1
        </button>
        <button className="border px-3 py-1 rounded">Next</button>
      </div>
    </div>
  );
}
