// // components/b2b/B2BUsers.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Eye,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Power,
//   Search,
//   Filter,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import Pagination from "@mui/material/Pagination";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";

// interface User {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber: string;
//   name: string;
//   email: string;
//   address: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   role: string;
//   isActive: boolean;
//   rejectionReason: string;
//   verificationStatus: "pending" | "verified" | "rejected";
//   verifiedBy: string;
//   verifiedDate: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface B2BUsersProps {
//   adminSession: any;
// }

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90%",
//   maxWidth: 800,
//   maxHeight: "90vh",
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   overflow: "auto",
//   p: 0,
// };

// const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const [page, setPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: "verify" | "reject" | "toggleActive" | "delete";
//     userId: string;
//     userName?: string;
//   } | null>(null);

//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/b2b-users");
//       const data = await response.json();
//       if (data.success) {
//         setUsers(data.users);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter and search users
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.mobileNumber.includes(searchTerm) ||
//       user.name.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesFilter =
//       filterStatus === "all" || user.verificationStatus === filterStatus;

//     return matchesSearch && matchesFilter;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage,
//   );

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     value: number,
//   ) => {
//     setPage(value);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleVerifyUser = async (
//     userId: string,
//     status: "verified" | "rejected",
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-users/${userId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           verificationStatus: status,
//           verifiedBy: adminSession?.name || "Admin",
//           rejectionReason: status === "rejected" ? "Rejected by admin" : "",
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success(`User ${status} successfully`);
//         fetchUsers();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to update user status");
//     }
//   };

//   const handleToggleActive = async (userId: string, currentStatus: boolean) => {
//     try {
//       const response = await fetch(`/api/b2b-users/${userId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive: !currentStatus }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success(
//           `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
//         );
//         fetchUsers();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to toggle user status");
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/b2b-users/${userId}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success("User deleted successfully");
//         fetchUsers();
//         if (paginatedUsers.length === 1 && page > 1) {
//           setPage(page - 1);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to delete user");
//     }
//   };

//   const openConfirmModal = (type: any, userId: string, userName: string) => {
//     setConfirmAction({ type, userId, userName });
//     setConfirmModalOpen(true);
//   };

//   const handleConfirmAction = () => {
//     if (!confirmAction) return;

//     switch (confirmAction.type) {
//       case "verify":
//         handleVerifyUser(confirmAction.userId, "verified");
//         break;
//       case "reject":
//         handleVerifyUser(confirmAction.userId, "rejected");
//         break;
//       case "toggleActive":
//         const user = users.find((u) => u._id === confirmAction.userId);
//         if (user) handleToggleActive(confirmAction.userId, user.isActive);
//         break;
//       case "delete":
//         handleDeleteUser(confirmAction.userId);
//         break;
//     }
//     setConfirmModalOpen(false);
//     setConfirmAction(null);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "verified":
//         return (
//           <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
//             Verified
//           </span>
//         );
//       case "rejected":
//         return (
//           <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
//             Rejected
//           </span>
//         );
//       default:
//         return (
//           <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
//             Pending
//           </span>
//         );
//     }
//   };

//   // Desktop Table View
//   const DesktopTable = () => (
//     <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Business
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Contact
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Verification
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedUsers.map((user) => (
//               <tr key={user._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <div className="font-medium text-gray-900">
//                     {user.businessName}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {user.businessType}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="text-sm text-gray-900">{user.name}</div>
//                   <div className="text-sm text-gray-500">
//                     {user.mobileNumber}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       user.isActive
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {user.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   {getStatusBadge(user.verificationStatus)}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setSelectedUser(user);
//                         setModalOpen(true);
//                       }}
//                       className="text-blue-600 hover:text-blue-800"
//                       title="View Details"
//                     >
//                       <Eye size={18} />
//                     </button>

//                     {user.verificationStatus === "pending" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             openConfirmModal(
//                               "verify",
//                               user._id,
//                               user.businessName,
//                             )
//                           }
//                           className="text-green-600 hover:text-green-800"
//                           title="Verify"
//                         >
//                           <CheckCircle size={18} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             openConfirmModal(
//                               "reject",
//                               user._id,
//                               user.businessName,
//                             )
//                           }
//                           className="text-red-600 hover:text-red-800"
//                           title="Reject"
//                         >
//                           <XCircle size={18} />
//                         </button>
//                       </>
//                     )}

//                     <button
//                       onClick={() =>
//                         openConfirmModal(
//                           "toggleActive",
//                           user._id,
//                           user.businessName,
//                         )
//                       }
//                       className="text-purple-600 hover:text-purple-800"
//                       title={user.isActive ? "Deactivate" : "Activate"}
//                     >
//                       <Power size={18} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         openConfirmModal("delete", user._id, user.businessName)
//                       }
//                       className="text-red-600 hover:text-red-800"
//                       title="Delete"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   // Mobile Card View
//   const MobileCards = () => (
//     <div className="md:hidden space-y-4">
//       {paginatedUsers.map((user) => (
//         <div key={user._id} className="bg-white rounded-lg shadow p-4">
//           <div className="flex justify-between items-start mb-3">
//             <div>
//               <h3 className="font-semibold text-gray-900">
//                 {user.businessName}
//               </h3>
//               <p className="text-sm text-gray-500">{user.businessType}</p>
//             </div>
//             {getStatusBadge(user.verificationStatus)}
//           </div>

//           <div className="space-y-2 mb-3">
//             <p className="text-sm">
//               <span className="font-medium text-gray-700">Name:</span>{" "}
//               {user.name}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium text-gray-700">Mobile:</span>{" "}
//               {user.mobileNumber}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium text-gray-700">Status:</span>{" "}
//               <span
//                 className={user.isActive ? "text-green-600" : "text-red-600"}
//               >
//                 {user.isActive ? "Active" : "Inactive"}
//               </span>
//             </p>
//           </div>

//           <div className="flex justify-end space-x-3 pt-3 border-t">
//             <button
//               onClick={() => {
//                 setSelectedUser(user);
//                 setModalOpen(true);
//               }}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               <Eye size={18} />
//             </button>

//             {user.verificationStatus === "pending" && (
//               <>
//                 <button
//                   onClick={() =>
//                     openConfirmModal("verify", user._id, user.businessName)
//                   }
//                   className="text-green-600 hover:text-green-800"
//                 >
//                   <CheckCircle size={18} />
//                 </button>
//                 <button
//                   onClick={() =>
//                     openConfirmModal("reject", user._id, user.businessName)
//                   }
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <XCircle size={18} />
//                 </button>
//               </>
//             )}

//             <button
//               onClick={() =>
//                 openConfirmModal("toggleActive", user._id, user.businessName)
//               }
//               className="text-purple-600 hover:text-purple-800"
//             >
//               <Power size={18} />
//             </button>

//             <button
//               onClick={() =>
//                 openConfirmModal("delete", user._id, user.businessName)
//               }
//               className="text-red-600 hover:text-red-800"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // Stats
//   const stats = {
//     total: users.length,
//     verified: users.filter((u) => u.verificationStatus === "verified").length,
//     pending: users.filter((u) => u.verificationStatus === "pending").length,
//     rejected: users.filter((u) => u.verificationStatus === "rejected").length,
//     active: users.filter((u) => u.isActive).length,
//     inactive: users.filter((u) => !u.isActive).length,
//   };

//   return (
//     <>
//       {/* Search and Filter Section */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               placeholder="Search by business name, mobile or name..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div className="sm:w-64">
//             <select
//               value={filterStatus}
//               onChange={(e) => {
//                 setFilterStatus(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="verified">Verified</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-sm text-gray-600">Total Users</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-sm text-gray-600">Verified</p>
//           <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-sm text-gray-600">Pending</p>
//           <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-sm text-gray-600">Active</p>
//           <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
//         </div>
//       </div>

//       {/* Users Table/Cards */}
//       {paginatedUsers.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <p className="text-gray-500">No users found</p>
//         </div>
//       ) : (
//         <>
//           <DesktopTable />
//           <MobileCards />

//           {/* MUI Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 size="large"
//                 showFirstButton
//                 showLastButton
//               />
//             </div>
//           )}
//         </>
//       )}

//       {/* MUI Modal for User Details */}
//       <Modal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         aria-labelledby="user-details-modal"
//       >
//         <Box sx={modalStyle}>
//           <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-900">
//               User Details
//             </h2>
//             <IconButton onClick={() => setModalOpen(false)} size="small">
//               <CloseIcon />
//             </IconButton>
//           </div>

//           {selectedUser && (
//             <div className="p-6 space-y-6">
//               {/* Status Badges */}
//               <div className="flex gap-3">
//                 {getStatusBadge(selectedUser.verificationStatus)}
//                 <span
//                   className={`px-3 py-1 text-sm font-medium rounded-full ${
//                     selectedUser.isActive
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
//                 </span>
//               </div>

//               {/* Business Information */}
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                   <Building size={18} /> Business Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-gray-500">Business Name:</span>{" "}
//                     <span className="font-medium">
//                       {selectedUser.businessName}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Business Type:</span>{" "}
//                     <span className="font-medium">
//                       {selectedUser.businessType}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">GST Number:</span>{" "}
//                     <span className="font-medium">
//                       {selectedUser.gstNumber || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-semibold text-gray-900 mb-3">
//                   Contact Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                   <div className="flex items-center gap-2">
//                     <Phone size={16} className="text-gray-400" />
//                     <span className="font-medium">
//                       {selectedUser.mobileNumber}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Mail size={16} className="text-gray-400" />
//                     <span className="font-medium">
//                       {selectedUser.email || "N/A"}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Name:</span>{" "}
//                     {selectedUser.name}
//                   </div>
//                 </div>
//               </div>

//               {/* Address Information */}
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                   <MapPin size={18} /> Address Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-gray-500">Address:</span>{" "}
//                     {selectedUser.address || "N/A"}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Village:</span>{" "}
//                     {selectedUser.village || "N/A"}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Taluk:</span>{" "}
//                     {selectedUser.taluk || "N/A"}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">District:</span>{" "}
//                     {selectedUser.district || "N/A"}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">State:</span>{" "}
//                     {selectedUser.state || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Verification Info */}
//               {selectedUser.verificationStatus !== "pending" && (
//                 <div className="border rounded-lg p-4">
//                   <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                     <CheckCircle size={18} /> Verification Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                     <div>
//                       <span className="text-gray-500">Verified By:</span>{" "}
//                       {selectedUser.verifiedBy || "N/A"}
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Verified Date:</span>{" "}
//                       {selectedUser.verifiedDate
//                         ? new Date(
//                             selectedUser.verifiedDate,
//                           ).toLocaleDateString()
//                         : "N/A"}
//                     </div>
//                     {selectedUser.rejectionReason && (
//                       <div className="col-span-2">
//                         <span className="text-gray-500">Rejection Reason:</span>{" "}
//                         <span className="text-red-600">
//                           {selectedUser.rejectionReason}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Timestamps */}
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                   <Calendar size={18} /> Timestamps
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-gray-500">Created At:</span>{" "}
//                     {new Date(selectedUser.createdAt).toLocaleString()}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Last Updated:</span>{" "}
//                     {new Date(selectedUser.updatedAt).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </Box>
//       </Modal>

//       {/* MUI Modal for Confirmation */}
//       <Modal
//         open={confirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         aria-labelledby="confirmation-modal"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
//               {confirmAction?.type === "delete" ? (
//                 <Trash2 className="text-red-600" size={24} />
//               ) : confirmAction?.type === "verify" ? (
//                 <CheckCircle className="text-green-600" size={24} />
//               ) : confirmAction?.type === "reject" ? (
//                 <XCircle className="text-red-600" size={24} />
//               ) : (
//                 <Power className="text-purple-600" size={24} />
//               )}
//             </div>

//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               {confirmAction?.type === "verify"
//                 ? "Verify User"
//                 : confirmAction?.type === "reject"
//                   ? "Reject User"
//                   : confirmAction?.type === "toggleActive"
//                     ? "Change Status"
//                     : "Delete User"}
//             </h3>

//             <p className="text-gray-600 mb-6">
//               {confirmAction?.type === "verify"
//                 ? `Are you sure you want to verify "${confirmAction?.userName}"?`
//                 : confirmAction?.type === "reject"
//                   ? `Are you sure you want to reject "${confirmAction?.userName}"?`
//                   : confirmAction?.type === "toggleActive"
//                     ? `Are you sure you want to change the active status of "${confirmAction?.userName}"?`
//                     : `Are you sure you want to delete "${confirmAction?.userName}"? This action cannot be undone.`}
//             </p>

//             <div className="flex justify-center space-x-3">
//               <button
//                 onClick={() => setConfirmModalOpen(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
//                   confirmAction?.type === "delete" ||
//                   confirmAction?.type === "reject"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : confirmAction?.type === "verify"
//                       ? "bg-green-600 hover:bg-green-700"
//                       : "bg-purple-600 hover:bg-purple-700"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default B2BUsers;











// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Power,
//   Search,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   RefreshCw,
//   Users,
//   ShieldCheck,
//   Clock,
//   Zap,
//   AlertTriangle,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Undo2,
//   Ban,
//   Shield,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// /* ─────────────────────────── types ─────────────────────────── */
// interface User {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber: string;
//   name: string;
//   email: string;
//   address: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   role: string;
//   isActive: boolean;
//   rejectionReason?: string;
//   verificationStatus?: "pending" | "verified" | "rejected";
//   verifiedBy?: string;
//   verifiedDate?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// type SortKey = keyof Pick<
//   User,
//   | "businessName"
//   | "name"
//   | "mobileNumber"
//   | "verificationStatus"
//   | "isActive"
//   | "createdAt"
// >;
// type SortDir = "asc" | "desc";

// interface ConfirmAction {
//   type: "verify" | "reject" | "toggleActive" | "delete" | "resetToPending";
//   userId: string;
//   userName: string;
//   currentActive?: boolean;
//   currentStatus?: string;
// }

// interface B2BUsersProps {
//   adminSession?: { name: string };
// }

// /* ─────────────────────────── helpers ───────────────────────── */
// const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// // Styled MUI Dialog components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     padding: "8px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "480px",
//     width: "100%",
//     margin: "16px",
//   },
// }));

// const StyledDetailDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "720px",
//     width: "100%",
//     margin: "16px",
//     maxHeight: "90vh",
//     overflow: "hidden",
//   },
// }));

// const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
//   textAlign: "center",
//   padding: "24px 24px 8px 24px",
//   "& .MuiTypography-root": {
//     fontWeight: 700,
//     fontSize: "1.25rem",
//     color: "#1e293b",
//   },
// }));

// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//   textAlign: "center",
//   padding: "8px 24px 24px 24px",
// }));

// const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
//   padding: "8px 24px 24px 24px",
//   gap: "12px",
// }));

// function StatusPill({
//   status,
// }: {
//   status: User["verificationStatus"] | undefined | null;
// }) {
//   const safeStatus = status ?? "pending";
//   const map = {
//     verified: {
//       cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
//       icon: <ShieldCheck size={11} />,
//     },
//     rejected: {
//       cls: "bg-rose-50 text-rose-700 border-rose-200",
//       icon: <XCircle size={11} />,
//     },
//     pending: {
//       cls: "bg-amber-50 text-amber-700 border-amber-200",
//       icon: <Clock size={11} />,
//     },
//   } as const;
//   const { cls, icon } = map[safeStatus as keyof typeof map] ?? map.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}
//     >
//       {icon}
//       {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
//     </span>
//   );
// }

// function ActivePill({ active }: { active: boolean }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
//         active
//           ? "bg-blue-50 text-blue-700 border-blue-200"
//           : "bg-slate-100 text-slate-500 border-slate-200"
//       }`}
//     >
//       <span
//         className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-400"}`}
//       />
//       {active ? "Active" : "Inactive"}
//     </span>
//   );
// }

// /* ─────────────────────────── main component ─────────────────── */
// const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     verified: 0,
//     pending: 0,
//     rejected: 0,
//     active: 0,
//     inactive: 0,
//   });
//   const [businessTypes, setBusinessTypes] = useState<string[]>([]);

//   // filters
//   const [search, setSearch] = useState("");
//   const [filterVS, setFilterVS] = useState<string>("all");
//   const [filterActive, setFilterActive] = useState<string>("all");
//   const [filterBType, setFilterBType] = useState<string>("all");

//   // sort
//   const [sortKey, setSortKey] = useState<SortKey>("createdAt");
//   const [sortDir, setSortDir] = useState<SortDir>("desc");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   // modals
//   const [detailUser, setDetailUser] = useState<User | null>(null);
//   const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
//     null,
//   );
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [rejectionReasonText, setRejectionReasonText] = useState("");

//   const tableRef = useRef<HTMLDivElement>(null);

//   /* ── fetch ── */
//   const fetchUsers = useCallback(async (quiet = false) => {
//     quiet ? setRefreshing(true) : setLoading(true);
//     try {
//       const res = await fetch("/api/b2b-users");
//       const data = await res.json();
//       if (data.success) {
//         setUsers(data.users);
//         setStats(data.stats);
//         setBusinessTypes(data.businessTypes || []);
//       } else {
//         toast.error(data.message || "Failed to load users");
//       }
//     } catch {
//       toast.error("Network error — could not load users");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   /* ── derived filter / sort / paginate ── */
//   const filtered = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       u.businessName.toLowerCase().includes(q) ||
//       u.name.toLowerCase().includes(q) ||
//       u.mobileNumber.includes(q) ||
//       (u.email || "").toLowerCase().includes(q) ||
//       (u.district || "").toLowerCase().includes(q) ||
//       (u.gstNumber || "").toLowerCase().includes(q);

//     const matchVS =
//       filterVS === "all" || (u.verificationStatus ?? "pending") === filterVS;
//     const matchActive =
//       filterActive === "all" || String(u.isActive) === filterActive;
//     const matchBType = filterBType === "all" || u.businessType === filterBType;

//     return matchSearch && matchVS && matchActive && matchBType;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     let av: any = a[sortKey];
//     let bv: any = b[sortKey];
//     if (sortKey === "isActive") {
//       av = a.isActive ? 1 : 0;
//       bv = b.isActive ? 1 : 0;
//     }
//     if (sortKey === "verificationStatus") {
//       const statusOrder = { verified: 3, pending: 2, rejected: 1 };
//       av = statusOrder[a.verificationStatus || "pending"] || 0;
//       bv = statusOrder[b.verificationStatus || "pending"] || 0;
//     }
//     if (typeof av === "string") av = av.toLowerCase();
//     if (typeof bv === "string") bv = bv.toLowerCase();
//     if (av < bv) return sortDir === "asc" ? -1 : 1;
//     if (av > bv) return sortDir === "asc" ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   const safePage = Math.min(page, totalPages);
//   const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);
//   const activeFilters = [
//     filterVS !== "all",
//     filterActive !== "all",
//     filterBType !== "all",
//   ].filter(Boolean).length;

//   /* ── sort toggle ── */
//   const handleSort = (key: SortKey) => {
//     if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const SortIcon = ({ col }: { col: SortKey }) =>
//     sortKey === col ? (
//       sortDir === "asc" ? (
//         <ChevronUp size={13} className="text-indigo-500" />
//       ) : (
//         <ChevronDown size={13} className="text-indigo-500" />
//       )
//     ) : (
//       <ChevronsUpDown size={13} className="text-slate-300" />
//     );

//   /* ── actions ── */
//   const handleConfirmAction = async () => {
//     if (!confirmAction) return;
//     const { type, userId, currentActive } = confirmAction;

//     try {
//       if (type === "delete") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "DELETE",
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User deleted successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "toggleActive") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isActive: !currentActive }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(
//             data.message ||
//               `User ${!currentActive ? "activated" : "deactivated"} successfully`,
//           );
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "resetToPending") {
//         // Reset user to pending status
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "pending",
//             verifiedBy: "",
//             rejectionReason: "",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User reset to pending successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "reject") {
//         if (!rejectionReasonText.trim()) {
//           toast.error("Please provide a rejection reason");
//           return;
//         }

//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "rejected",
//             verifiedBy: adminSession?.name || "Admin",
//             rejectionReason: rejectionReasonText,
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User rejected successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "verify") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "verified",
//             verifiedBy: adminSession?.name || "Admin",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User verified successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Action failed — try again");
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilterVS("all");
//     setFilterActive("all");
//     setFilterBType("all");
//     setPage(1);
//   };

//   // Reset rejection reason when modal opens for reject action
//   const handleOpenConfirmModal = (action: ConfirmAction) => {
//     setRejectionReasonText("");
//     setConfirmAction(action);
//   };

//   // Get modal content based on action type
//   const getModalContent = () => {
//     if (!confirmAction)
//       return { icon: null, title: "", message: "", bgColor: "" };

//     switch (confirmAction.type) {
//       case "verify":
//         return {
//           icon: <CheckCircle size={26} className="text-emerald-500" />,
//           title: "Verify User",
//           message: (
//             <>
//               Confirm verification for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#ecfdf5",
//         };
//       case "reject":
//         return {
//           icon: <XCircle size={26} className="text-rose-500" />,
//           title: "Reject User",
//           message: (
//             <>
//               Confirm rejection for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               . Please provide a reason below.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       case "resetToPending":
//         return {
//           icon: <Undo2 size={26} className="text-amber-500" />,
//           title: "Reset to Pending",
//           message: (
//             <>
//               Reset{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>{" "}
//               to pending status? This will clear verification/rejection data.
//             </>
//           ),
//           bgColor: "#fef3c7",
//         };
//       case "toggleActive":
//         return {
//           icon: <Power size={26} className="text-violet-500" />,
//           title: confirmAction.currentActive
//             ? "Deactivate User"
//             : "Activate User",
//           message: (
//             <>
//               {confirmAction.currentActive ? "Deactivate" : "Activate"} user{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#f5f3ff",
//         };
//       case "delete":
//         return {
//           icon: <AlertTriangle size={26} className="text-rose-500" />,
//           title: "Delete User",
//           message: (
//             <>
//               Are you sure you want to permanently delete{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ? This cannot be undone.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       default:
//         return { icon: null, title: "", message: "", bgColor: "" };
//     }
//   };

//   const modalContent = getModalContent();

//   /* ── loading skeleton ── */
//   if (loading)
//     return (
//       <div className="space-y-4 animate-pulse p-6">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
//           ))}
//         </div>
//         <div className="h-12 bg-slate-100 rounded-xl" />
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="h-14 border-b border-slate-50 bg-slate-50 mx-4 my-1 rounded-lg"
//             />
//           ))}
//         </div>
//       </div>
//     );

//   /* ═══════════════════════════ RENDER ══════════════════════════ */
//   return (
//     <div className="min-h-screen font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
//         .th-btn { @apply flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 transition-colors; }
//         .action-btn { @apply p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95; }
//         .input-base { @apply w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all; }
//         select:focus { outline: none; }
//         input:focus { outline: none; }
//         button:focus { outline: none; }
//       `}</style>

//       <div className="">
//         {/* ── page header ── */}
//         <div className="flex items-center justify-end mb-3">
//           <button
//             onClick={() => fetchUsers(true)}
//             className={`flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-indigo-50 -mt-6 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm ${refreshing ? "animate-pulse" : ""}`}
//           >
//             <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* ── stat cards ── */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//           {[
//             {
//               label: "Total",
//               val: stats.total,
//               icon: <Users size={18} />,
//               color: "from-indigo-500 to-violet-600",
//             },
//             {
//               label: "Verified",
//               val: stats.verified,
//               icon: <ShieldCheck size={18} />,
//               color: "from-emerald-400 to-teal-600",
//             },
//             {
//               label: "Pending",
//               val: stats.pending,
//               icon: <Clock size={18} />,
//               color: "from-amber-400 to-orange-500",
//             },
//             {
//               label: "Rejected",
//               val: stats.rejected,
//               icon: <XCircle size={18} />,
//               color: "from-rose-400 to-red-600",
//             },
//             {
//               label: "Active",
//               val: stats.active,
//               icon: <Zap size={18} />,
//               color: "from-sky-400 to-blue-600",
//             },
//           ].map(({ label, val, icon, color }) => (
//             <div
//               key={label}
//               className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
//             >
//               <div
//                 className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
//               >
//                 {icon}
//               </div>
//               <div>
//                 <p className="text-xs text-slate-400 font-medium">{label}</p>
//                 <p className="text-2xl font-bold text-slate-800 leading-none mt-0.5">
//                   {val}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── search + filter bar ── */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* search */}
//             <div className="flex-1 relative">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//               />
//               <input
//                 className="input-base pl-9 pr-9"
//                 placeholder="Search business, name, mobile, email, GST, district…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//               {search && (
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setPage(1);
//                   }}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* filter toggle */}
//             <button
//               onClick={() => setFilterPanelOpen((v) => !v)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
//                 filterPanelOpen || activeFilters > 0
//                   ? "bg-indigo-50 border-indigo-200 text-indigo-700"
//                   : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
//               }`}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFilters > 0 && (
//                 <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {activeFilters}
//                 </span>
//               )}
//             </button>

//             {/* per-page */}
//             <select
//               value={perPage}
//               onChange={(e) => {
//                 setPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="input-base w-auto pr-8 cursor-pointer focus:outline-none"
//             >
//               {ITEMS_PER_PAGE_OPTIONS.map((n) => (
//                 <option key={n} value={n}>
//                   {n} / page
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* expanded filter panel */}
//           {filterPanelOpen && (
//             <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
//               <div>
//                 <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Verification
//                 </label>
//                 <select
//                   value={filterVS}
//                   onChange={(e) => {
//                     setFilterVS(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none"
//                 >
//                   <option value="all">All</option>
//                   <option value="pending">Pending</option>
//                   <option value="verified">Verified</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Status
//                 </label>
//                 <select
//                   value={filterActive}
//                   onChange={(e) => {
//                     setFilterActive(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none"
//                 >
//                   <option value="all">All</option>
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Business Type
//                 </label>
//                 <select
//                   value={filterBType}
//                   onChange={(e) => {
//                     setFilterBType(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none"
//                 >
//                   <option value="all">All Types</option>
//                   {businessTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {activeFilters > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className="sm:col-span-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
//                 >
//                   <X size={13} /> Clear all filters
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── results meta ── */}
//         <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
//           <span>
//             Showing{" "}
//             <strong className="text-slate-600">{paginated.length}</strong> of{" "}
//             <strong className="text-slate-600">{sorted.length}</strong> results
//             {activeFilters > 0 || search
//               ? ` (filtered from ${users.length})`
//               : ""}
//           </span>
//           <span>
//             Page {safePage} of {totalPages}
//           </span>
//         </div>

