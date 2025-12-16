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



"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

/* ================= TYPES ================= */

interface SubAdmin {
  id: number;
  name: string;
  email: string;
  password: string;
  access: string[];
}

/* ================= DATA ================= */

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

const initialSubAdmins: SubAdmin[] = [
  { id: 1, name: "John Doe", email: "john.doe@agro.com", password: "123456", access: ["Dashboard", "Orders", "Labours"] },
  { id: 2, name: "Jane Smith", email: "jane.smith@agro.com", password: "123456", access: ["Farmers", "Agents", "Postings", "Categories"] },
  { id: 3, name: "Michael Lee", email: "michael.lee@agro.com", password: "123456", access: ["All"] },
  { id: 4, name: "Sarah Chen", email: "sarah.chen@agro.com", password: "123456", access: ["Sliders", "Menu Icons", "Pages Module", "Languages"] },
  { id: 5, name: "David Kim", email: "david.kim@agro.com", password: "123456", access: ["Breed Options", "Cattle Options", "Quantity Options", "Acres", "Seeds", "Settings"] },
];

/* ================= PAGE ================= */

export default function SubAdminAccountsPage() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(initialSubAdmins);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SubAdmin | null>(null);

  const [form, setForm] = useState<Omit<SubAdmin, "id">>({
    name: "",
    email: "",
    password: "",
    access: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(1, Math.ceil(subAdmins.length / rowsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedData = useMemo(
    () => subAdmins.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [subAdmins, page]
  );

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email.trim()) e.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password.trim()) e.password = "Password required";
    if (form.access.length === 0) e.access = "Select at least one module";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CRUD ================= */

  const handleSave = () => {
    if (!validate()) return;

    if (editing) {
      setSubAdmins(prev =>
        prev.map(a => (a.id === editing.id ? { ...form, id: a.id } : a))
      );
    } else {
      setSubAdmins(prev => [...prev, { ...form, id: Date.now() }]);
    }

    reset();
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this sub admin?")) {
      setSubAdmins(prev => prev.filter(a => a.id !== id));
    }
  };

  const reset = () => {
    setOpen(false);
    setEditing(null);
    setForm({ name: "", email: "", password: "", access: [] });
    setErrors({});
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-black">
      <div className="bg-white p-4 rounded shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg sm:text-xl font-semibold">Sub Admin Accounts</h1>
          <button
            onClick={() => setOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add New
          </button>
        </div>

        {/* ================= MOBILE CARD VIEW ================= */}
        <div className="space-y-4 sm:hidden">
          {paginatedData.map(a => (
            <div key={a.id} className="border rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-lg">{a.name}</div>
              <div className="text-sm text-gray-600 mt-1">{a.email}</div>
              <div className="text-sm mt-1">Password: ******</div>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {a.access.map(m => (
                  <span key={m} className="bg-gray-100 px-3 py-1 rounded text-xs">
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-4 text-lg">
                <FaEdit
                  onClick={() => {
                    setEditing(a);
                    setForm(a);
                    setOpen(true);
                  }}
                />
                <FaTrash
                  className="text-red-500"
                  onClick={() => handleDelete(a.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP TABLE VIEW ================= */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm border-t">
            <thead className="text-gray-600">
              <tr>
                <Th>Sr.</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Password</Th>
                <Th>Page Access List</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((a, i) => (
                <tr key={a.id} className="border-t">
                  <Td>{(page - 1) * rowsPerPage + i + 1}</Td>
                  <Td>{a.name}</Td>
                  <Td><div className="pl-8">{a.email}</div></Td>
                  <Td><div className="pl-8">{"*".repeat(a.password.length)}</div></Td>
                  <Td align="center">
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {a.access.map(m => (
                        <span key={m} className="bg-gray-100 px-3 py-1 rounded text-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-3">
                      <FaEdit onClick={() => { setEditing(a); setForm(a); setOpen(true); }} />
                      <FaTrash className="text-red-500" onClick={() => handleDelete(a.id)} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* MODAL */}
      {open && (
        <Modal title={editing ? "Edit Sub Admin" : "Add Sub Admin"} onClose={reset}>
          <Input label="Name" value={form.name} error={errors.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
          <Input label="Email" value={form.email} error={errors.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
          <Input label="Password" type="password" value={form.password} error={errors.password}
            onChange={v => setForm(p => ({ ...p, password: v }))} />

          <div>
            <p className="text-sm font-medium mb-1">Page Access</p>
            <div className="flex flex-wrap gap-2">
              {ALL_MODULES.map(m => (
                <label key={m} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.access.includes(m)}
                    onChange={() =>
                      setForm(p => ({
                        ...p,
                        access: p.access.includes(m)
                          ? p.access.filter(x => x !== m)
                          : [...p.access, m],
                      }))
                    }
                  />
                  {m}
                </label>
              ))}
            </div>
            {errors.access && <p className="text-red-500 text-xs">{errors.access}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={reset} className="border px-4 py-2 rounded">Cancel</button>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              {editing ? "Update" : "Save"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE ================= */

const Th = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) =>
  <th className={`py-2 text-${align}`}>{children}</th>;

const Td = ({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" | "right" }) =>
  <td className={`py-2 text-${align}`}>{children}</td>;

const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
    <div className="bg-white p-4 rounded w-full max-w-lg">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  </div>
);

const Input = ({
  label,
  value,
  error,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  error?: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <input
      type={type}
      placeholder={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`border px-3 py-2 rounded w-full ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
