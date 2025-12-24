"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  icon?: string;
}

const initialMenus: MenuItem[] = [
  { id: 1, name: "Farmer Post Crops" },
  { id: 2, name: "Farmer My Crops" },
  { id: 3, name: "Farmer My Orders" },
  { id: 4, name: "Farmer Crop Care" },
  { id: 5, name: "Farmer Shopping" },
  { id: 6, name: "Farmer Loans" },
  { id: 7, name: "Farmer Government Scheme" },
  { id: 8, name: "Farmer Market" },
  { id: 9, name: "Farmer Labour" },
  { id: 10, name: "Farmer Videos" },
  { id: 11, name: "Agent Post Requirements" },
  { id: 12, name: "Agent Follow Up Crops" },
  { id: 13, name: "Agent My Orders" },
  { id: 14, name: "Agent Loans and Advances" },
  { id: 15, name: "Logout" },
];

export default function MenuIconsTable() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [rowsToShow, setRowsToShow] = useState(50);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedMenuId = useRef<number | null>(null);

  /* ---------- EDIT ICON ---------- */
  const handleEditClick = (id: number) => {
    selectedMenuId.current = id;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedMenuId.current === null) return;

    const imageUrl = URL.createObjectURL(file);

    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === selectedMenuId.current
          ? { ...menu, icon: imageUrl }
          : menu
      )
    );
  };

  const visibleMenus = menus.slice(0, rowsToShow);

  /* ---------- EXPORT HELPERS ---------- */
  const exportRows = visibleMenus.map((m, i) => ({
    Sr: i + 1,
    Name: m.name,
  }));

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyData = () => {
    const text = [
      "Sr\tMenu Name",
      ...exportRows.map((r) => `${r.Sr}\t${r.Name}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
  };

  const downloadCSV = () => {
    const csv =
      "Sr,Menu Name\n" +
      exportRows.map((r) => `${r.Sr},"${r.Name}"`).join("\n");
    downloadFile(csv, "menu-icons.csv", "text/csv");
  };

  const downloadExcel = () => {
    const header = "Sr\tMenu Name\n";
    const rows = exportRows.map((r) => `${r.Sr}\t${r.Name}`).join("\n");
    downloadFile(header + rows, "menu-icons.xls", "application/vnd.ms-excel");
  };

  const downloadPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    const rows = exportRows
      .map(
        (r) => `
        <tr>
          <td>${r.Sr}</td>
          <td>${r.Name}</td>
        </tr>`
      )
      .join("");

    w.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 40px; }
            table { width:100%; border-collapse:collapse; }
            th,td { border:1px solid #000; padding:8px; }
            th { background:#f3f3f3; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Menu Icons</h2>
          <table>
            <tr><th>Sr</th><th>Menu Name</th></tr>
            ${rows}
          </table>
        </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-4 md:p-6 text-black">
      <h1 className="text-[22px] font-semibold mb-1">Menu Icons</h1>

      <p className="text-sm text-blue-600 mb-4">
        Menu Icons (Note: Icons must be 40×40 size and transparent PNG.)
      </p>

      {/* ===== BUTTON BAR (ADDED) ===== */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={copyData} className="border px-3 py-1 rounded">Copy</button>
        <button onClick={downloadExcel} className="border px-3 py-1 rounded">Excel</button>
        <button onClick={downloadCSV} className="border px-3 py-1 rounded">CSV</button>
        <button onClick={downloadPDF} className="border px-3 py-1 rounded">PDF</button>
        <button onClick={downloadPDF} className="border px-3 py-1 rounded">Print</button>

        <select
          className="border px-3 py-1 rounded"
          value={rowsToShow}
          onChange={(e) => setRowsToShow(Number(e.target.value))}
        >
          <option value={10}>Show 10 rows</option>
          <option value={25}>Show 25 rows</option>
          <option value={50}>Show 50 rows</option>
          <option value={200}>Show 200 rows</option>
        </select>
      </div>

      <div className="bg-white rounded-md p-4 shadow-[0_0_0_1px_#ddd]">
        <h2 className="text-[16px] font-semibold mb-3">
          Menu Icons Management
        </h2>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Sr.</th>
                <th className="px-3 py-2 border">Menu Name</th>
                <th className="px-3 py-2 border">Menu Icon</th>
                <th className="px-3 py-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleMenus.map((menu, index) => (
                <tr key={menu.id}>
                  <td className="px-3 py-3 border">{index + 1}</td>
                  <td className="px-3 py-3 border">{menu.name}</td>
                  <td className="px-3 py-3 border">
                    {menu.icon ? (
                      <img src={menu.icon} className="w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 border-2 border-green-600 rounded flex items-center justify-center">+</div>
                    )}
                  </td>
                  <td className="px-3 py-3 border text-center">
                    <button
                      onClick={() => handleEditClick(menu.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden space-y-3">
          {visibleMenus.map((menu, index) => (
            <div key={menu.id} className="border rounded p-3">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">#{index + 1}</span>
                <button
                  onClick={() => handleEditClick(menu.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                >
                  <Pencil size={14} /> Edit
                </button>
              </div>

              <p className="text-sm mb-2">
                <b>Menu:</b> {menu.name}
              </p>

              {menu.icon ? (
                <img src={menu.icon} className="w-10 h-10" />
              ) : (
                <div className="w-10 h-10 border-2 border-green-600 rounded flex items-center justify-center">+</div>
              )}
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </div>
    </div>
  );
}