//         {/* ── table ── */}
//         {paginated.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-slate-400">
//             <Users size={40} className="mb-3 opacity-30" />
//             <p className="font-semibold text-slate-500">No users found</p>
//             <p className="text-sm mt-1">Try adjusting your search or filters</p>
//             {(search || activeFilters > 0) && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* ── DESKTOP TABLE ── */}
//             <div
//               ref={tableRef}
//               className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4"
//             >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-slate-50/70">
//                       {[
//                         { label: "Business", key: "businessName" as SortKey },
//                         { label: "Contact", key: "name" as SortKey },
//                         { label: "Mobile", key: "mobileNumber" as SortKey },
//                         { label: "Active", key: "isActive" as SortKey },
//                         {
//                           label: "Verification",
//                           key: "verificationStatus" as SortKey,
//                         },
//                         { label: "Joined", key: "createdAt" as SortKey },
//                       ].map(({ label, key }) => (
//                         <th
//                           key={key}
//                           className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
//                         >
//                           <button
//                             className="th-btn"
//                             onClick={() => handleSort(key)}
//                           >
//                             {label} <SortIcon col={key} />
//                           </button>
//                         </th>
//                       ))}
//                       <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {paginated.map((user) => (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-indigo-50/30 transition-colors group"
//                       >
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
//                             {user.businessName}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {user.businessType || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4">
//                           <p className="text-slate-700 font-medium">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
//                             {user.email || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4 text-slate-600 font-mono text-xs">
//                           {user.mobileNumber}
//                         </td>
//                         <td className="px-5 py-4">
//                           <ActivePill active={user.isActive} />
//                         </td>
//                         <td className="px-5 py-4">
//                           <StatusPill status={user.verificationStatus} />
//                         </td>
//                         <td className="px-5 py-4 text-xs text-slate-400">
//                           {new Date(user.createdAt).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-1">
//                             {/* View Details Button */}
//                             <button
//                               title="View Details"
//                               onClick={() => setDetailUser(user)}
//                               className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                             >
//                               <Eye size={15} />
//                             </button>

//                             {/* For PENDING users - Show Verify & Reject buttons */}
//                             {user.verificationStatus === "pending" && (
//                               <>
//                                 <button
//                                   title="Verify"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "verify",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                                 >
//                                   <CheckCircle size={15} />
//                                 </button>
//                                 <button
//                                   title="Reject"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "reject",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                                 >
//                                   <XCircle size={15} />
//                                 </button>
//                               </>
//                             )}

//                             {/* For VERIFIED users - Show Reject & Reset to Pending buttons */}
                            

//                             {/* For REJECTED users - Show Verify & Reset to Pending buttons */}
//                             {user.verificationStatus === "rejected" && (
//                               <>
//                                 <button
//                                   title="Verify (Change to Verified)"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "verify",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                                 >
//                                   <Shield size={15} />
//                                 </button>
//                                 <button
//                                   title="Reset to Pending"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "resetToPending",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-amber-600 hover:bg-amber-50"
//                                 >
//                                   <Undo2 size={15} />
//                                 </button>
//                               </>
//                             )}

//                             {/* Toggle Active/Inactive Button - Always show */}
//                             <button
//                               title={user.isActive ? "Deactivate" : "Activate"}
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "toggleActive",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                   currentActive: user.isActive,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-violet-600 hover:bg-violet-50"
//                             >
//                               <Power size={15} />
//                             </button>

//                             {/* Delete Button - Always show */}
//                             <button
//                               title="Delete"
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "delete",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ── MOBILE CARDS ── */}
//             <div className="md:hidden space-y-3 mb-4">
//               {paginated.map((user) => (
//                 <div
//                   key={user._id}
//                   className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-bold text-slate-800">
//                         {user.businessName}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {user.businessType || "—"}
//                       </p>
//                     </div>
//                     <StatusPill status={user.verificationStatus} />
//                   </div>
//                   <div className="space-y-1.5 text-xs text-slate-500 mb-3">
//                     <p>
//                       <span className="font-medium text-slate-600">Name: </span>
//                       {user.name}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Mobile:{" "}
//                       </span>
//                       <span className="font-mono">{user.mobileNumber}</span>
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Joined:{" "}
//                       </span>
//                       {new Date(user.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                     <div className="pt-1">
//                       <ActivePill active={user.isActive} />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-50">
//                     <button
//                       onClick={() => setDetailUser(user)}
//                       className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                     >
//                       <Eye size={16} />
//                     </button>

//                     {user.verificationStatus === "pending" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "verify",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-emerald-500 hover:bg-emerald-50"
//                         >
//                           <CheckCircle size={16} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "reject",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-rose-500 hover:bg-rose-50"
//                         >
//                           <XCircle size={16} />
//                         </button>
//                       </>
//                     )}

//                     {user.verificationStatus === "verified" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "reject",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-rose-500 hover:bg-rose-50"
//                         >
//                           <Ban size={16} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "resetToPending",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-amber-500 hover:bg-amber-50"
//                         >
//                           <Undo2 size={16} />
//                         </button>
//                       </>
//                     )}

//                     {user.verificationStatus === "rejected" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "verify",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-emerald-500 hover:bg-emerald-50"
//                         >
//                           <Shield size={16} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "resetToPending",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-amber-500 hover:bg-amber-50"
//                         >
//                           <Undo2 size={16} />
//                         </button>
//                       </>
//                     )}

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "toggleActive",
//                           userId: user._id,
//                           userName: user.businessName,
//                           currentActive: user.isActive,
//                         })
//                       }
//                       className="action-btn text-violet-500 hover:bg-violet-50"
//                     >
//                       <Power size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "delete",
//                           userId: user._id,
//                           userName: user.businessName,
//                         })
//                       }
//                       className="action-btn text-rose-500 hover:bg-rose-50"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── PAGINATION ── */}
//             {totalPages > 1 && (
//               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
//                 <p className="text-xs text-slate-400">
//                   {(safePage - 1) * perPage + 1}–
//                   {Math.min(safePage * perPage, sorted.length)} of{" "}
//                   {sorted.length}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage(1)}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsLeft size={15} />
//                   </button>
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft size={15} />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (n) =>
//                         n === 1 ||
//                         n === totalPages ||
//                         Math.abs(n - safePage) <= 1,
//                     )
//                     .reduce<(number | "…")[]>((acc, n, i, arr) => {
//                       if (
//                         i > 0 &&
//                         typeof arr[i - 1] === "number" &&
//                         n - (arr[i - 1] as number) > 1
//                       )
//                         acc.push("…");
//                       acc.push(n);
//                       return acc;
//                     }, [])
//                     .map((n, i) =>
//                       n === "…" ? (
//                         <span
//                           key={`e${i}`}
//                           className="px-2 text-slate-300 text-xs"
//                         >
//                           …
//                         </span>
//                       ) : (
//                         <button
//                           key={n}
//                           onClick={() => setPage(n as number)}
//                           className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
//                             safePage === n
//                               ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
//                               : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
//                           }`}
//                         >
//                           {n}
//                         </button>
//                       ),
//                     )}

//                   <button
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight size={15} />
//                   </button>
//                   <button
//                     onClick={() => setPage(totalPages)}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsRight size={15} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ════════════ MUI DETAIL MODAL (Same as before) ════════════ */}
//       <StyledDetailDialog
//         open={detailUser !== null}
//         onClose={() => setDetailUser(null)}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: "16px 24px",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//         >
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
//               {detailUser?.businessName}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#94a3b8" }}>
//               {detailUser?.businessType}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setDetailUser(null)} size="small">
//             <X size={18} />
//           </IconButton>
//         </Box>

//         <DialogContent sx={{ p: "24px", overflow: "auto" }}>
//           {detailUser && (
//             <div className="space-y-5">
//               <div className="flex gap-2 flex-wrap">
//                 <StatusPill status={detailUser.verificationStatus} />
//                 <ActivePill active={detailUser.isActive} />
//               </div>

//               {[
//                 {
//                   title: "Business Information",
//                   icon: <Building size={15} />,
//                   rows: [
//                     ["Business Name", detailUser.businessName],
//                     ["Business Type", detailUser.businessType || "N/A"],
//                     ["GST Number", detailUser.gstNumber || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Contact Details",
//                   icon: <Phone size={15} />,
//                   rows: [
//                     ["Contact Person", detailUser.name],
//                     ["Mobile Number", detailUser.mobileNumber],
//                     ["Email Address", detailUser.email || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Address Information",
//                   icon: <MapPin size={15} />,
//                   rows: [
//                     ["Full Address", detailUser.address || "Not Provided"],
//                     ["Village/City", detailUser.village || "Not Provided"],
//                     ["Taluk", detailUser.taluk || "Not Provided"],
//                     ["District", detailUser.district || "Not Provided"],
//                     ["State", detailUser.state || "Not Provided"],
//                   ],
//                 },
//               ].map((sec) => (
//                 <div
//                   key={sec.title}
//                   className="border border-slate-100 rounded-xl overflow-hidden"
//                 >
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     {sec.icon} {sec.title}
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {sec.rows.map(([k, v]) => (
//                       <div key={k} className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32 flex-shrink-0">
//                           {k}
//                         </span>
//                         <span className="text-slate-700 font-medium">{v}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {(detailUser.verificationStatus === "verified" ||
//                 detailUser.verificationStatus === "rejected") && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <ShieldCheck size={15} /> Verification Details
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.verifiedBy && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified By</span>
//                         <span className="text-slate-700 font-medium">
//                           {detailUser.verifiedBy}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.verifiedDate && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified On</span>
//                         <span className="text-slate-700 font-medium">
//                           {new Date(detailUser.verifiedDate).toLocaleString(
//                             "en-IN",
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.rejectionReason && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">
//                           Rejection Reason
//                         </span>
//                         <span className="text-rose-600 font-medium">
//                           {detailUser.rejectionReason}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="border border-slate-100 rounded-xl overflow-hidden">
//                 <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                   <Calendar size={15} /> System Information
//                 </div>
//                 <div className="divide-y divide-slate-50">
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Account Created</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.createdAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Last Updated</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.updatedAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
//           <Button onClick={() => setDetailUser(null)}>Close</Button>
//         </DialogActions>
//       </StyledDetailDialog>

//       {/* ════════════ MUI CONFIRM MODAL ════════════ */}
//       <StyledDialog
//         open={confirmAction !== null}
//         onClose={() => {
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             pt: 3,
//           }}
//         >
//           <Box
//             sx={{
//               width: 56,
//               height: 56,
//               borderRadius: "16px",
//               backgroundColor: modalContent.bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "16px",
//             }}
//           >
//             {modalContent.icon}
//           </Box>
//         </Box>
//         <StyledDialogTitle>
//           <Typography variant="h6" component="span">
//             {modalContent.title}
//           </Typography>
//         </StyledDialogTitle>
//         <StyledDialogContent>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#64748b",
//               mb: confirmAction?.type === "reject" ? 2 : 0,
//             }}
//           >
//             {modalContent.message}
//           </Typography>

//           {confirmAction?.type === "reject" && (
//             <TextField
//               autoFocus
//               multiline
//               rows={3}
//               fullWidth
//               variant="outlined"
//               label="Rejection Reason"
//               placeholder="Please provide a detailed reason for rejection..."
//               value={rejectionReasonText}
//               onChange={(e) => setRejectionReasonText(e.target.value)}
//               sx={{
//                 mt: 2,
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "12px",
//                 },
//               }}
//             />
//           )}
//         </StyledDialogContent>
//         <StyledDialogActions>
//           <Button
//             onClick={() => {
//               setConfirmAction(null);
//               setRejectionReasonText("");
//             }}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               color: "#475569",
//               border: "1px solid #e2e8f0",
//               "&:hover": {
//                 backgroundColor: "#f8fafc",
//                 borderColor: "#cbd5e1",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmAction}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               backgroundColor:
//                 confirmAction?.type === "verify"
//                   ? "#10b981"
//                   : confirmAction?.type === "resetToPending"
//                     ? "#f59e0b"
//                     : confirmAction?.type === "toggleActive"
//                       ? "#8b5cf6"
//                       : "#f43f5e",
//               color: "white",
//               "&:hover": {
//                 backgroundColor:
//                   confirmAction?.type === "verify"
//                     ? "#059669"
//                     : confirmAction?.type === "resetToPending"
//                       ? "#d97706"
//                       : confirmAction?.type === "toggleActive"
//                         ? "#7c3aed"
//                         : "#e11d48",
//               },
//             }}
//           >
//             Confirm
//           </Button>
//         </StyledDialogActions>
//       </StyledDialog>
//     </div>
//   );
// };

// export default B2BUsers;













// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Power,
//   Search,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   RefreshCw,
//   Users,
//   ShieldCheck,
//   Clock,
//   Zap,
//   AlertTriangle,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Undo2,
//   Ban,
//   Shield,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// /* ─────────────────────────── types ─────────────────────────── */
// interface User {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber: string;
//   name: string;
//   email: string;
//   address: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   role: string;
//   isActive: boolean;
//   rejectionReason?: string;
//   verificationStatus?: "pending" | "verified" | "rejected";
//   verifiedBy?: string;
//   verifiedDate?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// type SortKey = keyof Pick<
//   User,
//   | "businessName"
//   | "name"
//   | "mobileNumber"
//   | "isActive"
//   | "createdAt"
// >;
// type SortDir = "asc" | "desc";

// interface ConfirmAction {
//   type: "verify" | "reject" | "toggleActive" | "delete" | "resetToPending";
//   userId: string;
//   userName: string;
//   currentActive?: boolean;
//   currentStatus?: string;
// }

// interface B2BUsersProps {
//   adminSession?: { name: string };
// }

// /* ─────────────────────────── helpers ───────────────────────── */
// const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// // Styled MUI Dialog components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     padding: "8px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "480px",
//     width: "100%",
//     margin: "16px",
//   },
// }));

// const StyledDetailDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "720px",
//     width: "100%",
//     margin: "16px",
//     maxHeight: "90vh",
//     overflow: "hidden",
//   },
// }));

// const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
//   textAlign: "center",
//   padding: "24px 24px 8px 24px",
//   "& .MuiTypography-root": {
//     fontWeight: 700,
//     fontSize: "1.25rem",
//     color: "#1e293b",
//   },
// }));

// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//   textAlign: "center",
//   padding: "8px 24px 24px 24px",
// }));

// const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
//   padding: "8px 24px 24px 24px",
//   gap: "12px",
// }));

// function StatusPill({
//   status,
// }: {
//   status: User["verificationStatus"] | undefined | null;
// }) {
//   const safeStatus = status ?? "pending";
//   const map = {
//     verified: {
//       cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
//       icon: <ShieldCheck size={11} />,
//     },
//     rejected: {
//       cls: "bg-rose-50 text-rose-700 border-rose-200",
//       icon: <XCircle size={11} />,
//     },
//     pending: {
//       cls: "bg-amber-50 text-amber-700 border-amber-200",
//       icon: <Clock size={11} />,
//     },
//   } as const;
//   const { cls, icon } = map[safeStatus as keyof typeof map] ?? map.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}
//     >
//       {icon}
//       {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
//     </span>
//   );
// }

// function ActivePill({ active }: { active: boolean }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
//         active
//           ? "bg-blue-50 text-blue-700 border-blue-200"
//           : "bg-slate-100 text-slate-500 border-slate-200"
//       }`}
//     >
//       <span
//         className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-400"}`}
//       />
//       {active ? "Active" : "Inactive"}
//     </span>
//   );
// }

// /* ─────────────────────────── main component ─────────────────── */
// const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     verified: 0,
//     pending: 0,
//     rejected: 0,
//     active: 0,
//     inactive: 0,
//   });
//   const [businessTypes, setBusinessTypes] = useState<string[]>([]);

//   // filters
//   const [search, setSearch] = useState("");
//   const [filterVS, setFilterVS] = useState<string>("all");
//   const [filterActive, setFilterActive] = useState<string>("all");
//   const [filterBType, setFilterBType] = useState<string>("all");

//   // sort
//   const [sortKey, setSortKey] = useState<SortKey>("createdAt");
//   const [sortDir, setSortDir] = useState<SortDir>("desc");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   // modals
//   const [detailUser, setDetailUser] = useState<User | null>(null);
//   const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
//     null,
//   );
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [rejectionReasonText, setRejectionReasonText] = useState("");

//   const tableRef = useRef<HTMLDivElement>(null);

//   /* ── fetch ── */
//   const fetchUsers = useCallback(async (quiet = false) => {
//     quiet ? setRefreshing(true) : setLoading(true);
//     try {
//       const res = await fetch("/api/b2b-users");
//       const data = await res.json();
//       if (data.success) {
//         setUsers(data.users);
//         setStats(data.stats);
//         setBusinessTypes(data.businessTypes || []);
//       } else {
//         toast.error(data.message || "Failed to load users");
//       }
//     } catch {
//       toast.error("Network error — could not load users");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   /* ── derived filter / sort / paginate ── */
//   const filtered = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       u.businessName.toLowerCase().includes(q) ||
//       u.name.toLowerCase().includes(q) ||
//       u.mobileNumber.includes(q) ||
//       (u.email || "").toLowerCase().includes(q) ||
//       (u.district || "").toLowerCase().includes(q) ||
//       (u.gstNumber || "").toLowerCase().includes(q);

//     const matchVS =
//       filterVS === "all" || (u.verificationStatus ?? "pending") === filterVS;
//     const matchActive =
//       filterActive === "all" || String(u.isActive) === filterActive;
//     const matchBType = filterBType === "all" || u.businessType === filterBType;

//     return matchSearch && matchVS && matchActive && matchBType;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     let av: any = a[sortKey];
//     let bv: any = b[sortKey];
//     if (sortKey === "isActive") {
//       av = a.isActive ? 1 : 0;
//       bv = b.isActive ? 1 : 0;
//     }
//     if (typeof av === "string") av = av.toLowerCase();
//     if (typeof bv === "string") bv = bv.toLowerCase();
//     if (av < bv) return sortDir === "asc" ? -1 : 1;
//     if (av > bv) return sortDir === "asc" ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   const safePage = Math.min(page, totalPages);
//   const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);
//   const activeFilters = [
//     filterVS !== "all",
//     filterActive !== "all",
//     filterBType !== "all",
//   ].filter(Boolean).length;

//   /* ── sort toggle ── */
//   const handleSort = (key: SortKey) => {
//     if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const SortIcon = ({ col }: { col: SortKey }) =>
//     sortKey === col ? (
//       sortDir === "asc" ? (
//         <ChevronUp size={13} className="text-indigo-500" />
//       ) : (
//         <ChevronDown size={13} className="text-indigo-500" />
//       )
//     ) : (
//       <ChevronsUpDown size={13} className="text-slate-300" />
//     );

//   /* ── actions ── */
//   const handleConfirmAction = async () => {
//     if (!confirmAction) return;
//     const { type, userId, currentActive } = confirmAction;

//     try {
//       if (type === "delete") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "DELETE",
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User deleted successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "toggleActive") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isActive: !currentActive }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(
//             data.message ||
//               `User ${!currentActive ? "activated" : "deactivated"} successfully`,
//           );
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "resetToPending") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "pending",
//             verifiedBy: "",
//             rejectionReason: "",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User reset to pending successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "reject") {
//         if (!rejectionReasonText.trim()) {
//           toast.error("Please provide a rejection reason");
//           return;
//         }

//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "rejected",
//             verifiedBy: adminSession?.name || "Admin",
//             rejectionReason: rejectionReasonText,
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User rejected successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "verify") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "verified",
//             verifiedBy: adminSession?.name || "Admin",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User verified successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Action failed — try again");
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilterVS("all");
//     setFilterActive("all");
//     setFilterBType("all");
//     setPage(1);
//   };

