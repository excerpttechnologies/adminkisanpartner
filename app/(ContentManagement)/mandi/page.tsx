


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination } from "@mui/material";
// import {
//   FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaRedo,
//   FaToggleOn, FaToggleOff, FaUsers, FaStore, FaPhone,
// } from "react-icons/fa";
// import { MdLocationOn } from "react-icons/md";
// import Link from "next/link";

// /* ───────── Types ───────── */
// interface Mandi {
//   _id: string;
//   mandiId: string;
//   mandiName: string;
//   state: string;
//   district: string;
//   taluka: string;
//   address: string;
//   pincode: string;
//   isActive: boolean;
//   allowPostingView: boolean;
//   allowMobileView: boolean;
//   subAdmins: SubAdmin[];
//   createdAt: string;
// }

// interface SubAdmin {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface FormState {
//   mandiName: string;
//   state: string;
//   district: string;
//   taluka: string;
//   address: string;
//   pincode: string;
//   allowPostingView: boolean;
//   allowMobileView: boolean;
// }

// const EMPTY_FORM: FormState = {
//   mandiName: "",
//   state: "",
//   district: "",
//   taluka: "",
//   address: "",
//   pincode: "",
//   allowPostingView: false,
//   allowMobileView: false,
// };

// /* ─── Toggle switch sub-component ─── */
// function Toggle({
//   value,
//   onToggle,
//   activeClass = "bg-green-600",
// }: {
//   value: boolean;
//   onToggle: () => void;
//   activeClass?: string;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
//         value ? activeClass : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${
//           value ? "translate-x-5" : "translate-x-0.5"
//         }`}
//       />
//     </button>
//   );
// }

// /* ───────── Page Component ───────── */
// export default function MandiPage() {
//   const [mandis, setMandis]           = useState<Mandi[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [search, setSearch]           = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages]   = useState(1);
//   const [total, setTotal]             = useState(0);
//   const [sessionRole, setSessionRole] = useState<string>("");
//   const rowsPerPage                   = 10;

//   /* modal state */
//   const [formOpen, setFormOpen]           = useState(false);
//   const [deleteOpen, setDeleteOpen]       = useState(false);
//   const [editing, setEditing]             = useState<Mandi | null>(null);
//   const [selectedMandi, setSelectedMandi] = useState<Mandi | null>(null);
//   const [form, setForm]                   = useState<FormState>(EMPTY_FORM);
//   const [errors, setErrors]               = useState<Partial<FormState>>({});
//   const [saving, setSaving]               = useState(false);

//   /* derived */
//   const isAdmin = sessionRole === "admin";

//   /* ── Fetch session ── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get("/api/admin/session");
//         setSessionRole(res.data.data?.role || "");
//       } catch {}
//     })();
//   }, []);

//   /* ── Fetch mandis ── */
//   const fetchMandis = useCallback(async (page = 1, q = "") => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/mandi", {
//         params: { page, limit: rowsPerPage, search: q },
//       });
//       if (res.data.success) {
//         setMandis(res.data.data || []);
//         setTotalPages(res.data.totalPages || 1);
//         setTotal(res.data.total || 0);
//       }
//     } catch {
//       toast.error("Failed to load mandis");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchMandis(currentPage, search); }, [currentPage]);

//   const handleSearch = () => { setCurrentPage(1); fetchMandis(1, search); };
//   const handleReset  = () => { setSearch(""); setCurrentPage(1); fetchMandis(1, ""); };

//   /* ── Validate ── */
//   const validate = (): boolean => {
//     const e: Partial<FormState> = {};
//     if (!form.mandiName.trim()) e.mandiName = "Mandi name is required";
//     if (!form.state.trim())     e.state     = "State is required";
//     if (!form.district.trim())  e.district  = "District is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ── Save ── */
//   const handleSave = async () => {
//     if (!validate()) return;
//     setSaving(true);
//     try {
//       if (editing) {
//         await axios.put(`/api/mandi/${editing._id}`, form);
//         toast.success("Mandi updated");
//       } else {
//         await axios.post("/api/mandi", form);
//         toast.success("Mandi created");
//       }
//       setFormOpen(false);
//       setEditing(null);
//       setForm(EMPTY_FORM);
//       fetchMandis(currentPage, search);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ── Delete ── */
//   const handleDelete = async () => {
//     if (!selectedMandi) return;
//     try {
//       await axios.delete(`/api/mandi/${selectedMandi._id}`);
//       toast.success("Mandi deleted");
//       setDeleteOpen(false);
//       setSelectedMandi(null);
//       fetchMandis(currentPage, search);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   /* ── Toggle posting permission ── */
//   const togglePostingPermission = async (mandi: Mandi) => {
//     try {
//       await axios.put(`/api/mandi/${mandi._id}`, {
//         allowPostingView: !mandi.allowPostingView,
//       });
//       toast.success(!mandi.allowPostingView ? "Posting view enabled" : "Posting view disabled");
//       fetchMandis(currentPage, search);
//     } catch {
//       toast.error("Failed to update permission");
//     }
//   };

//   /* ── Toggle mobile permission ── */
//   const toggleMobilePermission = async (mandi: Mandi) => {
//     try {
//       await axios.put(`/api/mandi/${mandi._id}`, {
//         allowMobileView: !mandi.allowMobileView,
//       });
//       toast.success(
//         !mandi.allowMobileView
//           ? "Mobile numbers now visible to subadmins"
//           : "Mobile numbers now hidden from subadmins"
//       );
//       fetchMandis(currentPage, search);
//     } catch {
//       toast.error("Failed to update mobile permission");
//     }
//   };

