// components/b2b/B2BUsers.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Power,
  Search,
  Filter,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  rejectionReason: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy: string;
  verifiedDate: string;
  createdAt: string;
  updatedAt: string;
}

interface B2BUsersProps {
  adminSession: any;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  overflow: "auto",
  p: 0,
};

const B2BUsers: React.FC<B2BUsersProps> = ({ adminSession }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "verify" | "reject" | "toggleActive" | "delete";
    userId: string;
    userName?: string;
  } | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/b2b-users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNumber.includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || user.verificationStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVerifyUser = async (
    userId: string,
    status: "verified" | "rejected",
  ) => {
    try {
      const response = await fetch(`/api/b2b-users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedBy: adminSession?.name || "Admin",
          rejectionReason: status === "rejected" ? "Rejected by admin" : "",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`User ${status} successfully`);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/b2b-users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
        );
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to toggle user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/b2b-users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
        if (paginatedUsers.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const openConfirmModal = (type: any, userId: string, userName: string) => {
    setConfirmAction({ type, userId, userName });
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case "verify":
        handleVerifyUser(confirmAction.userId, "verified");
        break;
      case "reject":
        handleVerifyUser(confirmAction.userId, "rejected");
        break;
      case "toggleActive":
        const user = users.find((u) => u._id === confirmAction.userId);
        if (user) handleToggleActive(confirmAction.userId, user.isActive);
        break;
      case "delete":
        handleDeleteUser(confirmAction.userId);
        break;
    }
    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Verified
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };

  // Desktop Table View
  const DesktopTable = () => (
    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {user.businessName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.businessType}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">
                    {user.mobileNumber}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.verificationStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>

                    {user.verificationStatus === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            openConfirmModal(
                              "verify",
                              user._id,
                              user.businessName,
                            )
                          }
                          className="text-green-600 hover:text-green-800"
                          title="Verify"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() =>
                            openConfirmModal(
                              "reject",
                              user._id,
                              user.businessName,
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        openConfirmModal(
                          "toggleActive",
                          user._id,
                          user.businessName,
                        )
                      }
                      className="text-purple-600 hover:text-purple-800"
                      title={user.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power size={18} />
                    </button>

                    <button
                      onClick={() =>
                        openConfirmModal("delete", user._id, user.businessName)
                      }
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Mobile Card View
  const MobileCards = () => (
    <div className="md:hidden space-y-4">
      {paginatedUsers.map((user) => (
        <div key={user._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {user.businessName}
              </h3>
              <p className="text-sm text-gray-500">{user.businessType}</p>
            </div>
            {getStatusBadge(user.verificationStatus)}
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm">
              <span className="font-medium text-gray-700">Name:</span>{" "}
              {user.name}
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Mobile:</span>{" "}
              {user.mobileNumber}
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Status:</span>{" "}
              <span
                className={user.isActive ? "text-green-600" : "text-red-600"}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t">
            <button
              onClick={() => {
                setSelectedUser(user);
                setModalOpen(true);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <Eye size={18} />
            </button>

            {user.verificationStatus === "pending" && (
              <>
                <button
                  onClick={() =>
                    openConfirmModal("verify", user._id, user.businessName)
                  }
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={() =>
                    openConfirmModal("reject", user._id, user.businessName)
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}

            <button
              onClick={() =>
                openConfirmModal("toggleActive", user._id, user.businessName)
              }
              className="text-purple-600 hover:text-purple-800"
            >
              <Power size={18} />
            </button>

            <button
              onClick={() =>
                openConfirmModal("delete", user._id, user.businessName)
              }
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Stats
  const stats = {
    total: users.length,
    verified: users.filter((u) => u.verificationStatus === "verified").length,
    pending: users.filter((u) => u.verificationStatus === "pending").length,
    rejected: users.filter((u) => u.verificationStatus === "rejected").length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by business name, mobile or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-64">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
      </div>

      {/* Users Table/Cards */}
      {paginatedUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <>
          <DesktopTable />
          <MobileCards />

          {/* MUI Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </>
      )}

      {/* MUI Modal for User Details */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="user-details-modal"
      >
        <Box sx={modalStyle}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              User Details
            </h2>
            <IconButton onClick={() => setModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </div>

          {selectedUser && (
            <div className="p-6 space-y-6">
              {/* Status Badges */}
              <div className="flex gap-3">
                {getStatusBadge(selectedUser.verificationStatus)}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedUser.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              {/* Business Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building size={18} /> Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Business Name:</span>{" "}
                    <span className="font-medium">
                      {selectedUser.businessName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Business Type:</span>{" "}
                    <span className="font-medium">
                      {selectedUser.businessType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">GST Number:</span>{" "}
                    <span className="font-medium">
                      {selectedUser.gstNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="font-medium">
                      {selectedUser.mobileNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="font-medium">
                      {selectedUser.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Name:</span>{" "}
                    {selectedUser.name}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} /> Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Address:</span>{" "}
                    {selectedUser.address || "N/A"}
                  </div>
                  <div>
                    <span className="text-gray-500">Village:</span>{" "}
                    {selectedUser.village || "N/A"}
                  </div>
                  <div>
                    <span className="text-gray-500">Taluk:</span>{" "}
                    {selectedUser.taluk || "N/A"}
                  </div>
                  <div>
                    <span className="text-gray-500">District:</span>{" "}
                    {selectedUser.district || "N/A"}
                  </div>
                  <div>
                    <span className="text-gray-500">State:</span>{" "}
                    {selectedUser.state || "N/A"}
                  </div>
                </div>
              </div>

              {/* Verification Info */}
              {selectedUser.verificationStatus !== "pending" && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} /> Verification Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Verified By:</span>{" "}
                      {selectedUser.verifiedBy || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-500">Verified Date:</span>{" "}
                      {selectedUser.verifiedDate
                        ? new Date(
                            selectedUser.verifiedDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                    {selectedUser.rejectionReason && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Rejection Reason:</span>{" "}
                        <span className="text-red-600">
                          {selectedUser.rejectionReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} /> Timestamps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Created At:</span>{" "}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>{" "}
                    {new Date(selectedUser.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      {/* MUI Modal for Confirmation */}
      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        aria-labelledby="confirmation-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              {confirmAction?.type === "delete" ? (
                <Trash2 className="text-red-600" size={24} />
              ) : confirmAction?.type === "verify" ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : confirmAction?.type === "reject" ? (
                <XCircle className="text-red-600" size={24} />
              ) : (
                <Power className="text-purple-600" size={24} />
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {confirmAction?.type === "verify"
                ? "Verify User"
                : confirmAction?.type === "reject"
                  ? "Reject User"
                  : confirmAction?.type === "toggleActive"
                    ? "Change Status"
                    : "Delete User"}
            </h3>

            <p className="text-gray-600 mb-6">
              {confirmAction?.type === "verify"
                ? `Are you sure you want to verify "${confirmAction?.userName}"?`
                : confirmAction?.type === "reject"
                  ? `Are you sure you want to reject "${confirmAction?.userName}"?`
                  : confirmAction?.type === "toggleActive"
                    ? `Are you sure you want to change the active status of "${confirmAction?.userName}"?`
                    : `Are you sure you want to delete "${confirmAction?.userName}"? This action cannot be undone.`}
            </p>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  confirmAction?.type === "delete" ||
                  confirmAction?.type === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction?.type === "verify"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default B2BUsers;