//   const handleOpenConfirmModal = (action: ConfirmAction) => {
//     setRejectionReasonText("");
//     setConfirmAction(action);
//   };

//   const getModalContent = () => {
//     if (!confirmAction)
//       return { icon: null, title: "", message: "", bgColor: "" };

//     switch (confirmAction.type) {
//       case "verify":
//         return {
//           icon: <CheckCircle size={26} className="text-emerald-500" />,
//           title: "Verify User",
//           message: (
//             <>
//               Confirm verification for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#ecfdf5",
//         };
//       case "reject":
//         return {
//           icon: <XCircle size={26} className="text-rose-500" />,
//           title: "Reject User",
//           message: (
//             <>
//               Confirm rejection for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               . Please provide a reason below.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       case "resetToPending":
//         return {
//           icon: <Undo2 size={26} className="text-amber-500" />,
//           title: "Reset to Pending",
//           message: (
//             <>
//               Reset{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>{" "}
//               to pending status? This will clear verification/rejection data.
//             </>
//           ),
//           bgColor: "#fef3c7",
//         };
//       case "toggleActive":
//         return {
//           icon: <Power size={26} className="text-violet-500" />,
//           title: confirmAction.currentActive
//             ? "Deactivate User"
//             : "Activate User",
//           message: (
//             <>
//               {confirmAction.currentActive ? "Deactivate" : "Activate"} user{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#f5f3ff",
//         };
//       case "delete":
//         return {
//           icon: <AlertTriangle size={26} className="text-rose-500" />,
//           title: "Delete User",
//           message: (
//             <>
//               Are you sure you want to permanently delete{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ? This cannot be undone.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       default:
//         return { icon: null, title: "", message: "", bgColor: "" };
//     }
//   };

//   const modalContent = getModalContent();

//   /* ── loading skeleton ── */
//   if (loading)
//     return (
//       <div className="space-y-4 animate-pulse p-6">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
//           ))}
//         </div>
//         <div className="h-12 bg-slate-100 rounded-xl" />
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="h-14 border-b border-slate-50 bg-slate-50 mx-4 my-1 rounded-lg"
//             />
//           ))}
//         </div>
//       </div>
//     );

//   /* ═══════════════════════════ RENDER ══════════════════════════ */
//   return (
//     <div className="min-h-screen font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
//         .th-btn { @apply flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 transition-colors; }
//         .action-btn { @apply p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95; }
//         .input-base { @apply w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all; }
//         select:focus { outline: none; }
//         input:focus { outline: none; }
//         button:focus { outline: none; }
//       `}</style>

//       <div className="p-4 md:p-6">
//         {/* ── page header ── */}
//         <div className="flex items-center justify-end mb-3">
//           <button
//             onClick={() => fetchUsers(true)}
//             className={`flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm ${refreshing ? "animate-pulse" : ""}`}
//           >
//             <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* ── stat cards - responsive grid ── */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
//           {[
//             {
//               label: "Total",
//               val: stats.total,
//               icon: <Users size={16} />,
//               color: "from-indigo-500 to-violet-600",
//             },
//             {
//               label: "Verified",
//               val: stats.verified,
//               icon: <ShieldCheck size={16} />,
//               color: "from-emerald-400 to-teal-600",
//             },
//             {
//               label: "Pending",
//               val: stats.pending,
//               icon: <Clock size={16} />,
//               color: "from-amber-400 to-orange-500",
//             },
           
//             {
//               label: "Active",
//               val: stats.active,
//               icon: <Zap size={16} />,
//               color: "from-sky-400 to-blue-600",
//             },
//           ].map(({ label, val, icon, color }) => (
//             <div
//               key={label}
//               className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 flex items-center gap-2 md:gap-4 hover:shadow-md transition-shadow"
//             >
//               <div
//                 className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
//               >
//                 {icon}
//               </div>
//               <div>
//                 <p className="text-[10px] md:text-xs text-slate-400 font-medium">{label}</p>
//                 <p className="text-lg md:text-2xl font-bold text-slate-800 leading-none mt-0.5">
//                   {val}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── search + filter bar ── */}
//         <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* search */}
//             <div className="flex-1 relative">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//               />
//               <input
//                 className="input-base pl-9 pr-9"
//                 placeholder="Search business, name, mobile, email, GST, district…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//               {search && (
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setPage(1);
//                   }}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* filter toggle */}
//             <button
//               onClick={() => setFilterPanelOpen((v) => !v)}
//               className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-xs md:text-sm font-medium transition-all ${
//                 filterPanelOpen || activeFilters > 0
//                   ? "bg-indigo-50 border-indigo-200 text-indigo-700"
//                   : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
//               }`}
//             >
//               <Filter size={14} />
//               Filters
//               {activeFilters > 0 && (
//                 <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {activeFilters}
//                 </span>
//               )}
//             </button>

//             {/* per-page */}
//             <select
//               value={perPage}
//               onChange={(e) => {
//                 setPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="input-base w-auto pr-8 cursor-pointer focus:outline-none text-xs md:text-sm"
//             >
//               {ITEMS_PER_PAGE_OPTIONS.map((n) => (
//                 <option key={n} value={n}>
//                   {n} / page
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* expanded filter panel */}
//           {filterPanelOpen && (
//             <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Verification
//                 </label>
//                 <select
//                   value={filterVS}
//                   onChange={(e) => {
//                     setFilterVS(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="pending">Pending</option>
//                   <option value="verified">Verified</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Status
//                 </label>
//                 <select
//                   value={filterActive}
//                   onChange={(e) => {
//                     setFilterActive(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Business Type
//                 </label>
//                 <select
//                   value={filterBType}
//                   onChange={(e) => {
//                     setFilterBType(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All Types</option>
//                   {businessTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {activeFilters > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className="sm:col-span-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
//                 >
//                   <X size={13} /> Clear all filters
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── results meta ── */}
//         <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
//           <span>
//             Showing{" "}
//             <strong className="text-slate-600">{paginated.length}</strong> of{" "}
//             <strong className="text-slate-600">{sorted.length}</strong> results
//             {activeFilters > 0 || search
//               ? ` (filtered from ${users.length})`
//               : ""}
//           </span>
//           <span>
//             Page {safePage} of {totalPages}
//           </span>
//         </div>

//         {/* ── table ── */}
//         {paginated.length === 0 ? (
//           <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 md:py-20 text-slate-400">
//             <Users size={36} className="mb-3 opacity-30" />
//             <p className="font-semibold text-slate-500">No users found</p>
//             <p className="text-xs md:text-sm mt-1">Try adjusting your search or filters</p>
//             {(search || activeFilters > 0) && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* ── DESKTOP TABLE (Verification column removed) ── */}
//             <div
//               ref={tableRef}
//               className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4"
//             >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-slate-50/70">
//                       {[
//                         { label: "Business", key: "businessName" as SortKey },
//                         { label: "Contact", key: "name" as SortKey },
//                         { label: "Mobile", key: "mobileNumber" as SortKey },
//                         { label: "Active", key: "isActive" as SortKey },
//                         { label: "Joined", key: "createdAt" as SortKey },
//                       ].map(({ label, key }) => (
//                         <th
//                           key={key}
//                           className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
//                         >
//                           <button
//                             className="th-btn"
//                             onClick={() => handleSort(key)}
//                           >
//                             {label} <SortIcon col={key} />
//                           </button>
//                         </th>
//                       ))}
//                       <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {paginated.map((user) => (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-indigo-50/30 transition-colors group"
//                       >
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
//                             {user.businessName}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {user.businessType || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4">
//                           <p className="text-slate-700 font-medium">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
//                             {user.email || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4 text-slate-600 font-mono text-xs">
//                           {user.mobileNumber}
//                         </td>
//                         <td className="px-5 py-4">
//                           <ActivePill active={user.isActive} />
//                         </td>
//                         <td className="px-5 py-4 text-xs text-slate-400">
//                           {new Date(user.createdAt).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-1">
//                             {/* View Details Button */}
//                             <button
//                               title="View Details"
//                               onClick={() => setDetailUser(user)}
//                               className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                             >
//                               <Eye size={15} />
//                             </button>

//                             {/* For PENDING users - Show Verify & Reject buttons */}
//                             {user.verificationStatus === "pending" && (
//                               <>
//                                 <button
//                                   title="Verify"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "verify",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                                 >
//                                   <CheckCircle size={15} />
//                                 </button>
//                                 <button
//                                   title="Reject"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "reject",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                                 >
//                                   <XCircle size={15} />
//                                 </button>
//                               </>
//                             )}

//                             {/* For VERIFIED users - Show Reject & Reset buttons */}
//                             {user.verificationStatus === "verified" && (
//                               <>
//                                 <button
//                                   title="Reject"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "reject",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                                 >
//                                   <XCircle size={15} />
//                                 </button>
//                                 <button
//                                   title="Reset to Pending"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "resetToPending",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-amber-600 hover:bg-amber-50"
//                                 >
//                                   <Undo2 size={15} />
//                                 </button>
//                               </>
//                             )}

//                             {/* For REJECTED users - Show Verify & Reset buttons */}
//                             {user.verificationStatus === "rejected" && (
//                               <>
//                                 <button
//                                   title="Verify (Change to Verified)"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "verify",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                                 >
//                                   <Shield size={15} />
//                                 </button>
//                                 <button
//                                   title="Reset to Pending"
//                                   onClick={() =>
//                                     handleOpenConfirmModal({
//                                       type: "resetToPending",
//                                       userId: user._id,
//                                       userName: user.businessName,
//                                     })
//                                   }
//                                   className="action-btn text-slate-400 hover:text-amber-600 hover:bg-amber-50"
//                                 >
//                                   <Undo2 size={15} />
//                                 </button>
//                               </>
//                             )}

//                             {/* Toggle Active/Inactive Button - Always show */}
//                             <button
//                               title={user.isActive ? "Deactivate" : "Activate"}
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "toggleActive",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                   currentActive: user.isActive,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-violet-600 hover:bg-violet-50"
//                             >
//                               <Power size={15} />
//                             </button>

//                             {/* Delete Button - Always show */}
//                             <button
//                               title="Delete"
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "delete",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ── MOBILE CARDS (Verification pill visible) ── */}
//             <div className="md:hidden space-y-3 mb-4">
//               {paginated.map((user) => (
//                 <div
//                   key={user._id}
//                   className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-bold text-slate-800 text-base">
//                         {user.businessName}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {user.businessType || "—"}
//                       </p>
//                     </div>
//                     <StatusPill status={user.verificationStatus} />
//                   </div>
//                   <div className="space-y-1.5 text-xs text-slate-500 mb-3">
//                     <p>
//                       <span className="font-medium text-slate-600">Name: </span>
//                       {user.name}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Mobile:{" "}
//                       </span>
//                       <span className="font-mono">{user.mobileNumber}</span>
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Joined:{" "}
//                       </span>
//                       {new Date(user.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                     <div className="pt-1">
//                       <ActivePill active={user.isActive} />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-50">
//                     <button
//                       onClick={() => setDetailUser(user)}
//                       className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                     >
//                       <Eye size={16} />
//                     </button>

//                     {user.verificationStatus === "pending" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "verify",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-emerald-500 hover:bg-emerald-50"
//                         >
//                           <CheckCircle size={16} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "reject",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-rose-500 hover:bg-rose-50"
//                         >
//                           <XCircle size={16} />
//                         </button>
//                       </>
//                     )}

//                     {user.verificationStatus === "verified" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "reject",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-rose-500 hover:bg-rose-50"
//                         >
//                           <XCircle size={16} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "resetToPending",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-amber-500 hover:bg-amber-50"
//                         >
//                           <Undo2 size={16} />
//                         </button>
//                       </>
//                     )}

//                     {user.verificationStatus === "rejected" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "verify",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-emerald-500 hover:bg-emerald-50"
//                         >
//                           <Shield size={16} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleOpenConfirmModal({
//                               type: "resetToPending",
//                               userId: user._id,
//                               userName: user.businessName,
//                             })
//                           }
//                           className="action-btn text-amber-500 hover:bg-amber-50"
//                         >
//                           <Undo2 size={16} />
//                         </button>
//                       </>
//                     )}

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "toggleActive",
//                           userId: user._id,
//                           userName: user.businessName,
//                           currentActive: user.isActive,
//                         })
//                       }
//                       className="action-btn text-violet-500 hover:bg-violet-50"
//                     >
//                       <Power size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "delete",
//                           userId: user._id,
//                           userName: user.businessName,
//                         })
//                       }
//                       className="action-btn text-rose-500 hover:bg-rose-50"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── PAGINATION ── */}
//             {totalPages > 1 && (
//               <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm px-3 md:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
//                 <p className="text-xs text-slate-400">
//                   {(safePage - 1) * perPage + 1}–
//                   {Math.min(safePage * perPage, sorted.length)} of{" "}
//                   {sorted.length}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage(1)}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsLeft size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft size={14} />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (n) =>
//                         n === 1 ||
//                         n === totalPages ||
//                         Math.abs(n - safePage) <= 1,
//                     )
//                     .reduce<(number | "…")[]>((acc, n, i, arr) => {
//                       if (
//                         i > 0 &&
//                         typeof arr[i - 1] === "number" &&
//                         n - (arr[i - 1] as number) > 1
//                       )
//                         acc.push("…");
//                       acc.push(n);
//                       return acc;
//                     }, [])
//                     .map((n, i) =>
//                       n === "…" ? (
//                         <span
//                           key={`e${i}`}
//                           className="px-2 text-slate-300 text-xs"
//                         >
//                           …
//                         </span>
//                       ) : (
//                         <button
//                           key={n}
//                           onClick={() => setPage(n as number)}
//                           className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs font-semibold transition-all ${
//                             safePage === n
//                               ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
//                               : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
//                           }`}
//                         >
//                           {n}
//                         </button>
//                       ),
//                     )}

//                   <button
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage(totalPages)}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ════════════ MUI DETAIL MODAL ════════════ */}
//       <StyledDetailDialog
//         open={detailUser !== null}
//         onClose={() => setDetailUser(null)}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: "16px 24px",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//         >
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
//               {detailUser?.businessName}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#94a3b8" }}>
//               {detailUser?.businessType}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setDetailUser(null)} size="small">
//             <X size={18} />
//           </IconButton>
//         </Box>

//         <DialogContent sx={{ p: "24px", overflow: "auto" }}>
//           {detailUser && (
//             <div className="space-y-5">
//               <div className="flex gap-2 flex-wrap">
//                 <StatusPill status={detailUser.verificationStatus} />
//                 <ActivePill active={detailUser.isActive} />
//               </div>