//   /* ── Open edit ── */
//   const openEdit = (mandi: Mandi) => {
//     setEditing(mandi);
//     setForm({
//       mandiName:        mandi.mandiName,
//       state:            mandi.state,
//       district:         mandi.district,
//       taluka:           mandi.taluka,
//       address:          mandi.address,
//       pincode:          mandi.pincode,
//       allowPostingView: mandi.allowPostingView,
//       allowMobileView:  mandi.allowMobileView,
//     });
//     setErrors({});
//     setFormOpen(true);
//   };

//   const openCreate = () => {
//     setEditing(null);
//     setForm(EMPTY_FORM);
//     setErrors({});
//     setFormOpen(true);
//   };

//   /* ─── column count for empty/loading colspan ─── */
//   const colCount = isAdmin ? 9 : 7;

//   /* ───────────────────── RENDER ───────────────────── */
//   return (
//     <div className="p-4 min-h-screen bg-gray-50">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             <FaStore className="text-green-600" /> Mandi Management
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {isAdmin
//               ? "Create and manage mandis, assign subadmins, control permissions."
//               : "View the mandis you are assigned to."}
//           </p>
//         </div>
//         {/* Add Mandi — admin only */}
//         {isAdmin && (
//           <button
//             onClick={openCreate}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             <FaPlus /> Add Mandi
//           </button>
//         )}
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-2 items-center">
//         <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
//           <FaSearch className="text-gray-400 mr-2 shrink-0" />
//           <input
//             type="text"
//             placeholder="Search by name, district, state..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="outline-none text-sm w-full"
//           />
//         </div>
//         <button
//           onClick={handleSearch}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
//         >
//           Search
//         </button>
//         <button
//           onClick={handleReset}
//           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
//         >
//           <FaRedo /> Reset
//         </button>
//         {isAdmin && (
//           <span className="ml-auto text-sm text-gray-500">Total: {total} mandis</span>
//         )}
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-green-50 border-b border-green-100">
//               <tr>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">Mandi ID</th>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">Mandi Name</th>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
//                 <th className="text-center px-4 py-3 font-semibold text-gray-700">Sub Admins</th>
//                 {/* Columns visible to admin only */}
//                 {isAdmin && (
//                   <>
//                     <th className="text-center px-4 py-3 font-semibold text-gray-700">Posting View</th>
//                     <th className="text-center px-4 py-3 font-semibold text-gray-700">Mobile View</th>
//                   </>
//                 )}
//                 <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
//                 <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan={colCount} className="text-center py-12 text-gray-400">
//                     <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mb-2" />
//                     <p>Loading mandis...</p>
//                   </td>
//                 </tr>
//               ) : mandis.length === 0 ? (
//                 <tr>
//                   <td colSpan={colCount} className="text-center py-12 text-gray-400">
//                     <FaStore className="mx-auto text-4xl mb-3 opacity-30" />
//                     <p>No mandis found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 mandis.map((mandi, idx) => (
//                   <tr key={mandi._id} className="hover:bg-gray-50 transition">
//                     {/* # */}
//                     <td className="px-4 py-3 text-gray-500">
//                       {(currentPage - 1) * rowsPerPage + idx + 1}
//                     </td>
//                     {/* ID */}
//                     <td className="px-4 py-3 font-mono text-xs text-gray-600">{mandi.mandiId}</td>
//                     {/* Name */}
//                     <td className="px-4 py-3 font-medium text-gray-800">{mandi.mandiName}</td>
//                     {/* Location */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-start gap-1 text-gray-600">
//                         <MdLocationOn className="text-green-500 mt-0.5 shrink-0" />
//                         <span>
//                           {mandi.district}, {mandi.state}
//                           {mandi.taluka && (
//                             <span className="text-gray-400"> · {mandi.taluka}</span>
//                           )}
//                         </span>
//                       </div>
//                     </td>
//                     {/* Sub Admins count */}
//                     <td className="px-4 py-3 text-center">
//                       <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
//                         <FaUsers className="text-xs" />
//                         {mandi.subAdmins?.length || 0}
//                       </span>
//                     </td>
//                     {/* Permission toggles — admin only */}
//                     {isAdmin && (
//                       <>
//                         <td className="px-4 py-3 text-center">
//                           <button
//                             onClick={() => togglePostingPermission(mandi)}
//                             title={mandi.allowPostingView ? "Disable posting view" : "Enable posting view"}
//                             className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
//                               mandi.allowPostingView
//                                 ? "bg-green-100 text-green-700 hover:bg-green-200"
//                                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                             }`}
//                           >
//                             {mandi.allowPostingView
//                               ? <><FaToggleOn className="text-base" /> Enabled</>
//                               : <><FaToggleOff className="text-base" /> Disabled</>}
//                           </button>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <button
//                             onClick={() => toggleMobilePermission(mandi)}
//                             title={mandi.allowMobileView ? "Hide mobile numbers" : "Show mobile numbers"}
//                             className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
//                               mandi.allowMobileView
//                                 ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                             }`}
//                           >
//                             {mandi.allowMobileView
//                               ? <><FaToggleOn className="text-base" /> Visible</>
//                               : <><FaToggleOff className="text-base" /> Hidden</>}
//                           </button>
//                         </td>
//                       </>
//                     )}
//                     {/* Status */}
//                     <td className="px-4 py-3 text-center">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         mandi.isActive
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-600"
//                       }`}>
//                         {mandi.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     {/* Actions */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-center gap-2">
//                         {/* View — always shown */}
//                         <Link
//                           href={`/mandi/${mandi._id}`}
//                           className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </Link>
//                         {/* Edit & Delete — admin only */}
//                         {isAdmin && (
//                           <>
//                             <button
//                               onClick={() => openEdit(mandi)}
//                               className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition"
//                               title="Edit"
//                             >
//                               <FaEdit />
//                             </button>
//                             <button
//                               onClick={() => { setSelectedMandi(mandi); setDeleteOpen(true); }}
//                               className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
//                               title="Delete"
//                             >
//                               <FaTrash />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-center py-4 border-t">
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={(_, val) => setCurrentPage(val)}
//               color="primary"
//               size="small"
//             />
//           </div>
//         )}
//       </div>

//       {/* ══════════ CREATE / EDIT MODAL — admin only ══════════ */}
//       {isAdmin && formOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {editing ? "Edit Mandi" : "Add New Mandi"}
//               </h2>
//               <button
//                 onClick={() => setFormOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
//               {/* Mandi Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mandi Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={form.mandiName}
//                   onChange={(e) => setForm({ ...form, mandiName: e.target.value })}
//                   placeholder="e.g. Hubli Mandi"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
//                 />
//                 {errors.mandiName && <p className="text-red-500 text-xs mt-1">{errors.mandiName}</p>}
//               </div>

//               {/* State */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   State <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={form.state}
//                   onChange={(e) => setForm({ ...form, state: e.target.value })}
//                   placeholder="e.g. Karnataka"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
//                 />
//                 {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//               </div>

//               {/* District */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   District <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={form.district}
//                   onChange={(e) => setForm({ ...form, district: e.target.value })}
//                   placeholder="e.g. Dharwad"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
//                 />
//                 {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
//               </div>

//               {/* Taluka */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
//                 <input
//                   type="text"
//                   value={form.taluka}
//                   onChange={(e) => setForm({ ...form, taluka: e.target.value })}
//                   placeholder="Optional"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
//                 />
//               </div>

//               {/* Address */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                 <textarea
//                   value={form.address}
//                   onChange={(e) => setForm({ ...form, address: e.target.value })}
//                   placeholder="Full address of the mandi"
//                   rows={2}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
//                 />
//               </div>

//               {/* Pincode */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
//                 <input
//                   type="text"
//                   value={form.pincode}
//                   onChange={(e) => setForm({ ...form, pincode: e.target.value })}
//                   placeholder="6-digit pincode"
//                   maxLength={6}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
//                 />
//               </div>

//               {/* Allow Posting View toggle */}
//               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">Allow Subadmins to View Crop Postings</p>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     If enabled, assigned subadmins can see farmer crop postings.
//                   </p>
//                 </div>
//                 <Toggle
//                   value={form.allowPostingView}
//                   onToggle={() => setForm({ ...form, allowPostingView: !form.allowPostingView })}
//                   activeClass="bg-green-600"
//                 />
//               </div>

//               {/* Allow Mobile View toggle */}
//               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">Allow Subadmins to See Farmer Mobile Numbers</p>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     If disabled, mobile numbers appear as •••••••••• to subadmins.
//                   </p>
//                 </div>
//                 <Toggle
//                   value={form.allowMobileView}
//                   onToggle={() => setForm({ ...form, allowMobileView: !form.allowMobileView })}
//                   activeClass="bg-blue-600"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 px-6 py-4 border-t">
//               <button
//                 onClick={() => setFormOpen(false)}
//                 className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg text-sm font-medium transition"
//               >
//                 {saving ? "Saving..." : editing ? "Update Mandi" : "Create Mandi"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════ DELETE CONFIRM — admin only ══════════ */}
//       {isAdmin && deleteOpen && selectedMandi && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
//             <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaTrash className="text-red-500 text-xl" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Mandi</h3>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete{" "}
//               <strong className="text-gray-800">{selectedMandi.mandiName}</strong>?
//               This cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteOpen(false)}
//                 className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





//-------dropdown


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination } from "@mui/material";
// import {
//   FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaRedo,
//   FaToggleOn, FaToggleOff, FaUsers, FaStore, FaChevronDown,
// } from "react-icons/fa";
// import { MdLocationOn } from "react-icons/md";
// import Link from "next/link";

