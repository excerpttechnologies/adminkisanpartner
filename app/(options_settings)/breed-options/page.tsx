




// "use client";

// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus, X } from "lucide-react";

// interface Breed {
//   id: number;
//   name: string;
//   selected?: boolean;
// }

// export default function BreedOptionsPage() {
//   const [breeds, setBreeds] = useState<Breed[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [newBreedName, setNewBreedName] = useState("");
//   const [editBreedId, setEditBreedId] = useState<number | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [message, setMessage] = useState<string | null>(null);

//   /* ---------- INIT ---------- */
//   useEffect(() => {
//     setBreeds([
//       { id: 1, name: "Holstein" },
//       { id: 2, name: "Jersey" },
//       { id: 3, name: "Angus" },
//       { id: 4, name: "Hereford" },
//       { id: 5, name: "Brahman" },
//       { id: 6, name: "Guernsey" },
//       { id: 7, name: "Shorthorn" },
//     ]);
//   }, []);

//   /* ---------- SORT ---------- */
//   const toggleSort = () => {
//     setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
//   };

//   const sortedBreeds = [...breeds].sort((a, b) =>
//     sortOrder === "asc" ? a.id - b.id : b.id - a.id
//   );

//   /* ---------- SUCCESS ---------- */
//   const showSuccess = (text: string) => {
//     setMessage(text);
//     setTimeout(() => setMessage(null), 2500);
//   };

//   /* ---------- ADD ---------- */
//   const saveNewBreed = () => {
//     if (!newBreedName.trim()) return;

//     setBreeds((prev) => [
//       ...prev,
//       { id: Date.now(), name: newBreedName.trim() },
//     ]);

//     setShowAddModal(false);
//     setNewBreedName("");
//     showSuccess("Breed added successfully");
//   };

//   /* ---------- EDIT ---------- */
//   const openEditModal = (breed: Breed) => {
//     setEditBreedId(breed.id);
//     setNewBreedName(breed.name);
//     setShowEditModal(true);
//   };

//   const saveEditBreed = () => {
//     if (!newBreedName.trim() || editBreedId === null) return;

//     setBreeds((prev) =>
//       prev.map((b) =>
//         b.id === editBreedId ? { ...b, name: newBreedName.trim() } : b
//       )
//     );

//     setShowEditModal(false);
//     setEditBreedId(null);
//     setNewBreedName("");
//     showSuccess("Breed updated successfully");
//   };

//   /* ---------- DELETE ---------- */
//   const deleteBreed = (id: number) => {
//     setBreeds((prev) => prev.filter((b) => b.id !== id));
//     showSuccess("Breed deleted successfully");
//   };

//   const toggleSelect = (id: number) => {
//     setBreeds((prev) =>
//       prev.map((b) =>
//         b.id === id ? { ...b, selected: !b.selected } : b
//       )
//     );
//   };

//   const deleteSelected = () => {
//     setBreeds((prev) => prev.filter((b) => !b.selected));
//     showSuccess("Selected breeds deleted successfully");
//   };

//   /* ---------- EXPORT (FIXED) ---------- */
//   const exportRows = sortedBreeds.map((b) => ({
//     Sr: b.id,
//     Name: b.name,
//   }));

//   const downloadFile = (content: string, filename: string, type: string) => {
//     const blob = new Blob([content], { type });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const copyData = () => {
//     const text = [
//       "Sr\tBreed Option Name",
//       ...exportRows.map((r) => `${r.Sr}\t${r.Name}`),
//     ].join("\n");
//     navigator.clipboard.writeText(text);
//     showSuccess("Copied to clipboard");
//   };

//   const downloadCSV = () => {
//     const csv =
//       "Sr,Breed Option Name\n" +
//       exportRows.map((r) => `${r.Sr},"${r.Name}"`).join("\n");
//     downloadFile(csv, "breed-options.csv", "text/csv");
//   };

//   const downloadExcel = () => {
//     const header = "Sr\tBreed Option Name\n";
//     const rows = exportRows.map((r) => `${r.Sr}\t${r.Name}`).join("\n");
//     downloadFile(header + rows, "breed-options.xls", "application/vnd.ms-excel");
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-4 md:p-6 text-black">

//       {message && (
//         <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
//           {message}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold">Breed Options</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           <Plus size={16} /> Add New
//         </button>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-wrap gap-2 mb-3">
//         <button
//           onClick={deleteSelected}
//           disabled={!breeds.some((b) => b.selected)}
//           className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
//         >
//           Delete Selected
//         </button>

