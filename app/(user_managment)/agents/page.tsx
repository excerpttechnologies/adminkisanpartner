// "use client";

// import { useMemo, useState, useEffect, ReactNode } from "react";
// import { FaEye, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* ================= TYPES ================= */

// type Status = "Approved" | "Pending" | "Rejected";

// interface Agent {
//   id: number;
//   name: string;
//   mobile: string;
//   email: string;
//   status: Status;
// }

// /* ================= DATA ================= */

// const initialAgents: Agent[] = [
//   { id: 1, name: "John Doe", mobile: "+1-555-1234", email: "john.doe@example.com", status: "Approved" },
//   { id: 2, name: "Jane Smith", mobile: "+1-555-5678", email: "jane.smith@example.com", status: "Pending" },
//   { id: 3, name: "Robert Johnson", mobile: "+1-555-9012", email: "robert.j@example.com", status: "Rejected" },
//   { id: 4, name: "Emily White", mobile: "+1-555-3456", email: "emily.w@example.com", status: "Approved" },
//   { id: 5, name: "Michael Brown", mobile: "+1-555-7890", email: "michael.b@example.com", status: "Pending" },
// ];

// export default function AgentManagementPage() {
//   const [agents, setAgents] = useState<Agent[]>(initialAgents);
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [page, setPage] = useState(1);

//   /* MODALS */
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);

//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

//   const [form, setForm] = useState<Omit<Agent, "id">>({
//     name: "",
//     mobile: "",
//     email: "",
//     status: "Pending",
//   });

//   const [errors, setErrors] = useState<{
//     name?: string;
//     mobile?: string;
//     email?: string;
//   }>({});

//   /* ================= FILTER ================= */

//   const filteredAgents = useMemo(() => {
//     return agents.filter((a) =>
//       `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [agents, search]);

//   /* ================= PAGINATION (FIXED) ================= */

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredAgents.length / rowsPerPage)
//   );

//   useEffect(() => {
//     if (page > totalPages) {
//       setPage(() => totalPages); // ✅ FIXED
//     }
//   }, [page, totalPages]);

//   const paginatedAgents = filteredAgents.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   /* ================= VALIDATION ================= */

//   const validateForm = (): boolean => {
//     const e: typeof errors = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.mobile.trim()) e.mobile = "Mobile is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD ================= */

//   const resetForm = () => {
//     setForm({ name: "", mobile: "", email: "", status: "Pending" });
//     setErrors({});
//     setSelectedAgent(null);
//   };

//   const handleAdd = () => {
//     if (!validateForm()) return;
//     setAgents(prev => [...prev, { ...form, id: Date.now() }]);
//     resetForm();
//     setAddOpen(false);
//   };

//   const handleEdit = () => {
//     if (!selectedAgent || !validateForm()) return;
//     setAgents(prev =>
//       prev.map(a =>
//         a.id === selectedAgent.id ? { ...form, id: a.id } : a
//       )
//     );
//     resetForm();
//     setEditOpen(false);
//   };

//   const approveAgent = (id: number) =>
//     setAgents(prev =>
//       prev.map(a =>
//         a.id === id ? { ...a, status: "Approved" } : a
//       )
//     );

//   const deleteAgent = (id: number) =>
//     setAgents(prev => prev.filter(a => a.id !== id));

//   /* ================= EXPORT ================= */