// /* ───────── Types ───────── */
// interface Mandi {
//   _id: string;
//   mandiId: string;
//   mandiName: string;
//   state: string;
//   district: string;
//   taluka: string;
//   address: string;
//   pincode: string;
//   isActive: boolean;
//   allowPostingView: boolean;
//   allowMobileView: boolean;
//   subAdmins: SubAdmin[];
//   createdAt: string;
// }

// interface SubAdmin {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// /* StateDetail record returned by /api/states-details */
// interface StateDetail {
//   _id: string;
//   state: string;
//   district: string;
//   taluk: string;
// }

// interface FormState {
//   mandiName: string;
//   state: string;
//   district: string;
//   taluka: string;
//   address: string;
//   allowPostingView: boolean;
//   allowMobileView: boolean;
// }

// const EMPTY_FORM: FormState = {
//   mandiName: "",
//   state: "",
//   district: "",
//   taluka: "",
//   address: "",
//   allowPostingView: false,
//   allowMobileView: false,
// };

// /* ─── Reusable Toggle ─── */
// function Toggle({
//   value,
//   onToggle,
//   activeClass = "bg-green-600",
// }: {
//   value: boolean;
//   onToggle: () => void;
//   activeClass?: string;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
//         value ? activeClass : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${
//           value ? "translate-x-5" : "translate-x-0.5"
//         }`}
//       />
//     </button>
//   );
// }

// /* ─── Styled select wrapper ─── */
// function SelectField({
//   label,
//   required,
//   value,
//   onChange,
//   disabled,
//   children,
//   error,
//   placeholder,
// }: {
//   label: string;
//   required?: boolean;
//   value: string;
//   onChange: (v: string) => void;
//   disabled?: boolean;
//   children: React.ReactNode;
//   error?: string;
//   placeholder: string;
// }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <select
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           disabled={disabled}
//           className={`w-full appearance-none border rounded-lg px-3 py-2 pr-9 text-sm outline-none transition
//             ${disabled
//               ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-white border-gray-300 text-gray-800 focus:border-green-500 cursor-pointer"
//             }`}
//         >
//           <option value="">{placeholder}</option>
//           {children}
//         </select>
//         <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
//       </div>
//       {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//     </div>
//   );
// }