//               {[
//                 {
//                   title: "Business Information",
//                   icon: <Building size={15} />,
//                   rows: [
//                     ["Business Name", detailUser.businessName],
//                     ["Business Type", detailUser.businessType || "N/A"],
//                     ["GST Number", detailUser.gstNumber || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Contact Details",
//                   icon: <Phone size={15} />,
//                   rows: [
//                     ["Contact Person", detailUser.name],
//                     ["Mobile Number", detailUser.mobileNumber],
//                     ["Email Address", detailUser.email || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Address Information",
//                   icon: <MapPin size={15} />,
//                   rows: [
//                     ["Full Address", detailUser.address || "Not Provided"],
//                     ["Village/City", detailUser.village || "Not Provided"],
//                     ["Taluk", detailUser.taluk || "Not Provided"],
//                     ["District", detailUser.district || "Not Provided"],
//                     ["State", detailUser.state || "Not Provided"],
//                   ],
//                 },
//               ].map((sec) => (
//                 <div
//                   key={sec.title}
//                   className="border border-slate-100 rounded-xl overflow-hidden"
//                 >
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     {sec.icon} {sec.title}
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {sec.rows.map(([k, v]) => (
//                       <div key={k} className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32 flex-shrink-0">
//                           {k}
//                         </span>
//                         <span className="text-slate-700 font-medium break-words">
//                           {v}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {(detailUser.verificationStatus === "verified" ||
//                 detailUser.verificationStatus === "rejected") && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <ShieldCheck size={15} /> Verification Details
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.verifiedBy && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified By</span>
//                         <span className="text-slate-700 font-medium">
//                           {detailUser.verifiedBy}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.verifiedDate && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified On</span>
//                         <span className="text-slate-700 font-medium">
//                           {new Date(detailUser.verifiedDate).toLocaleString(
//                             "en-IN",
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.rejectionReason && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">
//                           Rejection Reason
//                         </span>
//                         <span className="text-rose-600 font-medium">
//                           {detailUser.rejectionReason}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="border border-slate-100 rounded-xl overflow-hidden">
//                 <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                   <Calendar size={15} /> System Information
//                 </div>
//                 <div className="divide-y divide-slate-50">
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Account Created</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.createdAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Last Updated</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.updatedAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
//           <Button onClick={() => setDetailUser(null)}>Close</Button>
//         </DialogActions>
//       </StyledDetailDialog>

//       {/* ════════════ MUI CONFIRM MODAL ════════════ */}
//       <StyledDialog
//         open={confirmAction !== null}
//         onClose={() => {
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             pt: 3,
//           }}
//         >
//           <Box
//             sx={{
//               width: 56,
//               height: 56,
//               borderRadius: "16px",
//               backgroundColor: modalContent.bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "16px",
//             }}
//           >
//             {modalContent.icon}
//           </Box>
//         </Box>
//         <StyledDialogTitle>
//           <Typography variant="h6" component="span">
//             {modalContent.title}
//           </Typography>
//         </StyledDialogTitle>
//         <StyledDialogContent>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#64748b",
//               mb: confirmAction?.type === "reject" ? 2 : 0,
//             }}
//           >
//             {modalContent.message}
//           </Typography>

//           {confirmAction?.type === "reject" && (
//             <TextField
//               autoFocus
//               multiline
//               rows={3}
//               fullWidth
//               variant="outlined"
//               label="Rejection Reason"
//               placeholder="Please provide a detailed reason for rejection..."
//               value={rejectionReasonText}
//               onChange={(e) => setRejectionReasonText(e.target.value)}
//               sx={{
//                 mt: 2,
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "12px",
//                 },
//               }}
//             />
//           )}
//         </StyledDialogContent>
//         <StyledDialogActions>
//           <Button
//             onClick={() => {
//               setConfirmAction(null);
//               setRejectionReasonText("");
//             }}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               color: "#475569",
//               border: "1px solid #e2e8f0",
//               "&:hover": {
//                 backgroundColor: "#f8fafc",
//                 borderColor: "#cbd5e1",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmAction}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               backgroundColor:
//                 confirmAction?.type === "verify"
//                   ? "#10b981"
//                   : confirmAction?.type === "resetToPending"
//                     ? "#f59e0b"
//                     : confirmAction?.type === "toggleActive"
//                       ? "#8b5cf6"
//                       : "#f43f5e",
//               color: "white",
//               "&:hover": {
//                 backgroundColor:
//                   confirmAction?.type === "verify"
//                     ? "#059669"
//                     : confirmAction?.type === "resetToPending"
//                       ? "#d97706"
//                       : confirmAction?.type === "toggleActive"
//                         ? "#7c3aed"
//                         : "#e11d48",
//               },
//             }}
//           >
//             Confirm
//           </Button>
//         </StyledDialogActions>
//       </StyledDialog>
//     </div>
//   );
// };

// export default B2BUsers;















// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Power,
//   Search,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   RefreshCw,
//   Users,
//   ShieldCheck,
//   Clock,
//   Zap,
//   AlertTriangle,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Undo2,
//   Ban,
//   Shield,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// /* ─────────────────────────── types ─────────────────────────── */
// interface User {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber: string;
//   name: string;
//   email: string;
//   address: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   role: string;
//   isActive: boolean;
//   rejectionReason?: string;
//   verificationStatus?: "pending" | "verified" | "rejected";
//   verifiedBy?: string;
//   verifiedDate?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// type SortKey = keyof Pick<
//   User,
//   | "businessName"
//   | "name"
//   | "mobileNumber"
//   | "isActive"
//   | "createdAt"
// >;
// type SortDir = "asc" | "desc";

// interface ConfirmAction {
//   type: "verify" | "toggleActive" | "delete";
//   userId: string;
//   userName: string;
//   currentActive?: boolean;
//   currentStatus?: string;
// }

// interface B2BUsersProps {
//   adminSession?: { name: string };
// }

// /* ─────────────────────────── helpers ───────────────────────── */
// const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// // Styled MUI Dialog components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     padding: "8px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "480px",
//     width: "100%",
//     margin: "16px",
//   },
// }));

// const StyledDetailDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "720px",
//     width: "100%",
//     margin: "16px",
//     maxHeight: "90vh",
//     overflow: "hidden",
//   },
// }));

// const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
//   textAlign: "center",
//   padding: "24px 24px 8px 24px",
//   "& .MuiTypography-root": {
//     fontWeight: 700,
//     fontSize: "1.25rem",
//     color: "#1e293b",
//   },
// }));

// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//   textAlign: "center",
//   padding: "8px 24px 24px 24px",
// }));

// const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
//   padding: "8px 24px 24px 24px",
//   gap: "12px",
// }));

// function StatusPill({
//   status,
// }: {
//   status: User["verificationStatus"] | undefined | null;
// }) {
//   const safeStatus = status ?? "pending";
//   const map = {
//     verified: {
//       cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
//       icon: <ShieldCheck size={11} />,
//     },
//     rejected: {
//       cls: "bg-rose-50 text-rose-700 border-rose-200",
//       icon: <XCircle size={11} />,
//     },
//     pending: {
//       cls: "bg-amber-50 text-amber-700 border-amber-200",
//       icon: <Clock size={11} />,
//     },
//   } as const;
//   const { cls, icon } = map[safeStatus as keyof typeof map] ?? map.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}
//     >
//       {icon}
//       {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
//     </span>
//   );
// }

// function ActivePill({ active }: { active: boolean }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
//         active
//           ? "bg-blue-50 text-blue-700 border-blue-200"
//           : "bg-slate-100 text-slate-500 border-slate-200"
//       }`}
//     >
//       <span
//         className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-400"}`}
//       />
//       {active ? "Active" : "Inactive"}
//     </span>
//   );
// }

// /* ─────────────────────────── main component ─────────────────── */
// const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     verified: 0,
//     pending: 0,
//     rejected: 0,
//     active: 0,
//     inactive: 0,
//   });
//   const [businessTypes, setBusinessTypes] = useState<string[]>([]);

//   // filters
//   const [search, setSearch] = useState("");
//   const [filterVS, setFilterVS] = useState<string>("all");
//   const [filterActive, setFilterActive] = useState<string>("all");
//   const [filterBType, setFilterBType] = useState<string>("all");

//   // sort
//   const [sortKey, setSortKey] = useState<SortKey>("createdAt");
//   const [sortDir, setSortDir] = useState<SortDir>("desc");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   // modals
//   const [detailUser, setDetailUser] = useState<User | null>(null);
//   const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
//     null,
//   );
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [rejectionReasonText, setRejectionReasonText] = useState("");

//   const tableRef = useRef<HTMLDivElement>(null);

//   /* ── fetch ── */
//   const fetchUsers = useCallback(async (quiet = false) => {
//     quiet ? setRefreshing(true) : setLoading(true);
//     try {
//       const res = await fetch("/api/b2b-users");
//       const data = await res.json();
//       if (data.success) {
//         setUsers(data.users);
//         setStats(data.stats);
//         setBusinessTypes(data.businessTypes || []);
//       } else {
//         toast.error(data.message || "Failed to load users");
//       }
//     } catch {
//       toast.error("Network error — could not load users");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   /* ── derived filter / sort / paginate ── */
//   const filtered = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       u.businessName.toLowerCase().includes(q) ||
//       u.name.toLowerCase().includes(q) ||
//       u.mobileNumber.includes(q) ||
//       (u.email || "").toLowerCase().includes(q) ||
//       (u.district || "").toLowerCase().includes(q) ||
//       (u.gstNumber || "").toLowerCase().includes(q);

//     const matchVS =
//       filterVS === "all" || (u.verificationStatus ?? "pending") === filterVS;
//     const matchActive =
//       filterActive === "all" || String(u.isActive) === filterActive;
//     const matchBType = filterBType === "all" || u.businessType === filterBType;

//     return matchSearch && matchVS && matchActive && matchBType;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     let av: any = a[sortKey];
//     let bv: any = b[sortKey];
//     if (sortKey === "isActive") {
//       av = a.isActive ? 1 : 0;
//       bv = b.isActive ? 1 : 0;
//     }
//     if (typeof av === "string") av = av.toLowerCase();
//     if (typeof bv === "string") bv = bv.toLowerCase();
//     if (av < bv) return sortDir === "asc" ? -1 : 1;
//     if (av > bv) return sortDir === "asc" ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   const safePage = Math.min(page, totalPages);
//   const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);
//   const activeFilters = [
//     filterVS !== "all",
//     filterActive !== "all",
//     filterBType !== "all",
//   ].filter(Boolean).length;

//   /* ── sort toggle ── */
//   const handleSort = (key: SortKey) => {
//     if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const SortIcon = ({ col }: { col: SortKey }) =>
//     sortKey === col ? (
//       sortDir === "asc" ? (
//         <ChevronUp size={13} className="text-indigo-500" />
//       ) : (
//         <ChevronDown size={13} className="text-indigo-500" />
//       )
//     ) : (
//       <ChevronsUpDown size={13} className="text-slate-300" />
//     );

//   /* ── actions ── */
//   const handleConfirmAction = async () => {
//     if (!confirmAction) return;
//     const { type, userId, currentActive } = confirmAction;

//     try {
//       if (type === "delete") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "DELETE",
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User deleted successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "toggleActive") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isActive: !currentActive }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(
//             data.message ||
//               `User ${!currentActive ? "activated" : "deactivated"} successfully`,
//           );
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "verify") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "verified",
//             verifiedBy: adminSession?.name || "Admin",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User verified successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Action failed — try again");
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilterVS("all");
//     setFilterActive("all");
//     setFilterBType("all");
//     setPage(1);
//   };

//   const handleOpenConfirmModal = (action: ConfirmAction) => {
//     setRejectionReasonText("");
//     setConfirmAction(action);
//   };

//   const getModalContent = () => {
//     if (!confirmAction)
//       return { icon: null, title: "", message: "", bgColor: "" };

//     switch (confirmAction.type) {
//       case "verify":
//         return {
//           icon: <CheckCircle size={26} className="text-emerald-500" />,
//           title: "Verify User",
//           message: (
//             <>
//               Confirm verification for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#ecfdf5",
//         };
//       case "toggleActive":
//         return {
//           icon: <Power size={26} className="text-violet-500" />,
//           title: confirmAction.currentActive
//             ? "Deactivate User"
//             : "Activate User",
//           message: (
//             <>
//               {confirmAction.currentActive ? "Deactivate" : "Activate"} user{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#f5f3ff",
//         };
//       case "delete":
//         return {
//           icon: <AlertTriangle size={26} className="text-rose-500" />,
//           title: "Delete User",
//           message: (
//             <>
//               Are you sure you want to permanently delete{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ? This cannot be undone.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       default:
//         return { icon: null, title: "", message: "", bgColor: "" };
//     }
//   };

//   const modalContent = getModalContent();

//   /* ── loading skeleton ── */
//   if (loading)
//     return (
//       <div className="space-y-4 animate-pulse p-6">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
//           ))}
//         </div>
//         <div className="h-12 bg-slate-100 rounded-xl" />
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="h-14 border-b border-slate-50 bg-slate-50 mx-4 my-1 rounded-lg"
//             />
//           ))}
//         </div>
//       </div>
//     );

//   /* ═══════════════════════════ RENDER ══════════════════════════ */
//   return (
//     <div className="min-h-screen font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
//         .th-btn { @apply flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 transition-colors; }
//         .action-btn { @apply p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95; }
//         .input-base { @apply w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all; }
//         select:focus { outline: none; }
//         input:focus { outline: none; }
//         button:focus { outline: none; }
//       `}</style>

//       <div className="p-4 md:p-6">
//         {/* ── page header ── */}
//         <div className="flex items-center justify-end mb-3">
//           <button
//             onClick={() => fetchUsers(true)}
//             className={`flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm ${refreshing ? "animate-pulse" : ""}`}
//           >
//             <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* ── stat cards - responsive grid ── */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
//           {[
//             {
//               label: "Total",
//               val: stats.total,
//               icon: <Users size={16} />,
//               color: "from-indigo-500 to-violet-600",
//             },
//             {
//               label: "Verified",
//               val: stats.verified,
//               icon: <ShieldCheck size={16} />,
//               color: "from-emerald-400 to-teal-600",
//             },
//             {
//               label: "Pending",
//               val: stats.pending,
//               icon: <Clock size={16} />,
//               color: "from-amber-400 to-orange-500",
//             },
//             {
//               label: "Active",
//               val: stats.active,
//               icon: <Zap size={16} />,
//               color: "from-sky-400 to-blue-600",
//             },
//           ].map(({ label, val, icon, color }) => (
//             <div
//               key={label}
//               className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 flex items-center gap-2 md:gap-4 hover:shadow-md transition-shadow"
//             >
//               <div
//                 className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
//               >
//                 {icon}
//               </div>
//               <div>
//                 <p className="text-[10px] md:text-xs text-slate-400 font-medium">{label}</p>
//                 <p className="text-lg md:text-2xl font-bold text-slate-800 leading-none mt-0.5">
//                   {val}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── search + filter bar ── */}
//         <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* search */}
//             <div className="flex-1 relative">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//               />
//               <input
//                 className="input-base pl-9 pr-9"
//                 placeholder="Search business, name, mobile, email, GST, district…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//               {search && (
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setPage(1);
//                   }}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* filter toggle */}
//             <button
//               onClick={() => setFilterPanelOpen((v) => !v)}
//               className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-xs md:text-sm font-medium transition-all ${
//                 filterPanelOpen || activeFilters > 0
//                   ? "bg-indigo-50 border-indigo-200 text-indigo-700"
//                   : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
//               }`}
//             >
//               <Filter size={14} />
//               Filters
//               {activeFilters > 0 && (
//                 <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {activeFilters}
//                 </span>
//               )}
//             </button>

//             {/* per-page */}
//             <select
//               value={perPage}
//               onChange={(e) => {
//                 setPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="input-base w-auto pr-8 cursor-pointer focus:outline-none text-xs md:text-sm"
//             >
//               {ITEMS_PER_PAGE_OPTIONS.map((n) => (
//                 <option key={n} value={n}>
//                   {n} / page
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* expanded filter panel */}
//           {filterPanelOpen && (
//             <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Verification
//                 </label>
//                 <select
//                   value={filterVS}
//                   onChange={(e) => {
//                     setFilterVS(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="pending">Pending</option>
//                   <option value="verified">Verified</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Status
//                 </label>
//                 <select
//                   value={filterActive}
//                   onChange={(e) => {
//                     setFilterActive(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Business Type
//                 </label>
//                 <select
//                   value={filterBType}
//                   onChange={(e) => {
//                     setFilterBType(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All Types</option>
//                   {businessTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {activeFilters > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className="sm:col-span-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
//                 >
//                   <X size={13} /> Clear all filters
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── results meta ── */}
//         <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
//           <span>
//             Showing{" "}
//             <strong className="text-slate-600">{paginated.length}</strong> of{" "}
//             <strong className="text-slate-600">{sorted.length}</strong> results
//             {activeFilters > 0 || search
//               ? ` (filtered from ${users.length})`
//               : ""}
//           </span>
//           <span>
//             Page {safePage} of {totalPages}
//           </span>
//         </div>

//         {/* ── table ── */}
//         {paginated.length === 0 ? (
//           <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 md:py-20 text-slate-400">
//             <Users size={36} className="mb-3 opacity-30" />
//             <p className="font-semibold text-slate-500">No users found</p>
//             <p className="text-xs md:text-sm mt-1">Try adjusting your search or filters</p>
//             {(search || activeFilters > 0) && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* ── DESKTOP TABLE ── */}
//             <div
//               ref={tableRef}
//               className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4"
//             >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-slate-50/70">
//                       {[
//                         { label: "Business", key: "businessName" as SortKey },
//                         { label: "Contact", key: "name" as SortKey },
//                         { label: "Mobile", key: "mobileNumber" as SortKey },
//                         { label: "Active", key: "isActive" as SortKey },
//                         { label: "Joined", key: "createdAt" as SortKey },
//                       ].map(({ label, key }) => (
//                         <th
//                           key={key}
//                           className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
//                         >
//                           <button
//                             className="th-btn"
//                             onClick={() => handleSort(key)}
//                           >
//                             {label} <SortIcon col={key} />
//                           </button>
//                         </th>
//                       ))}
//                       <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {paginated.map((user) => (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-indigo-50/30 transition-colors group"
//                       >
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
//                             {user.businessName}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {user.businessType || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4">
//                           <p className="text-slate-700 font-medium">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
//                             {user.email || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4 text-slate-600 font-mono text-xs">
//                           {user.mobileNumber}
//                         </td>
//                         <td className="px-5 py-4">
//                           <ActivePill active={user.isActive} />
//                         </td>
//                         <td className="px-5 py-4 text-xs text-slate-400">
//                           {new Date(user.createdAt).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-1">
//                             {/* View Details Button */}
//                             <button
//                               title="View Details"
//                               onClick={() => setDetailUser(user)}
//                               className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                             >
//                               <Eye size={15} />
//                             </button>

//                             {/* Verify Button - Show only for pending users */}
//                             {user.verificationStatus === "pending" && (
//                               <button
//                                 title="Verify"
//                                 onClick={() =>
//                                   handleOpenConfirmModal({
//                                     type: "verify",
//                                     userId: user._id,
//                                     userName: user.businessName,
//                                   })
//                                 }
//                                 className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                               >
//                                 <CheckCircle size={15} />
//                               </button>
//                             )}

//                             {/* Toggle Active/Inactive Button - Always show */}
//                             <button
//                               title={user.isActive ? "Deactivate" : "Activate"}
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "toggleActive",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                   currentActive: user.isActive,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-violet-600 hover:bg-violet-50"
//                             >
//                               <Power size={15} />
//                             </button>

//                             {/* Delete Button - Always show */}
//                             <button
//                               title="Delete"
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "delete",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ── MOBILE CARDS ── */}
//             <div className="md:hidden space-y-3 mb-4">
//               {paginated.map((user) => (
//                 <div
//                   key={user._id}
//                   className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-bold text-slate-800 text-base">
//                         {user.businessName}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {user.businessType || "—"}
//                       </p>
//                     </div>
//                     <StatusPill status={user.verificationStatus} />
//                   </div>
//                   <div className="space-y-1.5 text-xs text-slate-500 mb-3">
//                     <p>
//                       <span className="font-medium text-slate-600">Name: </span>
//                       {user.name}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Mobile:{" "}
//                       </span>
//                       <span className="font-mono">{user.mobileNumber}</span>
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Joined:{" "}
//                       </span>
//                       {new Date(user.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                     <div className="pt-1">
//                       <ActivePill active={user.isActive} />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-50">
//                     <button
//                       onClick={() => setDetailUser(user)}
//                       className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                     >
//                       <Eye size={16} />
//                     </button>

//                     {/* Verify Button - Show only for pending users */}
//                     {user.verificationStatus === "pending" && (
//                       <button
//                         onClick={() =>
//                           handleOpenConfirmModal({
//                             type: "verify",
//                             userId: user._id,
//                             userName: user.businessName,
//                           })
//                         }
//                         className="action-btn text-emerald-500 hover:bg-emerald-50"
//                       >
//                         <CheckCircle size={16} />
//                       </button>
//                     )}

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "toggleActive",
//                           userId: user._id,
//                           userName: user.businessName,
//                           currentActive: user.isActive,
//                         })
//                       }
//                       className="action-btn text-violet-500 hover:bg-violet-50"
//                     >
//                       <Power size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "delete",
//                           userId: user._id,
//                           userName: user.businessName,
//                         })
//                       }
//                       className="action-btn text-rose-500 hover:bg-rose-50"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── PAGINATION ── */}
//             {totalPages > 1 && (
//               <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm px-3 md:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
//                 <p className="text-xs text-slate-400">
//                   {(safePage - 1) * perPage + 1}–
//                   {Math.min(safePage * perPage, sorted.length)} of{" "}
//                   {sorted.length}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage(1)}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsLeft size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft size={14} />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (n) =>
//                         n === 1 ||
//                         n === totalPages ||
//                         Math.abs(n - safePage) <= 1,
//                     )
//                     .reduce<(number | "…")[]>((acc, n, i, arr) => {
//                       if (
//                         i > 0 &&
//                         typeof arr[i - 1] === "number" &&
//                         n - (arr[i - 1] as number) > 1
//                       )
//                         acc.push("…");
//                       acc.push(n);
//                       return acc;
//                     }, [])
//                     .map((n, i) =>
//                       n === "…" ? (
//                         <span
//                           key={`e${i}`}
//                           className="px-2 text-slate-300 text-xs"
//                         >
//                           …
//                         </span>
//                       ) : (
//                         <button
//                           key={n}
//                           onClick={() => setPage(n as number)}
//                           className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs font-semibold transition-all ${
//                             safePage === n
//                               ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
//                               : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
//                           }`}
//                         >
//                           {n}
//                         </button>
//                       ),
//                     )}

//                   <button
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage(totalPages)}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ════════════ MUI DETAIL MODAL ════════════ */}
//       <StyledDetailDialog
//         open={detailUser !== null}
//         onClose={() => setDetailUser(null)}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: "16px 24px",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//         >
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
//               {detailUser?.businessName}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#94a3b8" }}>
//               {detailUser?.businessType}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setDetailUser(null)} size="small">
//             <X size={18} />
//           </IconButton>
//         </Box>

