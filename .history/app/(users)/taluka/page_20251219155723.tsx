


// // "use client";

// // import { useEffect, useState } from "react";
// // import { Plus, Pencil, Trash2, X } from "lucide-react";

// // interface Taluka {
// //   id: number;
// //   name: string;
// //   district: string;
// //   selected?: boolean;
// // }

// // const DISTRICTS = ["Thane", "Palghar", "Mumbai", "Pune"];

// // export default function TalukaPage() {
// //   const [talukas, setTalukas] = useState<Taluka[]>([]);
// //   const [search, setSearch] = useState("");
// //   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
// //   const [message, setMessage] = useState<string | null>(null);

// //   const [showModal, setShowModal] = useState(false);
// //   const [editId, setEditId] = useState<number | null>(null);
// //   const [talukaName, setTalukaName] = useState("");
// //   const [district, setDistrict] = useState("");

// //   /* ---------- INIT ---------- */
// //   useEffect(() => {
// //     setTalukas([
// //       { id: 1, name: "Vasai", district: "Palghar" },
// //       { id: 2, name: "Dahanu", district: "Palghar" },
// //       { id: 3, name: "Kalyan", district: "Thane" },
// //       { id: 4, name: "Ulhasnagar", district: "Thane" },
// //     ]);
// //   }, []);

// //   /* ---------- HELPERS ---------- */
// //   const showSuccess = (text: string) => {
// //     setMessage(text);
// //     setTimeout(() => setMessage(null), 2500);
// //   };

// //   const toggleSort = () =>
// //     setSortOrder((p) => (p === "asc" ? "desc" : "asc"));

// //   /* ---------- FILTER + SORT ---------- */
// //   const filtered = talukas.filter(
// //     (t) =>
// //       t.name.toLowerCase().includes(search.toLowerCase()) ||
// //       t.district.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const sorted = [...filtered].sort((a, b) =>
// //     sortOrder === "asc" ? a.id - b.id : b.id - a.id
// //   );

// //   /* ---------- SELECT ---------- */
// //   const toggleSelect = (id: number) => {
// //     setTalukas((prev) =>
// //       prev.map((t) =>
// //         t.id === id ? { ...t, selected: !t.selected } : t
// //       )
// //     );
// //   };

// //   const selectAll = (checked: boolean) => {
// //     setTalukas((prev) =>
// //       prev.map((t) => ({ ...t, selected: checked }))
// //     );
// //   };

// //   const deleteSelected = () => {
// //     setTalukas((prev) => prev.filter((t) => !t.selected));
// //     showSuccess("Selected talukas deleted");
// //   };

// //   /* ---------- CRUD ---------- */
// //   const openAdd = () => {
// //     setEditId(null);
// //     setTalukaName("");
// //     setDistrict("");
// //     setShowModal(true);
// //   };

// //   const openEdit = (t: Taluka) => {
// //     setEditId(t.id);
// //     setTalukaName(t.name);
// //     setDistrict(t.district);
// //     setShowModal(true);
// //   };

// //   const save = () => {
// //     if (!talukaName.trim() || !district) return;

// //     if (editId) {
// //       setTalukas((prev) =>
// //         prev.map((t) =>
// //           t.id === editId
// //             ? { ...t, name: talukaName, district }
// //             : t
// //         )
// //       );
// //       showSuccess("Taluka updated successfully");
// //     } else {
// //       setTalukas((prev) => [
// //         ...prev,
// //         {
// //           id: Date.now(),
// //           name: talukaName,
// //           district,
// //         },
// //       ]);
// //       showSuccess("Taluka added successfully");
// //     }

// //     setShowModal(false);
// //   };

// //   const deleteOne = (id: number) => {
// //     setTalukas((prev) => prev.filter((t) => t.id !== id));
// //     showSuccess("Taluka deleted successfully");
// //   };

// //   /* ---------- UI ---------- */
// //   return (
// //     <div className="p-4 md:p-6 text-black">

// //       {message && (
// //         <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
// //           {message}
// //         </div>
// //       )}

