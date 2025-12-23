
// "use client";

// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus, X } from "lucide-react";

// interface Slider {
//   id: number;
//   image: string; // local preview URL
//   order: number;
//   screen: string;
// }

// const SCREENS = [
//   "Home Page",
//   "Category Page",
//   "Farmers Page",
//   "Products Page",
// ];

// export default function SlidersPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<Slider | null>(null);

//   const [form, setForm] = useState<{
//     image: string;
//     order: number;
//     screen: string;
//   }>({
//     image: "",
//     order: 1,
//     screen: "Home Page",
//   });

//   /* ---------------- INITIAL DATA ---------------- */
//   useEffect(() => {
//     setSliders([
//       {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
//         order: 1,
//         screen: "Home Page",
//       },
//     ]);
//   }, []);

//   /* ---------------- FILE UPLOAD ---------------- */
//   const handleImageUpload = (file: File) => {
//     const previewUrl = URL.createObjectURL(file);
//     setForm((prev) => ({ ...prev, image: previewUrl }));
//   };

//   /* ---------------- ADD / EDIT ---------------- */
//   const openAdd = () => {
//     setEditing(null);
//     setForm({
//       image: "",
//       order: sliders.length + 1,
//       screen: "Home Page",
//     });
//     setOpen(true);
//   };

//   const openEdit = (slider: Slider) => {
//     setEditing(slider);
//     setForm({
//       image: slider.image,
//       order: slider.order,
//       screen: slider.screen,
//     });
//     setOpen(true);
//   };

//   const saveSlider = () => {
//     if (!form.image) {
//       alert("Please upload an image");
//       return;
//     }

//     if (editing) {
//       setSliders((prev) =>
//         prev.map((s) =>
//           s.id === editing.id ? { ...s, ...form } : s
//         )
//       );
//     } else {
//       setSliders((prev) => [
//         ...prev,
//         { id: Date.now(), ...form },
//       ]);
//     }

//     setOpen(false);
//   };

//   const deleteSlider = (id: number) => {
//     if (confirm("Delete this slider?")) {
//       setSliders((prev) => prev.filter((s) => s.id !== id));
//     }
//   };

//   /* ---------------- EXPORTS ---------------- */
//   const exportData = sliders.map((s, i) => ({
//     Sr: i + 1,
//     Order: s.order,
//     Screen: s.screen,
//   }));

//   const copyData = () => {
//     navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
//     alert("Copied");
//   };

//   const downloadCSV = () => {
//     const csv =
//       "Sr,Order,Screen\n" +
//       exportData.map((r) => `${r.Sr},${r.Order},${r.Screen}`).join("\n");

//     download(csv, "sliders.csv", "text/csv");
//   };

//   const downloadExcel = () => {
//     download(JSON.stringify(exportData), "sliders.xls", "application/vnd.ms-excel");
//   };

//   const downloadPDF = () => {
//     const w = window.open("");
//     if (!w) return;
//     w.document.write(`<pre>${JSON.stringify(exportData, null, 2)}</pre>`);
//     w.print();
//   };

//   const download = (content: string, name: string, type: string) => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([content], { type }));
//     a.download = name;
//     a.click();
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="p-4 md:p-6 text-black">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-3">
//         <h1 className="text-xl font-semibold">Sliders</h1>
//         <button
//           onClick={openAdd}
//           className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           <Plus size={16} /> Add New
//         </button>
//       </div>

//       {/* EXPORT */}
//       <div className="flex gap-2 mb-4">
//         <button onClick={copyData} className="border px-3 py-1 rounded">Copy</button>
//         <button onClick={downloadExcel} className="border px-3 py-1 rounded">Excel</button>
//         <button onClick={downloadCSV} className="border px-3 py-1 rounded">CSV</button>
//         <button onClick={downloadPDF} className="border px-3 py-1 rounded">PDF</button>
//       </div>

//       {/* TABLE */}
//       <div className="hidden md:block bg-white  rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">Sr</th>
//               <th className="border px-3 py-2">Image</th>
//               <th className="border px-3 py-2">Order</th>
//               <th className="border px-3 py-2">Screen</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sliders.map((s, i) => (
//               <tr key={s.id}>
//                 <td className="border px-3 py-2">{i + 1}</td>
//                 <td className="border px-3 py-2">
//                   <img src={s.image} className="w-24 h-14 object-cover rounded" />
//                 </td>
//                 <td className="border px-3 py-2">{s.order}</td>
//                 <td className="border px-3 py-2">{s.screen}</td>
//                 <td className="border px-3 py-2 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button onClick={() => openEdit(s)} className="text-green-600">
//                       <Pencil size={16} />
//                     </button>
//                     <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE CARDS */}
//       <div className="md:hidden space-y-4">
//         {sliders.map((s) => (
//           <div key={s.id} className="bg-white border rounded p-3">
//             <img src={s.image} className="w-full h-40 object-cover rounded mb-2" />
//             <p><b>Order:</b> {s.order}</p>
//             <p><b>Screen:</b> {s.screen}</p>
//             <div className="flex gap-2 mt-2">
//               <button onClick={() => openEdit(s)} className="text-green-600">
//                 <Pencil size={16} />
//               </button>
//               <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editing ? "Edit Slider" : "Add Slider"}
//               </h2>
//               <button onClick={() => setOpen(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             {/* FILE INPUT */}
//             <input 
//               type="file"
//               accept="image/*"
//               className="mb-3"
//               onChange={(e) =>
//                 e.target.files && handleImageUpload(e.target.files[0])
              