//   const exportData = filteredAgents.map(({ id, ...rest }) => rest);

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(
//       exportData.map(a =>
//         `${a.name}\t${a.mobile}\t${a.email}\t${a.status}`
//       ).join("\n")
//     );
//     alert("Copied to clipboard");
//   };

//   const handleExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Agents");
//     XLSX.writeFile(wb, "agents.xlsx");
//   };

//   const handleCSV = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(ws);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "agents.csv";
//     a.click();
//   };

//   const handlePDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Name", "Mobile", "Email", "Status"]],
//       body: exportData.map(a => [a.name, a.mobile, a.email, a.status]),
//     });
//     doc.save("agents.pdf");
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen text-black">
//       <h1 className="text-2xl font-semibold mb-4">Agent Management</h1>

//       <div className="bg-white rounded-lg p-4 shadow">
//         <div className="flex justify-between mb-4">
//           <h2 className="font-semibold text-lg">Agent Accounts</h2>
//           <button
//             onClick={() => setAddOpen(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <FaPlus /> Add New Agent
//           </button>
//         </div>

//         {/* TOP EXPORT BUTTONS */}
//         <div className="flex gap-2 mb-4">
//           <ToolbarBtn label="Copy" onClick={handleCopy} />
//           <ToolbarBtn label="Excel" onClick={handleExcel} />
//           <ToolbarBtn label="CSV" onClick={handleCSV} />
//           <ToolbarBtn label="PDF" onClick={handlePDF} />
//         </div>

//         <input
//           className="border px-3 py-2 rounded w-full mb-4"
//           placeholder="Filter agents by name or email..."
//           value={search}
//           onChange={e => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />

//         <table className="w-full text-sm border-t">
//           <thead>
//             <tr className="text-gray-600">
//               <Th>Sr.</Th>
//               <Th>Name</Th>
//               <Th>Mobile</Th>
//               <Th>Email</Th>
//               <Th>Status</Th>
//               <Th align="right">Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedAgents.map((a, i) => (
//               <tr key={a.id} className="border-t">
//                 <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
//                 <Td>{a.name}</Td>
//                 <Td>{a.mobile}</Td>
//                 <Td>{a.email}</Td>
//                 <Td>
//                   <span className={`px-3 py-1 rounded-full text-xs ${
//                     a.status === "Approved"
//                       ? "bg-green-100 text-green-700"
//                       : a.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-600"
//                   }`}>
//                     {a.status}
//                   </span>
//                 </Td>
//                 <Td align="right">
//                   <div className="flex justify-end gap-3">
//                     <FaEye
//                       className="cursor-pointer"
//                       onClick={() => {
//                         setSelectedAgent(a);
//                         setViewOpen(true);
//                       }}
//                     />
//                     <FaEdit
//                       className="cursor-pointer"
//                       onClick={() => {
//                         setSelectedAgent(a);
//                         setForm(a);
//                         setEditOpen(true);
//                       }}
//                     />
//                     {a.status !== "Approved" && (
//                       <FaCheck
//                         className="cursor-pointer text-green-600"
//                         onClick={() => approveAgent(a.id)}
//                       />
//                     )}
//                     <FaTrash
//                       className="cursor-pointer text-red-500"
//                       onClick={() => deleteAgent(a.id)}
//                     />
//                   </div>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* PAGINATION */}
//         <div className="flex justify-center gap-2 mt-4">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//             className="border px-3 py-1 rounded disabled:opacity-40"
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`border px-3 py-1 rounded ${
//                 page === i + 1 ? "bg-green-500 text-white" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage(p => p + 1)}
//             className="border px-3 py-1 rounded disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {(addOpen || editOpen) && (
//         <Modal
//           title={addOpen ? "Add Agent" : "Edit Agent"}
//           onClose={() => {
//             setAddOpen(false);
//             setEditOpen(false);
//             resetForm();
//           }}
//         >
//           <Input label="Name" value={form.name} error={errors.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
//           <Input label="Mobile" value={form.mobile} error={errors.mobile} onChange={v => setForm(p => ({ ...p, mobile: v }))} />
//           <Input label="Email" value={form.email} error={errors.email} onChange={v => setForm(p => ({ ...p, email: v }))} />

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               className="border px-4 py-2 rounded"
//               onClick={() => {
//                 setAddOpen(false);
//                 setEditOpen(false);
//                 resetForm();
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded"
//               onClick={addOpen ? handleAdd : handleEdit}
//             >
//               {addOpen ? "Save" : "Update"}
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* VIEW MODAL */}
//       {viewOpen && selectedAgent && (
//         <Modal title="Agent Details" onClose={() => setViewOpen(false)}>
//           <p><b>Name:</b> {selectedAgent.name}</p>
//           <p><b>Mobile:</b> {selectedAgent.mobile}</p>
//           <p><b>Email:</b> {selectedAgent.email}</p>
//           <p><b>Status:</b> {selectedAgent.status}</p>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
//   <th className={`py-2 text-${align}`}>{children}</th>
// );

// const Td = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
//   <td className={`py-2 text-${align}`}>{children}</td>
// );

// const ToolbarBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
//   <button
//     onClick={onClick}
//     className="border px-3 py-1 rounded hover:bg-gray-100"
//   >
//     {label}
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
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white p-4 rounded w-full max-w-md">
//       <div className="flex justify-between mb-2">
//         <h2 className="font-semibold">{title}</h2>
//         <button onClick={onClose}>✕</button>
//       </div>
//       <div className="space-y-2">{children}</div>
//     </div>
//   </div>
// );

// const Input = ({
//   label,
//   value,
//   error,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   error?: string;
//   onChange: (v: string) => void;
// }) => (
//   <div>
//     <input
//       className={`border px-3 py-2 rounded w-full ${
//         error ? "border-red-500" : ""
//       }`}
//       placeholder={label}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//     />
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );

////api end point//////////////////////

// | Action         | Method | Endpoint          |
// | -------------- | ------ | ----------------- |
// | Create         | POST   | `/api/agents`     |
// | List           | GET    | `/api/agents`     |
// | View           | GET    | `/api/agents/:id` |
// | Approve / Edit | PUT    | `/api/agents/:id` |
// | Delete         | DELETE | `/api/agents/:id` |

// data return {
//   "name": "Thejas",
//   "mobile": "9019783119",
//   "email": "thejasnk16@gmail.com",
//   "status":"Pending"
// }

// return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
//     });

// "use client";

// import { useMemo, useState, useEffect, ReactNode } from "react";
// import { FaEye, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* ================= TYPES ================= */

// type Status = "Approved" | "Pending" | "Rejected";

// interface Agent {
//   id: number;
//   name: string;
//   mobile: string;
//   email: string;
//   status: Status;
// }

// /* ================= DATA ================= */

// const initialAgents: Agent[] = [
//   { id: 1, name: "John Doe", mobile: "+1-555-1234", email: "john.doe@example.com", status: "Approved" },
//   { id: 2, name: "Jane Smith", mobile: "+1-555-5678", email: "jane.smith@example.com", status: "Pending" },
//   { id: 3, name: "Robert Johnson", mobile: "+1-555-9012", email: "robert.j@example.com", status: "Rejected" },
//   { id: 4, name: "Emily White", mobile: "+1-555-3456", email: "emily.w@example.com", status: "Approved" },
//   { id: 5, name: "Michael Brown", mobile: "+1-555-7890", email: "michael.b@example.com", status: "Pending" },
// ];

// /* ================= PAGE ================= */

// export default function AgentManagementPage() {
//   const [agents, setAgents] = useState<Agent[]>(initialAgents);
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [page, setPage] = useState(1);

//   /* MODALS */
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);

//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

//   const [form, setForm] = useState<Omit<Agent, "id">>({
//     name: "",
//     mobile: "",
//     email: "",
//     status: "Pending",
//   });

//   const [errors, setErrors] = useState<{
//     name?: string;
//     mobile?: string;
//     email?: string;
//   }>({});

//   /* ================= FILTER ================= */

//   const filteredAgents = useMemo(() => {
//     return agents.filter((a) =>
//       `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [agents, search]);

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredAgents.length / rowsPerPage)
//   );

//   useEffect(() => {
//     if (page > totalPages) {
//       setPage(() => totalPages);
//     }
//   }, [page, totalPages]);

