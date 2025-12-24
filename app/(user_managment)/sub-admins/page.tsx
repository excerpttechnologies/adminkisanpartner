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

// "use client";

// import { useEffect, useMemo, useState, ReactNode } from "react";
// import { FaPlus, FaEdit, FaTrash, FaPrint, FaCopy, FaFileExcel, FaFileCsv, FaFilePdf } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";

// /* ================= TYPES ================= */

// interface SubAdmin {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   pageAccess: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data: SubAdmin | SubAdmin[];
//   message?: string;
//   page?: number;
//   limit?: number;
//   total?: number;
// }

// /* ================= CONSTANTS ================= */

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

// /* ================= PAGE ================= */

// export default function SubAdminAccountsPage() {
//   const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAdmins, setTotalAdmins] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<SubAdmin | null>(null);

//   const [form, setForm] = useState<Omit<SubAdmin, "_id">>({
//     name: "",
//     email: "",
//     password: "",
//     pageAccess: [],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* ================= API FUNCTIONS ================= */

//   // Fetch all sub-admins
//   const fetchSubAdmins = async (currentPage: number = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: rowsPerPage.toString(),
//       });

//       const response = await axios.get<ApiResponse>(`/api/admins?${params}`);
      
//       if (response.data.success) {
//         const data = Array.isArray(response.data.data) 
//           ? response.data.data 
//           : [response.data.data];
//         setSubAdmins(data);
        
//         if (response.data.total !== undefined) {
//           setTotalAdmins(response.data.total);
//           setTotalPages(Math.ceil(response.data.total / rowsPerPage));
//         }
//       }
//     } catch (err: any) {
//       console.error("Error fetching sub-admins:", err);
//       setError(err.response?.data?.message || "Failed to load sub-admins");
//       setSubAdmins([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new sub-admin
//   const createSubAdmin = async (adminData: Omit<SubAdmin, "_id">) => {
//     try {
//       const response = await axios.post<ApiResponse>("/api/admins", adminData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error creating sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to create sub-admin");
//     }
//   };

//   // Update sub-admin
//   const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
//     try {
//       const response = await axios.put<ApiResponse>(`/api/admins/${id}`, adminData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error updating sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to update sub-admin");
//     }
//   };

//   // Delete sub-admin
//   const deleteSubAdminAPI = async (id: string) => {
//     try {
//       const response = await axios.delete<ApiResponse>(`/api/admins/${id}`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error deleting sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to delete sub-admin");
//     }
//   };

//   /* ================= EFFECTS ================= */

//   // Initial load
//   useEffect(() => {
//     fetchSubAdmins(page);
//   }, []);

//   // Pagination effect
//   useEffect(() => {
//     fetchSubAdmins(page);
//   }, [page]);

//   // Rows per page change
//   useEffect(() => {
//     fetchSubAdmins(1);
//     setPage(1);
//   }, [rowsPerPage]);

//   /* ================= PAGINATION ================= */

//   const paginatedData = useMemo(
//     () => subAdmins.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [subAdmins, page, rowsPerPage]
//   );

//   /* ================= VALIDATION ================= */

//   const validate = (): boolean => {
//     const e: Record<string, string> = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
//     if (!form.password.trim()) e.password = "Password is required";
//     else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
//     if (form.pageAccess.length === 0) e.pageAccess = "Select at least one module";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD OPERATIONS ================= */

//   const handleSave = async () => {
//     if (!validate()) return;

//     try {
//       if (editing) {
//         // Update existing sub-admin
//         await updateSubAdmin(editing._id, form);
//         alert("Sub-admin updated successfully!");
//       } else {
//         // Create new sub-admin
//         await createSubAdmin(form);
//         alert("Sub-admin created successfully!");
//       }
      
//       await fetchSubAdmins(page);
//       reset();
//     } catch (err: any) {
//       alert(err.message || "Operation failed");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this sub-admin?")) return;
    