//             }
//             />

//             {form.image && (
//               <img
//                 src={form.image}
//                 className="w-full h-40 object-cover rounded mb-3"
//               />
//             )}

//             <input
//               type="number"
//               className="border w-full p-2 mb-2"
//               value={form.order}
//               onChange={(e) => setForm({ ...form, order: +e.target.value })}
//             />

//             <select
//               className="border w-full p-2 mb-3"
//               value={form.screen}
//               onChange={(e) => setForm({ ...form, screen: e.target.value })}
//             >
//               {SCREENS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>

//             <button
//               onClick={saveSlider}
//               className="w-full bg-green-500 text-white py-2 rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










// "use client";

// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus, X } from "lucide-react";

// interface Slider {
//   id: number;
//   image: string;
//   order: number;
//   screen: string;
// }

// const SCREENS = [
//   "Home Page",
//   "Category Page",
//   "Farmers Page",
//   "Products Page",
// ];

// export default function SlidersPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<Slider | null>(null);

//   const [form, setForm] = useState({
//     image: "",
//     order: 1,
//     screen: "Home Page",
//   });

//   /* ---------- INIT ---------- */
//   useEffect(() => {
//     setSliders([
//       {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
//         order: 1,
//         screen: "Home Page",
//       },
//     ]);
//   }, []);

//   /* ---------- IMAGE UPLOAD ---------- */
//   const handleImageUpload = (file: File) => {
//     const preview = URL.createObjectURL(file);
//     setForm((prev) => ({ ...prev, image: preview }));
//   };

//   /* ---------- ADD / EDIT ---------- */
//   const openAdd = () => {
//     setEditing(null);
//     setForm({
//       image: "",
//       order: sliders.length + 1,
//       screen: "Home Page",
//     });
//     setOpen(true);
//   };

//   const openEdit = (slider: Slider) => {
//     setEditing(slider);
//     setForm({
//       image: slider.image,
//       order: slider.order,
//       screen: slider.screen,
//     });
//     setOpen(true);
//   };

//   const saveSlider = () => {
//     if (!form.image) {
//       alert("Please choose an image");
//       return;
//     }

//     if (editing) {
//       setSliders((prev) =>
//         prev.map((s) =>
//           s.id === editing.id ? { ...s, ...form } : s
//         )
//       );
//     } else {
//       setSliders((prev) => [
//         ...prev,
//         { id: Date.now(), ...form },
//       ]);
//     }

//     setOpen(false);
//   };

//   const deleteSlider = (id: number) => {
//     if (confirm("Delete this slider?")) {
//       setSliders((prev) => prev.filter((s) => s.id !== id));
//     }
//   };

//   /* ---------- EXPORT ---------- */
//   const data = sliders.map((s, i) => ({
//     Sr: i + 1,
//     Order: s.order,
//     Screen: s.screen,
//   }));

//   const download = (content: string, name: string, type: string) => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([content], { type }));
//     a.download = name;
//     a.click();
//   };

//   const copyData = () =>
//     navigator.clipboard.writeText(JSON.stringify(data, null, 2));

//   const downloadCSV = () =>
//     download(
//       "Sr,Order,Screen\n" +
//         data.map((r) => `${r.Sr},${r.Order},${r.Screen}`).join("\n"),
//       "sliders.csv",
//       "text/csv"
//     );

//   const downloadExcel = () =>
//     download(JSON.stringify(data), "sliders.xls", "application/vnd.ms-excel");

//   const downloadPDF = () => {
//     const w = window.open("");
//     if (!w) return;
//     w.document.write(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
//     w.print();
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-4 md:p-6 text-black">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h1 className="text-xl font-semibold">Sliders</h1>
//         <button
//           onClick={openAdd}
//           className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           <Plus size={16} /> Add New
//         </button>
//       </div>