//         <DialogContent sx={{ p: "24px", overflow: "auto" }}>
//           {detailUser && (
//             <div className="space-y-5">
//               <div className="flex gap-2 flex-wrap">
//                 <StatusPill status={detailUser.verificationStatus} />
//                 <ActivePill active={detailUser.isActive} />
//               </div>

//               {[
//                 {
//                   title: "Business Information",
//                   icon: <Building size={15} />,
//                   rows: [
//                     ["Business Name", detailUser.businessName],
//                     ["Business Type", detailUser.businessType || "N/A"],
//                     ["GST Number", detailUser.gstNumber || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Contact Details",
//                   icon: <Phone size={15} />,
//                   rows: [
//                     ["Contact Person", detailUser.name],
//                     ["Mobile Number", detailUser.mobileNumber],
//                     ["Email Address", detailUser.email || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Address Information",
//                   icon: <MapPin size={15} />,
//                   rows: [
//                     ["Full Address", detailUser.address || "Not Provided"],
//                     ["Village/City", detailUser.village || "Not Provided"],
//                     ["Taluk", detailUser.taluk || "Not Provided"],
//                     ["District", detailUser.district || "Not Provided"],
//                     ["State", detailUser.state || "Not Provided"],
//                   ],
//                 },
//               ].map((sec) => (
//                 <div
//                   key={sec.title}
//                   className="border border-slate-100 rounded-xl overflow-hidden"
//                 >
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     {sec.icon} {sec.title}
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {sec.rows.map(([k, v]) => (
//                       <div key={k} className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32 flex-shrink-0">
//                           {k}
//                         </span>
//                         <span className="text-slate-700 font-medium break-words">
//                           {v}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {(detailUser.verificationStatus === "verified" ||
//                 detailUser.verificationStatus === "rejected") && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <ShieldCheck size={15} /> Verification Details
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.verifiedBy && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified By</span>
//                         <span className="text-slate-700 font-medium">
//                           {detailUser.verifiedBy}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.verifiedDate && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified On</span>
//                         <span className="text-slate-700 font-medium">
//                           {new Date(detailUser.verifiedDate).toLocaleString(
//                             "en-IN",
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.rejectionReason && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">
//                           Rejection Reason
//                         </span>
//                         <span className="text-rose-600 font-medium">
//                           {detailUser.rejectionReason}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="border border-slate-100 rounded-xl overflow-hidden">
//                 <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                   <Calendar size={15} /> System Information
//                 </div>
//                 <div className="divide-y divide-slate-50">
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Account Created</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.createdAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Last Updated</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.updatedAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
//           <Button onClick={() => setDetailUser(null)}>Close</Button>
//         </DialogActions>
//       </StyledDetailDialog>

//       {/* ════════════ MUI CONFIRM MODAL ════════════ */}
//       <StyledDialog
//         open={confirmAction !== null}
//         onClose={() => {
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             pt: 3,
//           }}
//         >
//           <Box
//             sx={{
//               width: 56,
//               height: 56,
//               borderRadius: "16px",
//               backgroundColor: modalContent.bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "16px",
//             }}
//           >
//             {modalContent.icon}
//           </Box>
//         </Box>
//         <StyledDialogTitle>
//           <Typography variant="h6" component="span">
//             {modalContent.title}
//           </Typography>
//         </StyledDialogTitle>
//         <StyledDialogContent>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#64748b",
//             }}
//           >
//             {modalContent.message}
//           </Typography>
//         </StyledDialogContent>
//         <StyledDialogActions>
//           <Button
//             onClick={() => {
//               setConfirmAction(null);
//               setRejectionReasonText("");
//             }}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               color: "#475569",
//               border: "1px solid #e2e8f0",
//               "&:hover": {
//                 backgroundColor: "#f8fafc",
//                 borderColor: "#cbd5e1",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmAction}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               backgroundColor:
//                 confirmAction?.type === "verify"
//                   ? "#10b981"
//                   : confirmAction?.type === "toggleActive"
//                     ? "#8b5cf6"
//                     : "#f43f5e",
//               color: "white",
//               "&:hover": {
//                 backgroundColor:
//                   confirmAction?.type === "verify"
//                     ? "#059669"
//                     : confirmAction?.type === "toggleActive"
//                       ? "#7c3aed"
//                       : "#e11d48",
//               },
//             }}
//           >
//             Confirm
//           </Button>
//         </StyledDialogActions>
//       </StyledDialog>
//     </div>
//   );
// };

// export default B2BUsers;
















// /////////////
// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Power,
//   Search,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   RefreshCw,
//   Users,
//   ShieldCheck,
//   Clock,
//   Zap,
//   AlertTriangle,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Undo2,
//   Ban,
//   Shield,
//   FileText,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// /* ─────────────────────────── types ─────────────────────────── */
// interface KYCImage {
//   docType: string;
//   docNumber: string;
//   documentUrl: string;
//   status: "pending" | "verified" | "rejected";
//   submittedAt: string;
//   _id: string;
//   rejectionReason?: string;
// }

// interface User {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber: string;
//   name: string;
//   email: string;
//   address: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   role: string;
//   isActive: boolean;
//   rejectionReason?: string;
//   verificationStatus?: "pending" | "verified" | "rejected";
//   verifiedBy?: string;
//   verifiedDate?: string;
//   createdAt: string;
//   updatedAt: string;
//   kycDocuments?: KYCImage[]; // added
// }

// type SortKey = keyof Pick<
//   User,
//   | "businessName"
//   | "name"
//   | "mobileNumber"
//   | "isActive"
//   | "createdAt"
// >;
// type SortDir = "asc" | "desc";

// interface ConfirmAction {
//   type: "verify" | "toggleActive" | "delete";
//   userId: string;
//   userName: string;
//   currentActive?: boolean;
//   currentStatus?: string;
// }

// interface B2BUsersProps {
//   adminSession?: { name: string };
// }

// /* ─────────────────────────── helpers ───────────────────────── */
// const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// // Styled MUI Dialog components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     padding: "8px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "480px",
//     width: "100%",
//     margin: "16px",
//   },
// }));

// const StyledDetailDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "720px",
//     width: "100%",
//     margin: "16px",
//     maxHeight: "90vh",
//     overflow: "hidden",
//   },
// }));

// const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
//   textAlign: "center",
//   padding: "24px 24px 8px 24px",
//   "& .MuiTypography-root": {
//     fontWeight: 700,
//     fontSize: "1.25rem",
//     color: "#1e293b",
//   },
// }));

// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//   textAlign: "center",
//   padding: "8px 24px 24px 24px",
// }));

// const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
//   padding: "8px 24px 24px 24px",
//   gap: "12px",
// }));

// function StatusPill({
//   status,
// }: {
//   status: User["verificationStatus"] | undefined | null;
// }) {
//   const safeStatus = status ?? "pending";
//   const map = {
//     verified: {
//       cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
//       icon: <ShieldCheck size={11} />,
//     },
//     rejected: {
//       cls: "bg-rose-50 text-rose-700 border-rose-200",
//       icon: <XCircle size={11} />,
//     },
//     pending: {
//       cls: "bg-amber-50 text-amber-700 border-amber-200",
//       icon: <Clock size={11} />,
//     },
//   } as const;
//   const { cls, icon } = map[safeStatus as keyof typeof map] ?? map.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}
//     >
//       {icon}
//       {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
//     </span>
//   );
// }

// function ActivePill({ active }: { active: boolean }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
//         active
//           ? "bg-blue-50 text-blue-700 border-blue-200"
//           : "bg-slate-100 text-slate-500 border-slate-200"
//       }`}
//     >
//       <span
//         className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-400"}`}
//       />
//       {active ? "Active" : "Inactive"}
//     </span>
//   );
// }

// /* ─────────────────────────── main component ─────────────────── */
// const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     verified: 0,
//     pending: 0,
//     rejected: 0,
//     active: 0,
//     inactive: 0,
//   });
//   const [businessTypes, setBusinessTypes] = useState<string[]>([]);

//   // filters
//   const [search, setSearch] = useState("");
//   const [filterVS, setFilterVS] = useState<string>("all");
//   const [filterActive, setFilterActive] = useState<string>("all");
//   const [filterBType, setFilterBType] = useState<string>("all");

//   // sort
//   const [sortKey, setSortKey] = useState<SortKey>("createdAt");
//   const [sortDir, setSortDir] = useState<SortDir>("desc");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   // modals
//   const [detailUser, setDetailUser] = useState<User | null>(null);
//   const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
//     null,
//   );
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [rejectionReasonText, setRejectionReasonText] = useState("");
//   const [kycActionLoading, setKycActionLoading] = useState<{
//   docId: string;
//   action: "verified" | "rejected";
// } | null>(null);

//   const tableRef = useRef<HTMLDivElement>(null);

//   /* ── fetch ── */
//   const fetchUsers = useCallback(async (quiet = false) => {
//     quiet ? setRefreshing(true) : setLoading(true);
//     try {
//       const res = await fetch("/api/b2b-users");
//       const data = await res.json();
//       if (data.success) {
//         setUsers(data.users);
//         setStats(data.stats);
//         setBusinessTypes(data.businessTypes || []);
//       } else {
//         toast.error(data.message || "Failed to load users");
//       }
//     } catch {
//       toast.error("Network error — could not load users");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   /* ── derived filter / sort / paginate ── */
//   const filtered = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       u.businessName.toLowerCase().includes(q) ||
//       u.name.toLowerCase().includes(q) ||
//       u.mobileNumber.includes(q) ||
//       (u.email || "").toLowerCase().includes(q) ||
//       (u.district || "").toLowerCase().includes(q) ||
//       (u.gstNumber || "").toLowerCase().includes(q);

//     const matchVS =
//       filterVS === "all" || (u.verificationStatus ?? "pending") === filterVS;
//     const matchActive =
//       filterActive === "all" || String(u.isActive) === filterActive;
//     const matchBType = filterBType === "all" || u.businessType === filterBType;

//     return matchSearch && matchVS && matchActive && matchBType;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     let av: any = a[sortKey];
//     let bv: any = b[sortKey];
//     if (sortKey === "isActive") {
//       av = a.isActive ? 1 : 0;
//       bv = b.isActive ? 1 : 0;
//     }
//     if (typeof av === "string") av = av.toLowerCase();
//     if (typeof bv === "string") bv = bv.toLowerCase();
//     if (av < bv) return sortDir === "asc" ? -1 : 1;
//     if (av > bv) return sortDir === "asc" ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   const safePage = Math.min(page, totalPages);
//   const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);
//   const activeFilters = [
//     filterVS !== "all",
//     filterActive !== "all",
//     filterBType !== "all",
//   ].filter(Boolean).length;

//   /* ── sort toggle ── */
//   const handleSort = (key: SortKey) => {
//     if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const SortIcon = ({ col }: { col: SortKey }) =>
//     sortKey === col ? (
//       sortDir === "asc" ? (
//         <ChevronUp size={13} className="text-indigo-500" />
//       ) : (
//         <ChevronDown size={13} className="text-indigo-500" />
//       )
//     ) : (
//       <ChevronsUpDown size={13} className="text-slate-300" />
//     );

//   /* ── KYC action handler ── */
// const handleKycAction = async (
//   docId: string,
//   status: "verified" | "rejected",
//   rejectionReason?: string
// ) => {
//   if (!detailUser) return;
//   try {
//     // ✅ New endpoint: /api/kyc/{userId}
//     const res = await fetch(`/api/kyc/${detailUser._id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         docId,                 // KYC document ID
//         status,
//         rejectionReason: rejectionReason || "",
//       }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       toast.success(`KYC document ${status === "verified" ? "approved" : "rejected"}`);
//       await fetchUsers(true);
//       // Update detailUser
//       if (detailUser) {
//         const updatedDoc = data.updatedDocument;
//         const updatedKyc = detailUser.kycDocuments?.map((doc) =>
//           doc._id === updatedDoc._id ? { ...doc, status: updatedDoc.status } : doc
//         );
//         setDetailUser({
//           ...detailUser,
//           kycDocuments: updatedKyc,
//           verificationStatus: data.overallStatus,
//         });
//       }
//     } else {
//       toast.error(data.message || "Failed to update KYC");
//     }
//   } catch (error: any) {
//     toast.error(error.message || "Network error");
//   } finally {
//     setKycActionLoading(null);
//   }
// };

//   /* ── existing actions ── */
//   const handleConfirmAction = async () => {
//     if (!confirmAction) return;
//     const { type, userId, currentActive } = confirmAction;

//     try {
//       if (type === "delete") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "DELETE",
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User deleted successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "toggleActive") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isActive: !currentActive }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(
//             data.message ||
//               `User ${!currentActive ? "activated" : "deactivated"} successfully`,
//           );
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "verify") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "verified",
//             verifiedBy: adminSession?.name || "Admin",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User verified successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Action failed — try again");
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilterVS("all");
//     setFilterActive("all");
//     setFilterBType("all");
//     setPage(1);
//   };

//   const handleOpenConfirmModal = (action: ConfirmAction) => {
//     setRejectionReasonText("");
//     setConfirmAction(action);
//   };

//   const getModalContent = () => {
//     if (!confirmAction)
//       return { icon: null, title: "", message: "", bgColor: "" };

//     switch (confirmAction.type) {
//       case "verify":
//         return {
//           icon: <CheckCircle size={26} className="text-emerald-500" />,
//           title: "Verify User",
//           message: (
//             <>
//               Confirm verification for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#ecfdf5",
//         };
//       case "toggleActive":
//         return {
//           icon: <Power size={26} className="text-violet-500" />,
//           title: confirmAction.currentActive
//             ? "Deactivate User"
//             : "Activate User",
//           message: (
//             <>
//               {confirmAction.currentActive ? "Deactivate" : "Activate"} user{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#f5f3ff",
//         };
//       case "delete":
//         return {
//           icon: <AlertTriangle size={26} className="text-rose-500" />,
//           title: "Delete User",
//           message: (
//             <>
//               Are you sure you want to permanently delete{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ? This cannot be undone.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       default:
//         return { icon: null, title: "", message: "", bgColor: "" };
//     }
//   };

//   const modalContent = getModalContent();

//   /* ── loading skeleton ── */
//   if (loading)
//     return (
//       <div className="space-y-4 animate-pulse p-6">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
//           ))}
//         </div>
//         <div className="h-12 bg-slate-100 rounded-xl" />
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="h-14 border-b border-slate-50 bg-slate-50 mx-4 my-1 rounded-lg"
//             />
//           ))}
//         </div>
//       </div>
//     );

//   /* ═══════════════════════════ RENDER ══════════════════════════ */
//   return (
//     <div className="min-h-screen font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
//         .th-btn { @apply flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 transition-colors; }
//         .action-btn { @apply p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95; }
//         .input-base { @apply w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all; }
//         select:focus { outline: none; }
//         input:focus { outline: none; }
//         button:focus { outline: none; }
//       `}</style>

//       <div className="p-4 md:p-6">
//         {/* ── page header ── */}
//         <div className="flex items-center justify-end mb-3">
//           <button
//             onClick={() => fetchUsers(true)}
//             className={`flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm ${refreshing ? "animate-pulse" : ""}`}
//           >
//             <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* ── stat cards - responsive grid ── */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
//           {[
//             {
//               label: "Total",
//               val: stats.total,
//               icon: <Users size={16} />,
//               color: "from-indigo-500 to-violet-600",
//             },
//             {
//               label: "Verified",
//               val: stats.verified,
//               icon: <ShieldCheck size={16} />,
//               color: "from-emerald-400 to-teal-600",
//             },
//             {
//               label: "Pending",
//               val: stats.pending,
//               icon: <Clock size={16} />,
//               color: "from-amber-400 to-orange-500",
//             },
//             {
//               label: "Active",
//               val: stats.active,
//               icon: <Zap size={16} />,
//               color: "from-sky-400 to-blue-600",
//             },
//           ].map(({ label, val, icon, color }) => (
//             <div
//               key={label}
//               className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 flex items-center gap-2 md:gap-4 hover:shadow-md transition-shadow"
//             >
//               <div
//                 className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
//               >
//                 {icon}
//               </div>
//               <div>
//                 <p className="text-[10px] md:text-xs text-slate-400 font-medium">{label}</p>
//                 <p className="text-lg md:text-2xl font-bold text-slate-800 leading-none mt-0.5">
//                   {val}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── search + filter bar ── */}
//         <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* search */}
//             <div className="flex-1 relative">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//               />
//               <input
//                 className="input-base pl-9 pr-9"
//                 placeholder="Search business, name, mobile, email, GST, district…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//               {search && (
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setPage(1);
//                   }}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* filter toggle */}
//             <button
//               onClick={() => setFilterPanelOpen((v) => !v)}
//               className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-xs md:text-sm font-medium transition-all ${
//                 filterPanelOpen || activeFilters > 0
//                   ? "bg-indigo-50 border-indigo-200 text-indigo-700"
//                   : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
//               }`}
//             >
//               <Filter size={14} />
//               Filters
//               {activeFilters > 0 && (
//                 <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {activeFilters}
//                 </span>
//               )}
//             </button>

//             {/* per-page */}
//             <select
//               value={perPage}
//               onChange={(e) => {
//                 setPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="input-base w-auto pr-8 cursor-pointer focus:outline-none text-xs md:text-sm"
//             >
//               {ITEMS_PER_PAGE_OPTIONS.map((n) => (
//                 <option key={n} value={n}>
//                   {n} / page
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* expanded filter panel */}
//           {filterPanelOpen && (
//             <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Verification
//                 </label>
//                 <select
//                   value={filterVS}
//                   onChange={(e) => {
//                     setFilterVS(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="pending">Pending</option>
//                   <option value="verified">Verified</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Status
//                 </label>
//                 <select
//                   value={filterActive}
//                   onChange={(e) => {
//                     setFilterActive(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Business Type
//                 </label>
//                 <select
//                   value={filterBType}
//                   onChange={(e) => {
//                     setFilterBType(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All Types</option>
//                   {businessTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {activeFilters > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className="sm:col-span-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
//                 >
//                   <X size={13} /> Clear all filters
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── results meta ── */}
//         <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
//           <span>
//             Showing{" "}
//             <strong className="text-slate-600">{paginated.length}</strong> of{" "}
//             <strong className="text-slate-600">{sorted.length}</strong> results
//             {activeFilters > 0 || search
//               ? ` (filtered from ${users.length})`
//               : ""}
//           </span>
//           <span>
//             Page {safePage} of {totalPages}
//           </span>
//         </div>

//         {/* ── table ── */}
//         {paginated.length === 0 ? (
//           <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 md:py-20 text-slate-400">
//             <Users size={36} className="mb-3 opacity-30" />
//             <p className="font-semibold text-slate-500">No users found</p>
//             <p className="text-xs md:text-sm mt-1">Try adjusting your search or filters</p>
//             {(search || activeFilters > 0) && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* ── DESKTOP TABLE ── */}
//             <div
//               ref={tableRef}
//               className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4"
//             >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-slate-50/70">
//                       {[
//                         { label: "Business", key: "businessName" as SortKey },
//                         { label: "Contact", key: "name" as SortKey },
//                         { label: "Mobile", key: "mobileNumber" as SortKey },
//                         { label: "Active", key: "isActive" as SortKey },
//                         { label: "Joined", key: "createdAt" as SortKey },
//                       ].map(({ label, key }) => (
//                         <th
//                           key={key}
//                           className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
//                         >
//                           <button
//                             className="th-btn"
//                             onClick={() => handleSort(key)}
//                           >
//                             {label} <SortIcon col={key} />
//                           </button>
//                         </th>
//                       ))}
//                       <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {paginated.map((user) => (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-indigo-50/30 transition-colors group"
//                       >
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
//                             {user.businessName}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {user.businessType || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4">
//                           <p className="text-slate-700 font-medium">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
//                             {user.email || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4 text-slate-600 font-mono text-xs">
//                           {user.mobileNumber}
//                         </td>
//                         <td className="px-5 py-4">
//                           <ActivePill active={user.isActive} />
//                         </td>
//                         <td className="px-5 py-4 text-xs text-slate-400">
//                           {new Date(user.createdAt).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-1">
//                             {/* View Details Button */}
//                             <button
//                               title="View Details"
//                               onClick={() => setDetailUser(user)}
//                               className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                             >
//                               <Eye size={15} />
//                             </button>

//                             {/* Verify Button - Show only for pending users */}
//                             {user.verificationStatus === "pending" && (
//                               <button
//                                 title="Verify"
//                                 onClick={() =>
//                                   handleOpenConfirmModal({
//                                     type: "verify",
//                                     userId: user._id,
//                                     userName: user.businessName,
//                                   })
//                                 }
//                                 className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                               >
//                                 <CheckCircle size={15} />
//                               </button>
//                             )}

//                             {/* Toggle Active/Inactive Button - Always show */}
//                             <button
//                               title={user.isActive ? "Deactivate" : "Activate"}
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "toggleActive",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                   currentActive: user.isActive,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-violet-600 hover:bg-violet-50"
//                             >
//                               <Power size={15} />
//                             </button>

