// "use client";

// import { useEffect, useMemo, useState, ReactNode } from "react";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// /* ================= TYPES ================= */

// interface SubAdmin {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   access: string[];
// }

// /* ================= DATA ================= */

// const ALL_MODULES = [
//   "Dashboard",
//   "Orders",
//   "Labours",
//   "Farmers",
//   "Agents",
//   "Postings",
//   "Categories",
//   "Sliders",
//   "Menu Icons",
//   "Pages Module",
//   "Languages",
//   "Breed Options",
//   "Cattle Options",
//   "Quantity Options",
//   "Acres",
//   "Seeds",
//   "Settings",
//   "All",
// ];

// const initialSubAdmins: SubAdmin[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john.doe@agro.com",
//     password: "123456",
//     access: ["Dashboard", "Orders", "Labours"],
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane.smith@agro.com",
//     password: "123456",
//     access: ["Farmers", "Agents", "Postings", "Categories"],
//   },
//   {
//     id: 3,
//     name: "Michael Lee",
//     email: "michael.lee@agro.com",
//     password: "123456",
//     access: ["All"],
//   },
//   {
//     id: 4,
//     name: "Sarah Chen",
//     email: "sarah.chen@agro.com",
//     password: "123456",
//     access: ["Sliders", "Menu Icons", "Pages Module", "Languages"],
//   },
//   {
//     id: 5,
//     name: "David Kim",
//     email: "david.kim@agro.com",
//     password: "123456",
//     access: ["Breed Options", "Cattle Options", "Quantity Options", "Acres", "Seeds", "Settings"],
//   },
// ];

// /* ================= PAGE ================= */

// export default function SubAdminAccountsPage() {
//   const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(initialSubAdmins);
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<SubAdmin | null>(null);

//   const [form, setForm] = useState<Omit<SubAdmin, "id">>({
//     name: "",
//     email: "",
//     password: "",
//     access: [],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.max(1, Math.ceil(subAdmins.length / rowsPerPage));

//   useEffect(() => {
//     if (page > totalPages) setPage(() => totalPages);
//   }, [page, totalPages]);

//   const paginatedData = useMemo(() => {
//     return subAdmins.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage
//     );
//   }, [subAdmins, page]);

//   /* ================= VALIDATION ================= */

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!form.name.trim()) e.name = "Name required";
//     if (!form.email.trim()) e.email = "Email required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
//     if (!form.password.trim()) e.password = "Password required";
//     if (form.access.length === 0) e.access = "Select at least one module";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD ================= */

//   const handleSave = () => {
//     if (!validate()) return;

//     if (editing) {
//       setSubAdmins(prev =>
//         prev.map(a => a.id === editing.id ? { ...form, id: a.id } : a)
//       );
//     } else {
//       setSubAdmins(prev => [...prev, { ...form, id: Date.now() }]);
//     }

//     reset();
//   };

//   const handleDelete = (id: number) => {
//     if (confirm("Delete this sub admin?")) {
//       setSubAdmins(prev => prev.filter(a => a.id !== id));
//     }
//   };

//   const reset = () => {
//     setOpen(false);
//     setEditing(null);
//     setForm({ name: "", email: "", password: "", access: [] });
//     setErrors({});
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen text-black">
//       <div className="bg-white p-4 rounded shadow">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-semibold">Sub Admin Accounts</h1>
//           <button
//             onClick={() => setOpen(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <FaPlus /> Add New
//           </button>
//         </div>

//         {/* Table */}
//         <table className="w-full text-sm border-t">
//           <thead className="text-gray-600">
//             <tr>
//               <Th>Sr.</Th>
//               <Th>Name</Th>
//               <Th>Email</Th>
//               <Th>Password</Th>
//               <Th>Page Access List</Th>
//               <Th align="right">Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.map((a, i) => (
//               <tr key={a.id} className="border-t">
//                 <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
//                 <Td>{a.name}</Td>

//                 {/* Email padding added */}
//                 <Td>
//                   <div className="pl-8">{a.email}</div>
//                 </Td>

//                 {/* Password padding added */}
//                 <Td>
//                   <div className="pl-8">{"*".repeat(a.password.length)}</div>
//                 </Td>

