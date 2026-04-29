// components/b2b/B2BProducts.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Plus,
  Edit,
  X,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  Power,
} from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  categoryId: string;
  categoryName: string;
  image: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  image: string;
}

interface Product {
  _id: string;
  productName: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  images: string[];
  price: number;
  quantity: number;
  unit: string;
  taluk: string;
  postedBy: string;
  postedByName: string;
  status: string;
  viewCount: number;
  isActive: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface AdminSession {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "subadmin";
  state: string;
  district: string;
  taluka: string;
  verificationStatus?: string;
  isActive?: boolean;
  pageAccess: string[];
  permissions: any;
}

interface B2BProductsProps {
  adminSession: AdminSession | null;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 900,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  overflow: "auto",
  p: 0,
};

const B2BProducts: React.FC<B2BProductsProps> = ({ adminSession }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVerification, setFilterVerification] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "verify" | "reject" | "toggleActive" | "delete";
    productId: string;
    productName?: string;
  } | null>(null);

  // In B2BProducts component, update the formData state:

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    categoryId: "",
    categoryName: "",
    subCategoryId: "",
    subCategoryName: "",
    price: "",
    quantity: "",
    unit: "kg",
    taluk: adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
    postedBy: adminSession?._id || "",
    postedByName: adminSession?.name || "",
    role: adminSession?.role || "",
    userTaluk: adminSession?.taluka || "",
    verificationStatus: adminSession?.verificationStatus || "verified",
    isActive:
      adminSession?.isActive !== undefined ? adminSession.isActive : true,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    if (adminSession) {
      fetchProducts();
      fetchCategories();
      fetchSubCategories();
    }
  }, [adminSession]);

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subCategories.filter(
        (sub) => sub.categoryId === formData.categoryId,
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.categoryId, subCategories]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "/api/b2b-products?";
      if (adminSession?.role === "subadmin") {
        url += `role=subadmin&adminTaluk=${adminSession.taluka}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategory");
      const data = await response.json();
      if (data.success) {
        setSubCategories(data.subCat);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formDataObj = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataObj.append("images", files[i]);
    }

    setUploading(true);
    try {
      const response = await fetch("/api/b2b-products/upload", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        setUploadedImages([...uploadedImages, ...data.images]);
        toast.success(`${data.images.length} image(s) uploaded successfully`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find((c) => c._id === categoryId);
    setFormData({
      ...formData,
      categoryId,
      categoryName: selectedCategory?.categoryName || "",
      subCategoryId: "",
      subCategoryName: "",
    });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subCategoryId = e.target.value;
    const selectedSub = subCategories.find((s) => s._id === subCategoryId);
    setFormData({
      ...formData,
      subCategoryId,
      subCategoryName: selectedSub?.subCategoryName || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    console.log(
      "Submitting product with data:",
      formData,
      "admin",
      adminSession,
    );
    // Only send fields that are in the schema
    const productData = {
      productName: formData.productName,
      description: formData.description,
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      subCategoryId: formData.subCategoryId,
      subCategoryName: formData.subCategoryName,
      images: uploadedImages,
      price: parseFloat(formData.price),
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      taluk: adminSession?.taluka || "",
      postedBy: adminSession?._id,
      postedByName: adminSession?.name,
      role: adminSession?.role,
      userTaluk: adminSession?.taluka || "",
      verificationStatus: adminSession?.verificationStatus || "verified",
      isActive:
        adminSession?.isActive !== undefined ? adminSession.isActive : true,
    };

    try {
      const url = isEditMode
        ? `/api/b2b-products/${editId}`
        : "/api/b2b-products";
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(
          isEditMode
            ? "Product updated successfully"
            : "Product created successfully",
        );
        resetForm();
        fetchProducts();
        setModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditMode(true);
    setEditId(product._id);
    setFormData({
      productName: product.productName,
      description: product.description,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      subCategoryId: product.subCategoryId,
      subCategoryName: product.subCategoryName,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit,
      taluk: product.taluk,
      postedBy: adminSession?._id || "",
      postedByName: adminSession?.name || "",
      role: adminSession?.role || "",
      userTaluk: adminSession?.taluka || "",
      verificationStatus: adminSession?.verificationStatus || "verified",
      isActive:
        adminSession?.isActive !== undefined ? adminSession.isActive : true,
    });
    setUploadedImages(product.images);
    setModalOpen(true);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditId("");
    setFormData({
      productName: "",
      description: "",
      categoryId: "",
      categoryName: "",
      subCategoryId: "",
      subCategoryName: "",
      price: "",
      quantity: "",
      unit: "kg",
      taluk:
        adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
      postedBy: adminSession?._id || "",
      postedByName: adminSession?.name || "",
      role: adminSession?.role || "",
      userTaluk: adminSession?.taluka || "",
      verificationStatus: adminSession?.verificationStatus || "verified",
      isActive:
        adminSession?.isActive !== undefined ? adminSession.isActive : true,
    });
    setUploadedImages([]);
  };

  const handleVerifyProduct = async (
    productId: string,
    status: "verified" | "rejected",
  ) => {
    try {
      const response = await fetch(`/api/b2b-products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationStatus: status,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Product ${status} successfully`);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const handleToggleActive = async (
    productId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/b2b-products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(
          `Product ${!currentStatus ? "activated" : "deactivated"} successfully`,
        );
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to toggle product status");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/b2b-products/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
        if (filteredProducts.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const openConfirmModal = (
    type: any,
    productId: string,
    productName: string,
  ) => {
    setConfirmAction({ type, productId, productName });
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    switch (confirmAction.type) {
      case "verify":
        handleVerifyProduct(confirmAction.productId, "verified");
        break;
      case "reject":
        handleVerifyProduct(confirmAction.productId, "rejected");
        break;
      case "toggleActive":
        const product = products.find((p) => p._id === confirmAction.productId);
        if (product)
          handleToggleActive(confirmAction.productId, product.isActive);
        break;
      case "delete":
        handleDeleteProduct(confirmAction.productId);
        break;
    }
    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    const matchesVerification =
      filterVerification === "all" ||
      product.verificationStatus === filterVerification;
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

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

  const DesktopTable = () => (
    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SubCategory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Taluk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {product.productName}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.categoryName}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.subCategoryName}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{product.price}/{product.unit}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.quantity} {product.unit}
                </td>
                <td className="px-6 py-4 text-gray-600">{product.taluk}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(product.verificationStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setViewModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    {adminSession?.role === "admin" &&
                      product.verificationStatus === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              openConfirmModal(
                                "verify",
                                product._id,
                                product.productName,
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
                                product._id,
                                product.productName,
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
                          product._id,
                          product.productName,
                        )
                      }
                      className="text-purple-600 hover:text-purple-800"
                      title={product.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power size={18} />
                    </button>
                    <button
                      onClick={() =>
                        openConfirmModal(
                          "delete",
                          product._id,
                          product.productName,
                        )
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

  const MobileCards = () => (
    <div className="md:hidden space-y-4">
      {paginatedProducts.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {product.productName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product.description}
              </p>
            </div>
            {getStatusBadge(product.verificationStatus)}
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm">
              <span className="font-medium">Category:</span>{" "}
              {product.categoryName}
            </p>
            <p className="text-sm">
              <span className="font-medium">SubCategory:</span>{" "}
              {product.subCategoryName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Price:</span> ₹{product.price}/
              {product.unit}
            </p>
            <p className="text-sm">
              <span className="font-medium">Quantity:</span> {product.quantity}{" "}
              {product.unit}
            </p>
            <p className="text-sm">
              <span className="font-medium">Taluk:</span> {product.taluk}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span> {product.status}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t">
            <button
              onClick={() => {
                setSelectedProduct(product);
                setViewModalOpen(true);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(product)}
              className="text-green-600 hover:text-green-800"
            >
              <Edit size={18} />
            </button>
            {adminSession?.role === "admin" &&
              product.verificationStatus === "pending" && (
                <>
                  <button
                    onClick={() =>
                      openConfirmModal(
                        "verify",
                        product._id,
                        product.productName,
                      )
                    }
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() =>
                      openConfirmModal(
                        "reject",
                        product._id,
                        product.productName,
                      )
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle size={18} />
                  </button>
                </>
              )}
            <button
              onClick={() =>
                openConfirmModal("delete", product._id, product.productName)
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

  const stats = {
    total: products.length,
    verified: products.filter((p) => p.verificationStatus === "verified")
      .length,
    pending: products.filter((p) => p.verificationStatus === "pending").length,
    active: products.filter((p) => p.isActive).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="sold">Sold</option>
          </select>
          <select
            value={filterVerification}
            onChange={(e) => {
              setFilterVerification(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Verification</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Products</p>
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

      {/* Products Table/Cards */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <DesktopTable />
          <MobileCards />
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </div>
          )}
        </>
      )}

      {/* Add/Edit Product Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploading && (
                  <p className="text-sm text-blue-600">Uploading...</p>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category *
                </label>
                <select
                  required
                  value={formData.subCategoryId}
                  onChange={handleSubCategoryChange}
                  disabled={!formData.categoryId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Sub Category</option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="ton">Ton</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="bunch">Bunch</option>
                  <option value="packet">Packet</option>
                  <option value="quintal">Quintal</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isEditMode ? "Update" : "Create"} Product
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* View Product Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box sx={modalStyle}>
          {selectedProduct && (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Details</h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-600">
                      Product Name:
                    </label>{" "}
                    <p className="mt-1">{selectedProduct.productName}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Category:
                    </label>{" "}
                    <p className="mt-1">{selectedProduct.categoryName}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Sub Category:
                    </label>{" "}
                    <p className="mt-1">{selectedProduct.subCategoryName}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Price:</label>{" "}
                    <p className="mt-1">
                      ₹{selectedProduct.price}/{selectedProduct.unit}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Quantity:
                    </label>{" "}
                    <p className="mt-1">
                      {selectedProduct.quantity} {selectedProduct.unit}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Taluk:</label>{" "}
                    <p className="mt-1">{selectedProduct.taluk}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Posted By:
                    </label>{" "}
                    <p className="mt-1">{selectedProduct.postedByName}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Status:</label>{" "}
                    <p className="mt-1">{selectedProduct.status}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Verification:
                    </label>{" "}
                    <p className="mt-1">{selectedProduct.verificationStatus}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Views:</label>{" "}
                    <p className="mt-1">{selectedProduct.viewCount}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Created At:
                    </label>{" "}
                    <p className="mt-1">
                      {new Date(selectedProduct.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Last Updated:
                    </label>{" "}
                    <p className="mt-1">
                      {new Date(selectedProduct.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-600">
                      Description:
                    </label>{" "}
                    <p className="mt-1">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
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
            <h3 className="text-lg font-semibold mb-2">
              {confirmAction?.type === "verify"
                ? "Verify Product"
                : confirmAction?.type === "reject"
                  ? "Reject Product"
                  : confirmAction?.type === "toggleActive"
                    ? "Change Status"
                    : "Delete Product"}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmAction?.type === "verify"
                ? `Are you sure you want to verify "${confirmAction?.productName}"?`
                : confirmAction?.type === "reject"
                  ? `Are you sure you want to reject "${confirmAction?.productName}"?`
                  : confirmAction?.type === "toggleActive"
                    ? `Are you sure you want to change the status of "${confirmAction?.productName}"?`
                    : `Are you sure you want to delete "${confirmAction?.productName}"? This action cannot be undone.`}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg ${
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

export default B2BProducts;