//                             {/* Delete Button - Always show */}
//                             <button
//                               title="Delete"
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "delete",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ── MOBILE CARDS ── */}
//             <div className="md:hidden space-y-3 mb-4">
//               {paginated.map((user) => (
//                 <div
//                   key={user._id}
//                   className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-bold text-slate-800 text-base">
//                         {user.businessName}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {user.businessType || "—"}
//                       </p>
//                     </div>
//                     <StatusPill status={user.verificationStatus} />
//                   </div>
//                   <div className="space-y-1.5 text-xs text-slate-500 mb-3">
//                     <p>
//                       <span className="font-medium text-slate-600">Name: </span>
//                       {user.name}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Mobile:{" "}
//                       </span>
//                       <span className="font-mono">{user.mobileNumber}</span>
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Joined:{" "}
//                       </span>
//                       {new Date(user.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                     <div className="pt-1">
//                       <ActivePill active={user.isActive} />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-50">
//                     <button
//                       onClick={() => setDetailUser(user)}
//                       className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                     >
//                       <Eye size={16} />
//                     </button>

//                     {/* Verify Button - Show only for pending users */}
//                     {user.verificationStatus === "pending" && (
//                       <button
//                         onClick={() =>
//                           handleOpenConfirmModal({
//                             type: "verify",
//                             userId: user._id,
//                             userName: user.businessName,
//                           })
//                         }
//                         className="action-btn text-emerald-500 hover:bg-emerald-50"
//                       >
//                         <CheckCircle size={16} />
//                       </button>
//                     )}

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "toggleActive",
//                           userId: user._id,
//                           userName: user.businessName,
//                           currentActive: user.isActive,
//                         })
//                       }
//                       className="action-btn text-violet-500 hover:bg-violet-50"
//                     >
//                       <Power size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "delete",
//                           userId: user._id,
//                           userName: user.businessName,
//                         })
//                       }
//                       className="action-btn text-rose-500 hover:bg-rose-50"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── PAGINATION ── */}
//             {totalPages > 1 && (
//               <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm px-3 md:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
//                 <p className="text-xs text-slate-400">
//                   {(safePage - 1) * perPage + 1}–
//                   {Math.min(safePage * perPage, sorted.length)} of{" "}
//                   {sorted.length}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage(1)}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsLeft size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft size={14} />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (n) =>
//                         n === 1 ||
//                         n === totalPages ||
//                         Math.abs(n - safePage) <= 1,
//                     )
//                     .reduce<(number | "…")[]>((acc, n, i, arr) => {
//                       if (
//                         i > 0 &&
//                         typeof arr[i - 1] === "number" &&
//                         n - (arr[i - 1] as number) > 1
//                       )
//                         acc.push("…");
//                       acc.push(n);
//                       return acc;
//                     }, [])
//                     .map((n, i) =>
//                       n === "…" ? (
//                         <span
//                           key={`e${i}`}
//                           className="px-2 text-slate-300 text-xs"
//                         >
//                           …
//                         </span>
//                       ) : (
//                         <button
//                           key={n}
//                           onClick={() => setPage(n as number)}
//                           className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs font-semibold transition-all ${
//                             safePage === n
//                               ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
//                               : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
//                           }`}
//                         >
//                           {n}
//                         </button>
//                       ),
//                     )}

//                   <button
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage(totalPages)}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ════════════ MUI DETAIL MODAL (UPDATED WITH KYC) ════════════ */}
//       <StyledDetailDialog
//         open={detailUser !== null}
//         onClose={() => setDetailUser(null)}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: "16px 24px",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//         >
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
//               {detailUser?.businessName}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#94a3b8" }}>
//               {detailUser?.businessType}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setDetailUser(null)} size="small">
//             <X size={18} />
//           </IconButton>
//         </Box>

//         <DialogContent sx={{ p: "24px", overflow: "auto" }}>
//           {detailUser && (
//             <div className="space-y-5">
//               <div className="flex gap-2 flex-wrap">
//                 <StatusPill status={detailUser.verificationStatus} />
//                 <ActivePill active={detailUser.isActive} />
//               </div>