// /* ───────── Page Component ───────── */
// export default function MandiPage() {
//   const [mandis, setMandis]           = useState<Mandi[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [search, setSearch]           = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages]   = useState(1);
//   const [total, setTotal]             = useState(0);
//   const [sessionRole, setSessionRole] = useState<string>("");
//   const rowsPerPage                   = 10;

//   /* modal state */
//   const [formOpen, setFormOpen]           = useState(false);
//   const [deleteOpen, setDeleteOpen]       = useState(false);
//   const [editing, setEditing]             = useState<Mandi | null>(null);
//   const [selectedMandi, setSelectedMandi] = useState<Mandi | null>(null);
//   const [form, setForm]                   = useState<FormState>(EMPTY_FORM);
//   const [errors, setErrors]               = useState<Partial<FormState>>({});
//   const [saving, setSaving]               = useState(false);

//   /* ── Location data from /api/states-details ── */
//   const [allLocationData, setAllLocationData] = useState<StateDetail[]>([]);
//   const [locationLoading, setLocationLoading] = useState(false);

//   /* Derived dropdown options */
//   const uniqueStates: string[] = Array.from(
//     new Set(allLocationData.map((d) => d.state).filter(Boolean))
//   ).sort();

//   const districtsForState: string[] = Array.from(
//     new Set(
//       allLocationData
//         .filter((d) => d.state === form.state)
//         .map((d) => d.district)
//         .filter(Boolean)
//     )
//   ).sort();

//   const talukasForDistrict: string[] = Array.from(
//     new Set(
//       allLocationData
//         .filter((d) => d.state === form.state && d.district === form.district)
//         .map((d) => d.taluk)
//         .filter(Boolean)
//     )
//   ).sort();

//   /* derived */
//   const isAdmin = sessionRole === "admin";

//   /* ── Fetch session ── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get("/api/admin/session");
//         setSessionRole(res.data.data?.role || "");
//       } catch {}
//     })();
//   }, []);

//   /* ── Fetch all location data from states-details API ── */
//   const fetchLocationData = useCallback(async () => {
//     setLocationLoading(true);
//     try {
//       const res = await axios.get("/api/states-details");
//       if (res.data.success) {
//         const records: StateDetail[] = res.data.data || [];
//         setAllLocationData(records);
//       }
//     } catch {
//       toast.error("Failed to load location data");
//     } finally {
//       setLocationLoading(false);
//     }
//   }, []);

//   /* Fetch location data once on mount */
//   useEffect(() => { fetchLocationData(); }, [fetchLocationData]);

//   /* ── Fetch mandis ── */
//   const fetchMandis = useCallback(async (page = 1, q = "") => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/mandi", {
//         params: { page, limit: rowsPerPage, search: q },
//       });
//       if (res.data.success) {
//         setMandis(res.data.data || []);
//         setTotalPages(res.data.totalPages || 1);
//         setTotal(res.data.total || 0);
//       }
//     } catch {
//       toast.error("Failed to load mandis");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchMandis(currentPage, search); }, [currentPage]);

//   const handleSearch = () => { setCurrentPage(1); fetchMandis(1, search); };
//   const handleReset  = () => { setSearch(""); setCurrentPage(1); fetchMandis(1, ""); };

//   /* ── Validate ── */
//   const validate = (): boolean => {
//     const e: Partial<FormState> = {};
//     if (!form.mandiName.trim()) e.mandiName = "Mandi name is required";
//     if (!form.state.trim())     e.state     = "State is required";
//     if (!form.district.trim())  e.district  = "District is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ── Save ── */
//   const handleSave = async () => {
//     if (!validate()) return;
//     setSaving(true);
//     try {
//       const payload = {
//         mandiName:        form.mandiName.trim(),
//         state:            form.state,
//         district:         form.district,
//         taluka:           form.taluka,
//         address:          form.address.trim(),
//         allowPostingView: form.allowPostingView,
//         allowMobileView:  form.allowMobileView,
//       };

//       if (editing) {
//         await axios.put(`/api/mandi/${editing._id}`, payload);
//         toast.success("Mandi updated");
//       } else {
//         await axios.post("/api/mandi", payload);
//         toast.success("Mandi created");
//       }
//       setFormOpen(false);
//       setEditing(null);
//       setForm(EMPTY_FORM);
//       fetchMandis(currentPage, search);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ── Delete ── */
//   const handleDelete = async () => {
//     if (!selectedMandi) return;
//     try {
//       await axios.delete(`/api/mandi/${selectedMandi._id}`);
//       toast.success("Mandi deleted");
//       setDeleteOpen(false);
//       setSelectedMandi(null);
//       fetchMandis(currentPage, search);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   /* ── Toggle posting permission ── */
//   const togglePostingPermission = async (mandi: Mandi) => {
//     try {
//       await axios.put(`/api/mandi/${mandi._id}`, {
//         allowPostingView: !mandi.allowPostingView,
//       });
//       toast.success(!mandi.allowPostingView ? "Posting view enabled" : "Posting view disabled");
//       fetchMandis(currentPage, search);
//     } catch {
//       toast.error("Failed to update permission");
//     }
//   };

//   /* ── Toggle mobile permission ── */
//   const toggleMobilePermission = async (mandi: Mandi) => {
//     try {
//       await axios.put(`/api/mandi/${mandi._id}`, {
//         allowMobileView: !mandi.allowMobileView,
//       });
//       toast.success(
//         !mandi.allowMobileView
//           ? "Mobile numbers now visible to subadmins"
//           : "Mobile numbers now hidden from subadmins"
//       );
//       fetchMandis(currentPage, search);
//     } catch {
//       toast.error("Failed to update mobile permission");
//     }
//   };