// //       {/* HEADER */}
// //       <h1 className="text-xl font-semibold mb-3">Taluka Management</h1>

// //       {/* ACTION BAR */}
// //       <div className="flex flex-wrap justify-between gap-3 mb-3">
// //         <div className="flex gap-2 items-center">
// //           <input
// //             type="checkbox"
// //             onChange={(e) => selectAll(e.target.checked)}
// //           />
// //           <button
// //             onClick={deleteSelected}
// //             disabled={!talukas.some((t) => t.selected)}
// //             className={`px-4 py-2 rounded text-white ${
// //               talukas.some((t) => t.selected)
// //                 ? "bg-red-600"
// //                 : "bg-gray-400"
// //             }`}
// //           >
// //             Delete Selected
// //           </button>
// //         </div>

// //         <div className="flex gap-2">
// //           <input
// //             placeholder="Search Taluka / District"
// //             className="border px-3 py-1 rounded w-48"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //           />
// //           <button
// //             onClick={openAdd}
// //             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
// //           >
// //             <Plus size={16} /> Add Taluka
// //           </button>
// //         </div>
// //       </div>

// //       {/* ================= DESKTOP TABLE ================= */}
// //       <div className="hidden md:block bg-white rounded ">
// //         <table className="w-full">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="border px-3 py-2">✓</th>
// //               <th
// //                 onClick={toggleSort}
// //                 className="border px-3 py-2 cursor-pointer"
// //               >
// //                 Sr {sortOrder === "asc" ? "▲" : "▼"}
// //               </th>
// //               <th className="border px-3 py-2">Taluka</th>
// //               <th className="border px-3 py-2">District</th>
// //               <th className="border px-3 py-2">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {sorted.map((t, index) => {
// //               const sr =
// //                 sortOrder === "asc"
// //                   ? index + 1
// //                   : sorted.length - index;

// //               return (
// //                 <tr key={t.id}>
// //                   <td className="border px-3 py-2 text-center">
// //                     <input
// //                       type="checkbox"
// //                       checked={!!t.selected}
// //                       onChange={() => toggleSelect(t.id)}
// //                     />
// //                   </td>
// //                   <td className="border px-3 py-2">{sr}</td>
// //                   <td className="border px-3 py-2">{t.name}</td>
// //                   <td className="border px-3 py-2">{t.district}</td>
// //                   <td className="border px-3 py-2 text-center">
// //                     <div className="flex justify-center gap-2">
// //                       <button
// //                         onClick={() => openEdit(t)}
// //                         className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
// //                       >
// //                         <Pencil size={12} /> Edit
// //                       </button>
// //                       <button
// //                         onClick={() => deleteOne(t.id)}
// //                         className="bg-red-500 text-white px-2 py-1 rounded text-xs"
// //                       >
// //                         <Trash2 size={12} /> Delete
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* ================= MOBILE CARDS ================= */}
// //       <div className="md:hidden space-y-3">
// //         {sorted.map((t, index) => {
// //           const sr =
// //             sortOrder === "asc"
// //               ? index + 1
// //               : sorted.length - index;

// //           return (
// //             <div key={t.id} className="bg-white border rounded p-3 shadow-sm">
// //               <div className="flex justify-between mb-2">
// //                 <span className="font-semibold">#{sr}</span>
// //                 <input
// //                   type="checkbox"
// //                   checked={!!t.selected}
// //                   onChange={() => toggleSelect(t.id)}
// //                 />
// //               </div>

// //               <p className="text-sm"><b>Taluka:</b> {t.name}</p>
// //               <p className="text-sm mb-2"><b>District:</b> {t.district}</p>