//     try {
//       await deleteSubAdminAPI(id);
//       await fetchSubAdmins(page);
//       alert("Sub-admin deleted successfully!");
//     } catch (err: any) {
//       alert(err.message || "Failed to delete sub-admin");
//     }
//   };

//   const reset = () => {
//     setOpen(false);
//     setEditing(null);
//     setForm({ name: "", email: "", password: "", pageAccess: [] });
//     setErrors({});
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
//     ...rest,
//     password: "********", // Hide password in exports
//   }));

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleCopy = async () => {
//     try {
//       const text = exportData.map(admin => 
//         `${admin.name}\t${admin.email}\t********\t${admin.pageAccess.join(", ")}`
//       ).join("\n");
      
//       await navigator.clipboard.writeText(text);
//       alert("Copied to clipboard!");
//     } catch (err) {
//       alert("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
//       XLSX.writeFile(wb, "sub-admins.xlsx");
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
//       a.download = "sub-admins.csv";
//       a.click();
//     } catch (err) {
//       alert("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     try {
//       const doc = new jsPDF();
//       autoTable(doc, {
//         head: [["Name", "Email", "Password", "Page Access"]],
//         body: exportData.map(admin => [
//           admin.name,
//           admin.email,
//           "********",
//           admin.pageAccess.join(", "),
//         ]),
//         theme: 'grid',
//         styles: { fontSize: 9 },
//         headStyles: { fillColor: [22, 160, 133] },
//       });
//       doc.save("sub-admins.pdf");
//     } catch (err) {
//       alert("Failed to export PDF file");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
//       <div className="bg-white p-4 rounded-lg shadow">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//           <h1 className="text-xl sm:text-2xl font-semibold">Sub Admin Accounts</h1>
          
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setOpen(true)}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
//             >
//               <FaPlus /> Add New Sub-Admin
//             </button>
//           </div>
//         </div>

//         {/* Export Toolbar */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           <ToolbarBtn icon={<FaPrint />} label="Print" onClick={handlePrint} />
//           <ToolbarBtn icon={<FaCopy />} label="Copy" onClick={handleCopy} />
//           <ToolbarBtn icon={<FaFileExcel />} label="Excel" onClick={handleExcel} />
//           <ToolbarBtn icon={<FaFileCsv />} label="CSV" onClick={handleCSV} />
//           <ToolbarBtn icon={<FaFilePdf />} label="PDF" onClick={handlePDF} />
//         </div>

//         {/* Filters and Controls */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-3 bg-red-50 text-red-600 rounded border border-red-200">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//             <p className="mt-2 text-gray-600">Loading sub-admins...</p>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && subAdmins.length === 0 && !error && (
//           <div className="text-center py-8 border rounded-lg bg-gray-50">
//             <p className="text-gray-600">No sub-admins found</p>
//             <p className="text-sm text-gray-500 mt-1">Click "Add New Sub-Admin" to create one</p>
//           </div>
//         )}

//         {/* ================= MOBILE CARD VIEW ================= */}
//         {!loading && subAdmins.length > 0 && (
//           <>
//             <div className="space-y-4 sm:hidden">
//               {paginatedData.map((admin) => (
//                 <div key={admin._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="font-semibold text-lg text-gray-800">{admin.name}</div>
//                   <div className="text-sm text-gray-600 mt-1">{admin.email}</div>
//                   <div className="text-sm mt-1">Password: ********</div>