//               {[
//                 {
//                   title: "Business Information",
//                   icon: <Building size={15} />,
//                   rows: [
//                     ["Business Name", detailUser.businessName],
//                     ["Business Type", detailUser.businessType || "N/A"],
//                     ["GST Number", detailUser.gstNumber || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Contact Details",
//                   icon: <Phone size={15} />,
//                   rows: [
//                     ["Contact Person", detailUser.name],
//                     ["Mobile Number", detailUser.mobileNumber],
//                     ["Email Address", detailUser.email || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Address Information",
//                   icon: <MapPin size={15} />,
//                   rows: [
//                     ["Full Address", detailUser.address || "Not Provided"],
//                     ["Village/City", detailUser.village || "Not Provided"],
//                     ["Taluk", detailUser.taluk || "Not Provided"],
//                     ["District", detailUser.district || "Not Provided"],
//                     ["State", detailUser.state || "Not Provided"],
//                   ],
//                 },
//               ].map((sec) => (
//                 <div
//                   key={sec.title}
//                   className="border border-slate-100 rounded-xl overflow-hidden"
//                 >
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     {sec.icon} {sec.title}
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {sec.rows.map(([k, v]) => (
//                       <div key={k} className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32 flex-shrink-0">
//                           {k}
//                         </span>
//                         <span className="text-slate-700 font-medium break-words">
//                           {v}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {/* ─── KYC DOCUMENTS SECTION ─── */}
//               {detailUser.kycDocuments && detailUser.kycDocuments.length > 0 && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <FileText size={15} /> KYC Documents
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.kycDocuments.map((doc) => (
//                       <div key={doc._id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-slate-700 capitalize">
//                             {doc.docType} – {doc.docNumber}
//                           </p>
//                           <a
//                             // href={doc.documentUrl}
//                               href={`https://kisan.etpl.ai${doc.documentUrl}`}

//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-xs text-indigo-500 hover:underline break-all"
//                           >
//                             View Document
//                           </a>
//                           <div className="mt-1">
//                             <StatusPill status={doc.status} />
//                             {doc.status === "rejected" && doc.rejectionReason && (
//                               <span className="ml-2 text-xs text-rose-500">
//                                 Reason: {doc.rejectionReason}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                           {doc.status === "pending" && (
//                             <>
//                           <button
//   onClick={() => {
//     const reason = prompt("Enter rejection reason (optional):");
//     if (reason !== null) {
//       setKycActionLoading({
//         docId: doc._id,
//         action: "rejected",
//       });

//       handleKycAction(doc._id, "rejected", reason || undefined);
//     }
//   }}
//   disabled={kycActionLoading?.docId === doc._id}
//   className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-100 transition disabled:opacity-50"
// >
//   {kycActionLoading?.docId === doc._id &&
//   kycActionLoading?.action === "rejected"
//     ? "Rejecting..."
//     : "Reject"}
// </button>
//                               <button
//   onClick={() => {
//     setKycActionLoading({
//       docId: doc._id,
//       action: "verified",
//     });

//     handleKycAction(doc._id, "verified");
//   }}
//   disabled={kycActionLoading?.docId === doc._id}
//   className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition disabled:opacity-50"
// >
//   {kycActionLoading?.docId === doc._id &&
//   kycActionLoading?.action === "verified"
//     ? "Approving..."
//     : "Approve"}
// </button>
//                             </>
//                           )}
//                           {doc.status === "verified" && (
//                             <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
//                           )}
//                           {doc.status === "rejected" && (
//                             <span className="text-xs text-rose-600 font-medium">✗ Rejected</span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ─── VERIFICATION DETAILS ─── */}
//               {(detailUser.verificationStatus === "verified" ||
//                 detailUser.verificationStatus === "rejected") && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <ShieldCheck size={15} /> Verification Details
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.verifiedBy && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified By</span>
//                         <span className="text-slate-700 font-medium">
//                           {detailUser.verifiedBy}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.verifiedDate && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified On</span>
//                         <span className="text-slate-700 font-medium">
//                           {new Date(detailUser.verifiedDate).toLocaleString(
//                             "en-IN",
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.rejectionReason && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">
//                           Rejection Reason
//                         </span>
//                         <span className="text-rose-600 font-medium">
//                           {detailUser.rejectionReason}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="border border-slate-100 rounded-xl overflow-hidden">
//                 <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                   <Calendar size={15} /> System Information
//                 </div>
//                 <div className="divide-y divide-slate-50">
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Account Created</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.createdAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Last Updated</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.updatedAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
//           <Button onClick={() => setDetailUser(null)}>Close</Button>
//         </DialogActions>
//       </StyledDetailDialog>

//       {/* ════════════ MUI CONFIRM MODAL ════════════ */}
//       <StyledDialog
//         open={confirmAction !== null}
//         onClose={() => {
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             pt: 3,
//           }}
//         >
//           <Box
//             sx={{
//               width: 56,
//               height: 56,
//               borderRadius: "16px",
//               backgroundColor: modalContent.bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "16px",
//             }}
//           >
//             {modalContent.icon}
//           </Box>
//         </Box>
//         <StyledDialogTitle>
//           <Typography variant="h6" component="span">
//             {modalContent.title}
//           </Typography>
//         </StyledDialogTitle>
//         <StyledDialogContent>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#64748b",
//             }}
//           >
//             {modalContent.message}
//           </Typography>
//         </StyledDialogContent>
//         <StyledDialogActions>
//           <Button
//             onClick={() => {
//               setConfirmAction(null);
//               setRejectionReasonText("");
//             }}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               color: "#475569",
//               border: "1px solid #e2e8f0",
//               "&:hover": {
//                 backgroundColor: "#f8fafc",
//                 borderColor: "#cbd5e1",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmAction}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               backgroundColor:
//                 confirmAction?.type === "verify"
//                   ? "#10b981"
//                   : confirmAction?.type === "toggleActive"
//                     ? "#8b5cf6"
//                     : "#f43f5e",
//               color: "white",
//               "&:hover": {
//                 backgroundColor:
//                   confirmAction?.type === "verify"
//                     ? "#059669"
//                     : confirmAction?.type === "toggleActive"
//                       ? "#7c3aed"
//                       : "#e11d48",
//               },
//             }}
//           >
//             Confirm
//           </Button>
//         </StyledDialogActions>
//       </StyledDialog>
//     </div>
//   );
// };

// export default B2BUsers;













///demo


// /////////////
// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Power,
//   Search,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   RefreshCw,
//   Users,
//   ShieldCheck,
//   Clock,
//   Zap,
//   AlertTriangle,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Undo2,
//   Ban,
//   Shield,
//   FileText,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// /* ─────────────────────────── types ─────────────────────────── */
// interface KYCImage {
//   docType: string;
//   docNumber: string;
//   documentUrl: string;
//   status: "pending" | "verified" | "rejected";
//   submittedAt: string;
//   _id: string;
//   rejectionReason?: string;
//   isReupload?: boolean;
//   resubmittedAt?: string;
// }

// interface User {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber: string;
//   name: string;
//   email: string;
//   address: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   role: string;
//   isActive: boolean;
//   rejectionReason?: string;
//   verificationStatus?: "pending" | "verified" | "rejected";
//   verifiedBy?: string;
//   verifiedDate?: string;
//   createdAt: string;
//   updatedAt: string;
//   kycDocuments?: KYCImage[]; // added
// }

// type SortKey = keyof Pick<
//   User,
//   | "businessName"
//   | "name"
//   | "mobileNumber"
//   | "isActive"
//   | "createdAt"
// >;
// type SortDir = "asc" | "desc";

// interface ConfirmAction {
//   type: "verify" | "toggleActive" | "delete";
//   userId: string;
//   userName: string;
//   currentActive?: boolean;
//   currentStatus?: string;
// }

// interface B2BUsersProps {
//   adminSession?: { name: string };
// }

// /* ─────────────────────────── helpers ───────────────────────── */
// const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// // Styled MUI Dialog components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     padding: "8px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "480px",
//     width: "100%",
//     margin: "16px",
//   },
// }));

// const StyledDetailDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "24px",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//     background: "white",
//     maxWidth: "720px",
//     width: "100%",
//     margin: "16px",
//     maxHeight: "90vh",
//     overflow: "hidden",
//   },
// }));

// const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
//   textAlign: "center",
//   padding: "24px 24px 8px 24px",
//   "& .MuiTypography-root": {
//     fontWeight: 700,
//     fontSize: "1.25rem",
//     color: "#1e293b",
//   },
// }));

// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//   textAlign: "center",
//   padding: "8px 24px 24px 24px",
// }));

// const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
//   padding: "8px 24px 24px 24px",
//   gap: "12px",
// }));

// function StatusPill({
//   status,
// }: {
//   status: User["verificationStatus"] | undefined | null;
// }) {
//   const safeStatus = status ?? "pending";
//   const map = {
//     verified: {
//       cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
//       icon: <ShieldCheck size={11} />,
//     },
//     rejected: {
//       cls: "bg-rose-50 text-rose-700 border-rose-200",
//       icon: <XCircle size={11} />,
//     },
//     pending: {
//       cls: "bg-amber-50 text-amber-700 border-amber-200",
//       icon: <Clock size={11} />,
//     },
//   } as const;
//   const { cls, icon } = map[safeStatus as keyof typeof map] ?? map.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}
//     >
//       {icon}
//       {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
//     </span>
//   );
// }

// function ActivePill({ active }: { active: boolean }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
//         active
//           ? "bg-blue-50 text-blue-700 border-blue-200"
//           : "bg-slate-100 text-slate-500 border-slate-200"
//       }`}
//     >
//       <span
//         className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-400"}`}
//       />
//       {active ? "Active" : "Inactive"}
//     </span>
//   );
// }

// /* ─────────────────────────── main component ─────────────────── */
// const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     verified: 0,
//     pending: 0,
//     rejected: 0,
//     active: 0,
//     inactive: 0,
//   });
//   const [businessTypes, setBusinessTypes] = useState<string[]>([]);

//   // filters
//   const [search, setSearch] = useState("");
//   const [filterVS, setFilterVS] = useState<string>("all");
//   const [filterActive, setFilterActive] = useState<string>("all");
//   const [filterBType, setFilterBType] = useState<string>("all");

//   // sort
//   const [sortKey, setSortKey] = useState<SortKey>("createdAt");
//   const [sortDir, setSortDir] = useState<SortDir>("desc");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   // modals
//   const [detailUser, setDetailUser] = useState<User | null>(null);
//   const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
//     null,
//   );
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [rejectionReasonText, setRejectionReasonText] = useState("");
//   const [kycActionLoading, setKycActionLoading] = useState<{
//   docId: string;
//   action: "verified" | "rejected";
// } | null>(null);

//   const tableRef = useRef<HTMLDivElement>(null);

//   /* ── fetch ── */
//   const fetchUsers = useCallback(async (quiet = false) => {
//     quiet ? setRefreshing(true) : setLoading(true);
//     try {
//       const res = await fetch("/api/b2b-users");
//       const data = await res.json();
//       if (data.success) {
//         setUsers(data.users);
//         setStats(data.stats);
//         setBusinessTypes(data.businessTypes || []);
//       } else {
//         toast.error(data.message || "Failed to load users");
//       }
//     } catch {
//       toast.error("Network error — could not load users");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   /* ── derived filter / sort / paginate ── */
//   const filtered = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       u.businessName.toLowerCase().includes(q) ||
//       u.name.toLowerCase().includes(q) ||
//       u.mobileNumber.includes(q) ||
//       (u.email || "").toLowerCase().includes(q) ||
//       (u.district || "").toLowerCase().includes(q) ||
//       (u.gstNumber || "").toLowerCase().includes(q);

//     const matchVS =
//       filterVS === "all" || (u.verificationStatus ?? "pending") === filterVS;
//     const matchActive =
//       filterActive === "all" || String(u.isActive) === filterActive;
//     const matchBType = filterBType === "all" || u.businessType === filterBType;

//     return matchSearch && matchVS && matchActive && matchBType;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     let av: any = a[sortKey];
//     let bv: any = b[sortKey];
//     if (sortKey === "isActive") {
//       av = a.isActive ? 1 : 0;
//       bv = b.isActive ? 1 : 0;
//     }
//     if (typeof av === "string") av = av.toLowerCase();
//     if (typeof bv === "string") bv = bv.toLowerCase();
//     if (av < bv) return sortDir === "asc" ? -1 : 1;
//     if (av > bv) return sortDir === "asc" ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   const safePage = Math.min(page, totalPages);
//   const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);
//   const activeFilters = [
//     filterVS !== "all",
//     filterActive !== "all",
//     filterBType !== "all",
//   ].filter(Boolean).length;

//   /* ── sort toggle ── */
//   const handleSort = (key: SortKey) => {
//     if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const SortIcon = ({ col }: { col: SortKey }) =>
//     sortKey === col ? (
//       sortDir === "asc" ? (
//         <ChevronUp size={13} className="text-indigo-500" />
//       ) : (
//         <ChevronDown size={13} className="text-indigo-500" />
//       )
//     ) : (
//       <ChevronsUpDown size={13} className="text-slate-300" />
//     );

//   /* ── KYC action handler ── */
// const handleKycAction = async (
//   docId: string,
//   status: "verified" | "rejected",
//   rejectionReason?: string
// ) => {
//   if (!detailUser) return;
//   try {
//     // ✅ New endpoint: /api/kyc/{userId}
//     const res = await fetch(`/api/kyc/${detailUser._id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         docId,                 // KYC document ID
//         status,
//         rejectionReason: rejectionReason || "",
//       }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       toast.success(`KYC document ${status === "verified" ? "approved" : "rejected"}`);
//       await fetchUsers(true);
//       // Update detailUser
//       if (detailUser) {
//         const updatedDoc = data.updatedDocument;
//         const updatedKyc = detailUser.kycDocuments?.map((doc) =>
//           doc._id === updatedDoc._id ? { ...doc, status: updatedDoc.status } : doc
//         );
//         setDetailUser({
//           ...detailUser,
//           kycDocuments: updatedKyc,
//           verificationStatus: data.overallStatus,
//         });
//       }
//     } else {
//       toast.error(data.message || "Failed to update KYC");
//     }
//   } catch (error: any) {
//     toast.error(error.message || "Network error");
//   } finally {
//     setKycActionLoading(null);
//   }
// };

//   /* ── existing actions ── */
//   const handleConfirmAction = async () => {
//     if (!confirmAction) return;
//     const { type, userId, currentActive } = confirmAction;

//     try {
//       if (type === "delete") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "DELETE",
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("User deleted successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "toggleActive") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isActive: !currentActive }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(
//             data.message ||
//               `User ${!currentActive ? "activated" : "deactivated"} successfully`,
//           );
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       } else if (type === "verify") {
//         const res = await fetch(`/api/b2b-users/${userId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             verificationStatus: "verified",
//             verifiedBy: adminSession?.name || "Admin",
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success(data.message || "User verified successfully");
//           fetchUsers(true);
//           setConfirmAction(null);
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Action failed — try again");
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilterVS("all");
//     setFilterActive("all");
//     setFilterBType("all");
//     setPage(1);
//   };

//   const handleOpenConfirmModal = (action: ConfirmAction) => {
//     setRejectionReasonText("");
//     setConfirmAction(action);
//   };

//   const getModalContent = () => {
//     if (!confirmAction)
//       return { icon: null, title: "", message: "", bgColor: "" };

//     switch (confirmAction.type) {
//       case "verify":
//         return {
//           icon: <CheckCircle size={26} className="text-emerald-500" />,
//           title: "Verify User",
//           message: (
//             <>
//               Confirm verification for{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#ecfdf5",
//         };
//       case "toggleActive":
//         return {
//           icon: <Power size={26} className="text-violet-500" />,
//           title: confirmAction.currentActive
//             ? "Deactivate User"
//             : "Activate User",
//           message: (
//             <>
//               {confirmAction.currentActive ? "Deactivate" : "Activate"} user{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ?
//             </>
//           ),
//           bgColor: "#f5f3ff",
//         };
//       case "delete":
//         return {
//           icon: <AlertTriangle size={26} className="text-rose-500" />,
//           title: "Delete User",
//           message: (
//             <>
//               Are you sure you want to permanently delete{" "}
//               <strong className="text-slate-700">
//                 "{confirmAction.userName}"
//               </strong>
//               ? This cannot be undone.
//             </>
//           ),
//           bgColor: "#fff1f2",
//         };
//       default:
//         return { icon: null, title: "", message: "", bgColor: "" };
//     }
//   };

//   const modalContent = getModalContent();

//   /* ── loading skeleton ── */
//   if (loading)
//     return (
//       <div className="space-y-4 animate-pulse p-6">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
//           ))}
//         </div>
//         <div className="h-12 bg-slate-100 rounded-xl" />
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="h-14 border-b border-slate-50 bg-slate-50 mx-4 my-1 rounded-lg"
//             />
//           ))}
//         </div>
//       </div>
//     );

//   /* ═══════════════════════════ RENDER ══════════════════════════ */
//   return (
//     <div className="min-h-screen font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
//         .th-btn { @apply flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 transition-colors; }
//         .action-btn { @apply p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95; }
//         .input-base { @apply w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all; }
//         select:focus { outline: none; }
//         input:focus { outline: none; }
//         button:focus { outline: none; }
//       `}</style>

//       <div className="p-4 md:p-6">
//         {/* ── page header ── */}
//         <div className="flex items-center justify-end mb-3">
//           <button
//             onClick={() => fetchUsers(true)}
//             className={`flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm ${refreshing ? "animate-pulse" : ""}`}
//           >
//             <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* ── stat cards - responsive grid ── */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
//           {[
//             {
//               label: "Total",
//               val: stats.total,
//               icon: <Users size={16} />,
//               color: "from-indigo-500 to-violet-600",
//             },
//             {
//               label: "Verified",
//               val: stats.verified,
//               icon: <ShieldCheck size={16} />,
//               color: "from-emerald-400 to-teal-600",
//             },
//             {
//               label: "Pending",
//               val: stats.pending,
//               icon: <Clock size={16} />,
//               color: "from-amber-400 to-orange-500",
//             },
//             {
//               label: "Active",
//               val: stats.active,
//               icon: <Zap size={16} />,
//               color: "from-sky-400 to-blue-600",
//             },
//           ].map(({ label, val, icon, color }) => (
//             <div
//               key={label}
//               className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 flex items-center gap-2 md:gap-4 hover:shadow-md transition-shadow"
//             >
//               <div
//                 className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
//               >
//                 {icon}
//               </div>
//               <div>
//                 <p className="text-[10px] md:text-xs text-slate-400 font-medium">{label}</p>
//                 <p className="text-lg md:text-2xl font-bold text-slate-800 leading-none mt-0.5">
//                   {val}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── search + filter bar ── */}
//         <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* search */}
//             <div className="flex-1 relative">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//               />
//               <input
//                 className="input-base pl-9 pr-9"
//                 placeholder="Search business, name, mobile, email, GST, district…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//               {search && (
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setPage(1);
//                   }}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* filter toggle */}
//             <button
//               onClick={() => setFilterPanelOpen((v) => !v)}
//               className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-xs md:text-sm font-medium transition-all ${
//                 filterPanelOpen || activeFilters > 0
//                   ? "bg-indigo-50 border-indigo-200 text-indigo-700"
//                   : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
//               }`}
//             >
//               <Filter size={14} />
//               Filters
//               {activeFilters > 0 && (
//                 <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {activeFilters}
//                 </span>
//               )}
//             </button>

//             {/* per-page */}
//             <select
//               value={perPage}
//               onChange={(e) => {
//                 setPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="input-base w-auto pr-8 cursor-pointer focus:outline-none text-xs md:text-sm"
//             >
//               {ITEMS_PER_PAGE_OPTIONS.map((n) => (
//                 <option key={n} value={n}>
//                   {n} / page
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* expanded filter panel */}
//           {filterPanelOpen && (
//             <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Verification
//                 </label>
//                 <select
//                   value={filterVS}
//                   onChange={(e) => {
//                     setFilterVS(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="pending">Pending</option>
//                   <option value="verified">Verified</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Status
//                 </label>
//                 <select
//                   value={filterActive}
//                   onChange={(e) => {
//                     setFilterActive(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All</option>
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
//                   Business Type
//                 </label>
//                 <select
//                   value={filterBType}
//                   onChange={(e) => {
//                     setFilterBType(e.target.value);
//                     setPage(1);
//                   }}
//                   className="input-base focus:outline-none text-sm"
//                 >
//                   <option value="all">All Types</option>
//                   {businessTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {activeFilters > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className="sm:col-span-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
//                 >
//                   <X size={13} /> Clear all filters
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── results meta ── */}
//         <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
//           <span>
//             Showing{" "}
//             <strong className="text-slate-600">{paginated.length}</strong> of{" "}
//             <strong className="text-slate-600">{sorted.length}</strong> results
//             {activeFilters > 0 || search
//               ? ` (filtered from ${users.length})`
//               : ""}
//           </span>
//           <span>
//             Page {safePage} of {totalPages}
//           </span>
//         </div>

//         {/* ── table ── */}
//         {paginated.length === 0 ? (
//           <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 md:py-20 text-slate-400">
//             <Users size={36} className="mb-3 opacity-30" />
//             <p className="font-semibold text-slate-500">No users found</p>
//             <p className="text-xs md:text-sm mt-1">Try adjusting your search or filters</p>
//             {(search || activeFilters > 0) && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* ── DESKTOP TABLE ── */}
//             <div
//               ref={tableRef}
//               className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4"
//             >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-slate-50/70">
//                       {[
//                         { label: "Business", key: "businessName" as SortKey },
//                         { label: "Contact", key: "name" as SortKey },
//                         { label: "Mobile", key: "mobileNumber" as SortKey },
//                         { label: "Active", key: "isActive" as SortKey },
//                         { label: "Joined", key: "createdAt" as SortKey },
//                       ].map(({ label, key }) => (
//                         <th
//                           key={key}
//                           className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
//                         >
//                           <button
//                             className="th-btn"
//                             onClick={() => handleSort(key)}
//                           >
//                             {label} <SortIcon col={key} />
//                           </button>
//                         </th>
//                       ))}
//                       <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {paginated.map((user) => (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-indigo-50/30 transition-colors group"
//                       >
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
//                             {user.businessName}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {user.businessType || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4">
//                           <p className="text-slate-700 font-medium">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
//                             {user.email || "—"}
//                           </p>
//                         </td>
//                         <td className="px-5 py-4 text-slate-600 font-mono text-xs">
//                           {user.mobileNumber}
//                         </td>
//                         <td className="px-5 py-4">
//                           <ActivePill active={user.isActive} />
//                         </td>
//                         <td className="px-5 py-4 text-xs text-slate-400">
//                           {new Date(user.createdAt).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-1">
//                             {/* View Details Button */}
//                             <button
//                               title="View Details"
//                               onClick={() => setDetailUser(user)}
//                               className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                             >
//                               <Eye size={15} />
//                             </button>

//                             {/* Verify Button - Show only for pending users */}
//                             {user.verificationStatus === "pending" && (
//                               <button
//                                 title="Verify"
//                                 onClick={() =>
//                                   handleOpenConfirmModal({
//                                     type: "verify",
//                                     userId: user._id,
//                                     userName: user.businessName,
//                                   })
//                                 }
//                                 className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
//                               >
//                                 <CheckCircle size={15} />
//                               </button>
//                             )}

//                             {/* Toggle Active/Inactive Button - Always show */}
//                             <button
//                               title={user.isActive ? "Deactivate" : "Activate"}
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "toggleActive",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                   currentActive: user.isActive,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-violet-600 hover:bg-violet-50"
//                             >
//                               <Power size={15} />
//                             </button>

//                             {/* Delete Button - Always show */}
//                             <button
//                               title="Delete"
//                               onClick={() =>
//                                 handleOpenConfirmModal({
//                                   type: "delete",
//                                   userId: user._id,
//                                   userName: user.businessName,
//                                 })
//                               }
//                               className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ── MOBILE CARDS ── */}
//             <div className="md:hidden space-y-3 mb-4">
//               {paginated.map((user) => (
//                 <div
//                   key={user._id}
//                   className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-bold text-slate-800 text-base">
//                         {user.businessName}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {user.businessType || "—"}
//                       </p>
//                     </div>
//                     <StatusPill status={user.verificationStatus} />
//                   </div>
//                   <div className="space-y-1.5 text-xs text-slate-500 mb-3">
//                     <p>
//                       <span className="font-medium text-slate-600">Name: </span>
//                       {user.name}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Mobile:{" "}
//                       </span>
//                       <span className="font-mono">{user.mobileNumber}</span>
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-600">
//                         Joined:{" "}
//                       </span>
//                       {new Date(user.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                     <div className="pt-1">
//                       <ActivePill active={user.isActive} />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-50">
//                     <button
//                       onClick={() => setDetailUser(user)}
//                       className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
//                     >
//                       <Eye size={16} />
//                     </button>

//                     {/* Verify Button - Show only for pending users */}
//                     {user.verificationStatus === "pending" && (
//                       <button
//                         onClick={() =>
//                           handleOpenConfirmModal({
//                             type: "verify",
//                             userId: user._id,
//                             userName: user.businessName,
//                           })
//                         }
//                         className="action-btn text-emerald-500 hover:bg-emerald-50"
//                       >
//                         <CheckCircle size={16} />
//                       </button>
//                     )}

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "toggleActive",
//                           userId: user._id,
//                           userName: user.businessName,
//                           currentActive: user.isActive,
//                         })
//                       }
//                       className="action-btn text-violet-500 hover:bg-violet-50"
//                     >
//                       <Power size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleOpenConfirmModal({
//                           type: "delete",
//                           userId: user._id,
//                           userName: user.businessName,
//                         })
//                       }
//                       className="action-btn text-rose-500 hover:bg-rose-50"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── PAGINATION ── */}
//             {totalPages > 1 && (
//               <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm px-3 md:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
//                 <p className="text-xs text-slate-400">
//                   {(safePage - 1) * perPage + 1}–
//                   {Math.min(safePage * perPage, sorted.length)} of{" "}
//                   {sorted.length}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage(1)}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsLeft size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={safePage === 1}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft size={14} />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (n) =>
//                         n === 1 ||
//                         n === totalPages ||
//                         Math.abs(n - safePage) <= 1,
//                     )
//                     .reduce<(number | "…")[]>((acc, n, i, arr) => {
//                       if (
//                         i > 0 &&
//                         typeof arr[i - 1] === "number" &&
//                         n - (arr[i - 1] as number) > 1
//                       )
//                         acc.push("…");
//                       acc.push(n);
//                       return acc;
//                     }, [])
//                     .map((n, i) =>
//                       n === "…" ? (
//                         <span
//                           key={`e${i}`}
//                           className="px-2 text-slate-300 text-xs"
//                         >
//                           …
//                         </span>
//                       ) : (
//                         <button
//                           key={n}
//                           onClick={() => setPage(n as number)}
//                           className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs font-semibold transition-all ${
//                             safePage === n
//                               ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
//                               : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
//                           }`}
//                         >
//                           {n}
//                         </button>
//                       ),
//                     )}

//                   <button
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                   <button
//                     onClick={() => setPage(totalPages)}
//                     disabled={safePage === totalPages}
//                     className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronsRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ════════════ MUI DETAIL MODAL (UPDATED WITH KYC) ════════════ */}
//       <StyledDetailDialog
//         open={detailUser !== null}
//         onClose={() => setDetailUser(null)}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: "16px 24px",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//         >
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
//               {detailUser?.businessName}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#94a3b8" }}>
//               {detailUser?.businessType}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setDetailUser(null)} size="small">
//             <X size={18} />
//           </IconButton>
//         </Box>

//         <DialogContent sx={{ p: "24px", overflow: "auto" }}>
//           {detailUser && (
//             <div className="space-y-5">
//               <div className="flex gap-2 flex-wrap">
//                 <StatusPill status={detailUser.verificationStatus} />
//                 <ActivePill active={detailUser.isActive} />
//               </div>

//               {[
//                 {
//                   title: "Business Information",
//                   icon: <Building size={15} />,
//                   rows: [
//                     ["Business Name", detailUser.businessName],
//                     ["Business Type", detailUser.businessType || "N/A"],
//                     ["GST Number", detailUser.gstNumber || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Contact Details",
//                   icon: <Phone size={15} />,
//                   rows: [
//                     ["Contact Person", detailUser.name],
//                     ["Mobile Number", detailUser.mobileNumber],
//                     ["Email Address", detailUser.email || "Not Provided"],
//                   ],
//                 },
//                 {
//                   title: "Address Information",
//                   icon: <MapPin size={15} />,
//                   rows: [
//                     ["Full Address", detailUser.address || "Not Provided"],
//                     ["Village/City", detailUser.village || "Not Provided"],
//                     ["Taluk", detailUser.taluk || "Not Provided"],
//                     ["District", detailUser.district || "Not Provided"],
//                     ["State", detailUser.state || "Not Provided"],
//                   ],
//                 },
//               ].map((sec) => (
//                 <div
//                   key={sec.title}
//                   className="border border-slate-100 rounded-xl overflow-hidden"
//                 >
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     {sec.icon} {sec.title}
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {sec.rows.map(([k, v]) => (
//                       <div key={k} className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32 flex-shrink-0">
//                           {k}
//                         </span>
//                         <span className="text-slate-700 font-medium break-words">
//                           {v}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {/* ─── KYC DOCUMENTS SECTION ─── */}
//               {detailUser.kycDocuments && detailUser.kycDocuments.length > 0 && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <FileText size={15} /> KYC Documents
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.kycDocuments.map((doc) => (
//                       <div key={doc._id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-slate-700 capitalize">
//                             {doc.docType} – {doc.docNumber}
//                           </p>
//                           <a
//                             // href={doc.documentUrl}
//                               href={`https://kisan.etpl.ai${doc.documentUrl}`}

//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-xs text-indigo-500 hover:underline break-all"
//                           >
//                             View Document
//                           </a>
//                           <div className="mt-1 flex items-center gap-2 flex-wrap">
//                             <StatusPill status={doc.status} />
//                             {doc.isReupload && (
//                               <span
//                                 className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border bg-sky-50 text-sky-700 border-sky-200"
//                                 title={doc.resubmittedAt ? `Re-submitted on ${new Date(doc.resubmittedAt).toLocaleString("en-IN")}` : undefined}
//                               >
//                                 <RefreshCw size={11} />
//                                 Re-uploaded
//                               </span>
//                             )}
//                             {doc.status === "rejected" && doc.rejectionReason && (
//                               <span className="text-xs text-rose-500">
//                                 Reason: {doc.rejectionReason}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                           {doc.status === "pending" && (
//                             <>
//                           <button
//   onClick={() => {
//     const reason = prompt("Enter rejection reason (optional):");
//     if (reason !== null) {
//       setKycActionLoading({
//         docId: doc._id,
//         action: "rejected",
//       });

//       handleKycAction(doc._id, "rejected", reason || undefined);
//     }
//   }}
//   disabled={kycActionLoading?.docId === doc._id}
//   className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-100 transition disabled:opacity-50"
// >
//   {kycActionLoading?.docId === doc._id &&
//   kycActionLoading?.action === "rejected"
//     ? "Rejecting..."
//     : "Reject"}
// </button>
//                               <button
//   onClick={() => {
//     setKycActionLoading({
//       docId: doc._id,
//       action: "verified",
//     });

//     handleKycAction(doc._id, "verified");
//   }}
//   disabled={kycActionLoading?.docId === doc._id}
//   className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition disabled:opacity-50"
// >
//   {kycActionLoading?.docId === doc._id &&
//   kycActionLoading?.action === "verified"
//     ? "Approving..."
//     : "Approve"}
// </button>
//                             </>
//                           )}
//                           {doc.status === "verified" && (
//                             <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
//                           )}
//                           {doc.status === "rejected" && (
//                             <span className="text-xs text-rose-600 font-medium">✗ Rejected</span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ─── VERIFICATION DETAILS ─── */}
//               {(detailUser.verificationStatus === "verified" ||
//                 detailUser.verificationStatus === "rejected") && (
//                 <div className="border border-slate-100 rounded-xl overflow-hidden">
//                   <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                     <ShieldCheck size={15} /> Verification Details
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {detailUser.verifiedBy && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified By</span>
//                         <span className="text-slate-700 font-medium">
//                           {detailUser.verifiedBy}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.verifiedDate && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">Verified On</span>
//                         <span className="text-slate-700 font-medium">
//                           {new Date(detailUser.verifiedDate).toLocaleString(
//                             "en-IN",
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {detailUser.rejectionReason && (
//                       <div className="flex px-4 py-2.5 text-sm">
//                         <span className="text-slate-400 w-32">
//                           Rejection Reason
//                         </span>
//                         <span className="text-rose-600 font-medium">
//                           {detailUser.rejectionReason}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="border border-slate-100 rounded-xl overflow-hidden">
//                 <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                   <Calendar size={15} /> System Information
//                 </div>
//                 <div className="divide-y divide-slate-50">
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Account Created</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.createdAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex px-4 py-2.5 text-sm">
//                     <span className="text-slate-400 w-32">Last Updated</span>
//                     <span className="text-slate-700 font-medium">
//                       {new Date(detailUser.updatedAt).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
//           <Button onClick={() => setDetailUser(null)}>Close</Button>
//         </DialogActions>
//       </StyledDetailDialog>

//       {/* ════════════ MUI CONFIRM MODAL ════════════ */}
//       <StyledDialog
//         open={confirmAction !== null}
//         onClose={() => {
//           setConfirmAction(null);
//           setRejectionReasonText("");
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             pt: 3,
//           }}
//         >
//           <Box
//             sx={{
//               width: 56,
//               height: 56,
//               borderRadius: "16px",
//               backgroundColor: modalContent.bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "16px",
//             }}
//           >
//             {modalContent.icon}
//           </Box>
//         </Box>
//         <StyledDialogTitle>
//           <Typography variant="h6" component="span">
//             {modalContent.title}
//           </Typography>
//         </StyledDialogTitle>
//         <StyledDialogContent>
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#64748b",
//             }}
//           >
//             {modalContent.message}
//           </Typography>
//         </StyledDialogContent>
//         <StyledDialogActions>
//           <Button
//             onClick={() => {
//               setConfirmAction(null);
//               setRejectionReasonText("");
//             }}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               color: "#475569",
//               border: "1px solid #e2e8f0",
//               "&:hover": {
//                 backgroundColor: "#f8fafc",
//                 borderColor: "#cbd5e1",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmAction}
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               padding: "10px 16px",
//               textTransform: "none",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               backgroundColor:
//                 confirmAction?.type === "verify"
//                   ? "#10b981"
//                   : confirmAction?.type === "toggleActive"
//                     ? "#8b5cf6"
//                     : "#f43f5e",
//               color: "white",
//               "&:hover": {
//                 backgroundColor:
//                   confirmAction?.type === "verify"
//                     ? "#059669"
//                     : confirmAction?.type === "toggleActive"
//                       ? "#7c3aed"
//                       : "#e11d48",
//               },
//             }}
//           >
//             Confirm
//           </Button>
//         </StyledDialogActions>
//       </StyledDialog>
//     </div>
//   );
// };

// export default B2BUsers;











//test


/////////////
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Power,
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  RefreshCw,
  Users,
  ShieldCheck,
  Clock,
  Zap,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Undo2,
  Ban,
  Shield,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

/* ─────────────────────────── types ─────────────────────────── */
interface KYCImage {
  docType: string;
  docNumber: string;
  documentUrl: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  _id: string;
  rejectionReason?: string;
  isReupload?: boolean;
  resubmittedAt?: string;
}

interface User {
  _id: string;
  mobileNumber: string;
  businessName: string;
  businessType: string;
  gstNumber: string;
  name: string;
  email: string;
  address: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  role: string;
  isActive: boolean;
  rejectionReason?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedDate?: string;
  createdAt: string;
  updatedAt: string;
  kycDocuments?: KYCImage[]; // added
}

type SortKey = keyof Pick<
  User,
  | "businessName"
  | "name"
  | "mobileNumber"
  | "isActive"
  | "createdAt"
>;
type SortDir = "asc" | "desc";

interface ConfirmAction {
  type: "verify" | "toggleActive" | "delete";
  userId: string;
  userName: string;
  currentActive?: boolean;
  currentStatus?: string;
}

interface B2BUsersProps {
  adminSession?: { name: string };
}

/* ─────────────────────────── helpers ───────────────────────── */
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// Styled MUI Dialog components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    padding: "8px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    background: "white",
    maxWidth: "480px",
    width: "100%",
    margin: "16px",
  },
}));

const StyledDetailDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    background: "white",
    maxWidth: "720px",
    width: "100%",
    margin: "16px",
    maxHeight: "90vh",
    overflow: "hidden",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: "center",
  padding: "24px 24px 8px 24px",
  "& .MuiTypography-root": {
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#1e293b",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  textAlign: "center",
  padding: "8px 24px 24px 24px",
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: "8px 24px 24px 24px",
  gap: "12px",
}));

function StatusPill({
  status,
}: {
  status: User["verificationStatus"] | undefined | null;
}) {
  const safeStatus = status ?? "pending";
  const map = {
    verified: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <ShieldCheck size={11} />,
    },
    rejected: {
      cls: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle size={11} />,
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={11} />,
    },
  } as const;
  const { cls, icon } = map[safeStatus as keyof typeof map] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}
    >
      {icon}
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

function ActivePill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
        active
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-slate-100 text-slate-500 border-slate-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-400"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
function hasPendingReupload(user: User): boolean {
  return (user.kycDocuments || []).some(
    (doc) => doc.isReupload && doc.status === "pending"
  );
}
/* ─────────────────────────── main component ─────────────────── */
const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    active: 0,
    inactive: 0,
  });
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  // filters
  const [search, setSearch] = useState("");
  const [filterVS, setFilterVS] = useState<string>("all");
  const [filterActive, setFilterActive] = useState<string>("all");
  const [filterBType, setFilterBType] = useState<string>("all");

  // sort
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // modals
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [rejectionReasonText, setRejectionReasonText] = useState("");
  const [kycActionLoading, setKycActionLoading] = useState<{
  docId: string;
  action: "verified" | "rejected";
} | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  /* ── fetch ── */
  const fetchUsers = useCallback(async (quiet = false) => {
    quiet ? setRefreshing(true) : setLoading(true);
    try {
      const res = await fetch("/api/b2b-users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
        setBusinessTypes(data.businessTypes || []);
      } else {
        toast.error(data.message || "Failed to load users");
      }
    } catch {
      toast.error("Network error — could not load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ── derived filter / sort / paginate ── */
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.businessName.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.mobileNumber.includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.district || "").toLowerCase().includes(q) ||
      (u.gstNumber || "").toLowerCase().includes(q);

    const matchVS =
      filterVS === "all" || (u.verificationStatus ?? "pending") === filterVS;
    const matchActive =
      filterActive === "all" || String(u.isActive) === filterActive;
    const matchBType = filterBType === "all" || u.businessType === filterBType;

    return matchSearch && matchVS && matchActive && matchBType;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: any = a[sortKey];
    let bv: any = b[sortKey];
    if (sortKey === "isActive") {
      av = a.isActive ? 1 : 0;
      bv = b.isActive ? 1 : 0;
    }
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);
  const activeFilters = [
    filterVS !== "all",
    filterActive !== "all",
    filterBType !== "all",
  ].filter(Boolean).length;

  /* ── sort toggle ── */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp size={13} className="text-indigo-500" />
      ) : (
        <ChevronDown size={13} className="text-indigo-500" />
      )
    ) : (
      <ChevronsUpDown size={13} className="text-slate-300" />
    );

  /* ── KYC action handler ── */
const handleKycAction = async (
  docId: string,
  status: "verified" | "rejected",
  rejectionReason?: string
) => {
  if (!detailUser) return;
  try {
    // ✅ New endpoint: /api/kyc/{userId}
    const res = await fetch(`/api/kyc/${detailUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docId,                 // KYC document ID
        status,
        rejectionReason: rejectionReason || "",
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`KYC document ${status === "verified" ? "approved" : "rejected"}`);
      await fetchUsers(true);
      // Update detailUser
      if (detailUser) {
        const updatedDoc = data.updatedDocument;
        const updatedKyc = detailUser.kycDocuments?.map((doc) =>
          doc._id === updatedDoc._id ? { ...doc, status: updatedDoc.status } : doc
        );
        setDetailUser({
          ...detailUser,
          kycDocuments: updatedKyc,
          verificationStatus: data.overallStatus,
        });
      }
    } else {
      toast.error(data.message || "Failed to update KYC");
    }
  } catch (error: any) {
    toast.error(error.message || "Network error");
  } finally {
    setKycActionLoading(null);
  }
};

  /* ── existing actions ── */
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { type, userId, currentActive } = confirmAction;

    try {
      if (type === "delete") {
        const res = await fetch(`/api/b2b-users/${userId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("User deleted successfully");
          fetchUsers(true);
          setConfirmAction(null);
        } else {
          toast.error(data.message);
        }
      } else if (type === "toggleActive") {
        const res = await fetch(`/api/b2b-users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentActive }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(
            data.message ||
              `User ${!currentActive ? "activated" : "deactivated"} successfully`,
          );
          fetchUsers(true);
          setConfirmAction(null);
        } else {
          toast.error(data.message);
        }
      } else if (type === "verify") {
        const res = await fetch(`/api/b2b-users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verificationStatus: "verified",
            verifiedBy: adminSession?.name || "Admin",
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message || "User verified successfully");
          fetchUsers(true);
          setConfirmAction(null);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Action failed — try again");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterVS("all");
    setFilterActive("all");
    setFilterBType("all");
    setPage(1);
  };

  const handleOpenConfirmModal = (action: ConfirmAction) => {
    setRejectionReasonText("");
    setConfirmAction(action);
  };

  const getModalContent = () => {
    if (!confirmAction)
      return { icon: null, title: "", message: "", bgColor: "" };

    switch (confirmAction.type) {
      case "verify":
        return {
          icon: <CheckCircle size={26} className="text-emerald-500" />,
          title: "Verify User",
          message: (
            <>
              Confirm verification for{" "}
              <strong className="text-slate-700">
                "{confirmAction.userName}"
              </strong>
              ?
            </>
          ),
          bgColor: "#ecfdf5",
        };
      case "toggleActive":
        return {
          icon: <Power size={26} className="text-violet-500" />,
          title: confirmAction.currentActive
            ? "Deactivate User"
            : "Activate User",
          message: (
            <>
              {confirmAction.currentActive ? "Deactivate" : "Activate"} user{" "}
              <strong className="text-slate-700">
                "{confirmAction.userName}"
              </strong>
              ?
            </>
          ),
          bgColor: "#f5f3ff",
        };
      case "delete":
        return {
          icon: <AlertTriangle size={26} className="text-rose-500" />,
          title: "Delete User",
          message: (
            <>
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-700">
                "{confirmAction.userName}"
              </strong>
              ? This cannot be undone.
            </>
          ),
          bgColor: "#fff1f2",
        };
      default:
        return { icon: null, title: "", message: "", bgColor: "" };
    }
  };

  const modalContent = getModalContent();

  /* ── loading skeleton ── */
  if (loading)
    return (
      <div className="space-y-4 animate-pulse p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-14 border-b border-slate-50 bg-slate-50 mx-4 my-1 rounded-lg"
            />
          ))}
        </div>
      </div>
    );

  /* ═══════════════════════════ RENDER ══════════════════════════ */
  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif] bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .th-btn { @apply flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 transition-colors; }
        .action-btn { @apply p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95; }
        .input-base { @apply w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all; }
        select:focus { outline: none; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>

      <div className="p-4 md:p-6">
        {/* ── page header ── */}
        <div className="flex items-center justify-end mb-3">
          <button
            onClick={() => fetchUsers(true)}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm ${refreshing ? "animate-pulse" : ""}`}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── stat cards - responsive grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          {[
            {
              label: "Total",
              val: stats.total,
              icon: <Users size={16} />,
              color: "from-indigo-500 to-violet-600",
            },
            {
              label: "Verified",
              val: stats.verified,
              icon: <ShieldCheck size={16} />,
              color: "from-emerald-400 to-teal-600",
            },
            {
              label: "Pending",
              val: stats.pending,
              icon: <Clock size={16} />,
              color: "from-amber-400 to-orange-500",
            },
            {
              label: "Active",
              val: stats.active,
              icon: <Zap size={16} />,
              color: "from-sky-400 to-blue-600",
            },
          ].map(({ label, val, icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 flex items-center gap-2 md:gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
              >
                {icon}
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-lg md:text-2xl font-bold text-slate-800 leading-none mt-0.5">
                  {val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── search + filter bar ── */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* search */}
            <div className="flex-1 relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                className="input-base pl-9 pr-9"
                placeholder="Search business, name, mobile, email, GST, district…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* filter toggle */}
            <button
              onClick={() => setFilterPanelOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-xs md:text-sm font-medium transition-all ${
                filterPanelOpen || activeFilters > 0
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
              }`}
            >
              <Filter size={14} />
              Filters
              {activeFilters > 0 && (
                <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* per-page */}
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="input-base w-auto pr-8 cursor-pointer focus:outline-none text-xs md:text-sm"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>

          {/* expanded filter panel */}
          {filterPanelOpen && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
                  Verification
                </label>
                <select
                  value={filterVS}
                  onChange={(e) => {
                    setFilterVS(e.target.value);
                    setPage(1);
                  }}
                  className="input-base focus:outline-none text-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={filterActive}
                  onChange={(e) => {
                    setFilterActive(e.target.value);
                    setPage(1);
                  }}
                  className="input-base focus:outline-none text-sm"
                >
                  <option value="all">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
                  Business Type
                </label>
                <select
                  value={filterBType}
                  onChange={(e) => {
                    setFilterBType(e.target.value);
                    setPage(1);
                  }}
                  className="input-base focus:outline-none text-sm"
                >
                  <option value="all">All Types</option>
                  {businessTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <X size={13} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── results meta ── */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <span>
            Showing{" "}
            <strong className="text-slate-600">{paginated.length}</strong> of{" "}
            <strong className="text-slate-600">{sorted.length}</strong> results
            {activeFilters > 0 || search
              ? ` (filtered from ${users.length})`
              : ""}
          </span>
          <span>
            Page {safePage} of {totalPages}
          </span>
        </div>

        {/* ── table ── */}
        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 md:py-20 text-slate-400">
            <Users size={36} className="mb-3 opacity-30" />
            <p className="font-semibold text-slate-500">No users found</p>
            <p className="text-xs md:text-sm mt-1">Try adjusting your search or filters</p>
            {(search || activeFilters > 0) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── DESKTOP TABLE ── */}
            <div
              ref={tableRef}
              className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      {[
                        { label: "Business", key: "businessName" as SortKey },
                        { label: "Contact", key: "name" as SortKey },
                        { label: "Mobile", key: "mobileNumber" as SortKey },
                        { label: "Active", key: "isActive" as SortKey },
                        { label: "Joined", key: "createdAt" as SortKey },
                      ].map(({ label, key }) => (
                        <th
                          key={key}
                          className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
                        >
                          <button
                            className="th-btn"
                            onClick={() => handleSort(key)}
                          >
                            {label} <SortIcon col={key} />
                          </button>
                        </th>
                      ))}
                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                              {user.businessName}
                            </p>
                            {hasPendingReupload(user) && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200 animate-pulse"
                                title="This user re-uploaded a rejected KYC document — needs review"
                              >
                                <RefreshCw size={10} />
                                Reuploaded
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {user.businessType || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700 font-medium">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
                            {user.email || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-mono text-xs">
                          {user.mobileNumber}
                        </td>
                        <td className="px-5 py-4">
                          <ActivePill active={user.isActive} />
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Details Button */}
                            <button
                              title="View Details"
                              onClick={() => setDetailUser(user)}
                              className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Verify Button - Show only for pending users */}
                            {user.verificationStatus === "pending" && (
                              <button
                                title="Verify"
                                onClick={() =>
                                  handleOpenConfirmModal({
                                    type: "verify",
                                    userId: user._id,
                                    userName: user.businessName,
                                  })
                                }
                                className="action-btn text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              >
                                <CheckCircle size={15} />
                              </button>
                            )}

                            {/* Toggle Active/Inactive Button - Always show */}
                            <button
                              title={user.isActive ? "Deactivate" : "Activate"}
                              onClick={() =>
                                handleOpenConfirmModal({
                                  type: "toggleActive",
                                  userId: user._id,
                                  userName: user.businessName,
                                  currentActive: user.isActive,
                                })
                              }
                              className="action-btn text-slate-400 hover:text-violet-600 hover:bg-violet-50"
                            >
                              <Power size={15} />
                            </button>

                            {/* Delete Button - Always show */}
                            <button
                              title="Delete"
                              onClick={() =>
                                handleOpenConfirmModal({
                                  type: "delete",
                                  userId: user._id,
                                  userName: user.businessName,
                                })
                              }
                              className="action-btn text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="md:hidden space-y-3 mb-4">
              {paginated.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-800 text-base">
                          {user.businessName}
                        </p>
                        {hasPendingReupload(user) && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200"
                            title="This user re-uploaded a rejected KYC document — needs review"
                          >
                            <RefreshCw size={10} />
                            Reuploaded
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {user.businessType || "—"}
                      </p>
                    </div>
                    <StatusPill status={user.verificationStatus} />
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                    <p>
                      <span className="font-medium text-slate-600">Name: </span>
                      {user.name}
                    </p>
                    <p>
                      <span className="font-medium text-slate-600">
                        Mobile:{" "}
                      </span>
                      <span className="font-mono">{user.mobileNumber}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-600">
                        Joined:{" "}
                      </span>
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </p>
                    <div className="pt-1">
                      <ActivePill active={user.isActive} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => setDetailUser(user)}
                      className="action-btn text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Verify Button - Show only for pending users */}
                    {user.verificationStatus === "pending" && (
                      <button
                        onClick={() =>
                          handleOpenConfirmModal({
                            type: "verify",
                            userId: user._id,
                            userName: user.businessName,
                          })
                        }
                        className="action-btn text-emerald-500 hover:bg-emerald-50"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleOpenConfirmModal({
                          type: "toggleActive",
                          userId: user._id,
                          userName: user.businessName,
                          currentActive: user.isActive,
                        })
                      }
                      className="action-btn text-violet-500 hover:bg-violet-50"
                    >
                      <Power size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleOpenConfirmModal({
                          type: "delete",
                          userId: user._id,
                          userName: user.businessName,
                        })
                      }
                      className="action-btn text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm px-3 md:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  {(safePage - 1) * perPage + 1}–
                  {Math.min(safePage * perPage, sorted.length)} of{" "}
                  {sorted.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={safePage === 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (n) =>
                        n === 1 ||
                        n === totalPages ||
                        Math.abs(n - safePage) <= 1,
                    )
                    .reduce<(number | "…")[]>((acc, n, i, arr) => {
                      if (
                        i > 0 &&
                        typeof arr[i - 1] === "number" &&
                        n - (arr[i - 1] as number) > 1
                      )
                        acc.push("…");
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, i) =>
                      n === "…" ? (
                        <span
                          key={`e${i}`}
                          className="px-2 text-slate-300 text-xs"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n as number)}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs font-semibold transition-all ${
                            safePage === n
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                              : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                          }`}
                        >
                          {n}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={safePage === totalPages}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ════════════ MUI DETAIL MODAL (UPDATED WITH KYC) ════════════ */}
      <StyledDetailDialog
        open={detailUser !== null}
        onClose={() => setDetailUser(null)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: "16px 24px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {detailUser?.businessName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              {detailUser?.businessType}
            </Typography>
          </Box>
          <IconButton onClick={() => setDetailUser(null)} size="small">
            <X size={18} />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: "24px", overflow: "auto" }}>
          {detailUser && (
            <div className="space-y-5">
              <div className="flex gap-2 flex-wrap">
                <StatusPill status={detailUser.verificationStatus} />
                <ActivePill active={detailUser.isActive} />
              </div>

              {[
                {
                  title: "Business Information",
                  icon: <Building size={15} />,
                  rows: [
                    ["Business Name", detailUser.businessName],
                    ["Business Type", detailUser.businessType || "N/A"],
                    ["GST Number", detailUser.gstNumber || "Not Provided"],
                  ],
                },
                {
                  title: "Contact Details",
                  icon: <Phone size={15} />,
                  rows: [
                    ["Contact Person", detailUser.name],
                    ["Mobile Number", detailUser.mobileNumber],
                    ["Email Address", detailUser.email || "Not Provided"],
                  ],
                },
                {
                  title: "Address Information",
                  icon: <MapPin size={15} />,
                  rows: [
                    ["Full Address", detailUser.address || "Not Provided"],
                    ["Village/City", detailUser.village || "Not Provided"],
                    ["Taluk", detailUser.taluk || "Not Provided"],
                    ["District", detailUser.district || "Not Provided"],
                    ["State", detailUser.state || "Not Provided"],
                  ],
                },
              ].map((sec) => (
                <div
                  key={sec.title}
                  className="border border-slate-100 rounded-xl overflow-hidden"
                >
                  <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {sec.icon} {sec.title}
                  </div>
                  <div className="divide-y divide-slate-50">
                    {sec.rows.map(([k, v]) => (
                      <div key={k} className="flex px-4 py-2.5 text-sm">
                        <span className="text-slate-400 w-32 flex-shrink-0">
                          {k}
                        </span>
                        <span className="text-slate-700 font-medium break-words">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* ─── KYC DOCUMENTS SECTION ─── */}
              {detailUser.kycDocuments && detailUser.kycDocuments.length > 0 && (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <FileText size={15} /> KYC Documents
                  </div>
                  <div className="divide-y divide-slate-50">
                    {detailUser.kycDocuments.map((doc) => (
                      <div key={doc._id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 capitalize">
                            {doc.docType} – {doc.docNumber}
                          </p>
                          <a
                            // href={doc.documentUrl}
                              href={`https://kisan.etpl.ai${doc.documentUrl}`}

                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-500 hover:underline break-all"
                          >
                            View Document
                          </a>
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <StatusPill status={doc.status} />
                            {doc.isReupload && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border bg-sky-50 text-sky-700 border-sky-200"
                                title={doc.resubmittedAt ? `Re-submitted on ${new Date(doc.resubmittedAt).toLocaleString("en-IN")}` : undefined}
                              >
                                <RefreshCw size={11} />
                                Re-uploaded
                              </span>
                            )}
                            {doc.status === "rejected" && doc.rejectionReason && (
                              <span className="text-xs text-rose-500">
                                Reason: {doc.rejectionReason}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {doc.status === "pending" && (
                            <>
                          <button
  onClick={() => {
    const reason = prompt("Enter rejection reason (optional):");
    if (reason !== null) {
      setKycActionLoading({
        docId: doc._id,
        action: "rejected",
      });

      handleKycAction(doc._id, "rejected", reason || undefined);
    }
  }}
  disabled={kycActionLoading?.docId === doc._id}
  className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-100 transition disabled:opacity-50"
>
  {kycActionLoading?.docId === doc._id &&
  kycActionLoading?.action === "rejected"
    ? "Rejecting..."
    : "Reject"}
</button>
                              <button
  onClick={() => {
    setKycActionLoading({
      docId: doc._id,
      action: "verified",
    });

    handleKycAction(doc._id, "verified");
  }}
  disabled={kycActionLoading?.docId === doc._id}
  className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition disabled:opacity-50"
>
  {kycActionLoading?.docId === doc._id &&
  kycActionLoading?.action === "verified"
    ? "Approving..."
    : "Approve"}
</button>
                            </>
                          )}
                          {doc.status === "verified" && (
                            <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
                          )}
                          {doc.status === "rejected" && (
                            <span className="text-xs text-rose-600 font-medium">✗ Rejected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── VERIFICATION DETAILS ─── */}
              {(detailUser.verificationStatus === "verified" ||
                detailUser.verificationStatus === "rejected") && (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <ShieldCheck size={15} /> Verification Details
                  </div>
                  <div className="divide-y divide-slate-50">
                    {detailUser.verifiedBy && (
                      <div className="flex px-4 py-2.5 text-sm">
                        <span className="text-slate-400 w-32">Verified By</span>
                        <span className="text-slate-700 font-medium">
                          {detailUser.verifiedBy}
                        </span>
                      </div>
                    )}
                    {detailUser.verifiedDate && (
                      <div className="flex px-4 py-2.5 text-sm">
                        <span className="text-slate-400 w-32">Verified On</span>
                        <span className="text-slate-700 font-medium">
                          {new Date(detailUser.verifiedDate).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    )}
                    {detailUser.rejectionReason && (
                      <div className="flex px-4 py-2.5 text-sm">
                        <span className="text-slate-400 w-32">
                          Rejection Reason
                        </span>
                        <span className="text-rose-600 font-medium">
                          {detailUser.rejectionReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <Calendar size={15} /> System Information
                </div>
                <div className="divide-y divide-slate-50">
                  <div className="flex px-4 py-2.5 text-sm">
                    <span className="text-slate-400 w-32">Account Created</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(detailUser.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex px-4 py-2.5 text-sm">
                    <span className="text-slate-400 w-32">Last Updated</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(detailUser.updatedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
          <Button onClick={() => setDetailUser(null)}>Close</Button>
        </DialogActions>
      </StyledDetailDialog>

      {/* ════════════ MUI CONFIRM MODAL ════════════ */}
      <StyledDialog
        open={confirmAction !== null}
        onClose={() => {
          setConfirmAction(null);
          setRejectionReasonText("");
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              backgroundColor: modalContent.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            {modalContent.icon}
          </Box>
        </Box>
        <StyledDialogTitle>
          <Typography variant="h6" component="span">
            {modalContent.title}
          </Typography>
        </StyledDialogTitle>
        <StyledDialogContent>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
            }}
          >
            {modalContent.message}
          </Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            onClick={() => {
              setConfirmAction(null);
              setRejectionReasonText("");
            }}
            sx={{
              flex: 1,
              borderRadius: "12px",
              padding: "10px 16px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#475569",
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#f8fafc",
                borderColor: "#cbd5e1",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            sx={{
              flex: 1,
              borderRadius: "12px",
              padding: "10px 16px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              backgroundColor:
                confirmAction?.type === "verify"
                  ? "#10b981"
                  : confirmAction?.type === "toggleActive"
                    ? "#8b5cf6"
                    : "#f43f5e",
              color: "white",
              "&:hover": {
                backgroundColor:
                  confirmAction?.type === "verify"
                    ? "#059669"
                    : confirmAction?.type === "toggleActive"
                      ? "#7c3aed"
                      : "#e11d48",
              },
            }}
          >
            Confirm
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </div>
  );
};

export default B2BUsers;