//                 {/* Page Access improved spacing */}
//                 <Td align="center">
//   <div className="flex flex-wrap justify-center gap-2 mt-2">
//     {a.access.map((m) => (
//       <span
//         key={m}
//         className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs"
//       >
//         {m}
//       </span>
//     ))}
//   </div>
// </Td>


//                 <Td align="right">
//                   <div className="flex justify-end gap-3">
//                     <FaEdit
//                       className="cursor-pointer"
//                       onClick={() => {
//                         setEditing(a);
//                         setForm(a);
//                         setOpen(true);
//                       }}
//                     />
//                     <FaTrash
//                       className="cursor-pointer text-red-500"
//                       onClick={() => handleDelete(a.id)}
//                     />
//                   </div>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-center gap-2 mt-4">
//           <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border px-3 py-1 rounded">
//             Prev
//           </button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`border px-3 py-1 rounded ${page === i + 1 ? "bg-green-500 text-white" : ""}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="border px-3 py-1 rounded">
//             Next
//           </button>
//         </div>
//       </div>

//       {/* MODAL */}
//       {open && (
//         <Modal title={editing ? "Edit Sub Admin" : "Add Sub Admin"} onClose={reset}>
//           <Input label="Name" value={form.name} error={errors.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
//           <Input label="Email" value={form.email} error={errors.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
//           <Input label="Password" type="password" value={form.password} error={errors.password}
//             onChange={v => setForm(p => ({ ...p, password: v }))} />

//           <div>
//             <p className="text-sm font-medium mb-1">Page Access</p>
//             <div className="flex flex-wrap gap-2">
//               {ALL_MODULES.map(m => (
//                 <label key={m} className="flex items-center gap-1 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={form.access.includes(m)}
//                     onChange={() =>
//                       setForm(p => ({
//                         ...p,
//                         access: p.access.includes(m)
//                           ? p.access.filter(x => x !== m)
//                           : [...p.access, m],
//                       }))
//                     }
//                   />
//                   {m}
//                 </label>
//               ))}
//             </div>
//             {errors.access && <p className="text-red-500 text-xs">{errors.access}</p>}
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={reset} className="border px-4 py-2 rounded">Cancel</button>
//             <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
//               {editing ? "Update" : "Save"}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) =>
//   <th className={`py-2 text-${align}`}>{children}</th>;

// const Td = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) =>
//   <td className={`py-2 text-${align}`}>{children}</td>;

// const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white p-4 rounded w-full max-w-lg">
//       <div className="flex justify-between mb-2">
//         <h2 className="font-semibold">{title}</h2>
//         <button onClick={onClose}>✕</button>
//       </div>
//       <div className="space-y-3">{children}</div>
//     </div>
//   </div>
// );

// const Input = ({
//   label,
//   value,
//   error,
//   type = "text",
//   onChange,
// }: {
//   label: string;
//   value: string;
//   type?: string;
//   error?: string;
//   onChange: (v: string) => void;
// }) => (
//   <div>
//     <input
//       type={type}
//       placeholder={label}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//       className={`border px-3 py-2 rounded w-full ${error ? "border-red-500" : ""}`}
//     />
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );

////api end point////////////////

// | Action       | Method | Endpoint          |
// | ------------ | ------ | ----------------- |
// | Create Admin | POST   | `/api/admins`     |
// | List Admins  | GET    | `/api/admins`     |
// | View Admin   | GET    | `/api/admins/:id` |
// | Update Admin | PUT    | `/api/admins/:id` |
// | Delete Admin | DELETE | `/api/admins/:id` |

// {
//   "name": "Chethan",
//   "email": "kisanpartners@gmail.com",
//   "password": "June@2025",
//   "pageAccess": ["Category", "Posting", "Farmers", "Agents"]
// }


// "use client";

// import { useEffect, useMemo, useState, ReactNode } from "react";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// /* ================= TYPES ================= */

// interface SubAdmin {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   access: string[];
// }

// /* ================= DATA ================= */

// const ALL_MODULES = [
//   "Dashboard",
//   "Orders",
//   "Labours",
//   "Farmers",
//   "Agents",
//   "Postings",
//   "Categories",
//   "Sliders",
//   "Menu Icons",
//   "Pages Module",
//   "Languages",
//   "Breed Options",
//   "Cattle Options",
//   "Quantity Options",
//   "Acres",
//   "Seeds",
//   "Settings",
//   "All",
// ];