//       {/* Export buttons */}
//       <div className="flex gap-2 mb-4">
//         <button onClick={copyData} className="border px-3 py-1 rounded">Copy</button>
//         <button onClick={downloadExcel} className="border px-3 py-1 rounded">Excel</button>
//         <button onClick={downloadCSV} className="border px-3 py-1 rounded">CSV</button>
//         <button onClick={downloadPDF} className="border px-3 py-1 rounded">PDF</button>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block bg-white  rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">Sr</th>
//               <th className="border px-3 py-2">Image</th>
//               <th className="border px-3 py-2">Order</th>
//               <th className="border px-3 py-2">Screen</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sliders.map((s, i) => (
//               <tr key={s.id}>
//                 <td className="border px-3 py-2">{i + 1}</td>
//                 <td className="border px-3 py-2">
//                   <img src={s.image} className="w-24 h-14 object-cover rounded" />
//                 </td>
//                 <td className="border px-3 py-2">{s.order}</td>
//                 <td className="border px-3 py-2">{s.screen}</td>
//                 <td className="border px-3 py-2 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button onClick={() => openEdit(s)} className="text-green-600">
//                       <Pencil size={16} />
//                     </button>
//                     <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="md:hidden space-y-4">
//         {sliders.map((s) => (
//           <div key={s.id} className="bg-white border rounded p-3">
//             <img src={s.image} className="w-full h-40 object-cover rounded mb-2" />
//             <p><b>Order:</b> {s.order}</p>
//             <p><b>Screen:</b> {s.screen}</p>
//             <div className="flex gap-2 mt-2">
//               <button onClick={() => openEdit(s)} className="text-green-600">
//                 <Pencil size={16} />
//               </button>
//               <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editing ? "Edit Slider" : "Add Slider"}
//               </h2>
//               <button onClick={() => setOpen(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Styled File Upload */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Slider Image
//               </label>

//               <div className="flex items-center gap-3 border border-gray-300 rounded px-3 py-2">
//                 <label
//                   htmlFor="sliderImage"
//                   className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded border"
//                 >
//                   Choose File
//                 </label>

//                 <span className="text-sm text-gray-500 truncate">
//                   {form.image ? "Image selected" : "No file chosen"}
//                 </span>

//                 <input
//                   id="sliderImage"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     e.target.files && handleImageUpload(e.target.files[0])
//                   }
//                 />
//               </div>
//             </div>

//             {form.image && (
//               <img
//                 src={form.image}
//                 className="w-full h-40 object-cover rounded mb-3"
//               />
//             )}

//             <input
//               type="number"
//               className="border w-full p-2 mb-2"
//               value={form.order}
//               onChange={(e) => setForm({ ...form, order: +e.target.value })}
//             />

//             <select
//               className="border w-full p-2 mb-3"
//               value={form.screen}
//               onChange={(e) => setForm({ ...form, screen: e.target.value })}
//             >
//               {SCREENS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>

//             <button
//               onClick={saveSlider}
//               className="w-full bg-green-500 text-white py-2 rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus, X } from "lucide-react";

// interface Slider {
//   id: number;
//   image: string;
//   order: number;
//   screen: string;
// }

// const SCREENS = [
//   "Farmer Home Page",
//   "Agent Home Page",
//   "Category Page",
//   "Products Page",
// ];

// export default function SlidersPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<Slider | null>(null);

//   const [form, setForm] = useState({
//     image: "",
//     order: 1,
//     screen: "Farmer Home Page",
//   });

//   /* ---------- INIT DATA ---------- */
//   useEffect(() => {
//     setSliders([
//       {
//         id: 1,
//         image: "/apple.png",
//         order: 1,
//         screen: "Farmer Home Page",
//       },
//       {
//         id: 2,
//         image: "/logo.png",
//         order: 2,
//         screen: "Agent Home Page",
//       },
//     ]);
//   }, []);

//   /* ---------- IMAGE UPLOAD ---------- */
//   const handleImageUpload = (file: File) => {
//     const preview = URL.createObjectURL(file);
//     setForm((prev) => ({ ...prev, image: preview }));
//   };

//   /* ---------- ADD / EDIT ---------- */
//   const openAdd = () => {
//     setEditing(null);
//     setForm({
//       image: "",
//       order: sliders.length + 1,
//       screen: "Farmer Home Page",
//     });
//     setOpen(true);
//   };

//   const openEdit = (slider: Slider) => {
//     setEditing(slider);
//     setForm({
//       image: slider.image,
//       order: slider.order,
//       screen: slider.screen,
//     });
//     setOpen(true);
//   };

//   const saveSlider = () => {
//     if (!form.image) {
//       alert("Please choose an image");
//       return;
//     }

//     if (editing) {
//       setSliders((prev) =>
//         prev.map((s) =>
//           s.id === editing.id ? { ...s, ...form } : s
//         )
//       );
//     } else {
//       setSliders((prev) => [
//         ...prev,
//         { id: Date.now(), ...form },
//       ]);
//     }

//     setOpen(false);
//   };

//   const deleteSlider = (id: number) => {
//     if (confirm("Delete this slider?")) {
//       setSliders((prev) => prev.filter((s) => s.id !== id));
//     }
//   };

//   /* ---------- DOWNLOAD FUNCTIONS ---------- */
//   const downloadPDF = () => {
//     const w = window.open("", "_blank");
//     if (!w) return;

//     const rows = sliders
//       .map(
//         (s, i) => `
//         <tr>
//           <td>${i + 1}</td>
//           <td>-</td>
//           <td>${s.order}</td>
//           <td>${s.screen}</td>
//           <td>Edit | Delete</td>
//         </tr>
//       `
//       )
//       .join("");