//   const paginatedAgents = filteredAgents.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   /* ================= VALIDATION ================= */

//   const validateForm = (): boolean => {
//     const e: typeof errors = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.mobile.trim()) e.mobile = "Mobile is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD ================= */

//   const resetForm = () => {
//     setForm({ name: "", mobile: "", email: "", status: "Pending" });
//     setErrors({});
//     setSelectedAgent(null);
//   };

//   const handleAdd = () => {
//     if (!validateForm()) return;
//     setAgents(prev => [...prev, { ...form, id: Date.now() }]);
//     resetForm();
//     setAddOpen(false);
//   };

//   const handleEdit = () => {
//     if (!selectedAgent || !validateForm()) return;
//     setAgents(prev =>
//       prev.map(a =>
//         a.id === selectedAgent.id ? { ...form, id: a.id } : a
//       )
//     );
//     resetForm();
//     setEditOpen(false);
//   };

//   const approveAgent = (id: number) =>
//     setAgents(prev =>
//       prev.map(a =>
//         a.id === id ? { ...a, status: "Approved" } : a
//       )
//     );

//   const deleteAgent = (id: number) =>
//     setAgents(prev => prev.filter(a => a.id !== id));

//   /* ================= EXPORT ================= */

//   const exportData = filteredAgents.map(({ id, ...rest }) => rest);

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(
//       exportData.map(a =>
//         `${a.name}\t${a.mobile}\t${a.email}\t${a.status}`
//       ).join("\n")
//     );
//     alert("Copied to clipboard");
//   };

//   const handleExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Agents");
//     XLSX.writeFile(wb, "agents.xlsx");
//   };

//   const handleCSV = () => {
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(ws);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "agents.csv";
//     a.click();
//   };

//   const handlePDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Name", "Mobile", "Email", "Status"]],
//       body: exportData.map(a => [a.name, a.mobile, a.email, a.status]),
//     });
//     doc.save("agents.pdf");
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
//       <h1 className="text-xl sm:text-2xl font-semibold mb-4">Agent Management</h1>

//       <div className="bg-white rounded-lg p-4 shadow">
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
//           <h2 className="font-semibold text-lg">Agent Accounts</h2>
//           <button
//             onClick={() => setAddOpen(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <FaPlus /> Add New Agent
//           </button>
//         </div>

//         {/* EXPORT */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <ToolbarBtn label="Copy" onClick={handleCopy} />
//           <ToolbarBtn label="Excel" onClick={handleExcel} />
//           <ToolbarBtn label="CSV" onClick={handleCSV} />
//           <ToolbarBtn label="PDF" onClick={handlePDF} />
//         </div>

//         {/* SEARCH */}
//         <input
//           className="border px-3 py-2 rounded w-full mb-4"
//           placeholder="Filter agents by name or email..."
//           value={search}
//           onChange={e => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />

//         {/* ================= MOBILE CARD VIEW ================= */}
//         <div className="space-y-4 sm:hidden">
//           {paginatedAgents.map((a, i) => (
//             <div key={a.id} className="border rounded-lg p-4 shadow-sm">
//               <div className="font-semibold text-lg">{a.name}</div>
//               <div className="text-sm text-gray-600">{a.email}</div>
//               <div className="text-sm mt-1">📞 {a.mobile}</div>

//               <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
//                 a.status === "Approved"
//                   ? "bg-green-100 text-green-700"
//                   : a.status === "Pending"
//                   ? "bg-yellow-100 text-yellow-700"
//                   : "bg-red-100 text-red-600"
//               }`}>
//                 {a.status}
//               </span>

//               <div className="flex justify-end gap-4 mt-3 text-lg">
//                 <FaEye onClick={() => { setSelectedAgent(a); setViewOpen(true); }} />
//                 <FaEdit onClick={() => { setSelectedAgent(a); setForm(a); setEditOpen(true); }} />
//                 {a.status !== "Approved" && (
//                   <FaCheck className="text-green-600" onClick={() => approveAgent(a.id)} />
//                 )}
//                 <FaTrash className="text-red-500" onClick={() => deleteAgent(a.id)} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ================= DESKTOP TABLE VIEW ================= */}
//         <div className="hidden sm:block overflow-x-auto">
//           <table className="w-full text-sm border-t min-w-[700px]">
//             <thead>
//               <tr className="text-gray-600">
//                 <Th>Sr.</Th>
//                 <Th>Name</Th>
//                 <Th>Mobile</Th>
//                 <Th>Email</Th>
//                 <Th>Status</Th>
//                 <Th align="right">Actions</Th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedAgents.map((a, i) => (
//                 <tr key={a.id} className="border-t">
//                   <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
//                   <Td>{a.name}</Td>
//                   <Td>{a.mobile}</Td>
//                   <Td>{a.email}</Td>
//                   <Td>
//                     <span className={`px-3 py-1 rounded-full text-xs ${
//                       a.status === "Approved"
//                         ? "bg-green-100 text-green-700"
//                         : a.status === "Pending"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-red-100 text-red-600"
//                     }`}>
//                       {a.status}
//                     </span>
//                   </Td>
//                   <Td align="right">
//                     <div className="flex justify-end gap-3">
//                       <FaEye onClick={() => { setSelectedAgent(a); setViewOpen(true); }} />
//                       <FaEdit onClick={() => { setSelectedAgent(a); setForm(a); setEditOpen(true); }} />
//                       {a.status !== "Approved" && (
//                         <FaCheck className="text-green-600" onClick={() => approveAgent(a.id)} />
//                       )}
//                       <FaTrash className="text-red-500" onClick={() => deleteAgent(a.id)} />
//                     </div>
//                   </Td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-center gap-2 mt-4">
//           <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border px-3 py-1 rounded">Prev</button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`border px-3 py-1 rounded ${page === i + 1 ? "bg-green-500 text-white" : ""}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="border px-3 py-1 rounded">Next</button>
//         </div>
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {(addOpen || editOpen) && (
//         <Modal
//           title={addOpen ? "Add Agent" : "Edit Agent"}
//           onClose={() => {
//             setAddOpen(false);
//             setEditOpen(false);
//             resetForm();
//           }}
//         >
//           <Input label="Name" value={form.name} error={errors.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
//           <Input label="Mobile" value={form.mobile} error={errors.mobile} onChange={v => setForm(p => ({ ...p, mobile: v }))} />
//           <Input label="Email" value={form.email} error={errors.email} onChange={v => setForm(p => ({ ...p, email: v }))} />

//           <div className="flex justify-end gap-2 mt-4">
//             <button className="border px-4 py-2 rounded" onClick={() => { setAddOpen(false); setEditOpen(false); resetForm(); }}>
//               Cancel
//             </button>
//             <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={addOpen ? handleAdd : handleEdit}>
//               {addOpen ? "Save" : "Update"}
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* VIEW MODAL */}
//       {viewOpen && selectedAgent && (
//         <Modal title="Agent Details" onClose={() => setViewOpen(false)}>
//           <p><b>Name:</b> {selectedAgent.name}</p>
//           <p><b>Mobile:</b> {selectedAgent.mobile}</p>
//           <p><b>Email:</b> {selectedAgent.email}</p>
//           <p><b>Status:</b> {selectedAgent.status}</p>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
//   <th className={`py-2 text-${align}`}>{children}</th>
// );

// const Td = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
//   <td className={`py-2 text-${align}`}>{children}</td>
// );

// const ToolbarBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
//   <button onClick={onClick} className="border px-3 py-1 rounded hover:bg-gray-100">
//     {label}
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
//       <div className="space-y-2">{children}</div>
//     </div>
//   </div>
// );

// const Input = ({
//   label,
//   value,
//   error,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   error?: string;
//   onChange: (v: string) => void;
// }) => (
//   <div>
//     <input
//       className={`border px-3 py-2 rounded w-full ${error ? "border-red-500" : ""}`}
//       placeholder={label}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//     />
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );


// "use client";

// import { useMemo, useState, useEffect, ReactNode } from "react";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaPlus,
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

// type Status = "Approved" | "Pending" | "Rejected";

// interface Agent {
//   _id: string;
//   name: string;
//   mobile: string;
//   email: string;
//   status: Status;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ApiResponse {
//   success: boolean;
//   page?: number;
//   limit?: number;
//   total?: number;
//   data: Agent[];
//   message?: string;
// }

// /* ================= PAGE ================= */

// export default function AgentManagementPage() {
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAgents, setTotalAgents] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   /* MODALS */
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);

