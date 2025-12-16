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



"use client";

import { useMemo, useState, useEffect, ReactNode } from "react";
import { FaEye, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

type Status = "Approved" | "Pending" | "Rejected";

interface Agent {
  id: number;
  name: string;
  mobile: string;
  email: string;
  status: Status;
}

/* ================= DATA ================= */

const initialAgents: Agent[] = [
  { id: 1, name: "John Doe", mobile: "+1-555-1234", email: "john.doe@example.com", status: "Approved" },
  { id: 2, name: "Jane Smith", mobile: "+1-555-5678", email: "jane.smith@example.com", status: "Pending" },
  { id: 3, name: "Robert Johnson", mobile: "+1-555-9012", email: "robert.j@example.com", status: "Rejected" },
  { id: 4, name: "Emily White", mobile: "+1-555-3456", email: "emily.w@example.com", status: "Approved" },
  { id: 5, name: "Michael Brown", mobile: "+1-555-7890", email: "michael.b@example.com", status: "Pending" },
];

/* ================= PAGE ================= */

export default function AgentManagementPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  /* MODALS */
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const [form, setForm] = useState<Omit<Agent, "id">>({
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

  /* ================= FILTER ================= */

  const filteredAgents = useMemo(() => {
    return agents.filter((a) =>
      `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [agents, search]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAgents.length / rowsPerPage)
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(() => totalPages);
    }
  }, [page, totalPages]);

  const paginatedAgents = filteredAgents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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

  /* ================= CRUD ================= */

  const resetForm = () => {
    setForm({ name: "", mobile: "", email: "", status: "Pending" });
    setErrors({});
    setSelectedAgent(null);
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    setAgents(prev => [...prev, { ...form, id: Date.now() }]);
    resetForm();
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!selectedAgent || !validateForm()) return;
    setAgents(prev =>
      prev.map(a =>
        a.id === selectedAgent.id ? { ...form, id: a.id } : a
      )
    );
    resetForm();
    setEditOpen(false);
  };

  const approveAgent = (id: number) =>
    setAgents(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: "Approved" } : a
      )
    );

  const deleteAgent = (id: number) =>
    setAgents(prev => prev.filter(a => a.id !== id));

  /* ================= EXPORT ================= */

  const exportData = filteredAgents.map(({ id, ...rest }) => rest);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      exportData.map(a =>
        `${a.name}\t${a.mobile}\t${a.email}\t${a.status}`
      ).join("\n")
    );
    alert("Copied to clipboard");
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agents");
    XLSX.writeFile(wb, "agents.xlsx");
  };

  const handleCSV = () => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "agents.csv";
    a.click();
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Mobile", "Email", "Status"]],
      body: exportData.map(a => [a.name, a.mobile, a.email, a.status]),
    });
    doc.save("agents.pdf");
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Agent Management</h1>

      <div className="bg-white rounded-lg p-4 shadow">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-lg">Agent Accounts</h2>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add New Agent
          </button>
        </div>

        {/* EXPORT */}
        <div className="flex flex-wrap gap-2 mb-4">
          <ToolbarBtn label="Copy" onClick={handleCopy} />
          <ToolbarBtn label="Excel" onClick={handleExcel} />
          <ToolbarBtn label="CSV" onClick={handleCSV} />
          <ToolbarBtn label="PDF" onClick={handlePDF} />
        </div>

        {/* SEARCH */}
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          placeholder="Filter agents by name or email..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* ================= MOBILE CARD VIEW ================= */}
        <div className="space-y-4 sm:hidden">
          {paginatedAgents.map((a, i) => (
            <div key={a.id} className="border rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-lg">{a.name}</div>
              <div className="text-sm text-gray-600">{a.email}</div>
              <div className="text-sm mt-1">📞 {a.mobile}</div>

              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                a.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : a.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {a.status}
              </span>

              <div className="flex justify-end gap-4 mt-3 text-lg">
                <FaEye onClick={() => { setSelectedAgent(a); setViewOpen(true); }} />
                <FaEdit onClick={() => { setSelectedAgent(a); setForm(a); setEditOpen(true); }} />
                {a.status !== "Approved" && (
                  <FaCheck className="text-green-600" onClick={() => approveAgent(a.id)} />
                )}
                <FaTrash className="text-red-500" onClick={() => deleteAgent(a.id)} />
              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP TABLE VIEW ================= */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm border-t min-w-[700px]">
            <thead>
              <tr className="text-gray-600">
                <Th>Sr.</Th>
                <Th>Name</Th>
                <Th>Mobile</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((a, i) => (
                <tr key={a.id} className="border-t">
                  <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
                  <Td>{a.name}</Td>
                  <Td>{a.mobile}</Td>
                  <Td>{a.email}</Td>
                  <Td>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      a.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : a.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {a.status}
                    </span>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-3">
                      <FaEye onClick={() => { setSelectedAgent(a); setViewOpen(true); }} />
                      <FaEdit onClick={() => { setSelectedAgent(a); setForm(a); setEditOpen(true); }} />
                      {a.status !== "Approved" && (
                        <FaCheck className="text-green-600" onClick={() => approveAgent(a.id)} />
                      )}
                      <FaTrash className="text-red-500" onClick={() => deleteAgent(a.id)} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border px-3 py-1 rounded">Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`border px-3 py-1 rounded ${page === i + 1 ? "bg-green-500 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="border px-3 py-1 rounded">Next</button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(addOpen || editOpen) && (
        <Modal
          title={addOpen ? "Add Agent" : "Edit Agent"}
          onClose={() => {
            setAddOpen(false);
            setEditOpen(false);
            resetForm();
          }}
        >
          <Input label="Name" value={form.name} error={errors.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
          <Input label="Mobile" value={form.mobile} error={errors.mobile} onChange={v => setForm(p => ({ ...p, mobile: v }))} />
          <Input label="Email" value={form.email} error={errors.email} onChange={v => setForm(p => ({ ...p, email: v }))} />

          <div className="flex justify-end gap-2 mt-4">
            <button className="border px-4 py-2 rounded" onClick={() => { setAddOpen(false); setEditOpen(false); resetForm(); }}>
              Cancel
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={addOpen ? handleAdd : handleEdit}>
              {addOpen ? "Save" : "Update"}
            </button>
          </div>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {viewOpen && selectedAgent && (
        <Modal title="Agent Details" onClose={() => setViewOpen(false)}>
          <p><b>Name:</b> {selectedAgent.name}</p>
          <p><b>Mobile:</b> {selectedAgent.mobile}</p>
          <p><b>Email:</b> {selectedAgent.email}</p>
          <p><b>Status:</b> {selectedAgent.status}</p>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE ================= */

const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
  <th className={`py-2 text-${align}`}>{children}</th>
);

const Td = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
  <td className={`py-2 text-${align}`}>{children}</td>
);

const ToolbarBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button onClick={onClick} className="border px-3 py-1 rounded hover:bg-gray-100">
    {label}
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
      <div className="space-y-2">{children}</div>
    </div>
  </div>
);

const Input = ({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <input
      className={`border px-3 py-2 rounded w-full ${error ? "border-red-500" : ""}`}
      placeholder={label}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
