
// "use client";

// import { useMemo, useState, ReactNode, MouseEventHandler } from "react";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaPrint,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* ================= TYPES ================= */

// type FarmerStatus = "Approved" | "Pending" | "Rejected";

// interface Farmer {
//   id: number;
//   name: string;
//   mobile: string;
//   email: string;
//   status: FarmerStatus;
// }

// /* ================= DATA ================= */

// const initialFarmers: Farmer[] = [
//   { id: 1, name: "Ramesh Sharma", mobile: "9876543210", email: "ramesh.s@example.com", status: "Approved" },
//   { id: 2, name: "Priya Singh", mobile: "9988776655", email: "priya.s@example.com", status: "Pending" },
//   { id: 3, name: "Amit Kumar", mobile: "9123456789", email: "amit.k@example.com", status: "Approved" },
//   { id: 4, name: "Deepa Patel", mobile: "9012345678", email: "deepa.p@example.com", status: "Rejected" },
//   { id: 5, name: "Sanjay Yadav", mobile: "9765432109", email: "sanjay.y@example.com", status: "Pending" },
// ];

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const [editOpen, setEditOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

//   const [form, setForm] = useState<Omit<Farmer, "id">>({
//     name: "",
//     mobile: "",
//     email: "",
//     status: "Pending",
//   });

//   const ITEMS_PER_PAGE = 5;

//   /* ================= FILTER + PAGINATION ================= */

//   const filtered = useMemo(
//     () =>
//       farmers.filter(f =>
//         `${f.name} ${f.email} ${f.mobile}`.toLowerCase().includes(search.toLowerCase())
//       ),
//     [search, farmers]
//   );

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

//   const paginated = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   /* ================= CRUD ================= */

//   const handleDelete = (id: number) =>
//     setFarmers(farmers.filter(f => f.id !== id));

//   const handleApprove = (id: number) =>
//     setFarmers(farmers.map(f => (f.id === id ? { ...f, status: "Approved" } : f)));

//   const handleUpdate = () => {
//     if (!selectedFarmer) return;
//     setFarmers(farmers.map(f => (f.id === selectedFarmer.id ? { ...form, id: f.id } : f)));
//     setEditOpen(false);
//   };

//   /* ================= EXPORT ================= */

//   const exportData = filtered.map(({ id, ...rest }) => rest);

//   const handlePrint = () => window.print();

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(
//       exportData.map(f => `${f.name}\t${f.mobile}\t${f.email}\t${f.status}`).join("\n")
//     );
//     alert("Copied!");
//   };

//   const handleExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Farmers");
//     XLSX.writeFile(wb, "farmers.xlsx");
//   };

//   const handleCSV = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(ws);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "farmers.csv";
//     a.click();
//   };

//   const handlePDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Name", "Mobile", "Email", "Status"]],
//       body: exportData.map(f => [f.name, f.mobile, f.email, f.status]),
//     });
//     doc.save("farmers.pdf");
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 sm:p-6 bg-white min-h-screen text-black">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//         <h1 className="text-xl sm:text-2xl font-semibold">Farmers Management</h1>

//         <div className="flex flex-wrap gap-2">
//           <ActionBtn icon={<FaPrint />} label="Print" onClick={handlePrint} />
//           <ActionBtn icon={<FaCopy />} label="Copy" onClick={handleCopy} />
//           <ActionBtn icon={<FaFileExcel />} label="Excel" onClick={handleExcel} />
//           <ActionBtn icon={<FaFileCsv />} label="CSV" onClick={handleCSV} />
//           <ActionBtn icon={<FaFilePdf />} label="PDF" onClick={handlePDF} />
//         </div>
//       </div>

//       {/* Search */}
//       <input
//         className="border px-3 py-2 rounded mb-4 w-full sm:w-64"
//         placeholder="Search farmers..."
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setCurrentPage(1);
//         }}
//       />

//       {/* ================= MOBILE CARD VIEW ================= */}
//       <div className="space-y-4 sm:hidden">
//         {paginated.map(f => (
//           <div key={f.id} className="border rounded-lg p-4 shadow-sm">
//             <div className="font-semibold text-lg">{f.name}</div>
//             <div className="text-sm text-gray-600">{f.email}</div>
//             <div className="text-sm mt-1">📞 {f.mobile}</div>
//             <div className="text-sm mt-1">Status: {f.status}</div>

//             <div className="flex justify-end gap-4 mt-3 text-lg">
//               <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//               <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//               <FaTrash className="text-red-500" onClick={() => handleDelete(f.id)} />
//               <FaCheck className="text-green-600" onClick={() => handleApprove(f.id)} />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= DESKTOP TABLE VIEW ================= */}
//       <div className="hidden sm:block overflow-x-auto">
//         <table className="min-w-[700px] w-full border text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <Th>Name</Th>
//               <Th>Mobile</Th>
//               <Th>Email</Th>
//               <Th>Status</Th>
//               <Th align="right">Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map(f => (
//               <tr key={f.id} className="border-t">
//                 <Td>{f.name}</Td>
//                 <Td>{f.mobile}</Td>
//                 <Td>{f.email}</Td>
//                 <Td>{f.status}</Td>
//                 <Td align="right">
//                   <div className="flex justify-end gap-3">
//                     <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//                     <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//                     <FaTrash className="text-red-500" onClick={() => handleDelete(f.id)} />
//                     <FaCheck className="text-green-600" onClick={() => handleApprove(f.id)} />
//                   </div>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="mt-6 flex justify-center sm:justify-end">
//         <div className="flex items-center gap-2 border rounded px-3 py-2">
//           <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
//           <span className="bg-green-500 text-white px-3 py-1 rounded">{currentPage}</span>
//           <span>/ {totalPages}</span>
//           <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
//         </div>
//       </div>

//       {/* Modals */}
//       {viewOpen && selectedFarmer && (
//         <Modal title="Farmer Details" onClose={() => setViewOpen(false)}>
//           <p>Name: {selectedFarmer.name}</p>
//           <p>Mobile: {selectedFarmer.mobile}</p>
//           <p>Email: {selectedFarmer.email}</p>
//           <p>Status: {selectedFarmer.status}</p>
//         </Modal>
//       )}

//       {editOpen && (
//         <Modal title="Edit Farmer" onClose={() => setEditOpen(false)}>
//           <Form form={form} setForm={setForm} />
//           <ModalActions label="Update" onSave={handleUpdate} onCancel={() => setEditOpen(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// const Th = ({ children }: { children: ReactNode }) => (
//   <th className="px-4 py-2 text-left">{children}</th>
// );

// const Td = ({ children }: { children: ReactNode }) => (
//   <td className="px-4 py-2">{children}</td>
// );

// const ActionBtn = ({
//   icon,
//   label,
//   onClick,
// }: {
//   icon: ReactNode;
//   label: string;
//   onClick: MouseEventHandler<HTMLButtonElement>;
// }) => (
//   <button onClick={onClick} className="border border-green-500 text-green-600 px-3 py-2 rounded flex items-center gap-2 text-sm">
//     {icon} {label}
//   </button>
// );

// const Modal = ({
//   title,
//   children,
//   onClose,
// }: {
//   title: string;
//   children: ReactNode;
//   onClose: () => void;
// }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
//     <div className="bg-white p-4 rounded w-full max-w-md">
//       <div className="flex justify-between mb-2">
//         <h2 className="font-semibold">{title}</h2>
//         <button onClick={onClose}>✕</button>
//       </div>
//       {children}
//     </div>
//   </div>
// );

// const Form = ({
//   form,
//   setForm,
// }: {
//   form: { name: string; mobile: string; email: string };
//   setForm: React.Dispatch<React.SetStateAction<Omit<Farmer, "id">>>;
// }) => (
//   <div className="space-y-3">
//     {(["name", "mobile", "email"] as const).map(field => (
//       <input
//         key={field}
//         className="border w-full px-3 py-2 rounded"
//         placeholder={field.toUpperCase()}
//         value={form[field]}
//         onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
//       />
//     ))}
//   </div>
// );

// const ModalActions = ({
//   label,
//   onSave,
//   onCancel,
// }: {
//   label: string;
//   onSave: () => void;
//   onCancel: () => void;
// }) => (
//   <div className="flex justify-end gap-2 mt-4">
//     <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
//     <button onClick={onSave} className="bg-green-500 text-white px-4 py-2 rounded">{label}</button>
//   </div>
// );





// "use client";

// import { useMemo, useState, useEffect, ReactNode, MouseEventHandler } from "react";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaPrint,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* ================= TYPES ================= */

// type FarmerStatus = "Approved" | "Pending" | "Rejected";

// interface Farmer {
//   _id: string;
//   name: string;
//   mobile: string;
//   email: string;
//   status: FarmerStatus;
// }

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const [editOpen, setEditOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

//   const [form, setForm] = useState<Omit<Farmer, "_id">>({
//     name: "",
//     mobile: "",
//     email: "",
//     status: "Pending",
//   });

//   const ITEMS_PER_PAGE = 5;

//   /* ================= FETCH FROM BACKEND (STEP 4) ================= */

//   const fetchFarmers = async () => {
//     const res = await fetch("/api/farmers");
//     const data = await res.json();
//     setFarmers(data);
//   };

//   useEffect(() => {
//     fetchFarmers();
//   }, []);

//   /* ================= FILTER + PAGINATION ================= */

//   const filtered = useMemo(
//     () =>
//       farmers.filter(f =>
//         `${f.name} ${f.email} ${f.mobile}`
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       ),
//     [search, farmers]
//   );

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

//   const paginated = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   /* ================= CRUD (STEP 5) ================= */

//   const handleDelete = async (id: string) => {
//     await fetch("/api/farmers", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     fetchFarmers();
//   };

//   const handleApprove = async (id: string) => {
//     await fetch("/api/farmers", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, status: "Approved" }),
//     });
//     fetchFarmers();
//   };

//   const handleUpdate = async () => {
//     if (!selectedFarmer) return;

//     await fetch("/api/farmers", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: selectedFarmer._id, ...form }),
//     });

//     setEditOpen(false);
//     fetchFarmers();
//   };

//   /* ================= EXPORT ================= */

//   const exportData = filtered.map(({ _id, ...rest }) => rest);

//   const handlePrint = () => window.print();

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(
//       exportData.map(f => `${f.name}\t${f.mobile}\t${f.email}\t${f.status}`).join("\n")
//     );
//     alert("Copied!");
//   };

//   const handleExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Farmers");
//     XLSX.writeFile(wb, "farmers.xlsx");
//   };

//   const handleCSV = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(ws);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "farmers.csv";
//     a.click();
//   };

//   const handlePDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Name", "Mobile", "Email", "Status"]],
//       body: exportData.map(f => [f.name, f.mobile, f.email, f.status]),
//     });
//     doc.save("farmers.pdf");
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 sm:p-6 bg-white min-h-screen text-black">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
//         <h1 className="text-xl sm:text-2xl font-semibold">Farmers Management</h1>

//         <div className="flex flex-wrap gap-2">
//           <ActionBtn icon={<FaPrint />} label="Print" onClick={handlePrint} />
//           <ActionBtn icon={<FaCopy />} label="Copy" onClick={handleCopy} />
//           <ActionBtn icon={<FaFileExcel />} label="Excel" onClick={handleExcel} />
//           <ActionBtn icon={<FaFileCsv />} label="CSV" onClick={handleCSV} />
//           <ActionBtn icon={<FaFilePdf />} label="PDF" onClick={handlePDF} />
//         </div>
//       </div>

//       {/* Search */}
//       <input
//         className="border px-3 py-2 rounded mb-4 w-full sm:w-64"
//         placeholder="Search farmers..."
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setCurrentPage(1);
//         }}
//       />

//       {/* MOBILE CARD VIEW */}
//       <div className="space-y-4 sm:hidden">
//         {paginated.map(f => (
//           <div key={f._id} className="border rounded-lg p-4 shadow-sm">
//             <div className="font-semibold text-lg">{f.name}</div>
//             <div className="text-sm text-gray-600">{f.email}</div>
//             <div className="text-sm mt-1">📞 {f.mobile}</div>
//             <div className="text-sm mt-1">Status: {f.status}</div>

//             <div className="flex justify-end gap-4 mt-3 text-lg">
//               <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//               <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//               <FaTrash className="text-red-500" onClick={() => handleDelete(f._id)} />
//               <FaCheck className="text-green-600" onClick={() => handleApprove(f._id)} />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* DESKTOP TABLE */}
//       <div className="hidden sm:block overflow-x-auto">
//         <table className="min-w-[700px] w-full border text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <Th>Name</Th>
//               <Th>Mobile</Th>
//               <Th>Email</Th>
//               <Th>Status</Th>
//               <Th align="right">Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map(f => (
//               <tr key={f._id} className="border-t">
//                 <Td>{f.name}</Td>
//                 <Td>{f.mobile}</Td>
//                 <Td>{f.email}</Td>
//                 <Td>{f.status}</Td>
//                 <Td align="right">
//                   <div className="flex justify-end gap-3">
//                     <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//                     <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//                     <FaTrash className="text-red-500" onClick={() => handleDelete(f._id)} />
//                     <FaCheck className="text-green-600" onClick={() => handleApprove(f._id)} />
//                   </div>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="mt-6 flex justify-center sm:justify-end">
//         <div className="flex items-center gap-2 border rounded px-3 py-2">
//           <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
//           <span className="bg-green-500 text-white px-3 py-1 rounded">{currentPage}</span>
//           <span>/ {totalPages}</span>
//           <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
//         </div>
//       </div>

//       {/* Modals */}
//       {viewOpen && selectedFarmer && (
//         <Modal title="Farmer Details" onClose={() => setViewOpen(false)}>
//           <p>Name: {selectedFarmer.name}</p>
//           <p>Mobile: {selectedFarmer.mobile}</p>
//           <p>Email: {selectedFarmer.email}</p>
//           <p>Status: {selectedFarmer.status}</p>
//         </Modal>
//       )}

//       {editOpen && (
//         <Modal title="Edit Farmer" onClose={() => setEditOpen(false)}>
//           <Form form={form} setForm={setForm} />
//           <ModalActions label="Update" onSave={handleUpdate} onCancel={() => setEditOpen(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// const Th = ({ children }: { children: ReactNode }) => (
//   <th className="px-4 py-2 text-left">{children}</th>
// );

// const Td = ({ children }: { children: ReactNode }) => (
//   <td className="px-4 py-2">{children}</td>
// );

// const ActionBtn = ({
//   icon,
//   label,
//   onClick,
// }: {
//   icon: ReactNode;
//   label: string;
//   onClick: MouseEventHandler<HTMLButtonElement>;
// }) => (
//   <button onClick={onClick} className="border border-green-500 text-green-600 px-3 py-2 rounded flex items-center gap-2 text-sm">
//     {icon} {label}
//   </button>
// );

// const Modal = ({
//   title,
//   children,
//   onClose,
// }: {
//   title: string;
//   children: ReactNode;
//   onClose: () => void;
// }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
//     <div className="bg-white p-4 rounded w-full max-w-md">
//       <div className="flex justify-between mb-2">
//         <h2 className="font-semibold">{title}</h2>
//         <button onClick={onClose}>✕</button>
//       </div>
//       {children}
//     </div>
//   </div>
// );

// const Form = ({
//   form,
//   setForm,
// }: {
//   form: { name: string; mobile: string; email: string };
//   setForm: React.Dispatch<React.SetStateAction<Omit<Farmer, "_id">>>;
// }) => (
//   <div className="space-y-3">
//     {(["name", "mobile", "email"] as const).map(field => (
//       <input
//         key={field}
//         className="border w-full px-3 py-2 rounded"
//         placeholder={field.toUpperCase()}
//         value={form[field]}
//         onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
//       />
//     ))}
//   </div>
// );

// const ModalActions = ({
//   label,
//   onSave,
//   onCancel,
// }: {
//   label: string;
//   onSave: () => void;
//   onCancel: () => void;
// }) => (
//   <div className="flex justify-end gap-2 mt-4">
//     <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
//     <button onClick={onSave} className="bg-green-500 text-white px-4 py-2 rounded">{label}</button>
//   </div>
// );






"use client";

import { useMemo, useState, useEffect, ReactNode, MouseEventHandler } from "react";
import {
  FaEye,
  FaTrash,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

interface Farmer {
  _id: string;
  name: string;
  mobile: string;
  email: string;
}

/* ================= PAGE ================= */

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  const ITEMS_PER_PAGE = 5;

  /* ================= FETCH ================= */

  const fetchFarmers = async () => {
    const res = await fetch("/api/farmers");
    const data = await res.json();
    setFarmers(data);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  /* ================= FILTER + PAGINATION ================= */

  const filtered = useMemo(
    () =>
      farmers.filter(f =>
        `${f.name} ${f.email} ${f.mobile}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, farmers]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    await fetch("/api/farmers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchFarmers();
  };

  /* ================= EXPORT ================= */

  const exportData = filtered.map(({ _id, ...rest }) => rest);

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      exportData.map(f => `${f.name}\t${f.mobile}\t${f.email}`).join("\n")
    );
    alert("Copied!");
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Farmers");
    XLSX.writeFile(wb, "farmers.xlsx");
  };

  const handleCSV = () => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "farmers.csv";
    a.click();
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Mobile", "Email"]],
      body: exportData.map(f => [f.name, f.mobile, f.email]),
    });
    doc.save("farmers.pdf");
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Farmers Management</h1>

        <div className="flex flex-wrap gap-2">
          <ActionBtn icon={<FaPrint />} label="Print" onClick={handlePrint} />
          <ActionBtn icon={<FaCopy />} label="Copy" onClick={handleCopy} />
          <ActionBtn icon={<FaFileExcel />} label="Excel" onClick={handleExcel} />
          <ActionBtn icon={<FaFileCsv />} label="CSV" onClick={handleCSV} />
          <ActionBtn icon={<FaFilePdf />} label="PDF" onClick={handlePDF} />
        </div>
      </div>

      {/* Search */}
      <input
        className="border px-3 py-2 rounded mb-4 w-full sm:w-64"
        placeholder="Search farmers..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* MOBILE VIEW */}
      <div className="space-y-4 sm:hidden">
        {paginated.map(f => (
          <div key={f._id} className="border rounded-lg p-4 shadow-sm">
            <div className="font-semibold text-lg">{f.name}</div>
            <div className="text-sm text-gray-600">{f.email}</div>
            <div className="text-sm mt-1">📞 {f.mobile}</div>

            <div className="flex justify-end gap-4 mt-3 text-lg">
              <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
              <FaTrash className="text-red-500" onClick={() => handleDelete(f._id)} />
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-[700px] w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Name</Th>
              <Th>Mobile</Th>
              <Th>Email</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(f => (
              <tr key={f._id} className="border-t">
                <Td>{f.name}</Td>
                <Td>{f.mobile}</Td>
                <Td>{f.email}</Td>
                <Td align="right">
                  <div className="flex justify-end gap-3">
                    <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
                    <FaTrash className="text-red-500" onClick={() => handleDelete(f._id)} />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center sm:justify-end">
        <div className="flex items-center gap-2 border rounded px-3 py-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
          <span className="bg-green-500 text-white px-3 py-1 rounded">{currentPage}</span>
          <span>/ {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      </div>

      {/* View Modal */}
      {viewOpen && selectedFarmer && (
        <Modal title="Farmer Details" onClose={() => setViewOpen(false)}>
          <p>Name: {selectedFarmer.name}</p>
          <p>Mobile: {selectedFarmer.mobile}</p>
          <p>Email: {selectedFarmer.email}</p>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE ================= */

const Th = ({ children }: { children: ReactNode }) => (
  <th className="px-4 py-2 text-left">{children}</th>
);

const Td = ({ children }: { children: ReactNode }) => (
  <td className="px-4 py-2">{children}</td>
);

const ActionBtn = ({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    onClick={onClick}
    className="border border-green-500 text-green-600 px-3 py-2 rounded flex items-center gap-2 text-sm"
  >
    {icon} {label}
  </button>
);

const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
    <div className="bg-white p-4 rounded w-full max-w-md">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