// const initialSubAdmins: SubAdmin[] = [
//   { id: 1, name: "John Doe", email: "john.doe@agro.com", password: "123456", access: ["Dashboard", "Orders", "Labours"] },
//   { id: 2, name: "Jane Smith", email: "jane.smith@agro.com", password: "123456", access: ["Farmers", "Agents", "Postings", "Categories"] },
//   { id: 3, name: "Michael Lee", email: "michael.lee@agro.com", password: "123456", access: ["All"] },
//   { id: 4, name: "Sarah Chen", email: "sarah.chen@agro.com", password: "123456", access: ["Sliders", "Menu Icons", "Pages Module", "Languages"] },
//   { id: 5, name: "David Kim", email: "david.kim@agro.com", password: "123456", access: ["Breed Options", "Cattle Options", "Quantity Options", "Acres", "Seeds", "Settings"] },
// ];

// /* ================= PAGE ================= */

// export default function SubAdminAccountsPage() {
//   const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(initialSubAdmins);
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<SubAdmin | null>(null);

//   const [form, setForm] = useState<Omit<SubAdmin, "id">>({
//     name: "",
//     email: "",
//     password: "",
//     access: [],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.max(1, Math.ceil(subAdmins.length / rowsPerPage));

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   const paginatedData = useMemo(
//     () => subAdmins.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [subAdmins, page]
//   );

//   /* ================= VALIDATION ================= */

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!form.name.trim()) e.name = "Name required";
//     if (!form.email.trim()) e.email = "Email required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
//     if (!form.password.trim()) e.password = "Password required";
//     if (form.access.length === 0) e.access = "Select at least one module";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD ================= */

//   const handleSave = () => {
//     if (!validate()) return;

//     if (editing) {
//       setSubAdmins(prev =>
//         prev.map(a => (a.id === editing.id ? { ...form, id: a.id } : a))
//       );
//     } else {
//       setSubAdmins(prev => [...prev, { ...form, id: Date.now() }]);
//     }

//     reset();
//   };

//   const handleDelete = (id: number) => {
//     if (confirm("Delete this sub admin?")) {
//       setSubAdmins(prev => prev.filter(a => a.id !== id));
//     }
//   };

//   const reset = () => {
//     setOpen(false);
//     setEditing(null);
//     setForm({ name: "", email: "", password: "", access: [] });
//     setErrors({});
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
//       <div className="bg-white p-4 rounded shadow">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-lg sm:text-xl font-semibold">Sub Admin Accounts</h1>
//           <button
//             onClick={() => setOpen(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <FaPlus /> Add New
//           </button>
//         </div>

//         {/* ================= MOBILE CARD VIEW ================= */}
//         <div className="space-y-4 sm:hidden">
//           {paginatedData.map(a => (
//             <div key={a.id} className="border rounded-lg p-4 shadow-sm">
//               <div className="font-semibold text-lg">{a.name}</div>
//               <div className="text-sm text-gray-600 mt-1">{a.email}</div>
//               <div className="text-sm mt-1">Password: ******</div>

//               <div className="flex flex-wrap justify-center gap-2 mt-3">
//                 {a.access.map(m => (
//                   <span key={m} className="bg-gray-100 px-3 py-1 rounded text-xs">
//                     {m}
//                   </span>
//                 ))}
//               </div>