//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

//   const [form, setForm] = useState<Omit<Agent, "_id">>({
//     name: "",
//     mobile: "",
//     email: "",
//     status: "Pending",
//   });

//   const [errors, setErrors] = useState<{
//     name?: string;
//     mobile?: string;
//     email?: string;
//   }>({});

//   /* ================= API FUNCTIONS ================= */

//   // Fetch agents with pagination and search
//   const fetchAgents = async (currentPage: number = 1, searchTerm: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: rowsPerPage.toString(),
//         ...(searchTerm && { search: searchTerm }),
//       });

//       const response = await axios.get<ApiResponse>(`/api/agents?${params}`);
      
//       if (response.data.success) {
//         setAgents(response.data.data);
//         if (response.data.total !== undefined) {
//           setTotalAgents(response.data.total);
//           setTotalPages(Math.ceil(response.data.total / rowsPerPage));
//         }
//       }
//     } catch (err: any) {
//       console.error("Error fetching agents:", err);
//       setError(err.response?.data?.message || "Failed to load agents");
//       setAgents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new agent
//   const createAgent = async (agentData: Omit<Agent, "_id">) => {
//     try {
//       const response = await axios.post<ApiResponse>("/api/agents", agentData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error creating agent:", err);
//       throw new Error(err.response?.data?.message || "Failed to create agent");
//     }
//   };

//   // Update agent
//   const updateAgent = async (id: string, agentData: Partial<Agent>) => {
//     try {
//       const response = await axios.put<ApiResponse>(`/api/agents/${id}`, agentData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error updating agent:", err);
//       throw new Error(err.response?.data?.message || "Failed to update agent");
//     }
//   };

//   // Delete agent
//   const deleteAgentAPI = async (id: string) => {
//     try {
//       const response = await axios.delete<ApiResponse>(`/api/agents/${id}`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error deleting agent:", err);
//       throw new Error(err.response?.data?.message || "Failed to delete agent");
//     }
//   };

//   // Approve agent
//   const approveAgentAPI = async (id: string) => {
//     return updateAgent(id, { status: "Approved" });
//   };

//   /* ================= EFFECTS ================= */

//   // Initial load
//   useEffect(() => {
//     fetchAgents(page, search);
//   }, []);

//   // Pagination effect
//   useEffect(() => {
//     fetchAgents(page, search);
//   }, [page]);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchAgents(1, search);
//       setPage(1);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   // Rows per page change
//   useEffect(() => {
//     fetchAgents(1, search);
//     setPage(1);
//   }, [rowsPerPage]);

//   /* ================= FILTER ================= */

//   const filteredAgents = useMemo(() => {
//     return agents.filter((a) =>
//       `${a.name} ${a.email} ${a.mobile}`.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [agents, search]);

//   /* ================= PAGINATION ================= */

//   const paginatedAgents = useMemo(() => {
//     return filteredAgents.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage
//     );
//   }, [filteredAgents, page, rowsPerPage]);

//   /* ================= VALIDATION ================= */