// //               <div className="flex gap-3">
// //                 <button
// //                   onClick={() => openEdit(t)}
// //                   className="flex-1 bg-blue-500 text-white py-1 rounded text-sm"
// //                 >
// //                   Edit
// //                 </button>
// //                 <button
// //                   onClick={() => deleteOne(t.id)}
// //                   className="flex-1 bg-red-500 text-white py-1 rounded text-sm"
// //                 >
// //                   Delete
// //                 </button>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* MODAL */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
// //           <div className="bg-white w-full max-w-sm rounded p-4">
// //             <div className="flex justify-between mb-3">
// //               <h2 className="font-semibold">
// //                 {editId ? "Edit Taluka" : "Add Taluka"}
// //               </h2>
// //               <button onClick={() => setShowModal(false)}>
// //                 <X size={18} />
// //               </button>
// //             </div>

// //             <select
// //               className="border w-full p-2 rounded mb-3"
// //               value={district}
// //               onChange={(e) => setDistrict(e.target.value)}
// //             >
// //               <option value="">Select District</option>
// //               {DISTRICTS.map((d) => (
// //                 <option key={d} value={d}>
// //                   {d}
// //                 </option>
// //               ))}
// //             </select>

// //             <input
// //               className="border w-full p-2 rounded mb-4"
// //               placeholder="Enter Taluka Name"
// //               value={talukaName}
// //               onChange={(e) => setTalukaName(e.target.value)}
// //             />

// //             <div className="flex justify-end gap-2">
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="border px-4 py-2 rounded"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={save}
// //                 className="bg-green-500 text-white px-4 py-2 rounded"
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }







// "use client";

// import { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2, X } from "lucide-react";

// /* ================= TYPES ================= */
// interface Taluka {
//   _id: string;
//   name: string;
//   districtStateId: {
//     _id: string;
//     name: string;
//   };
//   selected?: boolean;
// }

// interface State {
//   _id: string;
//   name: string;
// }

// /* ================= COMPONENT ================= */
// export default function TalukaPage() {
//   const [talukas, setTalukas] = useState<Taluka[]>([]);
//   const [states, setStates] = useState<State[]>([]);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [talukaName, setTalukaName] = useState("");
//   const [stateId, setStateId] = useState("");

//   /* ================= FETCH STATES ================= */
//   const fetchStates = async () => {
//     try {
//       const res = await fetch("/api/states");
//       const data = await res.json();
//       setStates(Array.isArray(data.states) ? data.states : []);
//     } catch (error) {
//       console.error("Failed to fetch states", error);
//       setStates([]);
//     }
//   };

//   /* ================= FETCH TALUKAS ================= */
//   const fetchTalukas = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams();
//       if (search) query.append("search", search);

//       const res = await fetch(`/api/talukas?${query.toString()}`);
//       const data = await res.json();

//       setTalukas(
//         Array.isArray(data.talukas)
//           ? data.talukas.map((t: Taluka) => ({
//               ...t,
//               selected: false,
//             }))
//           : []
//       );
//     } catch (error) {
//       console.error("Failed to fetch talukas", error);
//       setTalukas([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= INIT ================= */
//   useEffect(() => {
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     fetchTalukas();
//   }, [search]);

//   /* ================= HELPERS ================= */
//   const showSuccess = (text: string) => {
//     setMessage(text);
//     setTimeout(() => setMessage(null), 2500);
//   };

//   /* ================= SELECT ================= */
//   const toggleSelect = (id: string) => {
//     setTalukas((prev) =>
//       prev.map((t) =>
//         t._id === id ? { ...t, selected: !t.selected } : t
//       )
//     );
//   };

//   const selectAll = (checked: boolean) => {
//     setTalukas((prev) =>
//       prev.map((t) => ({ ...t, selected: checked }))
//     );
//   };

//   /* ================= DELETE SELECTED ================= */
//   const deleteSelected = async () => {
//     const ids = talukas.filter((t) => t.selected).map((t) => t._id);
//     if (ids.length === 0) return;

//     await fetch("/api/talukas/delete-many", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ids }),
//     });

//     showSuccess("Selected talukas deleted");
//     fetchTalukas();
//   };

//   /* ================= CRUD ================= */
//   const openAdd = () => {
//     setEditId(null);
//     setTalukaName("");
//     setStateId("");
//     setShowModal(true);
//   };