//               <div className="flex justify-end gap-4 mt-4 text-lg">
//                 <FaEdit
//                   onClick={() => {
//                     setEditing(a);
//                     setForm(a);
//                     setOpen(true);
//                   }}
//                 />
//                 <FaTrash
//                   className="text-red-500"
//                   onClick={() => handleDelete(a.id)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ================= DESKTOP TABLE VIEW ================= */}
//         <div className="hidden sm:block overflow-x-auto">
//           <table className="w-full text-sm border-t">
//             <thead className="text-gray-600">
//               <tr>
//                 <Th>Sr.</Th>
//                 <Th>Name</Th>
//                 <Th>Email</Th>
//                 <Th>Password</Th>
//                 <Th>Page Access List</Th>
//                 <Th align="right">Actions</Th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.map((a, i) => (
//                 <tr key={a.id} className="border-t">
//                   <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
//                   <Td>{a.name}</Td>
//                   <Td><div className="pl-8">{a.email}</div></Td>
//                   <Td><div className="pl-8">{"*".repeat(a.password.length)}</div></Td>
//                   <Td align="center">
//                     <div className="flex flex-wrap justify-center gap-2 mt-2">
//                       {a.access.map(m => (
//                         <span key={m} className="bg-gray-100 px-3 py-1 rounded text-xs">
//                           {m}
//                         </span>
//                       ))}
//                     </div>
//                   </Td>
//                   <Td align="right">
//                     <div className="flex justify-end gap-3">
//                       <FaEdit onClick={() => { setEditing(a); setForm(a); setOpen(true); }} />
//                       <FaTrash className="text-red-500" onClick={() => handleDelete(a.id)} />
//                     </div>
//                   </Td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
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

//       {/* MODAL */}
//       {open && (
//         <Modal title={editing ? "Edit Sub Admin" : "Add Sub Admin"} onClose={reset}>
//           <Input label="Name" value={form.name} error={errors.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
//           <Input label="Email" value={form.email} error={errors.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
//           <Input label="Password" type="password" value={form.password} error={errors.password}
//             onChange={v => setForm(p => ({ ...p, password: v }))} />

//           <div>
//             <p className="text-sm font-medium mb-1">Page Access</p>
//             <div className="flex flex-wrap gap-2">
//               {ALL_MODULES.map(m => (
//                 <label key={m} className="flex items-center gap-1 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={form.access.includes(m)}
//                     onChange={() =>
//                       setForm(p => ({
//                         ...p,
//                         access: p.access.includes(m)
//                           ? p.access.filter(x => x !== m)
//                           : [...p.access, m],
//                       }))
//                     }
//                   />
//                   {m}
//                 </label>
//               ))}
//             </div>
//             {errors.access && <p className="text-red-500 text-xs">{errors.access}</p>}
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={reset} className="border px-4 py-2 rounded">Cancel</button>
//             <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
//               {editing ? "Update" : "Save"}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) =>
//   <th className={`py-2 text-${align}`}>{children}</th>;

// const Td = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) =>
//   <td className={`py-2 text-${align}`}>{children}</td>;

// const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
//     <div className="bg-white p-4 rounded w-full max-w-lg">
//       <div className="flex justify-between mb-2">
//         <h2 className="font-semibold">{title}</h2>
//         <button onClick={onClose}>✕</button>
//       </div>
//       <div className="space-y-3">{children}</div>
//     </div>
//   </div>
// );

// const Input = ({
//   label,
//   value,
//   error,
//   type = "text",
//   onChange,
// }: {
//   label: string;
//   value: string;
//   type?: string;
//   error?: string;
//   onChange: (v: string) => void;
// }) => (
//   <div>
//     <input
//       type={type}
//       placeholder={label}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//       className={`border px-3 py-2 rounded w-full ${error ? "border-red-500" : ""}`}
//     />
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );

"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import { FaPlus, FaEdit, FaTrash, FaPrint, FaCopy, FaFileExcel, FaFileCsv, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

/* ================= TYPES ================= */

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  password: string;
  pageAccess: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: SubAdmin | SubAdmin[];
  message?: string;
  page?: number;
  limit?: number;
  total?: number;
}

/* ================= CONSTANTS ================= */

const ALL_MODULES = [
  "Dashboard",
  "Orders",
  "Labours",
  "Farmers",
  "Agents",
  "Postings",
  "Categories",
  "Sliders",
  "Menu Icons",
  "Pages Module",
  "Languages",
  "Breed Options",
  "Cattle Options",
  "Quantity Options",
  "Acres",
  "Seeds",
  "Settings",
  "All",
];

/* ================= PAGE ================= */