//     w.document.write(`
//       <html>
//         <head>
//           <title>Slider</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 40px;
//             }
//             h2 {
//               text-align: center;
//               margin-bottom: 20px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//             }
//             th, td {
//               border: 1px solid #000;
//               padding: 8px;
//               font-size: 14px;
//               text-align: left;
//             }
//             th {
//               background: #1f4e79;
//               color: white;
//             }
//           </style>
//         </head>
//         <body>
//           <h2>Slider</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Sr.</th>
//                 <th>Image</th>
//                 <th>Sort Order</th>
//                 <th>Display Screen</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `);

//     w.document.close();
//     w.focus();
//     w.print();
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-4 md:p-6 text-black">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h1 className="text-xl font-semibold">Sliders</h1>
//         <button
//           onClick={openAdd}
//           className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           <Plus size={16} /> Add New
//         </button>
//       </div>

//       {/* Export Buttons */}
//       <div className="flex gap-2 mb-4">
//         <button className="border px-3 py-1 rounded">Copy</button>
//         <button className="border px-3 py-1 rounded">Excel</button>
//         <button className="border px-3 py-1 rounded">CSV</button>
//         <button
//           onClick={downloadPDF}
//           className="border px-3 py-1 rounded"
//         >
//           PDF
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white  rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">Sr</th>
//               <th className="border px-3 py-2">Image</th>
//               <th className="border px-3 py-2">Order</th>
//               <th className="border px-3 py-2">Screen</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sliders.map((s, i) => (
//               <tr key={s.id}>
//                 <td className="border px-3 py-2">{i + 1}</td>
//                 <td className="border px-3 py-2">
//                   <img
//                     src={s.image}
//                     className="w-16 h-16 object-contain"
//                   />
//                 </td>
//                 <td className="border px-3 py-2">{s.order}</td>
//                 <td className="border px-3 py-2">{s.screen}</td>
//                 <td className="border px-3 py-2 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => openEdit(s)}
//                       className="text-green-600"
//                     >
//                       <Pencil size={16} />
//                     </button>
//                     <button
//                       onClick={() => deleteSlider(s.id)}
//                       className="text-red-600"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editing ? "Edit Slider" : "Add Slider"}
//               </h2>
//               <button onClick={() => setOpen(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Styled File Upload */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Slider Image
//               </label>

//               <div className="flex items-center gap-3 border rounded px-3 py-2">
//                 <label
//                   htmlFor="sliderImage"
//                   className="cursor-pointer bg-gray-100 px-4 py-2 rounded border"
//                 >
//                   Choose File
//                 </label>

//                 <span className="text-sm text-gray-500">
//                   {form.image ? "Image selected" : "No file chosen"}
//                 </span>

//                 <input
//                   id="sliderImage"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     e.target.files && handleImageUpload(e.target.files[0])
//                   }
//                 />
//               </div>
//             </div>

//             {form.image && (
//               <img
//                 src={form.image}
//                 className="w-full h-40 object-cover rounded mb-3"
//               />
//             )}

//             <input
//               type="number"
//               className="border w-full p-2 mb-2"
//               value={form.order}
//               onChange={(e) =>
//                 setForm({ ...form, order: +e.target.value })
//               }
//             />

//             <select
//               className="border w-full p-2 mb-3"
//               value={form.screen}
//               onChange={(e) =>
//                 setForm({ ...form, screen: e.target.value })
//               }
//             >
//               {SCREENS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>

//             <button
//               onClick={saveSlider}
//               className="w-full bg-green-500 text-white py-2 rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus, X } from "lucide-react";

// interface Slider {
//   id: number;
//   image: string;
//   order: number;
//   screen: string;
// }

// const SCREENS = [
//   "Farmer Home Page",
//   "Agent Home Page",
//   "Category Page",
//   "Products Page",
// ];

// export default function SlidersPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<Slider | null>(null);