//   const openEdit = (t: Taluka) => {
//     setEditId(t._id);
//     setTalukaName(t.name);
//     setStateId(t.districtStateId?._id || "");
//     setShowModal(true);
//   };

//   const save = async () => {
//     if (!talukaName || !stateId) return;

//     const payload = { name: talukaName, districtStateId: stateId };

//     if (editId) {
//       await fetch(`/api/talukas/${editId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       showSuccess("Taluka updated successfully");
//     } else {
//       await fetch("/api/talukas", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       showSuccess("Taluka added successfully");
//     }

//     setShowModal(false);
//     fetchTalukas();
//   };

//   const deleteOne = async (id: string) => {
//     await fetch(`/api/talukas/${id}`, { method: "DELETE" });
//     showSuccess("Taluka deleted successfully");
//     fetchTalukas();
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-4 md:p-6 text-black">
//       {message && (
//         <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
//           {message}
//         </div>
//       )}

//       <h1 className="text-xl font-semibold mb-3">Taluka Management</h1>

//       {/* ACTION BAR */}
//       <div className="flex justify-between gap-3 mb-3">
//         <div className="flex gap-2 items-center">
//           <input type="checkbox" onChange={(e) => selectAll(e.target.checked)} />
//           <button
//             onClick={deleteSelected}
//             disabled={!talukas.some((t) => t.selected)}
//             className={`px-4 py-2 rounded text-white ${
//               talukas.some((t) => t.selected)
//                 ? "bg-red-600"
//                 : "bg-gray-400"
//             }`}
//           >
//             Delete Selected
//           </button>
//         </div>

//         <div className="flex gap-2">
//           <input
//             placeholder="Search Taluka"
//             className="border px-3 py-1 rounded"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             onClick={openAdd}
//             className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
//           >
//             <Plus size={16} /> Add Taluka
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded">
//         {loading ? (
//           <div className="p-6 text-center">Loading...</div>
//         ) : talukas.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">
//             No talukas found
//           </div>
//         ) : (
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="border px-3 py-2">✓</th>
//                 <th className="border px-3 py-2">Taluka</th>
//                 <th className="border px-3 py-2">State</th>
//                 <th className="border px-3 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {talukas.map((t) => (
//                 <tr key={t._id}>
//                   <td className="border px-3 py-2 text-center">
//                     <input
//                       type="checkbox"
//                       checked={!!t.selected}
//                       onChange={() => toggleSelect(t._id)}
//                     />
//                   </td>
//                   <td className="border px-3 py-2">{t.name}</td>
//                   <td className="border px-3 py-2">
//                     {t.districtStateId?.name || "-"}
//                   </td>
//                   <td className="border px-3 py-2 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() => openEdit(t)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
//                       >
//                         <Pencil size={12} /> Edit
//                       </button>
//                       <button
//                         onClick={() => deleteOne(t._id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded text-xs"
//                       >
//                         <Trash2 size={12} /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-sm rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editId ? "Edit Taluka" : "Add Taluka"}
//               </h2>
//               <button onClick={() => setShowModal(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             <select
//               className="border w-full p-2 rounded mb-3"
//               value={stateId}
//               onChange={(e) => setStateId(e.target.value)}
//             >
//               <option value="">Select State</option>
//               {states.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               className="border w-full p-2 rounded mb-4"
//               placeholder="Enter Taluka Name"
//               value={talukaName}
//               onChange={(e) => setTalukaName(e.target.value)}
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="border px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={save}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

/* ================= TYPES ================= */
interface District {
  _id: string;
  name: string;
  stateId: {
    _id: string;
    name: string;
  };
}

interface Taluka {
  _id: string;
  name: string;
  districtId: {
    _id: string;
    name: string;
    stateId: {
      _id: string;
      name: string;
    };
  };
  selected?: boolean;
}