//                   <div className="mt-3">
//                     <p className="text-sm font-medium text-gray-700 mb-1">Access Modules:</p>
//                     <div className="flex flex-wrap gap-1">
//                       {admin.pageAccess.map(module => (
//                         <span 
//                           key={module} 
//                           className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
//                         >
//                           {module}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-4 mt-4 text-lg pt-3 border-t">
//                     <button
//                       onClick={() => {
//                         setEditing(admin);
//                         setForm(admin);
//                         setOpen(true);
//                       }}
//                       className="p-2 hover:bg-gray-100 rounded"
//                       title="Edit"
//                     >
//                       <FaEdit className="text-blue-600" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(admin._id)}
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
//               <table className="w-full text-sm border-t">
//                 <thead className="bg-gray-50">
//                   <tr className="text-gray-600">
//                     <Th>Sr.</Th>
//                     <Th>Name</Th>
//                     <Th>Email</Th>
//                     <Th>Password</Th>
//                     <Th>Page Access List</Th>
//                     <Th align="right">Actions</Th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((admin, index) => (
//                     <tr key={admin._id} className="border-t hover:bg-gray-50 transition-colors">
//                       <Td>{(page - 1) * rowsPerPage + index + 1}</Td>
//                       <Td className="font-medium">{admin.name}</Td>
//                       <Td>{admin.email}</Td>
//                       <Td>
//                         <div className="text-gray-500">********</div>
//                       </Td>
//                       <Td>
//                         <div className="flex flex-wrap gap-1">
//                           {admin.pageAccess.map(module => (
//                             <span 
//                               key={module} 
//                               className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
//                             >
//                               {module}
//                             </span>
//                           ))}
//                         </div>
//                       </Td>
//                       <Td align="right">
//                         <div className="flex justify-end gap-3">
//                           <button
//                             onClick={() => {
//                               setEditing(admin);
//                               setForm(admin);
//                               setOpen(true);
//                             }}
//                             className="p-2 hover:bg-blue-50 rounded transition-colors"
//                             title="Edit"
//                           >
//                             <FaEdit className="text-blue-600" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(admin._id)}
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

//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalAdmins)} of {totalAdmins} sub-admins
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

//       {/* ADD/EDIT MODAL */}
//       {open && (
//         <Modal 
//           title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
//           onClose={reset}
//         >
//           <Input 
//             label="Name" 
//             value={form.name} 
//             error={errors.name} 
//             onChange={v => setForm(p => ({ ...p, name: v }))} 
//             placeholder="Enter full name"
//             required
//           />
          
//           <Input 
//             label="Email" 
//             type="email"
//             value={form.email} 
//             error={errors.email} 
//             onChange={v => setForm(p => ({ ...p, email: v }))} 
//             placeholder="Enter email address"
//             required
//           />
          
//           <Input 
//             label="Password" 
//             type="password"
//             value={form.password} 
//             error={errors.password} 
//             onChange={v => setForm(p => ({ ...p, password: v }))} 
//             placeholder="Enter password (min 6 characters)"
//             required
//           />

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Page Access <span className="text-red-500">*</span>
//             </label>
//             <div className="border rounded p-3 max-h-60 overflow-y-auto">
//               <div className="mb-2">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={form.pageAccess.includes("All")}
//                     onChange={() => {
//                       setForm(p => ({
//                         ...p,
//                         pageAccess: p.pageAccess.includes("All") 
//                           ? [] 
//                           : ["All"],
//                       }));
//                     }}
//                   />
//                   <span className="font-medium">Select All</span>
//                 </label>
//               </div>
              
//               <div className="grid grid-cols-2 gap-2">
//                 {ALL_MODULES.filter(m => m !== "All").map(module => (
//                   <label key={module} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={form.pageAccess.includes(module) || form.pageAccess.includes("All")}
//                       disabled={form.pageAccess.includes("All")}
//                       onChange={() => {
//                         setForm(p => ({
//                           ...p,
//                           pageAccess: p.pageAccess.includes(module)
//                             ? p.pageAccess.filter(x => x !== module)
//                             : [...p.pageAccess, module],
//                         }));
//                       }}
//                     />
//                     {module}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             {errors.pageAccess && <p className="text-red-500 text-xs mt-1">{errors.pageAccess}</p>}
//           </div>

//           <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
//             <button
//               onClick={reset}
//               className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
//             >
//               {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
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
//     <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
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
//   placeholder = "",
//   required = false 
// }: { 
//   label: string; 
//   value: string; 
//   error?: string; 
//   onChange: (v: string) => void;
//   type?: string;
//   placeholder?: string;
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
//       placeholder={placeholder}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

