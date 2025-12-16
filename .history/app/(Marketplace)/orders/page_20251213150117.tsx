"use client";

import { FaCopy, FaFileExcel, FaFileCsv, FaFilePdf, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

const orders = [
  {
    id: 1,
    date: "2024-07-20",
    crop: "Organic Wheat",
    orderedBy: "John Doe (Farmer)",
    status: "Delivered",
    delivery: "123 Farm Rd",
    payment: "Card",
    amount: 120,
  },
  {
    id: 2,
    date: "2024-07-19",
    crop: "Tomatoes",
    orderedBy: "AgroSupply (Agent)",
    status: "Processing",
    delivery: "456 Market St",
    payment: "Bank",
    amount: 90,
  },
  {
    id: 3,
    date: "2024-07-18",
    crop: "Potatoes",
    orderedBy: "Jane Smith",
    status: "Pending",
    delivery: "789 Green Ln",
    payment: "Cash",
    amount: 75,
  },
];

export default function OrdersPage() {
  /* ================= EXPORT FUNCTIONS ================= */

  // COPY
  const copyData = () => {
    const text = orders
      .map(o =>
        `${o.id}\t${o.date}\t${o.crop}\t${o.orderedBy}\t${o.status}\t${o.amount}`
      )
      .join("\n");

    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  // EXCEL
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  // CSV
  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  // PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["ID", "Date", "Crop", "Ordered By", "Status", "Amount"]],
      body: orders.map(o => [
        o.id,
        o.date,
        o.crop,
        o.orderedBy,
        o.status,
        `$${o.amount}`,
      ]),
    });

    doc.save("orders.pdf");
  };

  // PRINT
  const printTable = () => {
    window.print();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Orders Management</h1>

      {/* BUTTONS */}
      <div className="flex gap-2 mb-4">
        <button onClick={copyData} className="btn"><FaCopy /> Copy</button>
        <button onClick={exportExcel} className="btn"><FaFileExcel /> Excel</button>
        <button onClick={exportCSV} className="btn"><FaFileCsv /> CSV</button>
        <button onClick={exportPDF} className="btn"><FaFilePdf /> PDF</button>
        <button onClick={printTable} className="btn"><FaPrint /> Print</button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Date</th>
              <th>Crop</th>
              <th>Ordered By</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t text-center">
                <td className="p-3">{o.id}</td>
                <td>{o.date}</td>
                <td>{o.crop}</td>
                <td>{o.orderedBy}</td>
                <td>{o.status}</td>
                <td>${o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRINT STYLE */}
      <style jsx global>{`
        @media print {
          button {
            display: none;
          }
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