//   const validateForm = (): boolean => {
//     const e: typeof errors = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.mobile.trim()) e.mobile = "Mobile is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD OPERATIONS ================= */

//   const resetForm = () => {
//     setForm({ name: "", mobile: "", email: "", status: "Pending" });
//     setErrors({});
//     setSelectedAgent(null);
//   };

//   const handleAdd = async () => {
//     if (!validateForm()) return;
    
//     try {
//       await createAgent(form);
//       await fetchAgents(page, search);
//       resetForm();
//       setAddOpen(false);
//       alert("Agent added successfully!");
//     } catch (err: any) {
//       alert(err.message || "Failed to add agent");
//     }
//   };

//   const handleEdit = async () => {
//     if (!selectedAgent || !validateForm()) return;
    
//     try {
//       await updateAgent(selectedAgent._id, form);
//       await fetchAgents(page, search);
//       resetForm();
//       setEditOpen(false);
//       alert("Agent updated successfully!");
//     } catch (err: any) {
//       alert(err.message || "Failed to update agent");
//     }
//   };

//   const handleApprove = async (id: string) => {
//     if (!confirm("Are you sure you want to approve this agent?")) return;
    
//     try {
//       await approveAgentAPI(id);
//       await fetchAgents(page, search);
//       alert("Agent approved successfully!");
//     } catch (err: any) {
//       alert(err.message || "Failed to approve agent");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this agent?")) return;
    