//   const [form, setForm] = useState({
//     image: "",
//     order: 1,
//     screen: "Farmer Home Page",
//   });

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {
//     setSliders([
//       {
//         id: 1,
//         image: "/apple.png",
//         order: 1,
//         screen: "Farmer Home Page",
//       },
//       {
//         id: 2,
//         image: "/logo.png",
//         order: 2,
//         screen: "Agent Home Page",
//       },
//     ]);
//   }, []);

//   /* ---------------- IMAGE UPLOAD ---------------- */
//   const handleImageUpload = (file: File) => {
//     const preview = URL.createObjectURL(file);
//     setForm((prev) => ({ ...prev, image: preview }));
//   };

//   /* ---------------- ADD / EDIT ---------------- */
//   const openAdd = () => {
//     setEditing(null);
//     setForm({
//       image: "",
//       order: sliders.length + 1,
//       screen: "Farmer Home Page",
//     });
//     setOpen(true);
//   };

//   const openEdit = (slider: Slider) => {
//     setEditing(slider);
//     setForm({
//       image: slider.image,
//       order: slider.order,
//       screen: slider.screen,
//     });
//     setOpen(true);
//   };

//   const saveSlider = () => {
//     if (!form.image) {
//       alert("Please choose an image");
//       return;
//     }

//     if (editing) {
//       setSliders((prev) =>
//         prev.map((s) =>
//           s.id === editing.id ? { ...s, ...form } : s
//         )
//       );
//     } else {
//       setSliders((prev) => [
//         ...prev,
//         { id: Date.now(), ...form },
//       ]);
//     }

//     setOpen(false);
//   };

//   const deleteSlider = (id: number) => {
//     if (confirm("Delete this slider?")) {
//       setSliders((prev) => prev.filter((s) => s.id !== id));
//     }
//   };

//   /* ---------------- EXPORT DATA ---------------- */
//   const exportRows = sliders.map((s, i) => ({
//     Sr: i + 1,
//     Order: s.order,
//     Screen: s.screen,
//   }));

//   /* -------- COPY (WORKING) -------- */
//   const copyData = () => {
//     const text = [
//       "Sr\tSort Order\tDisplay Screen",
//       ...exportRows.map(
//         (r) => `${r.Sr}\t${r.Order}\t${r.Screen}`
//       ),
//     ].join("\n");

//     navigator.clipboard.writeText(text);
//     alert("Copied to clipboard");
//   };

//   /* -------- CSV (WORKING) -------- */
//   const downloadCSV = () => {
//     const csv =
//       "Sr,Sort Order,Display Screen\n" +
//       exportRows
//         .map((r) => `${r.Sr},${r.Order},"${r.Screen}"`)
//         .join("\n");

//     downloadFile(csv, "sliders.csv", "text/csv");
//   };

//   /* -------- EXCEL (WORKING) -------- */
//   const downloadExcel = () => {
//     const header = "Sr\tSort Order\tDisplay Screen\n";
//     const rows = exportRows
//       .map((r) => `${r.Sr}\t${r.Order}\t${r.Screen}`)
//       .join("\n");

//     downloadFile(header + rows, "sliders.xls", "application/vnd.ms-excel");
//   };

//   /* -------- PDF (ALREADY FIXED) -------- */
//   const downloadPDF = () => {
//     const w = window.open("", "_blank");
//     if (!w) return;

//     const rows = sliders
//       .map(
//         (s, i) => `
//         <tr>
//           <td>${i + 1}</td>
//           <td>-</td>
//           <td>${s.order}</td>
//           <td>${s.screen}</td>
//           <td>Edit | Delete</td>
//         </tr>
//       `
//       )
//       .join("");

//     w.document.write(`
//       <html>
//         <head>
//           <title>Slider</title>
//           <style>
//             body { font-family: Arial; padding: 40px; }
//             h2 { text-align: center; margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td {
//               border: 1px solid #000;
//               padding: 8px;
//               font-size: 14px;
//             }
//             th { background: #1f4e79; color: white; }
//           </style>
//         </head>
//         <body>
//           <h2>Slider</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Sr.</th>
//                 <th>Image</th>
//                 <th>Sort Order</th>
//                 <th>Display Screen</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `);

//     w.document.close();
//     w.focus();
//     w.print();
//   };

//   /* -------- HELPER -------- */
//   const downloadFile = (content: string, filename: string, type: string) => {
//     const blob = new Blob([content], { type });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="p-6 text-black">
//       <div className="flex justify-between items-center mb-3">
//         <h1 className="text-xl font-semibold">Sliders</h1>
//         <button
//           onClick={openAdd}
//           className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           <Plus size={16} /> Add New
//         </button>
//       </div>

//       <div className="flex gap-2 mb-4">
//         <button onClick={copyData} className="border px-3 py-1 rounded">
//           Copy
//         </button>
//         <button onClick={downloadExcel} className="border px-3 py-1 rounded">
//           Excel
//         </button>
//         <button onClick={downloadCSV} className="border px-3 py-1 rounded">
//           CSV
//         </button>
//         <button onClick={downloadPDF} className="border px-3 py-1 rounded">
//           PDF
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white  rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">Sr</th>
//               <th className="border px-3 py-2">Image</th>
//               <th className="border px-3 py-2">Order</th>
//               <th className="border px-3 py-2">Screen</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sliders.map((s, i) => (
//               <tr key={s.id}>
//                 <td className="border px-3 py-2">{i + 1}</td>
//                 <td className="border px-3 py-2">
//                   <img src={s.image} className="w-16 h-16 object-contain" />
//                 </td>
//                 <td className="border px-3 py-2">{s.order}</td>
//                 <td className="border px-3 py-2">{s.screen}</td>
//                 <td className="border px-3 py-2 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button onClick={() => openEdit(s)} className="text-green-600">
//                       <Pencil size={16} />
//                     </button>
//                     <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL (unchanged) */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editing ? "Edit Slider" : "Add Slider"}
//               </h2>
//               <button onClick={() => setOpen(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Slider Image
//               </label>
//               <div className="flex items-center gap-3 border rounded px-3 py-2">
//                 <label
//                   htmlFor="sliderImage"
//                   className="cursor-pointer bg-gray-100 px-4 py-2 rounded border"
//                 >
//                   Choose File
//                 </label>
//                 <span className="text-sm text-gray-500">
//                   {form.image ? "Image selected" : "No file chosen"}
//                 </span>
//                 <input
//                   id="sliderImage"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     e.target.files && handleImageUpload(e.target.files[0])
//                   }
//                 />
//               </div>
//             </div>

//             {form.image && (
//               <img
//                 src={form.image}
//                 className="w-full h-40 object-cover rounded mb-3"
//               />
//             )}

//             <input
//               type="number"
//               className="border w-full p-2 mb-2"
//               value={form.order}
//               onChange={(e) =>
//                 setForm({ ...form, order: +e.target.value })
//               }
//             />

//             <select
//               className="border w-full p-2 mb-3"
//               value={form.screen}
//               onChange={(e) =>
//                 setForm({ ...form, screen: e.target.value })
//               }
//             >
//               {SCREENS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>

//             <button
//               onClick={saveSlider}
//               className="w-full bg-green-500 text-white py-2 rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus, X } from "lucide-react";

// interface Slider {
//   id: number;
//   image: string;
//   order: number;
//   screen: string;
// }

// const SCREENS = [
//   "Farmer Home Page",
//   "Agent Home Page",
//   "Category Page",
//   "Products Page",
// ];

// export default function SlidersPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<Slider | null>(null);

//   const [form, setForm] = useState({
//     image: "",
//     order: 1,
//     screen: "Farmer Home Page",
//   });

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {
//     setSliders([
//       {
//         id: 1,
//         image: "/apple.png",
//         order: 1,
//         screen: "Farmer Home Page",
//       },
//       {
//         id: 2,
//         image: "/logo.png",
//         order: 2,
//         screen: "Agent Home Page",
//       },
//     ]);
//   }, []);

//   /* ---------------- IMAGE UPLOAD ---------------- */
//   const handleImageUpload = (file: File) => {
//     const preview = URL.createObjectURL(file);
//     setForm((prev) => ({ ...prev, image: preview }));
//   };

//   /* ---------------- ADD / EDIT ---------------- */
//   const openAdd = () => {
//     setEditing(null);
//     setForm({
//       image: "",
//       order: sliders.length + 1,
//       screen: "Farmer Home Page",
//     });
//     setOpen(true);
//   };

//   const openEdit = (slider: Slider) => {
//     setEditing(slider);
//     setForm({
//       image: slider.image,
//       order: slider.order,
//       screen: slider.screen,
//     });
//     setOpen(true);
//   };

//   const saveSlider = () => {
//     if (!form.image) {
//       alert("Please choose an image");
//       return;
//     }

//     if (editing) {
//       setSliders((prev) =>
//         prev.map((s) =>
//           s.id === editing.id ? { ...s, ...form } : s
//         )
//       );
//     } else {
//       setSliders((prev) => [
//         ...prev,
//         { id: Date.now(), ...form },
//       ]);
//     }

//     setOpen(false);
//   };

//   const deleteSlider = (id: number) => {
//     if (confirm("Delete this slider?")) {
//       setSliders((prev) => prev.filter((s) => s.id !== id));
//     }
//   };

//   /* ---------------- EXPORT HELPERS (UNCHANGED) ---------------- */
//   const exportRows = sliders.map((s, i) => ({
//     Sr: i + 1,
//     Order: s.order,
//     Screen: s.screen,
//   }));

//   const copyData = () => {
//     const text = [
//       "Sr\tSort Order\tDisplay Screen",
//       ...exportRows.map(
//         (r) => `${r.Sr}\t${r.Order}\t${r.Screen}`
//       ),
//     ].join("\n");

//     navigator.clipboard.writeText(text);
//     alert("Copied to clipboard");
//   };

//   const downloadCSV = () => {
//     const csv =
//       "Sr,Sort Order,Display Screen\n" +
//       exportRows
//         .map((r) => `${r.Sr},${r.Order},"${r.Screen}"`)
//         .join("\n");

//     downloadFile(csv, "sliders.csv", "text/csv");
//   };

//   const downloadExcel = () => {
//     const header = "Sr\tSort Order\tDisplay Screen\n";
//     const rows = exportRows
//       .map((r) => `${r.Sr}\t${r.Order}\t${r.Screen}`)
//       .join("\n");

//     downloadFile(header + rows, "sliders.xls", "application/vnd.ms-excel");
//   };

//   const downloadPDF = () => {
//     const w = window.open("", "_blank");
//     if (!w) return;

//     const rows = sliders
//       .map(
//         (s, i) => `
//         <tr>
//           <td>${i + 1}</td>
//           <td>-</td>
//           <td>${s.order}</td>
//           <td>${s.screen}</td>
//           <td>Edit | Delete</td>
//         </tr>
//       `
//       )
//       .join("");

//     w.document.write(`
//       <html>
//         <head>
//           <title>Slider</title>
//           <style>
//             body { font-family: Arial; padding: 40px; }
//             h2 { text-align: center; margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #000; padding: 8px; }
//             th { background: #1f4e79; color: white; }
//           </style>
//         </head>
//         <body>
//           <h2>Slider</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Sr.</th>
//                 <th>Image</th>
//                 <th>Sort Order</th>
//                 <th>Display Screen</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>${rows}</tbody>
//           </table>
//         </body>
//       </html>
//     `);

//     w.document.close();
//     w.focus();
//     w.print();
//   };

//   const downloadFile = (content: string, filename: string, type: string) => {
//     const blob = new Blob([content], { type });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="p-4 md:p-6 text-black">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h1 className="text-xl font-semibold">Sliders</h1>
//         <button
//           onClick={openAdd}
//           className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           <Plus size={16} /> Add New
//         </button>
//       </div>

//       {/* Export buttons */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button onClick={copyData} className="border px-3 py-1 rounded">Copy</button>
//         <button onClick={downloadExcel} className="border px-3 py-1 rounded">Excel</button>
//         <button onClick={downloadCSV} className="border px-3 py-1 rounded">CSV</button>
//         <button onClick={downloadPDF} className="border px-3 py-1 rounded">PDF</button>
//       </div>

//       {/* ================= DESKTOP TABLE ================= */}
//       <div className="hidden md:block bg-white rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">Sr</th>
//               <th className="border px-3 py-2">Image</th>
//               <th className="border px-3 py-2">Order</th>
//               <th className="border px-3 py-2">Screen</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sliders.map((s, i) => (
//               <tr key={s.id}>
//                 <td className="border px-3 py-2">{i + 1}</td>
//                 <td className="border px-3 py-2">
//                   <img src={s.image} className="w-16 h-16 object-contain" />
//                 </td>
//                 <td className="border px-3 py-2">{s.order}</td>
//                 <td className="border px-3 py-2">{s.screen}</td>
//                 <td className="border px-3 py-2 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button onClick={() => openEdit(s)} className="text-green-600">
//                       <Pencil size={16} />
//                     </button>
//                     <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= MOBILE CARDS ================= */}
//       <div className="md:hidden space-y-4">
//         {sliders.map((s, i) => (
//           <div key={s.id} className="bg-white border rounded p-4">
//             <div className="flex justify-between mb-2">
//               <span className="font-semibold">#{i + 1}</span>
//               <div className="flex gap-2">
//                 <button onClick={() => openEdit(s)} className="text-green-600">
//                   <Pencil size={16} />
//                 </button>
//                 <button onClick={() => deleteSlider(s.id)} className="text-red-600">
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>

//             <img
//               src={s.image}
//               className="w-full h-40 object-contain mb-3"
//             />

//             <p className="text-sm">
//               <span className="font-medium">Order:</span> {s.order}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium">Screen:</span> {s.screen}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* ================= MODAL (UNCHANGED) ================= */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editing ? "Edit Slider" : "Add Slider"}
//               </h2>
//               <button onClick={() => setOpen(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Slider Image
//               </label>
//               <div className="flex items-center gap-3 border rounded px-3 py-2">
//                 <label
//                   htmlFor="sliderImage"
//                   className="cursor-pointer bg-gray-100 px-4 py-2 rounded border"
//                 >
//                   Choose File
//                 </label>
//                 <span className="text-sm text-gray-500">
//                   {form.image ? "Image selected" : "No file chosen"}
//                 </span>
//                 <input
//                   id="sliderImage"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     e.target.files && handleImageUpload(e.target.files[0])
//                   }
//                 />
//               </div>
//             </div>

//             {form.image && (
//               <img
//                 src={form.image}
//                 className="w-full h-40 object-cover rounded mb-3"
//               />
//             )}

//             <input
//               type="number"
//               className="border w-full p-2 mb-2"
//               value={form.order}
//               onChange={(e) =>
//                 setForm({ ...form, order: +e.target.value })
//               }
//             />

//             <select
//               className="border w-full p-2 mb-3"
//               value={form.screen}
//               onChange={(e) =>
//                 setForm({ ...form, screen: e.target.value })
//               }
//             >
//               {SCREENS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>

//             <button
//               onClick={saveSlider}
//               className="w-full bg-green-500 text-white py-2 rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Slider {
  id: number;
  image: string;
  order: number;
  screen: string;
}

const SCREENS = [
  "Farmer Home Page",
  "Agent Home Page",
  "Category Page",
  "Products Page",
];

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Slider | null>(null);

  const [form, setForm] = useState({
    image: "",
    order: 1,
    screen: "Farmer Home Page",
  });

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    setSliders([
      {
        id: 1,
        image: "/apple.png",
        order: 1,
        screen: "Farmer Home Page",
      },
      {
        id: 2,
        image: "/logo.png",
        order: 2,
        screen: "Agent Home Page",
      },
    ]);
  }, []);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: preview }));
  };

  /* ---------------- ADD / EDIT ---------------- */
  const openAdd = () => {
    setEditing(null);
    setForm({
      image: "",
      order: sliders.length + 1,
      screen: "Farmer Home Page",
    });
    setOpen(true);
  };

  const openEdit = (slider: Slider) => {
    setEditing(slider);
    setForm({
      image: slider.image,
      order: slider.order,
      screen: slider.screen,
    });
    setOpen(true);
  };

  const saveSlider = () => {
    if (!form.image) {
      alert("Please choose an image");
      return;
    }

    if (editing) {
      setSliders((prev) =>
        prev.map((s) =>
          s.id === editing.id ? { ...s, ...form } : s
        )
      );
    } else {
      setSliders((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setOpen(false);
  };

  const deleteSlider = (id: number) => {
    if (confirm("Delete this slider?")) {
      setSliders((prev) => prev.filter((s) => s.id !== id));
    }
  };

  /* ---------------- EXPORT HELPERS ---------------- */
  const exportRows = sliders.map((s, i) => ({
    Sr: i + 1,
    Order: s.order,
    Screen: s.screen,
  }));

  const copyData = () => {
    const text = [
      "Sr\tSort Order\tDisplay Screen",
      ...exportRows.map(
        (r) => `${r.Sr}\t${r.Order}\t${r.Screen}`
      ),
    ].join("\n");

    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const downloadCSV = () => {
    const csv =
      "Sr,Sort Order,Display Screen\n" +
      exportRows
        .map((r) => `${r.Sr},${r.Order},"${r.Screen}"`)
        .join("\n");

    downloadFile(csv, "sliders.csv", "text/csv");
  };

  const downloadExcel = () => {
    const header = "Sr\tSort Order\tDisplay Screen\n";
    const rows = exportRows
      .map((r) => `${r.Sr}\t${r.Order}\t${r.Screen}`)
      .join("\n");

    downloadFile(header + rows, "sliders.xls", "application/vnd.ms-excel");
  };

  const downloadPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    const rows = sliders
      .map(
        (s, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>-</td>
          <td>${s.order}</td>
          <td>${s.screen}</td>
          <td>Edit | Delete</td>
        </tr>
      `
      )
      .join("");

    w.document.write(`
      <html>
        <head>
          <title>Slider</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background: #1f4e79; color: white; }
          </style>
        </head>
        <body>
          <h2>Slider</h2>
          <table>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Image</th>
                <th>Sort Order</th>
                <th>Display Screen</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    w.document.close();
    w.focus();
    w.print();
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 md:p-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-semibold">Sliders</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={copyData} className="border px-3 py-1 rounded">Copy</button>
        <button onClick={downloadExcel} className="border px-3 py-1 rounded">Excel</button>
        <button onClick={downloadCSV} className="border px-3 py-1 rounded">CSV</button>
        <button onClick={downloadPDF} className="border px-3 py-1 rounded">PDF</button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Sr</th>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Order</th>
              <th className="border px-3 py-2">Screen</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((s, i) => (
              <tr key={s.id}>
                <td className="border px-3 py-2">{i + 1}</td>
                <td className="border px-3 py-2">
                  <img src={s.image} className="w-16 h-16 object-contain" />
                </td>
                <td className="border px-3 py-2">{s.order}</td>
                <td className="border px-3 py-2">{s.screen}</td>
                <td className="border px-3 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(s)} className="text-green-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteSlider(s.id)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS (SMALLER) ================= */}
      <div className="md:hidden space-y-3">
        {sliders.map((s, i) => (
          <div key={s.id} className="bg-white border rounded p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">#{i + 1}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="text-green-600">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteSlider(s.id)} className="text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <img
              src={s.image}
              className="w-full h-32 object-contain mb-2"
            />

            <p className="text-xs">
              <span className="font-medium">Order:</span> {s.order}
            </p>
            <p className="text-xs">
              <span className="font-medium">Screen:</span> {s.screen}
            </p>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded p-4">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">
                {editing ? "Edit Slider" : "Add Slider"}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Slider Image
              </label>
              <div className="flex items-center gap-3 border rounded px-3 py-2">
                <label
                  htmlFor="sliderImage"
                  className="cursor-pointer bg-gray-100 px-4 py-2 rounded border"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">
                  {form.image ? "Image selected" : "No file chosen"}
                </span>
                <input
                  id="sliderImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files[0])
                  }
                />
              </div>
            </div>

            {form.image && (
              <img
                src={form.image}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <input
              type="number"
              className="border w-full p-2 mb-2"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: +e.target.value })
              }
            />

            <select
              className="border w-full p-2 mb-3"
              value={form.screen}
              onChange={(e) =>
                setForm({ ...form, screen: e.target.value })
              }
            >
              {SCREENS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={saveSlider}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