//   /* ── Handle state change → reset district + taluka ── */
//   const handleStateChange = (value: string) => {
//     setForm((prev) => ({ ...prev, state: value, district: "", taluka: "" }));
//   };

//   /* ── Handle district change → reset taluka ── */
//   const handleDistrictChange = (value: string) => {
//     setForm((prev) => ({ ...prev, district: value, taluka: "" }));
//   };

//   /* ── Open edit ── */
//   const openEdit = (mandi: Mandi) => {
//     setEditing(mandi);
//     setForm({
//       mandiName:        mandi.mandiName,
//       state:            mandi.state,
//       district:         mandi.district,
//       taluka:           mandi.taluka,
//       address:          mandi.address,
//       allowPostingView: mandi.allowPostingView,
//       allowMobileView:  mandi.allowMobileView,
//     });
//     setErrors({});
//     setFormOpen(true);
//   };

//   const openCreate = () => {
//     setEditing(null);
//     setForm(EMPTY_FORM);
//     setErrors({});
//     setFormOpen(true);
//   };

//   /* colspan count */
//   const colCount = isAdmin ? 9 : 7;

//   /* ───────────────────── RENDER ───────────────────── */
//   return (
//     <div className="p-4 min-h-screen bg-gray-50">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             <FaStore className="text-green-600" /> Mandi Management
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {isAdmin
//               ? "Create and manage mandis, assign subadmins, control permissions."
//               : "View the mandis you are assigned to."}
//           </p>
//         </div>
//         {isAdmin && (
//           <button
//             onClick={openCreate}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             <FaPlus /> Add Mandi
//           </button>
//         )}
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-2 items-center">
//         <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
//           <FaSearch className="text-gray-400 mr-2 shrink-0" />
//           <input
//             type="text"
//             placeholder="Search by name, district, state..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="outline-none text-sm w-full"
//           />
//         </div>
//         <button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
//           Search
//         </button>
//         <button onClick={handleReset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition">
//           <FaRedo /> Reset
//         </button>
//         {isAdmin && (
//           <span className="ml-auto text-sm text-gray-500">Total: {total} mandis</span>
//         )}
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-green-50 border-b border-green-100">
//               <tr>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">Mandi ID</th>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">Mandi Name</th>
//                 <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
//                 <th className="text-center px-4 py-3 font-semibold text-gray-700">Sub Admins</th>
//                 {isAdmin && (
//                   <>
//                     <th className="text-center px-4 py-3 font-semibold text-gray-700">Posting View</th>
//                     <th className="text-center px-4 py-3 font-semibold text-gray-700">Mobile View</th>
//                   </>
//                 )}
//                 <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
//                 <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan={colCount} className="text-center py-12 text-gray-400">
//                     <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mb-2" />
//                     <p>Loading mandis...</p>
//                   </td>
//                 </tr>
//               ) : mandis.length === 0 ? (
//                 <tr>
//                   <td colSpan={colCount} className="text-center py-12 text-gray-400">
//                     <FaStore className="mx-auto text-4xl mb-3 opacity-30" />
//                     <p>No mandis found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 mandis.map((mandi, idx) => (
//                   <tr key={mandi._id} className="hover:bg-gray-50 transition">
//                     <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
//                     <td className="px-4 py-3 font-mono text-xs text-gray-600">{mandi.mandiId}</td>
//                     <td className="px-4 py-3 font-medium text-gray-800">{mandi.mandiName}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-start gap-1 text-gray-600">
//                         <MdLocationOn className="text-green-500 mt-0.5 shrink-0" />
//                         <span>
//                           {mandi.district}, {mandi.state}
//                           {mandi.taluka && <span className="text-gray-400"> · {mandi.taluka}</span>}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
//                         <FaUsers className="text-xs" />
//                         {mandi.subAdmins?.length || 0}
//                       </span>
//                     </td>
//                     {isAdmin && (
//                       <>
//                         <td className="px-4 py-3 text-center">
//                           <button
//                             onClick={() => togglePostingPermission(mandi)}
//                             title={mandi.allowPostingView ? "Disable posting view" : "Enable posting view"}
//                             className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
//                               mandi.allowPostingView
//                                 ? "bg-green-100 text-green-700 hover:bg-green-200"
//                                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                             }`}
//                           >
//                             {mandi.allowPostingView
//                               ? <><FaToggleOn className="text-base" /> Enabled</>
//                               : <><FaToggleOff className="text-base" /> Disabled</>}
//                           </button>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <button
//                             onClick={() => toggleMobilePermission(mandi)}
//                             title={mandi.allowMobileView ? "Hide mobile numbers" : "Show mobile numbers"}
//                             className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
//                               mandi.allowMobileView
//                                 ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                             }`}
//                           >
//                             {mandi.allowMobileView
//                               ? <><FaToggleOn className="text-base" /> Visible</>
//                               : <><FaToggleOff className="text-base" /> Hidden</>}
//                           </button>
//                         </td>
//                       </>
//                     )}
//                     <td className="px-4 py-3 text-center">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         mandi.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
//                       }`}>
//                         {mandi.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-center gap-2">
//                         <Link
//                           href={`/mandi/${mandi._id}`}
//                           className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </Link>
//                         {isAdmin && (
//                           <>
//                             <button
//                               onClick={() => openEdit(mandi)}
//                               className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition"
//                               title="Edit"
//                             >
//                               <FaEdit />
//                             </button>
//                             <button
//                               onClick={() => { setSelectedMandi(mandi); setDeleteOpen(true); }}
//                               className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
//                               title="Delete"
//                             >
//                               <FaTrash />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-center py-4 border-t">
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={(_, val) => setCurrentPage(val)}
//               color="primary"
//               size="small"
//             />
//           </div>
//         )}
//       </div>

//       {/* ══════════ CREATE / EDIT MODAL — admin only ══════════ */}
//       {isAdmin && formOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {editing ? "Edit Mandi" : "Add New Mandi"}
//               </h2>
//               <button
//                 onClick={() => setFormOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

//               {/* ── Mandi Name ── */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mandi Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={form.mandiName}
//                   onChange={(e) => setForm({ ...form, mandiName: e.target.value })}
//                   placeholder="e.g. Hubli APMC Mandi"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
//                 />
//                 {errors.mandiName && <p className="text-red-500 text-xs mt-1">{errors.mandiName}</p>}
//               </div>

//               {/* ── Location info banner ── */}
//               {locationLoading ? (
//                 <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
//                   <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full" />
//                   Loading location data...
//                 </div>
//               ) : allLocationData.length === 0 ? (
//                 <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
//                   ⚠ No location data found. Please add entries via the States Details page first.
//                 </div>
//               ) : null}

//               {/* ── State dropdown ── */}
//               <SelectField
//                 label="State"
//                 required
//                 value={form.state}
//                 onChange={handleStateChange}
//                 disabled={locationLoading || allLocationData.length === 0}
//                 placeholder="— Select State —"
//                 error={errors.state}
//               >
//                 {uniqueStates.map((s) => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </SelectField>

//               {/* ── District dropdown ── */}
//               <SelectField
//                 label="District"
//                 required
//                 value={form.district}
//                 onChange={handleDistrictChange}
//                 disabled={!form.state || locationLoading}
//                 placeholder={form.state ? "— Select District —" : "Select state first"}
//                 error={errors.district}
//               >
//                 {districtsForState.map((d) => (
//                   <option key={d} value={d}>{d}</option>
//                 ))}
//               </SelectField>

//               {/* ── Taluka dropdown ── */}
//               <SelectField
//                 label="Taluka"
//                 value={form.taluka}
//                 onChange={(v) => setForm({ ...form, taluka: v })}
//                 disabled={!form.district || locationLoading}
//                 placeholder={form.district ? "— Select Taluka (optional) —" : "Select district first"}
//               >
//                 {talukasForDistrict.map((t) => (
//                   <option key={t} value={t}>{t}</option>
//                 ))}
//               </SelectField>

//               {/* ── Address ── */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                 <textarea
//                   value={form.address}
//                   onChange={(e) => setForm({ ...form, address: e.target.value })}
//                   placeholder="Full address of the mandi (optional)"
//                   rows={2}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
//                 />
//               </div>

//               {/* ── Allow Posting View ── */}
//               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">Allow Subadmins to View Crop Postings</p>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     If enabled, assigned subadmins can see farmer crop postings.
//                   </p>
//                 </div>
//                 <Toggle
//                   value={form.allowPostingView}
//                   onToggle={() => setForm({ ...form, allowPostingView: !form.allowPostingView })}
//                   activeClass="bg-green-600"
//                 />
//               </div>

//               {/* ── Allow Mobile View ── */}
//               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">Allow Subadmins to See Farmer Mobile Numbers</p>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     If disabled, mobile numbers appear as •••••••••• to subadmins.
//                   </p>
//                 </div>
//                 <Toggle
//                   value={form.allowMobileView}
//                   onToggle={() => setForm({ ...form, allowMobileView: !form.allowMobileView })}
//                   activeClass="bg-blue-600"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 px-6 py-4 border-t">
//               <button
//                 onClick={() => setFormOpen(false)}
//                 className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg text-sm font-medium transition"
//               >
//                 {saving ? "Saving..." : editing ? "Update Mandi" : "Create Mandi"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════ DELETE CONFIRM — admin only ══════════ */}
//       {isAdmin && deleteOpen && selectedMandi && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
//             <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaTrash className="text-red-500 text-xl" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Mandi</h3>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete{" "}
//               <strong className="text-gray-800">{selectedMandi.mandiName}</strong>?
//               This cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteOpen(false)}
//                 className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaRedo,
  FaToggleOn, FaToggleOff, FaUsers, FaStore, FaChevronDown,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Link from "next/link";

/* ───────── Types ───────── */
interface Mandi {
  _id: string;
  mandiId: string;
  mandiName: string;
  state: string;
  district: string;
  taluka: string;
  address: string;
  pincode: string;
  isActive: boolean;
  allowPostingView: boolean;
  allowMobileView: boolean;
  subAdmins: SubAdmin[];
  createdAt: string;
}

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface StateDetail {
  _id: string;
  state: string;
  district: string;
  taluk: string;
}

interface FormState {
  mandiName: string;
  state: string;
  district: string;
  taluka: string;
  address: string;
  allowPostingView: boolean;
  allowMobileView: boolean;
}

const EMPTY_FORM: FormState = {
  mandiName: "",
  state: "",
  district: "",
  taluka: "",
  address: "",
  allowPostingView: false,
  allowMobileView: false,
};

/* ─── Toggle ─── */
function Toggle({
  value,
  onToggle,
  activeClass = "bg-green-600",
}: {
  value: boolean;
  onToggle: () => void;
  activeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
        value ? activeClass : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${
          value ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ─── Select Field ─── */
function SelectField({
  label,
  required,
  value,
  onChange,
  disabled,
  children,
  error,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  error?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none border rounded-lg px-3 py-2 pr-9 text-sm outline-none transition ${
            disabled
              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-800 focus:border-green-500 cursor-pointer"
          }`}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ───────── Page ───────── */
export default function MandiPage() {
  const [mandis, setMandis]           = useState<Mandi[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [sessionRole, setSessionRole] = useState<string | null>(null); // null = not yet loaded
  const rowsPerPage                   = 10;

  /* modal */
  const [formOpen, setFormOpen]           = useState(false);
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [editing, setEditing]             = useState<Mandi | null>(null);
  const [selectedMandi, setSelectedMandi] = useState<Mandi | null>(null);
  const [form, setForm]                   = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]               = useState<Partial<FormState>>({});
  const [saving, setSaving]               = useState(false);

  /* location */
  const [allLocationData, setAllLocationData] = useState<StateDetail[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  /* derived */
  const isAdmin         = sessionRole === "admin";
  const sessionReady    = sessionRole !== null;   // true once session fetch completes

  /* ── prevent double-fetch ref ── */
  const initDone = useRef(false);

  /* Dropdown options — computed from allLocationData + current form values */
  const uniqueStates = Array.from(
    new Set(allLocationData.map((d) => d.state).filter(Boolean))
  ).sort();

  const districtsForState = Array.from(
    new Set(
      allLocationData
        .filter((d) => d.state === form.state)
        .map((d) => d.district)
        .filter(Boolean)
    )
  ).sort();

  const talukasForDistrict = Array.from(
    new Set(
      allLocationData
        .filter((d) => d.state === form.state && d.district === form.district)
        .map((d) => d.taluk)
        .filter(Boolean)
    )
  ).sort();

  /* ──────────────────────────────────────────────────
     STEP 1: fetch session  (runs once on mount)
     STEP 2: after session ready → fetch mandis + locations
             in parallel (both authenticated)
  ────────────────────────────────────────────────── */
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const init = async () => {
      /* ── Session first ── */
      let role = "";
      try {
        const res = await axios.get("/api/admin/session");
        role = res.data.data?.role || "";
      } catch {
        // session check failed — page will show unauthorised state
      }
      setSessionRole(role);

      /* ── Now fetch mandis + location data in parallel ── */
      await Promise.all([
        doFetchMandis(1, "", role),
        doFetchLocations(),
      ]);
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Page change after initial load ── */
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!sessionReady) return;
    doFetchMandis(currentPage, search, sessionRole ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  /* ──────────────────────────────────────────────────
     Fetch helpers — accept role explicitly so they
     don't rely on stale closure state
  ────────────────────────────────────────────────── */
  const doFetchMandis = useCallback(async (page: number, q: string, role: string) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/mandi", {
        params: { page, limit: rowsPerPage, search: q },
      });
      if (res.data.success) {
        setMandis(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      }
    } catch (err: any) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message || "";
      // 401 = session cookie not ready yet on first cold request — silent, page shows empty
      if (status !== 401) {
        toast.error("Failed to load mandis");
        console.error("Fetch mandis error:", msg || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const doFetchLocations = useCallback(async () => {
    setLocationLoading(true);
    try {
      const res = await axios.get("/api/states-details");
      if (res.data.success) {
        setAllLocationData(res.data.data || []);
      }
    } catch {
      // non-critical — form will show a warning
    } finally {
      setLocationLoading(false);
    }
  }, []);

  /* ── Manual search/reset ── */
  const handleSearch = () => {
    setCurrentPage(1);
    doFetchMandis(1, search, sessionRole ?? "");
  };
  const handleReset = () => {
    setSearch("");
    setCurrentPage(1);
    doFetchMandis(1, "", sessionRole ?? "");
  };

  /* ── Refetch wrapper (for after mutations) ── */
  const refetch = () => doFetchMandis(currentPage, search, sessionRole ?? "");

  /* ── Validate ── */
  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.mandiName.trim()) e.mandiName = "Mandi name is required";
    if (!form.state.trim())     e.state     = "State is required";
    if (!form.district.trim())  e.district  = "District is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        mandiName:        form.mandiName.trim(),
        state:            form.state,
        district:         form.district,
        taluka:           form.taluka,
        address:          form.address.trim(),
        allowPostingView: form.allowPostingView,
        allowMobileView:  form.allowMobileView,
      };
      if (editing) {
        await axios.put(`/api/mandi/${editing._id}`, payload);
        toast.success("Mandi updated");
      } else {
        await axios.post("/api/mandi", payload);
        toast.success("Mandi created");
      }
      setFormOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!selectedMandi) return;
    try {
      await axios.delete(`/api/mandi/${selectedMandi._id}`);
      toast.success("Mandi deleted");
      setDeleteOpen(false);
      setSelectedMandi(null);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* ── Toggle posting ── */
  const togglePostingPermission = async (mandi: Mandi) => {
    try {
      await axios.put(`/api/mandi/${mandi._id}`, { allowPostingView: !mandi.allowPostingView });
      toast.success(!mandi.allowPostingView ? "Posting view enabled" : "Posting view disabled");
      refetch();
    } catch {
      toast.error("Failed to update permission");
    }
  };

  /* ── Toggle mobile ── */
  const toggleMobilePermission = async (mandi: Mandi) => {
    try {
      await axios.put(`/api/mandi/${mandi._id}`, { allowMobileView: !mandi.allowMobileView });
      toast.success(!mandi.allowMobileView ? "Mobile numbers now visible" : "Mobile numbers now hidden");
      refetch();
    } catch {
      toast.error("Failed to update mobile permission");
    }
  };

  /* ── Location cascade ── */
  const handleStateChange = (value: string) => {
    setForm((p) => ({ ...p, state: value, district: "", taluka: "" }));
  };
  const handleDistrictChange = (value: string) => {
    setForm((p) => ({ ...p, district: value, taluka: "" }));
  };

  /* ── Open forms ── */
  const openEdit = (mandi: Mandi) => {
    setEditing(mandi);
    setForm({
      mandiName:        mandi.mandiName,
      state:            mandi.state,
      district:         mandi.district,
      taluka:           mandi.taluka,
      address:          mandi.address,
      allowPostingView: mandi.allowPostingView,
      allowMobileView:  mandi.allowMobileView,
    });
    setErrors({});
    setFormOpen(true);
  };
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormOpen(true);
  };

  const colCount = isAdmin ? 9 : 7;

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="p-4 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaStore className="text-green-600" /> Mandi Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin
              ? "Create and manage mandis, assign subadmins, control permissions."
              : "View the mandis you are assigned to."}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <FaPlus /> Add Mandi
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-2 items-center">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <FaSearch className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, district, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="outline-none text-sm w-full"
          />
        </div>
        <button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
          Search
        </button>
        <button onClick={handleReset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition">
          <FaRedo /> Reset
        </button>
        {isAdmin && (
          <span className="ml-auto text-sm text-gray-500">Total: {total} mandis</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-50 border-b border-green-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Mandi ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Mandi Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Sub Admins</th>
                {isAdmin && (
                  <>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Posting View</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Mobile View</th>
                  </>
                )}
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Show spinner while session or mandis are loading */}
              {loading || !sessionReady ? (
                <tr>
                  <td colSpan={colCount} className="text-center py-12 text-gray-400">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mb-2" />
                    <p>Loading...</p>
                  </td>
                </tr>
              ) : mandis.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="text-center py-12 text-gray-400">
                    <FaStore className="mx-auto text-4xl mb-3 opacity-30" />
                    <p>No mandis found</p>
                  </td>
                </tr>
              ) : (
                mandis.map((mandi, idx) => (
                  <tr key={mandi._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{mandi.mandiId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{mandi.mandiName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-1 text-gray-600">
                        <MdLocationOn className="text-green-500 mt-0.5 shrink-0" />
                        <span>
                          {mandi.district}, {mandi.state}
                          {mandi.taluka && <span className="text-gray-400"> · {mandi.taluka}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        <FaUsers className="text-xs" />
                        {mandi.subAdmins?.length || 0}
                      </span>
                    </td>
                    {isAdmin && (
                      <>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => togglePostingPermission(mandi)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                              mandi.allowPostingView
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {mandi.allowPostingView
                              ? <><FaToggleOn className="text-base" /> Enabled</>
                              : <><FaToggleOff className="text-base" /> Disabled</>}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleMobilePermission(mandi)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                              mandi.allowMobileView
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {mandi.allowMobileView
                              ? <><FaToggleOn className="text-base" /> Visible</>
                              : <><FaToggleOff className="text-base" /> Hidden</>}
                          </button>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mandi.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {mandi.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/mandi/${mandi._id}`}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => openEdit(mandi)}
                              className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => { setSelectedMandi(mandi); setDeleteOpen(true); }}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center py-4 border-t">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, val) => setCurrentPage(val)}
              color="primary"
              size="small"
            />
          </div>
        )}
      </div>

      {/* ══ CREATE / EDIT MODAL — admin only ══ */}
      {isAdmin && formOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editing ? "Edit Mandi" : "Add New Mandi"}
              </h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Mandi Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mandi Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.mandiName}
                  onChange={(e) => setForm({ ...form, mandiName: e.target.value })}
                  placeholder="e.g. Hubli APMC Mandi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />
                {errors.mandiName && <p className="text-red-500 text-xs mt-1">{errors.mandiName}</p>}
              </div>

              {/* Location loading notice */}
              {locationLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-1">
                  <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full" />
                  Loading location data...
                </div>
              )}
              {!locationLoading && allLocationData.length === 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  ⚠ No location data found. Please add entries in the States Details page first.
                </div>
              )}

              {/* State */}
              <SelectField
                label="State"
                required
                value={form.state}
                onChange={handleStateChange}
                disabled={locationLoading || allLocationData.length === 0}
                placeholder="— Select State —"
                error={errors.state}
              >
                {uniqueStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </SelectField>

              {/* District */}
              <SelectField
                label="District"
                required
                value={form.district}
                onChange={handleDistrictChange}
                disabled={!form.state || locationLoading}
                placeholder={form.state ? "— Select District —" : "Select state first"}
                error={errors.district}
              >
                {districtsForState.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </SelectField>

              {/* Taluka */}
              <SelectField
                label="Taluka"
                value={form.taluka}
                onChange={(v) => setForm({ ...form, taluka: v })}
                disabled={!form.district || locationLoading}
                placeholder={form.district ? "— Select Taluka (optional) —" : "Select district first"}
              >
                {talukasForDistrict.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </SelectField>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Full address of the mandi (optional)"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
                />
              </div>

              {/* Allow Posting View */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm font-medium text-gray-800">Allow Subadmins to View Crop Postings</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    If enabled, assigned subadmins can see farmer crop postings.
                  </p>
                </div>
                <Toggle
                  value={form.allowPostingView}
                  onToggle={() => setForm({ ...form, allowPostingView: !form.allowPostingView })}
                  activeClass="bg-green-600"
                />
              </div>

              {/* Allow Mobile View */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-gray-800">Allow Subadmins to See Farmer Mobile Numbers</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    If disabled, mobile numbers appear as •••••••••• to subadmins.
                  </p>
                </div>
                <Toggle
                  value={form.allowMobileView}
                  onToggle={() => setForm({ ...form, allowMobileView: !form.allowMobileView })}
                  activeClass="bg-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setFormOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                {saving ? "Saving..." : editing ? "Update Mandi" : "Create Mandi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM — admin only ══ */}
      {isAdmin && deleteOpen && selectedMandi && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Mandi</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">{selectedMandi.mandiName}</strong>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteOpen(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}