//     try {
//       await deleteAgentAPI(id);
//       await fetchAgents(page, search);
//       alert("Agent deleted successfully!");
//     } catch (err: any) {
//       alert(err.message || "Failed to delete agent");
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = filteredAgents.map(({ _id, createdAt, updatedAt, ...rest }) => rest);

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(
//         exportData.map(a =>
//           `${a.name}\t${a.mobile}\t${a.email}\t${a.status}`
//         ).join("\n")
//       );
//       alert("Copied to clipboard!");
//     } catch (err) {
//       alert("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Agents");
//       XLSX.writeFile(wb, "agents.xlsx");
//     } catch (err) {
//       alert("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = "agents.csv";
//       a.click();
//     } catch (err) {
//       alert("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     try {
//       const doc = new jsPDF();
//       autoTable(doc, {
//         head: [["Name", "Mobile", "Email", "Status"]],
//         body: exportData.map(a => [a.name, a.mobile, a.email, a.status]),
//         theme: 'grid',
//         styles: { fontSize: 10 },
//         headStyles: { fillColor: [22, 160, 133] },
//       });
//       doc.save("agents.pdf");
//     } catch (err) {
//       alert("Failed to export PDF file");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
//       <h1 className="text-xl sm:text-2xl font-semibold mb-4">Agent Management</h1>

//       <div className="bg-white rounded-lg p-4 shadow">
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
//           <h2 className="font-semibold text-lg">Agent Accounts</h2>
//           <button
//             onClick={() => setAddOpen(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition-colors"
//           >
//             <FaPlus /> Add New Agent
//           </button>
//         </div>

//         {/* EXPORT TOOLBAR */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <ToolbarBtn icon={<FaPrint />} label="Print" onClick={handlePrint} />
//           <ToolbarBtn icon={<FaCopy />} label="Copy" onClick={handleCopy} />
//           <ToolbarBtn icon={<FaFileExcel />} label="Excel" onClick={handleExcel} />
//           <ToolbarBtn icon={<FaFileCsv />} label="CSV" onClick={handleCSV} />
//           <ToolbarBtn icon={<FaFilePdf />} label="PDF" onClick={handlePDF} />
//         </div>

//         {/* SEARCH AND FILTERS */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <input
//             className="border px-3 py-2 rounded flex-1"
//             placeholder="Search agents by name, email, or mobile..."
//             value={search}
//             onChange={e => {
//               setSearch(e.target.value);
//             }}
//           />
          
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-600">Rows per page:</label>
//             <select
//               className="border px-3 py-2 rounded"
//               value={rowsPerPage}
//               onChange={e => setRowsPerPage(Number(e.target.value))}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="20">20</option>
//               <option value="50">50</option>
//             </select>
//           </div>
//         </div>

//         {/* ERROR MESSAGE */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
//             {error}
//           </div>
//         )}

//         {/* LOADING STATE */}
//         {loading && (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//             <p className="mt-2 text-gray-600">Loading agents...</p>
//           </div>
//         )}

//         {/* EMPTY STATE */}
//         {!loading && agents.length === 0 && !error && (
//           <div className="text-center py-8 border rounded-lg bg-gray-50">
//             <p className="text-gray-600">No agents found</p>
//             {search && (
//               <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
//             )}
//           </div>
//         )}

//         {/* ================= MOBILE CARD VIEW ================= */}
//         {!loading && agents.length > 0 && (
//           <>
//             <div className="space-y-4 sm:hidden">
//               {paginatedAgents.map((a, i) => (
//                 <div key={a._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="font-semibold text-lg text-gray-800">{a.name}</div>
//                   <div className="text-sm text-gray-600 mt-1">{a.email}</div>
//                   <div className="text-sm mt-1">📞 {a.mobile}</div>
                  
//                   <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
//                     a.status === "Approved"
//                       ? "bg-green-100 text-green-700"
//                       : a.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-600"
//                   }`}>
//                     {a.status}
//                   </span>

//                   <div className="flex justify-end gap-4 mt-3 text-lg">
//                     <button
//                       onClick={() => { setSelectedAgent(a); setViewOpen(true); }}
//                       className="p-2 hover:bg-blue-50 rounded"
//                       title="View"
//                     >
//                       <FaEye className="text-blue-600" />
//                     </button>
//                     <button
//                       onClick={() => { setSelectedAgent(a); setForm(a); setEditOpen(true); }}
//                       className="p-2 hover:bg-gray-50 rounded"
//                       title="Edit"
//                     >
//                       <FaEdit className="text-gray-600" />
//                     </button>
//                     {a.status !== "Approved" && (
//                       <button
//                         onClick={() => handleApprove(a._id)}
//                         className="p-2 hover:bg-green-50 rounded"
//                         title="Approve"
//                       >
//                         <FaCheck className="text-green-600" />
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleDelete(a._id)}
//                       className="p-2 hover:bg-red-50 rounded"
//                       title="Delete"
//                     >
//                       <FaTrash className="text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ================= DESKTOP TABLE VIEW ================= */}
//             <div className="hidden sm:block overflow-x-auto">
//               <table className="w-full text-sm border-t min-w-[700px]">
//                 <thead className="bg-gray-50">
//                   <tr className="text-gray-600">
//                     <Th>Sr.</Th>
//                     <Th>Name</Th>
//                     <Th>Mobile</Th>
//                     <Th>Email</Th>
//                     <Th>Status</Th>
//                     <Th align="right">Actions</Th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedAgents.map((a, i) => (
//                     <tr key={a._id} className="border-t hover:bg-gray-50 transition-colors">
//                       <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
//                       <Td className="font-medium">{a.name}</Td>
//                       <Td>{a.mobile}</Td>
//                       <Td>{a.email}</Td>
//                       <Td>
//                         <span className={`px-3 py-1 rounded-full text-xs ${
//                           a.status === "Approved"
//                             ? "bg-green-100 text-green-700"
//                             : a.status === "Pending"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-red-100 text-red-600"
//                         }`}>
//                           {a.status}
//                         </span>
//                       </Td>
//                       <Td align="right">
//                         <div className="flex justify-end gap-3">
//                           <button
//                             onClick={() => { setSelectedAgent(a); setViewOpen(true); }}
//                             className="p-2 hover:bg-blue-50 rounded transition-colors"
//                             title="View"
//                           >
//                             <FaEye className="text-blue-600" />
//                           </button>
//                           <button
//                             onClick={() => { setSelectedAgent(a); setForm(a); setEditOpen(true); }}
//                             className="p-2 hover:bg-gray-50 rounded transition-colors"
//                             title="Edit"
//                           >
//                             <FaEdit className="text-gray-600" />
//                           </button>
//                           {a.status !== "Approved" && (
//                             <button
//                               onClick={() => handleApprove(a._id)}
//                               className="p-2 hover:bg-green-50 rounded transition-colors"
//                               title="Approve"
//                             >
//                               <FaCheck className="text-green-600" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(a._id)}
//                             className="p-2 hover:bg-red-50 rounded transition-colors"
//                             title="Delete"
//                           >
//                             <FaTrash className="text-red-500" />
//                           </button>
//                         </div>
//                       </Td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* PAGINATION */}
//             <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalAgents)} of {totalAgents} agents
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={page === 1}
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   className={`border px-3 py-1 rounded ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
//                 >
//                   Previous
//                 </button>
                
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (page <= 3) {
//                       pageNum = i + 1;
//                     } else if (page >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = page - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setPage(pageNum)}
//                         className={`px-3 py-1 rounded ${page === pageNum ? 'bg-green-500 text-white' : 'border hover:bg-gray-100'}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   disabled={page === totalPages}
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   className={`border px-3 py-1 rounded ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* ADD MODAL */}
//       {addOpen && (
//         <Modal
//           title="Add New Agent"
//           onClose={() => {
//             setAddOpen(false);
//             resetForm();
//           }}
//         >
//           <Input 
//             label="Name" 
//             value={form.name} 
//             error={errors.name} 
//             onChange={v => setForm(p => ({ ...p, name: v }))} 
//             required
//           />
//           <Input 
//             label="Mobile" 
//             value={form.mobile} 
//             error={errors.mobile} 
//             onChange={v => setForm(p => ({ ...p, mobile: v }))} 
//             required
//           />
//           <Input 
//             label="Email" 
//             type="email"
//             value={form.email} 
//             error={errors.email} 
//             onChange={v => setForm(p => ({ ...p, email: v }))} 
//             required
//           />
          
//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//             <div className="flex gap-4">
//               {(["Pending", "Approved", "Rejected"] as Status[]).map((status) => (
//                 <label key={status} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="status"
//                     value={status}
//                     checked={form.status === status}
//                     onChange={() => setForm(p => ({ ...p, status }))}
//                     className="mr-2"
//                   />
//                   <span className="text-sm">{status}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               className="border px-4 py-2 rounded hover:bg-gray-50"
//               onClick={() => {
//                 setAddOpen(false);
//                 resetForm();
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               onClick={handleAdd}
//             >
//               Save Agent
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* EDIT MODAL */}
//       {editOpen && selectedAgent && (
//         <Modal
//           title="Edit Agent"
//           onClose={() => {
//             setEditOpen(false);
//             resetForm();
//           }}
//         >
//           <Input 
//             label="Name" 
//             value={form.name} 
//             error={errors.name} 
//             onChange={v => setForm(p => ({ ...p, name: v }))} 
//             required
//           />
//           <Input 
//             label="Mobile" 
//             value={form.mobile} 
//             error={errors.mobile} 
//             onChange={v => setForm(p => ({ ...p, mobile: v }))} 
//             required
//           />
//           <Input 
//             label="Email" 
//             type="email"
//             value={form.email} 
//             error={errors.email} 
//             onChange={v => setForm(p => ({ ...p, email: v }))} 
//             required
//           />
          
//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//             <div className="flex gap-4">
//               {(["Pending", "Approved", "Rejected"] as Status[]).map((status) => (
//                 <label key={status} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="status"
//                     value={status}
//                     checked={form.status === status}
//                     onChange={() => setForm(p => ({ ...p, status }))}
//                     className="mr-2"
//                   />
//                   <span className="text-sm">{status}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               className="border px-4 py-2 rounded hover:bg-gray-50"
//               onClick={() => {
//                 setEditOpen(false);
//                 resetForm();
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               onClick={handleEdit}
//             >
//               Update Agent
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* VIEW MODAL */}
//       {viewOpen && selectedAgent && (
//         <Modal title="Agent Details" onClose={() => setViewOpen(false)}>
//           <div className="space-y-3">
//             <DetailRow label="Name" value={selectedAgent.name} />
//             <DetailRow label="Mobile" value={selectedAgent.mobile} />
//             <DetailRow label="Email" value={selectedAgent.email} />
//             <DetailRow label="Status" value={selectedAgent.status} />
//             {selectedAgent.createdAt && (
//               <DetailRow label="Created" value={new Date(selectedAgent.createdAt).toLocaleDateString()} />
//             )}
//             {selectedAgent.updatedAt && (
//               <DetailRow label="Last Updated" value={new Date(selectedAgent.updatedAt).toLocaleDateString()} />
//             )}
//           </div>
          
//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               onClick={() => {
//                 setViewOpen(false);
//                 setForm(selectedAgent);
//                 setEditOpen(true);
//               }}
//             >
//               Edit Agent
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
//   <th className={`py-3 px-4 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
//     {children}
//   </th>
// );

// const Td = ({ children, align = "left", className = "" }: { children: ReactNode; align?: "left" | "center" | "right"; className?: string }) => (
//   <td className={`py-3 px-4 text-${align} ${className}`}>
//     {children}
//   </td>
// );

// const ToolbarBtn = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
//   <button
//     onClick={onClick}
//     className="border border-green-500 text-green-600 px-3 py-2 rounded flex items-center gap-2 text-sm hover:bg-green-50 transition-colors"
//   >
//     {icon} {label}
//   </button>
// );

// const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//     <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
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

// const Input = ({ 
//   label, 
//   value, 
//   error, 
//   onChange, 
//   type = "text",
//   required = false 
// }: { 
//   label: string; 
//   value: string; 
//   error?: string; 
//   onChange: (v: string) => void;
//   type?: string;
//   required?: boolean;
// }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//       placeholder={`Enter ${label.toLowerCase()}`}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex border-b pb-2 last:border-0">
//     <div className="w-32 font-medium text-gray-600">{label}:</div>
//     <div className="flex-1 text-gray-900">{value}</div>
//   </div>
// );


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaPlus,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Box, Pagination, Typography, Button } from "@mui/material";

/* ================= TYPES ================= */

type Status = "Approved" | "Pending" | "Rejected";

interface Agent {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  page?: number;
  limit?: number;
  total?: number;
  data: Agent[];
  message?: string;
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

/* ================= PAGE ================= */

export default function AgentManagementPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);

  /* MODALS */
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const [form, setForm] = useState<Omit<Agent, "_id">>({
    name: "",
    mobile: "",
    email: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    email?: string;
  }>({});

  /* ================= API FUNCTIONS ================= */

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit,
        ...(search && { search }),
      };
      
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      const response = await axios.get<ApiResponse>("/api/agents", { params });
      
      if (response.data.success) {
        setAgents(response.data.data || []);
        if (response.data.total !== undefined) {
          setTotalAgents(response.data.total);
          setTotalPages(Math.ceil(response.data.total / limit));
        }
      }
    } catch (error: any) {
      console.error("Error fetching agents:", error);
      toast.error(error.response?.data?.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<Agent, "_id">) => {
    try {
      const response = await axios.post<ApiResponse>("/api/agents", agentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create agent");
    }
  };

  const updateAgent = async (id: string, agentData: Partial<Agent>) => {
    try {
      const response = await axios.put<ApiResponse>(`/api/agents/${id}`, agentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update agent");
    }
  };

  const deleteAgentAPI = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/agents/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete agent");
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchAgents();
  }, [search, statusFilter, page, limit]);

  /* ================= VALIDATION ================= */

  const validateForm = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.mobile.trim()) e.mobile = "Mobile is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CRUD OPERATIONS ================= */

  const resetForm = () => {
    setForm({ name: "", mobile: "", email: "", status: "Pending" });
    setErrors({});
    setSelectedAgent(null);
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    
    try {
      await createAgent(form);
      await fetchAgents();
      resetForm();
      setAddOpen(false);
      toast.success("Agent added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add agent");
    }
  };

  const handleEdit = async () => {
    if (!selectedAgent || !validateForm()) return;
    
    try {
      await updateAgent(selectedAgent._id, form);
      await fetchAgents();
      resetForm();
      setEditOpen(false);
      toast.success("Agent updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update agent");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateAgent(id, { status: "Approved" });
      await fetchAgents();
      toast.success("Agent approved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve agent");
    }
  };

  const handleDelete = async () => {
    if (!selectedAgent) return;
    
    try {
      await deleteAgentAPI(selectedAgent._id);
      await fetchAgents();
      setDeleteOpen(false);
      toast.success("Agent deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete agent");
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const handlePrint = () => {
    if (agents.length === 0) {
      toast.error("No agents to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agents Report</title>
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
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
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
          <h1>👤 Agent Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Agents: ${totalAgents} | Showing: ${agents.length} agents</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
          <div class="header-info">Status Filter: ${statusFilter === "All" ? "All" : statusFilter}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${agents.map((agent, index) => {
              const statusClass = `status-${agent.status.toLowerCase()}`;
              const createdDate = agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : '-';
              const rowNumber = index + 1 + (page - 1) * 10;
              
              return `
                <tr>
                  <td>${rowNumber}</td>
                  <td><strong>${agent.name}</strong></td>
                  <td>${agent.mobile}</td>
                  <td>${agent.email}</td>
                  <td><span class="status-badge ${statusClass}">${agent.status}</span></td>
                  <td>${createdDate}</td>
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

  const handleExportExcel = () => {
    const data = agents.map((agent, index) => ({
      "Sr.": index + 1 + (page - 1) * 10,
      "Name": agent.name,
      "Mobile": agent.mobile,
      "Email": agent.email,
      "Status": agent.status,
      "Created Date": agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agents");
    XLSX.writeFile(wb, `agents-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel exported successfully!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Agents Report", 14, 16);
    
    const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Status"];
    const tableRows = agents.map((agent, index) => [
      index + 1 + (page - 1) * 10,
      agent.name,
      agent.mobile,
      agent.email,
      agent.status
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`agents-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF exported successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && agents.length === 0 && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb8c] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agent Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all agent accounts. {totalAgents} agents found.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setAddOpen(true)} 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            <FaPlus /> Add Agent
          </button>
        </div>
      </div>

      {/* Export Buttons Section (Mobile) */}
      <div className="flex lg:hidden flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem]">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
        >
          <FaFileExcel className="text-sm" />
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
        >
          <FaFilePdf className="text-sm" />
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
        >
          <FaPrint className="text-sm" />
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white lg:rounded shadow p-[.6rem] text-sm md:p-3 lg:mb-0 mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap sm:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="flex gap-x-4">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setPage(1);
              }}
              className="flex-1 px-4 w-fit py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={() => fetchAgents()}
              className="flex-1 px-4 w-fit py-2 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Apply
            </button>
          </div>

          {/* Export Buttons Section (Desktop) */}
          <div className="hidden lg:flex ml-auto flex-wrap gap-[.6rem] mb-1 text-sm bg-white">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
            >
              <FaFileExcel className="text-sm" />
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
            >
              <FaFilePdf className="text-sm" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
            >
              <FaPrint className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="border-b border-zinc-200">
            <tr className="*:text-zinc-800">
              <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Mobile</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.map((agent, index) => (
              <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-[.6rem] text-sm">{index + 1 + (page - 1) * 10}</td>
                <td className="p-[.6rem] text-sm">
                  <div className="font-semibold">{agent.name}</div>
                </td>
                <td className="p-[.6rem] text-sm">{agent.mobile}</td>
                <td className="p-[.6rem] text-sm">{agent.email}</td>
                <td className="p-[.6rem] text-sm">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="flex gap-[.6rem] text-sm">
                    <button
                      onClick={() => {
                        setSelectedAgent(agent);
                        setViewOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAgent(agent);
                        setForm(agent);
                        setEditOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Agent"
                    >
                      <FaEdit />
                    </button>
                    {agent.status !== "Approved" && (
                      <button
                        onClick={() => handleApprove(agent._id)}
                        className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve Agent"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAgent(agent);
                        setDeleteOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Agent"
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
      <div className="lg:hidden space-y-2 text-sm">
        {agents.map((agent, index) => (
          <div key={agent._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold text-gray-800">#{index + 1 + (page - 1) * 10}</span>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <div className="flex gap-[.6rem] text-sm">
                <button onClick={() => { setSelectedAgent(agent); setViewOpen(true); }} className="p-1.5 text-blue-600">
                  <FaEye />
                </button>
                <button onClick={() => { setSelectedAgent(agent); setForm(agent); setEditOpen(true); }} className="p-1.5 text-green-600">
                  <FaEdit />
                </button>
                {agent.status !== "Approved" && (
                  <button onClick={() => handleApprove(agent._id)} className="p-1.5 text-green-600">
                    <FaCheck />
                  </button>
                )}
                <button onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{agent.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Mobile</div>
                  <div>{agent.mobile}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="truncate">{agent.email}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && agents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold mb-2">No agents found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Material-UI Pagination */}
      {agents.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (page - 1) * 10}-{Math.min(page * 10, totalAgents)}</span> of{" "}
            <span className="font-semibold">{totalAgents}</span> agents
            <select value={limit} onChange={(e)=>setLimit(Number(e.target.value))} className="p-1 ml-3 border border-zinc-300 rounded">
              {[5, 10, 15, 20, 25, 30, 40, 50, 100].map((data,i)=>(
                <option key={i} value={data}>{data}</option>
              ))}
            </select>
          </div>
          
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
           
          />
        </div>
      )}

      {/* ADD MODAL */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            Add New Agent
          </Typography>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter agent name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile *
              </label>
              <input
                type="tel"
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                {(["Pending", "Approved", "Rejected"] as Status[]).map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={form.status === status}
                      onChange={() => setForm({ ...form, status })}
                      className="mr-2"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleAdd}>
                Add Agent
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            Edit Agent
          </Typography>
          {selectedAgent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter agent name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile *
                </label>
                <input
                  type="tel"
                  className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  {(["Pending", "Approved", "Rejected"] as Status[]).map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={form.status === status}
                        onChange={() => setForm({ ...form, status })}
                        className="mr-2"
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleEdit}>
                  Update Agent
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={modalStyle}>
          {selectedAgent && (
            <>
              <Typography variant="h6" className="mb-6">
                Agent Details
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Agent ID</div>
                    <div className="font-medium">{selectedAgent._id.substring(0, 8)}...</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedAgent.status)}`}>
                        {selectedAgent.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{selectedAgent.name}</div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Mobile</div>
                  <div className="font-medium">{selectedAgent.mobile}</div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{selectedAgent.email}</div>
                </div>
                {selectedAgent.createdAt && (
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Created Date</div>
                    <div>{new Date(selectedAgent.createdAt).toLocaleDateString()}</div>
                  </div>
                )}
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

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <Typography variant="h6" className="mb-2">
              Delete Agent?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete agent{" "}
              <span className="font-medium">{selectedAgent?.name}</span>?
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
    </div>
  );
}