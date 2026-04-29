// components/b2b/B2BOrders.tsx (Static Data)
"use client";

import React from "react";

const B2BOrders = () => {
  const staticOrders = [
    {
      id: "ORD001",
      customer: "Fresh Mart",
      product: "Organic Rice",
      quantity: "100 kg",
      total: "₹1,20,000",
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "ORD002",
      customer: "Green Store",
      product: "Wheat Flour",
      quantity: "50 kg",
      total: "₹42,500",
      status: "Processing",
      date: "2024-01-14",
    },
    {
      id: "ORD003",
      customer: "Healthy Bazaar",
      product: "Pulses Mix",
      quantity: "30 kg",
      total: "₹72,000",
      status: "Shipped",
      date: "2024-01-13",
    },
    {
      id: "ORD004",
      customer: "Organic World",
      product: "Spices Combo",
      quantity: "20 kg",
      total: "₹36,000",
      status: "Pending",
      date: "2024-01-12",
    },
    {
      id: "ORD005",
      customer: "Nature's Basket",
      product: "Organic Vegetables",
      quantity: "50 kg",
      total: "₹25,000",
      status: "Delivered",
      date: "2024-01-11",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">B2B Orders</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage B2B orders
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staticOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.product}</td>
                <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2BOrders;