//         <button onClick={copyData} className="border px-3 py-1 rounded">Copy</button>
//         <button onClick={downloadExcel} className="border px-3 py-1 rounded">Excel</button>
//         <button onClick={downloadCSV} className="border px-3 py-1 rounded">CSV</button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="border px-3 py-2">✓</th>
//               <th onClick={toggleSort} className="border px-3 py-2 cursor-pointer">
//                 Sr {sortOrder === "asc" ? "▲" : "▼"}
//               </th>
//               <th className="border px-3 py-2">Breed Option Name</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedBreeds.map((b) => (
//               <tr key={b.id}>
//                 <td className="border px-3 py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={!!b.selected}
//                     onChange={() => toggleSelect(b.id)}
//                   />
//                 </td>
//                 <td className="border px-3 py-2">{b.id}</td>
//                 <td className="border px-3 py-2">{b.name}</td>
//                 <td className="border px-3 py-2 text-center">
//                   <div className="flex justify-center gap-3">
//                     <button onClick={() => openEditModal(b)}>
//                       <Pencil size={16} />
//                     </button>
//                     <button onClick={() => deleteBreed(b.id)} className="text-red-600">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {(showAddModal || showEditModal) && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-sm rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {showEditModal ? "Edit Breed" : "Add Breed"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setShowEditModal(false);
//                   setNewBreedName("");
//                 }}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <input
//               className="border w-full p-2 rounded mb-4"
//               placeholder="Enter Breed Name"
//               value={newBreedName}
//               onChange={(e) => setNewBreedName(e.target.value)}
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setShowEditModal(false);
//                 }}
//                 className="border px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={showEditModal ? saveEditBreed : saveNewBreed}
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
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Breed {
  id: number;
  name: string;
  selected?: boolean;
}

export default function BreedOptionsPage() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBreedName, setNewBreedName] = useState("");
  const [editBreedId, setEditBreedId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [message, setMessage] = useState<string | null>(null);

  /* ---------- INIT ---------- */
  useEffect(() => {
    setBreeds([
      { id: 1, name: "Holstein" },
      { id: 2, name: "Jersey" },
      { id: 3, name: "Angus" },
      { id: 4, name: "Hereford" },
      { id: 5, name: "Brahman" },
      { id: 6, name: "Guernsey" },
      { id: 7, name: "Shorthorn" },
    ]);
  }, []);

  /* ---------- SORT ---------- */
  const toggleSort = () => {
    setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
  };

  const sortedBreeds = [...breeds].sort((a, b) =>
    sortOrder === "asc" ? a.id - b.id : b.id - a.id
  );

  /* ---------- SUCCESS ---------- */
  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  /* ---------- ADD ---------- */
  const saveNewBreed = () => {
    if (!newBreedName.trim()) return;

    setBreeds((prev) => [
      ...prev,
      { id: Date.now(), name: newBreedName.trim() },
    ]);

    setShowAddModal(false);
    setNewBreedName("");
    showSuccess("Breed added successfully");
  };

  /* ---------- EDIT ---------- */
  const openEditModal = (breed: Breed) => {
    setEditBreedId(breed.id);
    setNewBreedName(breed.name);
    setShowEditModal(true);
  };

  const saveEditBreed = () => {
    if (!newBreedName.trim() || editBreedId === null) return;

    setBreeds((prev) =>
      prev.map((b) =>
        b.id === editBreedId ? { ...b, name: newBreedName.trim() } : b
      )
    );

    setShowEditModal(false);
    setEditBreedId(null);
    setNewBreedName("");
    showSuccess("Breed updated successfully");
  };

  /* ---------- DELETE ---------- */
  const deleteBreed = (id: number) => {
    setBreeds((prev) => prev.filter((b) => b.id !== id));
    showSuccess("Breed deleted successfully");
  };

  const toggleSelect = (id: number) => {
    setBreeds((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, selected: !b.selected } : b
      )
    );
  };

  const deleteSelected = () => {
    setBreeds((prev) => prev.filter((b) => !b.selected));
    showSuccess("Selected breeds deleted successfully");
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-4 md:p-6 text-black">
      {message && (
        <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Breed Options</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={deleteSelected}
          disabled={!breeds.some((b) => b.selected)}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Delete Selected
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2">✓</th>
              <th
                onClick={toggleSort}
                className="border px-3 py-2 cursor-pointer"
              >
                Sr {sortOrder === "asc" ? "▲" : "▼"}
              </th>
              <th className="border px-3 py-2">Breed Option Name</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBreeds.map((b) => (
              <tr key={b.id}>
                <td className="border px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={!!b.selected}
                    onChange={() => toggleSelect(b.id)}
                  />
                </td>
                <td className="border px-3 py-2">{b.id}</td>
                <td className="border px-3 py-2">{b.name}</td>
                <td className="border px-3 py-2 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(b)}>
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteBreed(b.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {sortedBreeds.map((b) => (
          <div
            key={b.id}
            className="bg-white border rounded-lg p-3 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Sr: {b.id}</span>
              <input
                type="checkbox"
                checked={!!b.selected}
                onChange={() => toggleSelect(b.id)}
              />
            </div>

            <p className="text-sm mb-2">
              <span className="font-medium">Breed:</span> {b.name}
            </p>

            <div className="flex gap-4">
              <button onClick={() => openEditModal(b)}>
                <Pencil size={16} />
              </button>
              <button
                onClick={() => deleteBreed(b.id)}
                className="text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded p-4">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">
                {showEditModal ? "Edit Breed" : "Add Breed"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setNewBreedName("");
                }}
              >
                <X size={18} />
              </button>
            </div>

            <input
              className="border w-full p-2 rounded mb-4"
              placeholder="Enter Breed Name"
              value={newBreedName}
              onChange={(e) => setNewBreedName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? saveEditBreed : saveNewBreed}
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