export default function SubAdminAccountsPage() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SubAdmin | null>(null);

  const [form, setForm] = useState<Omit<SubAdmin, "_id">>({
    name: "",
    email: "",
    password: "",
    pageAccess: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= API FUNCTIONS ================= */

  // Fetch all sub-admins
  const fetchSubAdmins = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
      });

      const response = await axios.get<ApiResponse>(`/api/admins?${params}`);
      
      if (response.data.success) {
        const data = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        setSubAdmins(data);
        
        if (response.data.total !== undefined) {
          setTotalAdmins(response.data.total);
          setTotalPages(Math.ceil(response.data.total / rowsPerPage));
        }
      }
    } catch (err: any) {
      console.error("Error fetching sub-admins:", err);
      setError(err.response?.data?.message || "Failed to load sub-admins");
      setSubAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new sub-admin
  const createSubAdmin = async (adminData: Omit<SubAdmin, "_id">) => {
    try {
      const response = await axios.post<ApiResponse>("/api/admins", adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error creating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to create sub-admin");
    }
  };

  // Update sub-admin
  const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
    try {
      const response = await axios.put<ApiResponse>(`/api/admins/${id}`, adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error updating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to update sub-admin");
    }
  };

  // Delete sub-admin
  const deleteSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/admins/${id}`);
      return response.data;
    } catch (err: any) {
      console.error("Error deleting sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to delete sub-admin");
    }
  };

  /* ================= EFFECTS ================= */

  // Initial load
  useEffect(() => {
    fetchSubAdmins(page);
  }, []);

  // Pagination effect
  useEffect(() => {
    fetchSubAdmins(page);
  }, [page]);

  // Rows per page change
  useEffect(() => {
    fetchSubAdmins(1);
    setPage(1);
  }, [rowsPerPage]);

  /* ================= PAGINATION ================= */

  const paginatedData = useMemo(
    () => subAdmins.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [subAdmins, page, rowsPerPage]
  );

  /* ================= VALIDATION ================= */

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.pageAccess.length === 0) e.pageAccess = "Select at least one module";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CRUD OPERATIONS ================= */

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editing) {
        // Update existing sub-admin
        await updateSubAdmin(editing._id, form);
        alert("Sub-admin updated successfully!");
      } else {
        // Create new sub-admin
        await createSubAdmin(form);
        alert("Sub-admin created successfully!");
      }
      
      await fetchSubAdmins(page);
      reset();
    } catch (err: any) {
      alert(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-admin?")) return;
    
    try {
      await deleteSubAdminAPI(id);
      await fetchSubAdmins(page);
      alert("Sub-admin deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to delete sub-admin");
    }
  };

  const reset = () => {
    setOpen(false);
    setEditing(null);
    setForm({ name: "", email: "", password: "", pageAccess: [] });
    setErrors({});
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
    ...rest,
    password: "********", // Hide password in exports
  }));

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    try {
      const text = exportData.map(admin => 
        `${admin.name}\t${admin.email}\t********\t${admin.pageAccess.join(", ")}`
      ).join("\n");
      
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
      XLSX.writeFile(wb, "sub-admins.xlsx");
    } catch (err) {
      alert("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "sub-admins.csv";
      a.click();
    } catch (err) {
      alert("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    try {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["Name", "Email", "Password", "Page Access"]],
        body: exportData.map(admin => [
          admin.name,
          admin.email,
          "********",
          admin.pageAccess.join(", "),
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] },
      });
      doc.save("sub-admins.pdf");
    } catch (err) {
      alert("Failed to export PDF file");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Sub Admin Accounts</h1>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
            >
              <FaPlus /> Add New Sub-Admin
            </button>
          </div>
        </div>

        {/* Export Toolbar */}
        <div className="flex flex-wrap gap-2 mb-6">
          <ToolbarBtn icon={<FaPrint />} label="Print" onClick={handlePrint} />
          <ToolbarBtn icon={<FaCopy />} label="Copy" onClick={handleCopy} />
          <ToolbarBtn icon={<FaFileExcel />} label="Excel" onClick={handleExcel} />
          <ToolbarBtn icon={<FaFileCsv />} label="CSV" onClick={handleCSV} />
          <ToolbarBtn icon={<FaFilePdf />} label="PDF" onClick={handlePDF} />
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              className="border px-3 py-2 rounded"
              value={rowsPerPage}
              onChange={e => setRowsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading sub-admins...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && subAdmins.length === 0 && !error && (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-600">No sub-admins found</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add New Sub-Admin" to create one</p>
          </div>
        )}

        {/* ================= MOBILE CARD VIEW ================= */}
        {!loading && subAdmins.length > 0 && (
          <>
            <div className="space-y-4 sm:hidden">
              {paginatedData.map((admin) => (
                <div key={admin._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-semibold text-lg text-gray-800">{admin.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{admin.email}</div>
                  <div className="text-sm mt-1">Password: ********</div>

                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Access Modules:</p>
                    <div className="flex flex-wrap gap-1">
                      {admin.pageAccess.map(module => (
                        <span 
                          key={module} 
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-4 text-lg pt-3 border-t">
                    <button
                      onClick={() => {
                        setEditing(admin);
                        setForm(admin);
                        setOpen(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="p-2 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP TABLE VIEW ================= */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-t">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600">
                    <Th>Sr.</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Password</Th>
                    <Th>Page Access List</Th>
                    <Th align="right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((admin, index) => (
                    <tr key={admin._id} className="border-t hover:bg-gray-50 transition-colors">
                      <Td>{(page - 1) * rowsPerPage + index + 1}</Td>
                      <Td className="font-medium">{admin.name}</Td>
                      <Td>{admin.email}</Td>
                      <Td>
                        <div className="text-gray-500">********</div>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {admin.pageAccess.map(module => (
                            <span 
                              key={module} 
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {module}
                            </span>
                          ))}
                        </div>
                      </Td>
                      <Td align="right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditing(admin);
                              setForm(admin);
                              setOpen(true);
                            }}
                            className="p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-red-500" />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalAdmins)} of {totalAdmins} sub-admins
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={`border px-3 py-1 rounded ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded ${page === pageNum ? 'bg-green-500 text-white' : 'border hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={`border px-3 py-1 rounded ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {open && (
        <Modal 
          title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
          onClose={reset}
        >
          <Input 
            label="Name" 
            value={form.name} 
            error={errors.name} 
            onChange={v => setForm(p => ({ ...p, name: v }))} 
            placeholder="Enter full name"
            required
          />
          
          <Input 
            label="Email" 
            type="email"
            value={form.email} 
            error={errors.email} 
            onChange={v => setForm(p => ({ ...p, email: v }))} 
            placeholder="Enter email address"
            required
          />
          
          <Input 
            label="Password" 
            type="password"
            value={form.password} 
            error={errors.password} 
            onChange={v => setForm(p => ({ ...p, password: v }))} 
            placeholder="Enter password (min 6 characters)"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Access <span className="text-red-500">*</span>
            </label>
            <div className="border rounded p-3 max-h-60 overflow-y-auto">
              <div className="mb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.pageAccess.includes("All")}
                    onChange={() => {
                      setForm(p => ({
                        ...p,
                        pageAccess: p.pageAccess.includes("All") 
                          ? [] 
                          : ["All"],
                      }));
                    }}
                  />
                  <span className="font-medium">Select All</span>
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {ALL_MODULES.filter(m => m !== "All").map(module => (
                  <label key={module} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.pageAccess.includes(module) || form.pageAccess.includes("All")}
                      disabled={form.pageAccess.includes("All")}
                      onChange={() => {
                        setForm(p => ({
                          ...p,
                          pageAccess: p.pageAccess.includes(module)
                            ? p.pageAccess.filter(x => x !== module)
                            : [...p.pageAccess, module],
                        }));
                      }}
                    />
                    {module}
                  </label>
                ))}
              </div>
            </div>
            {errors.pageAccess && <p className="text-red-500 text-xs mt-1">{errors.pageAccess}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={reset}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) => (
  <th className={`py-3 px-4 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
    {children}
  </th>
);

const Td = ({ children, align = "left", className = "" }: { children: ReactNode; align?: "left" | "center" | "right"; className?: string }) => (
  <td className={`py-3 px-4 text-${align} ${className}`}>
    {children}
  </td>
);

const ToolbarBtn = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border border-green-500 text-green-600 px-3 py-2 rounded flex items-center gap-2 text-sm hover:bg-green-50 transition-colors"
  >
    {icon} {label}
  </button>
);

const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {children}
      </div>
    </div>
  </div>
);

const Input = ({ 
  label, 
  value, 
  error, 
  onChange, 
  type = "text",
  placeholder = "",
  required = false 
}: { 
  label: string; 
  value: string; 
  error?: string; 
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);