"use client";

import { useState, useEffect } from "react";
import {
  FaEye,
  FaTrash,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaRedo,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";

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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
  const [editing, setEditing] = useState<SubAdmin | null>(null);

  const [form, setForm] = useState<Omit<SubAdmin, "_id">>({
    name: "",
    email: "",
    password: "", // Always initialize as empty string
    pageAccess: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= API FUNCTIONS ================= */

  const fetchSubAdmins = async (page: number = 1, searchQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
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
        setCurrentPage(page);
      }
    } catch (err: any) {
      console.error("Error fetching sub-admins:", err);
      setError(err.response?.data?.message || 'Failed to load sub-admins. Please try again.');
      setSubAdmins([]);
      toast.error(err.response?.data?.message || "Failed to load sub-admins");
    } finally {
      setLoading(false);
    }
  };

  const createSubAdmin = async (adminData: Omit<SubAdmin, "_id">) => {
    try {
      const response = await axios.post<ApiResponse>("/api/admins", adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error creating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to create sub-admin");
    }
  };

  const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
    try {
      const response = await axios.put<ApiResponse>(`/api/admins/${id}`, adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error updating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to update sub-admin");
    }
  };

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

  useEffect(() => {
    fetchSubAdmins(currentPage, search);
  }, [currentPage, rowsPerPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubAdmins(1, search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= VALIDATION ================= */

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    
    // Name validation
    if (!form.name || !form.name.trim()) {
      e.name = "Name is required";
    }
    
    // Email validation
    if (!form.email || !form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Invalid email format";
    }
    
    // Password validation
    if (!editing) {
      // For create: password is required
      if (!form.password || !form.password.trim()) {
        e.password = "Password is required";
      } else if (form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    } else {
      // For edit: password is optional, but if provided, must be at least 6 chars
      if (form.password && form.password.trim() && form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    }
    
    // Page access validation
    if (form.pageAccess.length === 0) {
      e.pageAccess = "Select at least one module";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CRUD OPERATIONS ================= */

  const handleSave = async () => {
    if (!validate()) return;

    try {
      // Prepare data to send
      const adminData: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        pageAccess: form.pageAccess,
      };
      
      // Only include password if it's provided and not empty
      if (form.password && form.password.trim()) {
        adminData.password = form.password;
      }

      if (editing) {
        await updateSubAdmin(editing._id, adminData);
        toast.success("Sub-admin updated successfully!");
      } else {
        // For create, password should already be validated as required
        await createSubAdmin(adminData);
        toast.success("Sub-admin created successfully!");
      }
      
      await fetchSubAdmins(currentPage, search);
      reset();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
   
    try {
      await deleteSubAdminAPI(selectedAdmin._id);
      toast.success("Sub-admin deleted successfully!");
      setDeleteOpen(false);
      fetchSubAdmins(currentPage, search);
    } catch (error: any) {
      console.error("Error deleting sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to delete sub-admin. Please try again.");
    }
  };

  const reset = () => {
    setOpen(false);
    setEditing(null);
    setSelectedAdmin(null);
    setViewOpen(false);
    setForm({ name: "", email: "", password: "", pageAccess: [] });
    setErrors({});
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
    ...rest,
    password: "********",
  }));

  const handlePrint = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to print");
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
        <title>Sub-Admins Report</title>
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
          <h1>👨‍💼 Sub-Admins Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Sub-Admins: ${totalAdmins} | Showing: ${subAdmins.length} sub-admins</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Access Modules</th>
            </tr>
          </thead>
          <tbody>
            ${subAdmins.map((admin, index) => `
              <tr>
                <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td><strong>${admin.name}</strong></td>
                <td>${admin.email}</td>
                <td>********</td>
                <td>${admin.pageAccess.join(', ')}</td>
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

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleCopy = async () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to copy");
      return;
    }

    const text = exportData.map(admin => 
      `${admin.name}\t${admin.email}\t********\t${admin.pageAccess.join(", ")}`
    ).join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Sub-admins data copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
      XLSX.writeFile(wb, `sub-admins-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sub-admins-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Sub-Admins Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Email", "Password", "Access Modules"];
      const tableRows: any = exportData.map((admin, index) => [
        index + 1 + (currentPage - 1) * rowsPerPage,
        admin.name,
        admin.email,
        "********",
        admin.pageAccess.join(', '),
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`sub-admins-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    fetchSubAdmins(1, "");
    setRowsPerPage(10);
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Sub-Admin Accounts</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all sub-admin accounts. {totalAdmins} sub-admins found.
          </p>
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow">
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
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Add New Button */}
          <div className="md:col-span-2">
            <button
              onClick={() => setOpen(true)}
              className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaPlus /> Add New
            </button>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
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

      {/* Desktop Table */}
      {!loading && subAdmins.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Password</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Access Modules</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subAdmins.map((admin, index) => (
                  <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{admin.name}</div>
                    </td>
                    <td className="p-[.6rem] text-sm">{admin.email}</td>
                    <td className="p-[.6rem] text-sm">
                      <span className="text-gray-400">********</span>
                    </td>
                    <td className="p-[.6rem] text-sm">
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
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => { 
                            setEditing(admin); 
                            setForm({
                              ...admin,
                              password: "" // Clear password for editing
                            }); 
                            setOpen(true); 
                          }}
                          className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
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
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {subAdmins.map((admin, index) => (
              <div key={admin._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800">{admin.name}</div>
                    <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }} className="p-1.5 text-blue-600">
                      <FaEye />
                    </button>
                    <button onClick={() => { 
                      setEditing(admin); 
                      setForm({
                        ...admin,
                        password: ""
                      }); 
                      setOpen(true); 
                    }} className="p-1.5 text-green-600">
                      <FaEdit />
                    </button>
                    <button onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-sm">{admin.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Password</div>
                    <div className="text-sm text-gray-400">********</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Access Modules</div>
                    <div className="flex flex-wrap gap-1 mt-1">
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
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && subAdmins.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍💼</div>
          <h3 className="text-xl font-semibold mb-2">No sub-admins found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new sub-admin</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add New Sub-Admin
          </button>
        </div>
      )}

      {/* Pagination with MUI Component */}
      {!loading && subAdmins.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAdmins)}</span> of{" "}
            <span className="font-semibold">{totalAdmins}</span> sub-admins
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-1 ml-3 border border-zinc-300 rounded"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {open && (
        <Modal 
          title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
          onClose={reset}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-2">
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
              placeholder={editing ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
              required={!editing}
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
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && selectedAdmin && (
        <Modal 
          title="Sub-Admin Details" 
          onClose={() => { setViewOpen(false); setSelectedAdmin(null); }}
        >
          <div className="space-y-4">
            <DetailRow label="Name" value={selectedAdmin.name} />
            <DetailRow label="Email" value={selectedAdmin.email} />
            <DetailRow label="Password" value="********" />
            <div>
              <div className="font-medium text-gray-600 mb-2">Access Modules:</div>
              <div className="flex flex-wrap gap-1">
                {selectedAdmin.pageAccess.map(module => (
                  <span 
                    key={module} 
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
            {selectedAdmin.createdAt && (
              <DetailRow label="Created" value={new Date(selectedAdmin.createdAt).toLocaleDateString()} />
            )}
            {selectedAdmin.updatedAt && (
              <DetailRow label="Last Updated" value={new Date(selectedAdmin.updatedAt).toLocaleDateString()} />
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => { setViewOpen(false); setSelectedAdmin(null); }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteOpen && selectedAdmin && (
        <Modal 
          title="Delete Sub-Admin?" 
          onClose={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
        >
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold mb-2">Delete Sub-Admin?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedAdmin.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete Sub-Admin
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
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
      {children}
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

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
    <div className="w-32 font-medium text-gray-600">{label}:</div>
    <div className="flex-1 text-gray-900">{value}</div>
  </div>
);