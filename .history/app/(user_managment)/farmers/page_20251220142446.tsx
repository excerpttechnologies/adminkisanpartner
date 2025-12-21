
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
//         `${f.personalInfo.name} ${f.personalInfo.email} ${f.personalInfo.mobile}`.toLowerCase().includes(search.toLowerCase())
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
//     setFarmers(farmers.filter(f => f.personalInfo.id !== id));

//   const handleApprove = (id: number) =>
//     setFarmers(farmers.map(f => (f.personalInfo.id === id ? { ...f, status: "Approved" } : f)));

//   const handleUpdate = () => {
//     if (!selectedFarmer) return;
//     setFarmers(farmers.map(f => (f.personalInfo.id === selectedFarmer.id ? { ...form, id: f.personalInfo.id } : f)));
//     setEditOpen(false);
//   };

//   /* ================= EXPORT ================= */

//   const exportData = filtered.map(({ id, ...rest }) => rest);

//   const handlePrint = () => window.print();

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(
//       exportData.map(f => `${f.personalInfo.name}\t${f.personalInfo.mobile}\t${f.personalInfo.email}\t${f.personalInfo.status}`).join("\n")
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
//       body: exportData.map(f => [f.personalInfo.name, f.personalInfo.mobile, f.personalInfo.email, f.personalInfo.status]),
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
//           <div key={f.personalInfo.id} className="border rounded-lg p-4 shadow-sm">
//             <div className="font-semibold text-lg">{f.personalInfo.name}</div>
//             <div className="text-sm text-gray-600">{f.personalInfo.email}</div>
//             <div className="text-sm mt-1">📞 {f.personalInfo.mobile}</div>
//             <div className="text-sm mt-1">Status: {f.personalInfo.status}</div>

//             <div className="flex justify-end gap-4 mt-3 text-lg">
//               <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//               <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//               <FaTrash className="text-red-500" onClick={() => handleDelete(f.personalInfo.id)} />
//               <FaCheck className="text-green-600" onClick={() => handleApprove(f.personalInfo.id)} />
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
//               <tr key={f.personalInfo.id} className="border-t">
//                 <Td>{f.personalInfo.name}</Td>
//                 <Td>{f.personalInfo.mobile}</Td>
//                 <Td>{f.personalInfo.email}</Td>
//                 <Td>{f.personalInfo.status}</Td>
//                 <Td align="right">
//                   <div className="flex justify-end gap-3">
//                     <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//                     <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//                     <FaTrash className="text-red-500" onClick={() => handleDelete(f.personalInfo.id)} />
//                     <FaCheck className="text-green-600" onClick={() => handleApprove(f.personalInfo.id)} />
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
//         `${f.personalInfo.name} ${f.personalInfo.email} ${f.personalInfo.mobile}`
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
//       exportData.map(f => `${f.personalInfo.name}\t${f.personalInfo.mobile}\t${f.personalInfo.email}\t${f.personalInfo.status}`).join("\n")
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
//       body: exportData.map(f => [f.personalInfo.name, f.personalInfo.mobile, f.personalInfo.email, f.personalInfo.status]),
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
//           <div key={f.personalInfo._id} className="border rounded-lg p-4 shadow-sm">
//             <div className="font-semibold text-lg">{f.personalInfo.name}</div>
//             <div className="text-sm text-gray-600">{f.personalInfo.email}</div>
//             <div className="text-sm mt-1">📞 {f.personalInfo.mobile}</div>
//             <div className="text-sm mt-1">Status: {f.personalInfo.status}</div>

//             <div className="flex justify-end gap-4 mt-3 text-lg">
//               <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//               <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//               <FaTrash className="text-red-500" onClick={() => handleDelete(f.personalInfo._id)} />
//               <FaCheck className="text-green-600" onClick={() => handleApprove(f.personalInfo._id)} />
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
//               <tr key={f.personalInfo._id} className="border-t">
//                 <Td>{f.personalInfo.name}</Td>
//                 <Td>{f.personalInfo.mobile}</Td>
//                 <Td>{f.personalInfo.email}</Td>
//                 <Td>{f.personalInfo.status}</Td>
//                 <Td align="right">
//                   <div className="flex justify-end gap-3">
//                     <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//                     <FaEdit onClick={() => { setSelectedFarmer(f); setForm(f); setEditOpen(true); }} />
//                     <FaTrash className="text-red-500" onClick={() => handleDelete(f.personalInfo._id)} />
//                     <FaCheck className="text-green-600" onClick={() => handleApprove(f.personalInfo._id)} />
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



// | Action       | Method | Endpoint           |
// | ------------ | ------ | ------------------ |
// | List         | GET    | `/api/farmers`     |
// | View         | GET    | `/api/farmers/:id` |
// | Approve/Edit | PUT    | `/api/farmers/:id` |
// | Delete       | DELETE | `/api/farmers/:id` |



// "use client";

// import { useMemo, useState, useEffect, ReactNode, MouseEventHandler } from "react";
// import {
//   FaEye,
//   FaTrash,
//   FaPrint,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";

// /* ================= TYPES ================= */

// interface Farmer {
//   _id: string;
//   name: string;
//   mobile: string;
//   email: string;
// }

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

//   const ITEMS_PER_PAGE = 5;

//   /* ================= FETCH ================= */

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
//         `${f.personalInfo.name} ${f.personalInfo.email} ${f.personalInfo.mobile}`
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

//   /* ================= DELETE ================= */

//   const handleDelete = async (id: string) => {
//     await fetch("/api/farmers", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     fetchFarmers();
//   };

//   /* ================= EXPORT ================= */

//   const exportData = filtered.map(({ _id, ...rest }) => rest);

//   const handlePrint = () => window.print();

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(
//       exportData.map(f => `${f.personalInfo.name}\t${f.personalInfo.mobile}\t${f.personalInfo.email}`).join("\n")
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
//       head: [["Name", "Mobile", "Email"]],
//       body: exportData.map(f => [f.personalInfo.name, f.personalInfo.mobile, f.personalInfo.email]),
//     });
//     doc.save("farmers.pdf");
//   };

//   /* ================= UI ================= */
// /////get farmers

// const getFarmers=async()=>{
//   try{
//    const res=await axios.get("/api/farmers")
//    if(res.data.success){
//     setFarmers(res.data.data)
//    }
//   }catch(err){
//     console.log(err)
//   }
// }
// useEffect(()=>{

// },[search])
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

//       {/* MOBILE VIEW */}
//       <div className="space-y-4 sm:hidden">
//         {paginated.map(f => (
//           <div key={f.personalInfo._id} className="border rounded-lg p-4 shadow-sm">
//             <div className="font-semibold text-lg">{f.personalInfo.name}</div>
//             <div className="text-sm text-gray-600">{f.personalInfo.email}</div>
//             <div className="text-sm mt-1">📞 {f.personalInfo.mobile}</div>

//             <div className="flex justify-end gap-4 mt-3 text-lg">
//               <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//               <FaTrash className="text-red-500" onClick={() => handleDelete(f.personalInfo._id)} />
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
//               <Th >Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map(f => (
//               <tr key={f.personalInfo._id} className="border-t">
//                 <Td>{f.personalInfo.name}</Td>
//                 <Td>{f.personalInfo.mobile}</Td>
//                 <Td>{f.personalInfo.email}</Td>
//                 <Td >
//                   <div className="flex justify-end gap-3">
//                     <FaEye onClick={() => { setSelectedFarmer(f); setViewOpen(true); }} />
//                     <FaTrash className="text-red-500" onClick={() => handleDelete(f.personalInfo._id)} />
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

//       {/* View Modal */}
//       {viewOpen && selectedFarmer && (
//         <Modal title="Farmer Details" onClose={() => setViewOpen(false)}>
//           <p>Name: {selectedFarmer.name}</p>
//           <p>Mobile: {selectedFarmer.mobile}</p>
//           <p>Email: {selectedFarmer.email}</p>
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
//   <button
//     onClick={onClick}
//     className="border border-green-500 text-green-600 px-3 py-2 rounded flex items-center gap-2 text-sm"
//   >
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

// "use client";

// import { useMemo, useState, useEffect, ReactNode, MouseEventHandler } from "react";
// import {
//   FaEye,
//   FaTrash,
//   FaPrint,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// interface Farmer {
//   _id: string;
//   personalInfo:{
//     name: string;
//   mobileNo: string;
//   email: string;
//   address?: string;
//   villageGramaPanchayat?: string;
//   pincode?: string;
//   state?: string;
//   district?: string;
//   taluk?: string;
//   post?: string;
//   }
// }

// interface ApiResponse {
//   success: boolean;
//   data: Farmer[];
//   pagination?: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

//   const ITEMS_PER_PAGE = 10;

//   /* ================= FETCH ================= */

//   const fetchFarmers = async (page: number = 1, searchQuery: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: ITEMS_PER_PAGE.toString(),
//         ...(searchQuery && { search: searchQuery }),
//       });

//       const res = await axios.get<ApiResponse>(`/api/farmers?${params}`);
      
//       if (res.data.success) {
//         setFarmers(res.data.data);
//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages);
//           setCurrentPage(res.data.pagination.page);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching farmers:', err);
//       setError('Failed to load farmers. Please try again.');
//       setFarmers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFarmers(currentPage, search);
//   }, [currentPage]);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (search !== undefined) {
//         fetchFarmers(1, search);
//         setCurrentPage(1);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ================= DELETE ================= */

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this farmer?")) return;
   
//     try {
//       // await fetch("/api/farmers", {
//       //   method: "DELETE",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({ id }),
//       // });
//       const res=await axios.delete(`api/farmers/${id}`)
      
//       // Refresh the list
//       fetchFarmers(currentPage, search);
//       toast.success("Farmer deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting farmer:", error);
//       toast.error("Failed to delete farmer. Please try again.");
//     }
//   };

//   /* ================= EXPORT ================= */

//   const exportData = farmers.map(({ _id, ...rest }) => rest);

//   const handlePrint = () => window.print();

//   const handleCopy = async () => {
//     const text = exportData.map(f => 
//       `${f.personalInfo.name}\t${f.personalInfo.mobileNo}\t${f.personalInfo.email || 'N/A'}\t${f.personalInfo.villageGramaPanchayat || 'N/A'}\t${f.personalInfo.district || 'N/A'}`
//     ).join("\n");
    
//     await navigator.clipboard.writeText(text);
//     alert("Copied to clipboard!");
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
//       head: [["Name", "Mobile", "Email", "Village", "District", "State"]],
//       body: exportData.map(f => [
//         f.personalInfo.name,
//         f.personalInfo.mobileNo,
//         f.personalInfo.email || 'N/A',
//         f.personalInfo.villageGramaPanchayat || 'N/A',
//         f.personalInfo.district || 'N/A',
//         f.personalInfo.state || 'N/A',
//       ]),
//       theme: 'grid',
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [22, 160, 133] },
//     });
    
//     doc.save("farmers.pdf");
//   };

//   /* ================= UI ================= */
// console.log(farmers)
//   return (
//     <div className="p-4 sm:p-6 bg-white min-h-screen text-black">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
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
//       <div className="mb-6">
//         <input
//           className="border px-4 py-2 rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
//           placeholder="Search by name, email, mobile, or village..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         {error && (
//           <div className="mt-2 text-red-600 text-sm">{error}</div>
//         )}
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//           <p className="mt-2 text-gray-600">Loading farmers...</p>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && farmers.length === 0 && (
//         <div className="text-center py-8 border rounded-lg bg-gray-50">
//           <p className="text-gray-600">No farmers found</p>
//           {search && (
//             <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
//           )}
//         </div>
//       )}

//       {/* MOBILE VIEW */}
//       {!loading && farmers.length > 0 && (
//         <>
//           <div className="space-y-4 sm:hidden">
//             {farmers.map(f => (
//               <div key={f._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="font-semibold text-lg text-green-700">{f.personalInfo.name}</div>
//                 <div className="text-sm text-gray-600 mt-1">{f.personalInfo.email || 'No email'}</div>
//                 <div className="text-sm mt-1">📞 {f.personalInfo.mobileNo}</div>
//                 <div className="text-sm mt-1 text-gray-500">
//                   {f.personalInfo.villageGramaPanchayat}, {f.personalInfo.district}
//                 </div>

//                 <div className="flex justify-end gap-4 mt-3 text-lg pt-3 border-t">
//                   <button
//                     onClick={() => { setSelectedFarmer(f); setViewOpen(true); }}
//                     className="p-2 hover:bg-gray-100 rounded"
//                     title="View Details"
//                   >
//                     <FaEye className="text-blue-600" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(f._id)}
//                     className="p-2 hover:bg-gray-100 rounded"
//                     title="Delete"
//                   >
//                     <FaTrash className="text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* DESKTOP TABLE */}
//           <div className="hidden sm:block overflow-x-auto rounded-lg border shadow-sm">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <Th>Name</Th>
//                   <Th>Mobile</Th>
//                   <Th>Email</Th>
//                   <Th>Village</Th>
//                   <Th>District</Th>
//                   <Th>State</Th>
//                   <Th className="text-right">Actions</Th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {farmers.map(f => (
//                   <tr key={f._id} className="hover:bg-gray-50 transition-colors">
//                     <Td>
//                       <div className="font-medium text-gray-900">{f.personalInfo.name}</div>
//                     </Td>
//                     <Td>{f.personalInfo.mobileNo}</Td>
//                     <Td>
//                       <span className={`${f.personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
//                         {f.personalInfo.email || 'No email'}
//                       </span>
//                     </Td>
//                     <Td>{f.personalInfo.villageGramaPanchayat || 'N/A'}</Td>
//                     <Td>{f.personalInfo.district || 'N/A'}</Td>
//                     <Td>{f.personalInfo.state || 'N/A'}</Td>
//                     <Td className="text-right">
//                       <div className="flex justify-end gap-3">
//                         <button
//                           onClick={() => { setSelectedFarmer(f); setViewOpen(true); }}
//                           className="p-2 hover:bg-blue-50 rounded transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye className="text-blue-600" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(f._id)}
//                           className="p-2 hover:bg-red-50 rounded transition-colors"
//                           title="Delete"
//                         >
//                           <FaTrash className="text-red-500" />
//                         </button>
//                       </div>
//                     </Td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-6 flex justify-center sm:justify-end">
//               <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white shadow-sm">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
//                 >
//                   Prev
//                 </button>
                
//                 <span className="flex items-center gap-1">
//                   <span className="bg-green-500 text-white px-3 py-1 rounded-full">
//                     {currentPage}
//                   </span>
//                   <span className="text-gray-600">/ {totalPages}</span>
//                 </span>
                
//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* View Modal */}
//       {viewOpen && selectedFarmer && (
//         <Modal title="Farmer Details" onClose={() => setViewOpen(false)}>
//           <div className="space-y-4">
//             <DetailRow label="Name" value={selectedFarmer.personalInfo.name} />
//             <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo} />
//             <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
//             <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
//             <DetailRow label="Village" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
//             <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
//             <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
//             <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
//             <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
//             <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const Th = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
//   <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
//     {children}
//   </th>
// );

// const Td = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
//   <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
//     {children}
//   </td>
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
//   <button
//     onClick={onClick}
//     className="border border-green-500 text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-green-50 transition-colors"
//   >
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
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//     <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ✕
//         </button>
//       </div>
//       <div className="max-h-[70vh] overflow-y-auto pr-2">
//         {children}
//       </div>
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex">
//     <div className="w-32 font-medium text-gray-600">{label}:</div>
//     <div className="flex-1 text-gray-900">{value}</div>
//   </div>
// );

"use client";

import { useMemo, useState, useEffect, ReactNode, MouseEventHandler, useCallback } from "react";
import {
  FaEye,
  FaTrash,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaFilter,
  FaRedo,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";

/* ================= TYPES ================= */

interface Farmer {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address?: string;
    villageGramaPanchayat?: string;
    pincode?: string;
    state?: string;
    district?: string;
    taluk?: string;
    post?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Farmer[];
  page:number;
  limit:number;
  total:number;
}
interface District {
  _id: string;
  name: string;
}

/* ================= PAGE ================= */

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [districtsLoading, setDistrictsLoading] = useState(false);
   const [districts, setDistricts] = useState<District[]>([]);
   const [disName,setDisName]=useState("")
   
   

  /* ================= FETCH FARMERS ================= */

  const fetchFarmers = async (page: number = 1, searchQuery: string = "",disName="") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
        district:disName
      });

      const res = await axios.get<ApiResponse>(`/api/farmers?${params}`);
      
      if (res.data.success) {
        setFarmers(res.data.data);
        if (res.data.success) {
          setTotalPages(res.data.page);
          setCurrentPage(res.data.limit);
          setTotalFarmers(res.data.total);
        }
      }
    } catch (err: any) {
      console.error('Error fetching farmers:', err);
      setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
      setFarmers([]);
      toast.error(err.response?.data?.message || "Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

   const fetchDistricts = useCallback(async () => {
      setDistrictsLoading(true);
      try {
        const response = await axios.get("/api/districts", {
          params: { 
            limit: 100,
            page: 1
          }
        });
        if (response.data.success) {
          setDistricts(response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching districts:", error);
        toast.error("Failed to load districts");
      } finally {
        setDistrictsLoading(false);
      }
    }, []);

     useEffect(() => {
        fetchDistricts();
      }, [fetchDistricts]);
    

  useEffect(() => {
    fetchFarmers(currentPage, search,disName);
  }, [currentPage, rowsPerPage,disName]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFarmers(1, search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= DELETE FARMER ================= */

  const handleDelete = async () => {
    if (!selectedFarmer) return;
   
    try {
      await axios.delete(`/api/farmers/${selectedFarmer._id}`);
      toast.success("Farmer deleted successfully!");
      setDeleteOpen(false);
      fetchFarmers(currentPage, search);
    } catch (error: any) {
      console.error("Error deleting farmer:", error);
      toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = farmers.map((farmer, index) => ({
    "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
    "Name": farmer.personalInfo.name,
    "Mobile": farmer.personalInfo.mobileNo,
    "Email": farmer.personalInfo.email || 'N/A',
    "Village": farmer.personalInfo.villageGramaPanchayat || 'N/A',
    "District": farmer.personalInfo.district || 'N/A',
    "State": farmer.personalInfo.state || 'N/A',
    "Address": farmer.personalInfo.address || 'N/A',
    "Taluk": farmer.personalInfo.taluk || 'N/A',
    "Post": farmer.personalInfo.post || 'N/A',
    "Pincode": farmer.personalInfo.pincode || 'N/A',
  }));

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Farmers Report</title>
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
          <h1>👨‍🌾 Farmers Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Village</th>
              <th>District</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            ${farmers.map((farmer, index) => `
              <tr>
                <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td><strong>${farmer.personalInfo.name}</strong></td>
                <td>${farmer.personalInfo.mobileNo}</td>
                <td>${farmer.personalInfo.email || 'N/A'}</td>
                <td>${farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
                <td>${farmer.personalInfo.district || 'N/A'}</td>
                <td>${farmer.personalInfo.state || 'N/A'}</td>
              </tr>
            `).join('')}
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

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      toast.error("Please allow popups to print");
    }
  };

  const handleCopy = async () => {
    const text = exportData.map(f => 
      `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Village}\t${f.District}\t${f.State}`
    ).join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Farmers data copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Farmers");
      XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Farmers Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State"];
      const tableRows: any = exportData.map(f => [
        f["Sr."],
        f.Name,
        f.Mobile,
        f.Email,
        f.Village,
        f.District,
        f.State,
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    setDisName("")
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
          </p>
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow ">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
          >
            <btn.icon className="text-sm" />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, mobile, email, or village..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
             <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={disName}
              onChange={(e) => setDisName(e.target.value)}
              disabled={districtsLoading}
            >
              {districtsLoading ? (
                <option>Loading districts...</option>
              ) : districts.length === 0 ? (
                <option value="">No districts available</option>
              ) : (
                <>
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district._id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <button
              onClick={handleResetFilters}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaRedo /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
              { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
              { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon className="text-sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Desktop Table (hidden on mobile) */}
      {!loading && farmers.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Mobile</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Village</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {farmers.map((farmer, index) => (
                  <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{farmer.personalInfo.name}</div>
                    </td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.mobileNo}</td>
                    <td className="p-[.6rem] text-sm">
                      <span className={`${farmer.personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {farmer.personalInfo.email || 'No email'}
                      </span>
                    </td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.district || 'N/A'}</td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.state || 'N/A'}</td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Farmer"
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
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {farmers.map((farmer, index) => (
              <div key={farmer._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800">{farmer.personalInfo.name}</div>
                    <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }} className="p-1.5 text-blue-600">
                      <FaEye />
                    </button>
                    <button onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Mobile</div>
                    <div className="text-sm">{farmer.personalInfo.mobileNo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className={`text-sm ${farmer.personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                      {farmer.personalInfo.email || 'No email'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div>
                      <div className="text-sm text-gray-500">Village</div>
                      <div className="text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">District</div>
                      <div className="text-sm">{farmer.personalInfo.district || 'N/A'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">State</div>
                    <div className="text-sm">{farmer.personalInfo.state || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && farmers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
          <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && farmers.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm ">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
            <span className="font-semibold">{totalFarmers}</span> farmers
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-1 ml-3 border border-zinc-300 rounded"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>
          
          {/* <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className={`border px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-green-500 text-white' : 'border hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className={`border px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div> */}
           <Pagination
                      count={}
                      page={totalPages}
                      onChange={(event, value) => setTotalPages(value)}
                      color="primary"
                     
                    />
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl text-gray-800">Farmer Details</h2>
              <button
                onClick={() => setViewOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <DetailRow label="Name" value={selectedFarmer.personalInfo.name} />
              <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo} />
              <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
              <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
              <DetailRow label="Village" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
              <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
              <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
              <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
              <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
              <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewOpen(false)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
    <div className="w-32 font-medium text-gray-600">{label}:</div>
    <div className="flex-1 text-gray-900">{value}</div>
  </div>
);