/* ================= COMPONENT ================= */
export default function TalukaPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [talukaName, setTalukaName] = useState("");

  /* ================= FETCH DISTRICTS ================= */
  const fetchDistricts = async () => {
    try {
      const res = await fetch("/api/districts");
      const data = await res.json();
      setDistricts(Array.isArray(data.districts) ? data.districts : []);
    } catch {
      setDistricts([]);
    }
  };

  /* ================= FETCH TALUKAS ================= */
  const fetchTalukas = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (selectedDistrictId) query.append("districtId", selectedDistrictId);

      const res = await fetch(`/api/talukas?${query.toString()}`);
      const data = await res.json();

      setTalukas(
        Array.isArray(data.talukas)
          ? data.talukas.map((t: Taluka) => ({ ...t, selected: false }))
          : []
      );
    } catch {
      setTalukas([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchTalukas();
  }, [search, selectedDistrictId]);

  /* ================= HELPERS ================= */
  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  /* ================= SELECT ================= */
  const toggleSelect = (id: string) => {
    setTalukas((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, selected: !t.selected } : t
      )
    );
  };

  const selectAll = (checked: boolean) => {
    setTalukas((prev) =>
      prev.map((t) => ({ ...t, selected: checked }))
    );
  };

  /* ================= DELETE SELECTED ================= */
  const deleteSelected = async () => {
    const ids = talukas.filter(t => t.selected).map(t => t._id);
    if (ids.length === 0) return;

    await fetch("/api/talukas/delete-many", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    showSuccess("Selected talukas deleted");
    fetchTalukas();
  };

  /* ================= CRUD ================= */
  const openAdd = () => {
    setEditId(null);
    setTalukaName("");
    setSelectedDistrictId("");
    setShowModal(true);
  };

  const openEdit = (t: Taluka) => {
    setEditId(t._id);
    setTalukaName(t.name);
    setSelectedDistrictId(t.districtId._id);
    setShowModal(true);
  };

  const save = async () => {
    if (!talukaName || !selectedDistrictId) return;

    const payload = {
      name: talukaName,
      districtId: selectedDistrictId,
    };

    if (editId) {
      await fetch(`/api/talukas/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showSuccess("Taluka updated successfully");
    } else {
      await fetch("/api/talukas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showSuccess("Taluka added successfully");
    }

    setShowModal(false);
    fetchTalukas();
  };

  const deleteOne = async (id: string) => {
    await fetch(`/api/talukas/${id}`, { method: "DELETE" });
    showSuccess("Taluka deleted successfully");
    fetchTalukas();
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 md:p-6 text-black">

      {message && (
        <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
          {message}
        </div>
      )}

      <h1 className="text-xl font-semibold mb-3">Taluka Management</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-3">
        <select
          className="border p-2 rounded"
          value={selectedDistrictId}
          onChange={(e) => setSelectedDistrictId(e.target.value)}
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.stateId.name})
            </option>
          ))}
        </select>

        <input
          placeholder="Search Taluka"
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openAdd}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <Plus size={16} /> Add Taluka
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : talukas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No talukas found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2">✓</th>
                <th className="border px-3 py-2">Taluka</th>
                <th className="border px-3 py-2">District</th>
                <th className="border px-3 py-2">State</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {talukas.map(t => (
                <tr key={t._id}>
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!t.selected}
                      onChange={() => toggleSelect(t._id)}
                    />
                  </td>
                  <td className="border px-3 py-2">{t.name}</td>
                  <td className="border px-3 py-2">{t.districtId.name}</td>
                  <td className="border px-3 py-2">{t.districtId.stateId.name}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => deleteOne(t._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded p-4">
            <h2 className="font-semibold mb-3">
              {editId ? "Edit Taluka" : "Add Taluka"}
            </h2>

            <select
              className="border w-full p-2 rounded mb-3"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
            >
              <option value="">Select District</option>
              {districts.map(d => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.stateId.name})
                </option>
              ))}
            </select>

            <input
              className="border w-full p-2 rounded mb-4"
              placeholder="Enter Taluka Name"
              value={talukaName}
              onChange={(e) => setTalukaName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}










