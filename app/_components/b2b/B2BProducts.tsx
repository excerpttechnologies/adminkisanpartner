// // components/b2b/B2BProducts.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Eye,
//   Trash2,
//   Plus,
//   Edit,
//   X,
//   Upload,
//   Search,
//   CheckCircle,
//   XCircle,
//   Power,
// } from "lucide-react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Pagination from "@mui/material/Pagination";
// import toast from "react-hot-toast";

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
//   image: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image: string;
// }

// interface Product {
//   _id: string;
//   productName: string;
//   description: string;
//   categoryId: string;
//   categoryName: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   images: string[];
//   price: number;
//   quantity: number;
//   unit: string;
//   taluk: string;
//   postedBy: string;
//   postedByName: string;
//   status: string;
//   viewCount: number;
//   isActive: boolean;
//   verificationStatus: "pending" | "verified" | "rejected";
//   createdAt: string;
//   updatedAt: string;
// }

// interface AdminSession {
//   _id: string;
//   name: string;
//   email: string;
//   role: "admin" | "subadmin";
//   state: string;
//   district: string;
//   taluka: string;
//   verificationStatus?: string;
//   isActive?: boolean;
//   pageAccess: string[];
//   permissions: any;
// }

// interface B2BProductsProps {
//   adminSession: AdminSession | null;
// }

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90%",
//   maxWidth: 900,
//   maxHeight: "90vh",
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   overflow: "auto",
//   p: 0,
// };

// const B2BProducts: React.FC<B2BProductsProps> = ({ adminSession }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [filteredSubCategories, setFilteredSubCategories] = useState<
//     SubCategory[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterVerification, setFilterVerification] = useState("all");
//   const [page, setPage] = useState(1);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: "verify" | "reject" | "toggleActive" | "delete";
//     productId: string;
//     productName?: string;
//   } | null>(null);

//   // In B2BProducts component, update the formData state:

//   const [formData, setFormData] = useState({
//     productName: "",
//     description: "",
//     categoryId: "",
//     categoryName: "",
//     subCategoryId: "",
//     subCategoryName: "",
//     price: "",
//     quantity: "",
//     unit: "kg",
//     taluk: adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
//     postedBy: adminSession?._id || "",
//     postedByName: adminSession?.name || "",
//     role: adminSession?.role || "",
//     userTaluk: adminSession?.taluka || "",
//     verificationStatus: adminSession?.verificationStatus || "verified",
//     isActive:
//       adminSession?.isActive !== undefined ? adminSession.isActive : true,
//   });

//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState("");

//   const itemsPerPage = 10;

//   useEffect(() => {
//     if (adminSession) {
//       fetchProducts();
//       fetchCategories();
//       fetchSubCategories();
//     }
//   }, [adminSession]);

//   useEffect(() => {
//     if (formData.categoryId) {
//       const filtered = subCategories.filter(
//         (sub) => sub.categoryId === formData.categoryId,
//       );
//       setFilteredSubCategories(filtered);
//     } else {
//       setFilteredSubCategories([]);
//     }
//   }, [formData.categoryId, subCategories]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       let url = "/api/b2b-products?";
//       if (adminSession?.role === "subadmin") {
//         url += `role=subadmin&adminTaluk=${adminSession.taluka}`;
//       }
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.success) {
//         setProducts(data.products);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       toast.error("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("/api/category");
//       const data = await response.json();
//       if (data.success) {
//         setCategories(data.category);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSubCategories = async () => {
//     try {
//       const response = await fetch("/api/subcategory");
//       const data = await response.json();
//       if (data.success) {
//         setSubCategories(data.subCat);
//       }
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const formDataObj = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formDataObj.append("images", files[i]);
//     }

//     setUploading(true);
//     try {
//       const response = await fetch("/api/b2b-products/upload", {
//         method: "POST",
//         body: formDataObj,
//       });
//       const data = await response.json();
//       if (data.success) {
//         setUploadedImages([...uploadedImages, ...data.images]);
//         toast.success(`${data.images.length} image(s) uploaded successfully`);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to upload images");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeImage = (index: number) => {
//     const newImages = [...uploadedImages];
//     newImages.splice(index, 1);
//     setUploadedImages(newImages);
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const categoryId = e.target.value;
//     const selectedCategory = categories.find((c) => c._id === categoryId);
//     setFormData({
//       ...formData,
//       categoryId,
//       categoryName: selectedCategory?.categoryName || "",
//       subCategoryId: "",
//       subCategoryName: "",
//     });
//   };

//   const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const subCategoryId = e.target.value;
//     const selectedSub = subCategories.find((s) => s._id === subCategoryId);
//     setFormData({
//       ...formData,
//       subCategoryId,
//       subCategoryName: selectedSub?.subCategoryName || "",
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (uploadedImages.length === 0) {
//       toast.error("Please upload at least one image");
//       return;
//     }

//     console.log(
//       "Submitting product with data:",
//       formData,
//       "admin",
//       adminSession,
//     );
//     // Only send fields that are in the schema
//     const productData = {
//       productName: formData.productName,
//       description: formData.description,
//       categoryId: formData.categoryId,
//       categoryName: formData.categoryName,
//       subCategoryId: formData.subCategoryId,
//       subCategoryName: formData.subCategoryName,
//       images: uploadedImages,
//       price: parseFloat(formData.price),
//       quantity: parseFloat(formData.quantity),
//       unit: formData.unit,
//       taluk: adminSession?.taluka || "",
//       postedBy: adminSession?._id,
//       postedByName: adminSession?.name,
//       role: adminSession?.role,
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     };

//     try {
//       const url = isEditMode
//         ? `/api/b2b-products/${editId}`
//         : "/api/b2b-products";
//       const method = isEditMode ? "PATCH" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(productData),
//       });
//       const data = await response.json();

//       if (data.success) {
//         toast.success(
//           isEditMode
//             ? "Product updated successfully"
//             : "Product created successfully",
//         );
//         resetForm();
//         fetchProducts();
//         setModalOpen(false);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error saving product:", error);
//       toast.error("Failed to save product");
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setIsEditMode(true);
//     setEditId(product._id);
//     setFormData({
//       productName: product.productName,
//       description: product.description,
//       categoryId: product.categoryId,
//       categoryName: product.categoryName,
//       subCategoryId: product.subCategoryId,
//       subCategoryName: product.subCategoryName,
//       price: product.price.toString(),
//       quantity: product.quantity.toString(),
//       unit: product.unit,
//       taluk: product.taluk,
//       postedBy: adminSession?._id || "",
//       postedByName: adminSession?.name || "",
//       role: adminSession?.role || "",
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     });
//     setUploadedImages(product.images);
//     setModalOpen(true);
//   };

//   const resetForm = () => {
//     setIsEditMode(false);
//     setEditId("");
//     setFormData({
//       productName: "",
//       description: "",
//       categoryId: "",
//       categoryName: "",
//       subCategoryId: "",
//       subCategoryName: "",
//       price: "",
//       quantity: "",
//       unit: "kg",
//       taluk:
//         adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
//       postedBy: adminSession?._id || "",
//       postedByName: adminSession?.name || "",
//       role: adminSession?.role || "",
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     });
//     setUploadedImages([]);
//   };

//   const handleVerifyProduct = async (
//     productId: string,
//     status: "verified" | "rejected",
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           verificationStatus: status,
//         }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(`Product ${status} successfully`);
//         fetchProducts();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to update product status");
//     }
//   };

//   const handleToggleActive = async (
//     productId: string,
//     currentStatus: boolean,
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive: !currentStatus }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(
//           `Product ${!currentStatus ? "activated" : "deactivated"} successfully`,
//         );
//         fetchProducts();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to toggle product status");
//     }
//   };

//   const handleDeleteProduct = async (productId: string) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "DELETE",
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success("Product deleted successfully");
//         fetchProducts();
//         if (filteredProducts.length === 1 && page > 1) {
//           setPage(page - 1);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to delete product");
//     }
//   };

//   const openConfirmModal = (
//     type: any,
//     productId: string,
//     productName: string,
//   ) => {
//     setConfirmAction({ type, productId, productName });
//     setConfirmModalOpen(true);
//   };

//   const handleConfirmAction = () => {
//     if (!confirmAction) return;
//     switch (confirmAction.type) {
//       case "verify":
//         handleVerifyProduct(confirmAction.productId, "verified");
//         break;
//       case "reject":
//         handleVerifyProduct(confirmAction.productId, "rejected");
//         break;
//       case "toggleActive":
//         const product = products.find((p) => p._id === confirmAction.productId);
//         if (product)
//           handleToggleActive(confirmAction.productId, product.isActive);
//         break;
//       case "delete":
//         handleDeleteProduct(confirmAction.productId);
//         break;
//     }
//     setConfirmModalOpen(false);
//     setConfirmAction(null);
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "all" || product.status === filterStatus;
//     const matchesVerification =
//       filterVerification === "all" ||
//       product.verificationStatus === filterVerification;
//     return matchesSearch && matchesStatus && matchesVerification;
//   });

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage,
//   );

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

//   const DesktopTable = () => (
//     <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Category
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 SubCategory
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Quantity
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Taluk
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Verification
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedProducts.map((product) => (
//               <tr key={product._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <div className="font-medium text-gray-900">
//                     {product.productName}
//                   </div>
//                   <div className="text-sm text-gray-500 truncate max-w-xs">
//                     {product.description}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">
//                   {product.categoryName}
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">
//                   {product.subCategoryName}
//                 </td>
//                 <td className="px-6 py-4 font-medium text-gray-900">
//                   ₹{product.price}/{product.unit}
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">
//                   {product.quantity} {product.unit}
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">{product.taluk}</td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       product.status === "active"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   {getStatusBadge(product.verificationStatus)}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setSelectedProduct(product);
//                         setViewModalOpen(true);
//                       }}
//                       className="text-blue-600 hover:text-blue-800"
//                       title="View Details"
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="text-green-600 hover:text-green-800"
//                       title="Edit"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     {adminSession?.role === "admin" &&
//                       product.verificationStatus === "pending" && (
//                         <>
//                           <button
//                             onClick={() =>
//                               openConfirmModal(
//                                 "verify",
//                                 product._id,
//                                 product.productName,
//                               )
//                             }
//                             className="text-green-600 hover:text-green-800"
//                             title="Verify"
//                           >
//                             <CheckCircle size={18} />
//                           </button>
//                           <button
//                             onClick={() =>
//                               openConfirmModal(
//                                 "reject",
//                                 product._id,
//                                 product.productName,
//                               )
//                             }
//                             className="text-red-600 hover:text-red-800"
//                             title="Reject"
//                           >
//                             <XCircle size={18} />
//                           </button>
//                         </>
//                       )}
//                     <button
//                       onClick={() =>
//                         openConfirmModal(
//                           "toggleActive",
//                           product._id,
//                           product.productName,
//                         )
//                       }
//                       className="text-purple-600 hover:text-purple-800"
//                       title={product.isActive ? "Deactivate" : "Activate"}
//                     >
//                       <Power size={18} />
//                     </button>
//                     <button
//                       onClick={() =>
//                         openConfirmModal(
//                           "delete",
//                           product._id,
//                           product.productName,
//                         )
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

//   const MobileCards = () => (
//     <div className="md:hidden space-y-4">
//       {paginatedProducts.map((product) => (
//         <div key={product._id} className="bg-white rounded-lg shadow p-4">
//           <div className="flex justify-between items-start mb-3">
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-900">
//                 {product.productName}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 {product.description}
//               </p>
//             </div>
//             {getStatusBadge(product.verificationStatus)}
//           </div>

//           <div className="space-y-2 mb-3">
//             <p className="text-sm">
//               <span className="font-medium">Category:</span>{" "}
//               {product.categoryName}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium">SubCategory:</span>{" "}
//               {product.subCategoryName}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium">Price:</span> ₹{product.price}/
//               {product.unit}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium">Quantity:</span> {product.quantity}{" "}
//               {product.unit}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium">Taluk:</span> {product.taluk}
//             </p>
//             <p className="text-sm">
//               <span className="font-medium">Status:</span> {product.status}
//             </p>
//           </div>

//           <div className="flex justify-end space-x-3 pt-3 border-t">
//             <button
//               onClick={() => {
//                 setSelectedProduct(product);
//                 setViewModalOpen(true);
//               }}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               <Eye size={18} />
//             </button>
//             <button
//               onClick={() => handleEdit(product)}
//               className="text-green-600 hover:text-green-800"
//             >
//               <Edit size={18} />
//             </button>
//             {adminSession?.role === "admin" &&
//               product.verificationStatus === "pending" && (
//                 <>
//                   <button
//                     onClick={() =>
//                       openConfirmModal(
//                         "verify",
//                         product._id,
//                         product.productName,
//                       )
//                     }
//                     className="text-green-600 hover:text-green-800"
//                   >
//                     <CheckCircle size={18} />
//                   </button>
//                   <button
//                     onClick={() =>
//                       openConfirmModal(
//                         "reject",
//                         product._id,
//                         product.productName,
//                       )
//                     }
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <XCircle size={18} />
//                   </button>
//                 </>
//               )}
//             <button
//               onClick={() =>
//                 openConfirmModal("delete", product._id, product.productName)
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

//   const stats = {
//     total: products.length,
//     verified: products.filter((p) => p.verificationStatus === "verified")
//       .length,
//     pending: products.filter((p) => p.verificationStatus === "pending").length,
//     active: products.filter((p) => p.isActive).length,
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header and Actions */}
//       <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div className="flex-1 flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <select
//             value={filterStatus}
//             onChange={(e) => {
//               setFilterStatus(e.target.value);
//               setPage(1);
//             }}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="sold">Sold</option>
//           </select>
//           <select
//             value={filterVerification}
//             onChange={(e) => {
//               setFilterVerification(e.target.value);
//               setPage(1);
//             }}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All Verification</option>
//             <option value="pending">Pending</option>
//             <option value="verified">Verified</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>
//         <button
//           onClick={() => {
//             resetForm();
//             setModalOpen(true);
//           }}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus size={20} />
//           Add Product
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <p className="text-sm text-gray-600">Total Products</p>
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

//       {/* Products Table/Cards */}
//       {paginatedProducts.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <p className="text-gray-500">No products found</p>
//         </div>
//       ) : (
//         <>
//           <DesktopTable />
//           <MobileCards />
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={(_, value) => setPage(value)}
//                 color="primary"
//                 size="large"
//               />
//             </div>
//           )}
//         </>
//       )}

//       {/* Add/Edit Product Modal */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//             <h2 className="text-xl font-semibold">
//               {isEditMode ? "Edit Product" : "Add New Product"}
//             </h2>
//             <button
//               onClick={() => setModalOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Images Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Images
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                   {uploadedImages.map((img, idx) => (
//                     <div key={idx} className="relative">
//                       <img
//                         src={img}
//                         alt={`Product ${idx + 1}`}
//                         className="w-full h-24 object-cover rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(idx)}
//                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                       >
//                         <X size={14} />
//                       </button>
//                     </div>
//                   ))}
//                   <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
//                     <Upload size={24} className="text-gray-400" />
//                     <span className="text-xs text-gray-500 mt-1">Upload</span>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//                 {uploading && (
//                   <p className="text-sm text-blue-600">Uploading...</p>
//                 )}
//               </div>
//             </div>

//             {/* Product Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.productName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, productName: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.categoryId}
//                   onChange={handleCategoryChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sub Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.subCategoryId}
//                   onChange={handleSubCategoryChange}
//                   disabled={!formData.categoryId}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                 >
//                   <option value="">Select Sub Category</option>
//                   {filteredSubCategories.map((sub) => (
//                     <option key={sub._id} value={sub._id}>
//                       {sub.subCategoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   step="0.01"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, price: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   step="0.01"
//                   value={formData.quantity}
//                   onChange={(e) =>
//                     setFormData({ ...formData, quantity: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Unit *
//                 </label>
//                 <select
//                   required
//                   value={formData.unit}
//                   onChange={(e) =>
//                     setFormData({ ...formData, unit: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="kg">Kilogram (kg)</option>
//                   <option value="g">Gram (g)</option>
//                   <option value="ton">Ton</option>
//                   <option value="piece">Piece</option>
//                   <option value="dozen">Dozen</option>
//                   <option value="bunch">Bunch</option>
//                   <option value="packet">Packet</option>
//                   <option value="quintal">Quintal</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={() => setModalOpen(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//               >
//                 {isEditMode ? "Update" : "Create"} Product
//               </button>
//             </div>
//           </form>
//         </Box>
//       </Modal>

//       {/* View Product Modal */}
//       <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
//         <Box sx={modalStyle}>
//           {selectedProduct && (
//             <>
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//                 <h2 className="text-xl font-semibold">Product Details</h2>
//                 <button
//                   onClick={() => setViewModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {selectedProduct.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`Product ${idx + 1}`}
//                       className="w-full h-32 object-cover rounded-lg"
//                     />
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Product Name:
//                     </label>{" "}
//                     <p className="mt-1">{selectedProduct.productName}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Category:
//                     </label>{" "}
//                     <p className="mt-1">{selectedProduct.categoryName}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Sub Category:
//                     </label>{" "}
//                     <p className="mt-1">{selectedProduct.subCategoryName}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">Price:</label>{" "}
//                     <p className="mt-1">
//                       ₹{selectedProduct.price}/{selectedProduct.unit}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Quantity:
//                     </label>{" "}
//                     <p className="mt-1">
//                       {selectedProduct.quantity} {selectedProduct.unit}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">Taluk:</label>{" "}
//                     <p className="mt-1">{selectedProduct.taluk}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Posted By:
//                     </label>{" "}
//                     <p className="mt-1">{selectedProduct.postedByName}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">Status:</label>{" "}
//                     <p className="mt-1">{selectedProduct.status}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Verification:
//                     </label>{" "}
//                     <p className="mt-1">{selectedProduct.verificationStatus}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">Views:</label>{" "}
//                     <p className="mt-1">{selectedProduct.viewCount}</p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Created At:
//                     </label>{" "}
//                     <p className="mt-1">
//                       {new Date(selectedProduct.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="font-medium text-gray-600">
//                       Last Updated:
//                     </label>{" "}
//                     <p className="mt-1">
//                       {new Date(selectedProduct.updatedAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="font-medium text-gray-600">
//                       Description:
//                     </label>{" "}
//                     <p className="mt-1">{selectedProduct.description}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>

//       {/* Confirmation Modal */}
//       <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
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
//             <h3 className="text-lg font-semibold mb-2">
//               {confirmAction?.type === "verify"
//                 ? "Verify Product"
//                 : confirmAction?.type === "reject"
//                   ? "Reject Product"
//                   : confirmAction?.type === "toggleActive"
//                     ? "Change Status"
//                     : "Delete Product"}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {confirmAction?.type === "verify"
//                 ? `Are you sure you want to verify "${confirmAction?.productName}"?`
//                 : confirmAction?.type === "reject"
//                   ? `Are you sure you want to reject "${confirmAction?.productName}"?`
//                   : confirmAction?.type === "toggleActive"
//                     ? `Are you sure you want to change the status of "${confirmAction?.productName}"?`
//                     : `Are you sure you want to delete "${confirmAction?.productName}"? This action cannot be undone.`}
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setConfirmModalOpen(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 text-white rounded-lg ${
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

// export default B2BProducts;









// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Eye,
//   Trash2,
//   Plus,
//   Edit,
//   X,
//   Upload,
//   Search,
//   CheckCircle,
//   XCircle,
//   Power,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   Package,
//   Filter,
// } from "lucide-react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Pagination from "@mui/material/Pagination";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import toast from "react-hot-toast";

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
//   image: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image: string;
// }

// interface Product {
//   _id: string;
//   productName: string;
//   description: string;
//   categoryId: string;
//   categoryName: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   images: string[];
//   price: number;
//   quantity: number;
//   unit: string;
//   taluk: string;
//   postedBy: string;
//   postedByName: string;
//   status: string;
//   viewCount: number;
//   isActive: boolean;
//   verificationStatus: "pending" | "verified" | "rejected";
//   createdAt: string;
//   updatedAt: string;
// }

// interface PaginationMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// interface AdminSession {
//   _id: string;
//   name: string;
//   email: string;
//   role: "admin" | "subadmin";
//   state: string;
//   district: string;
//   taluka: string;
//   verificationStatus?: string;
//   isActive?: boolean;
//   pageAccess: string[];
//   permissions: any;
// }

// interface B2BProductsProps {
//   adminSession: AdminSession | null;
// }

// type SortField = "productName" | "price" | "quantity" | "createdAt" | "status";
// type SortOrder = "asc" | "desc";

// const LIMIT_OPTIONS = [10, 25, 50, 100];

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90%",
//   maxWidth: 900,
//   maxHeight: "90vh",
//   bgcolor: "background.paper",
//   borderRadius: 3,
//   boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
//   overflow: "auto",
//   p: 0,
// };

// const StatusBadge = ({ status }: { status: string }) => {
//   const map: Record<string, { bg: string; color: string; label: string }> = {
//     verified: { bg: "#ecfdf5", color: "#059669", label: "Verified" },
//     rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
//     pending: { bg: "#fffbeb", color: "#d97706", label: "Pending" },
//     active: { bg: "#eff6ff", color: "#2563eb", label: "Active" },
//     inactive: { bg: "#f9fafb", color: "#6b7280", label: "Inactive" },
//     sold: { bg: "#fdf4ff", color: "#9333ea", label: "Sold" },
//   };
//   const style = map[status] || map["pending"];
//   return (
//     <span
//       className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide"
//       style={{ background: style.bg, color: style.color }}
//     >
//       {style.label}
//     </span>
//   );
// };

// const SortIcon = ({
//   field,
//   sortField,
//   sortOrder,
// }: {
//   field: string;
//   sortField: string;
//   sortOrder: string;
// }) => {
//   if (sortField !== field)
//     return <ArrowUpDown size={14} className="opacity-35 ml-1" />;
//   return sortOrder === "asc" ? (
//     <ArrowUp size={14} className="ml-1 text-indigo-500" />
//   ) : (
//     <ArrowDown size={14} className="ml-1 text-indigo-500" />
//   );
// };

// const B2BProducts: React.FC<B2BProductsProps> = ({ adminSession }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [filteredSubCategories, setFilteredSubCategories] = useState<
//     SubCategory[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState(""); // debounced input
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [sortField, setSortField] = useState<SortField>("createdAt");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
//   const [previewImages, setPreviewImages] = useState<string[]>([]);
//   const [previewIndex, setPreviewIndex] = useState(0);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: "verify" | "reject" | "toggleActive" | "delete";
//     productId: string;
//     productName?: string;
//   } | null>(null);

//   const [formData, setFormData] = useState({
//     productName: "",
//     description: "",
//     categoryId: "",
//     categoryName: "",
//     subCategoryId: "",
//     subCategoryName: "",
//     price: "",
//     quantity: "",
//     unit: "kg",
//     taluk: adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
//     postedBy: adminSession?._id || "",
//     postedByName: adminSession?.name || "",
//     role: adminSession?.role || "",
//     userTaluk: adminSession?.taluka || "",
//     verificationStatus: adminSession?.verificationStatus || "verified",
//     isActive:
//       adminSession?.isActive !== undefined ? adminSession.isActive : true,
//   });

//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState("");
//   const [productLoading, setProductLoading] = useState(true);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   useEffect(() => {
//     if (adminSession) {
//       fetchProducts();
//     }
//   }, [
//     adminSession,
//     page,
//     limit,
//     searchTerm,
//     filterStatus,
//     sortField,
//     sortOrder,
//   ]);

//   useEffect(() => {
//     if (adminSession) {
//       fetchCategories();
//       fetchSubCategories();
//     }
//   }, [adminSession]);

//   useEffect(() => {
//     if (formData.categoryId) {
//       const filtered = subCategories.filter(
//         (sub) => sub.categoryId === formData.categoryId,
//       );
//       setFilteredSubCategories(filtered);
//     } else {
//       setFilteredSubCategories([]);
//     }
//   }, [formData.categoryId, subCategories]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();
//       params.set("page", String(page));
//       params.set("limit", String(limit));

//       if (adminSession?.role === "subadmin") {
//         params.set("role", "subadmin");
//         params.set("adminTaluk", adminSession.taluka || "");
//       }

//       if (searchTerm) params.set("search", searchTerm);
//       if (filterStatus !== "all") params.set("status", filterStatus);

//       // Pass sort to API (API currently sorts by createdAt desc; extend if needed)
//       params.set("sortField", sortField);
//       params.set("sortOrder", sortOrder);

//       const response = await fetch(`/api/b2b-products?${params.toString()}`);
//       const data = await response.json();

//       if (data.success) {
//         setProducts(data.products);
//         setPaginationMeta(data.pagination);
//       } else {
//         toast.error(data.message || "Failed to fetch products");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch products");
//     } finally {
//       setLoading(false);
//       setProductLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("/api/category");
//       const data = await response.json();
//       if (data.success) setCategories(data.category);
//     } catch {}
//   };

//   const fetchSubCategories = async () => {
//     try {
//       const response = await fetch("/api/subcategory");
//       const data = await response.json();
//       if (data.success) setSubCategories(data.subCat);
//     } catch {}
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
//     const formDataObj = new FormData();
//     for (let i = 0; i < files.length; i++)
//       formDataObj.append("images", files[i]);
//     setUploading(true);
//     try {
//       const response = await fetch("/api/b2b-products/upload", {
//         method: "POST",
//         body: formDataObj,
//       });
//       const data = await response.json();
//       if (data.success) {
//         setUploadedImages([...uploadedImages, ...data.images]);
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to upload images");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeImage = (index: number) => {
//     const newImages = [...uploadedImages];
//     newImages.splice(index, 1);
//     setUploadedImages(newImages);
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const categoryId = e.target.value;
//     const selectedCategory = categories.find((c) => c._id === categoryId);
//     setFormData({
//       ...formData,
//       categoryId,
//       categoryName: selectedCategory?.categoryName || "",
//       subCategoryId: "",
//       subCategoryName: "",
//     });
//   };

//   const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const subCategoryId = e.target.value;
//     const selectedSub = subCategories.find((s) => s._id === subCategoryId);
//     setFormData({
//       ...formData,
//       subCategoryId,
//       subCategoryName: selectedSub?.subCategoryName || "",
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (uploadedImages.length === 0) {
//       toast.error("Please upload at least one image");
//       return;
//     }
//     const productData = {
//       productName: formData.productName,
//       description: formData.description,
//       categoryId: formData.categoryId,
//       categoryName: formData.categoryName,
//       subCategoryId: formData.subCategoryId,
//       subCategoryName: formData.subCategoryName,
//       images: uploadedImages,
//       price: parseFloat(formData.price),
//       quantity: parseFloat(formData.quantity),
//       unit: formData.unit,
//       taluk: adminSession?.taluka || "",
//       postedBy: adminSession?._id,
//       postedByName: adminSession?.name,
//       role: adminSession?.role,
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     };
//     try {
//       const url = isEditMode
//         ? `/api/b2b-products/${editId}`
//         : "/api/b2b-products";
//       const method = isEditMode ? "PATCH" : "POST";
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(productData),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(isEditMode ? "Product updated" : "Product created");
//         resetForm();
//         fetchProducts();
//         setModalOpen(false);
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to save product");
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setIsEditMode(true);
//     setEditId(product._id);
//     setFormData({
//       productName: product.productName,
//       description: product.description,
//       categoryId: product.categoryId,
//       categoryName: product.categoryName,
//       subCategoryId: product.subCategoryId,
//       subCategoryName: product.subCategoryName,
//       price: product.price.toString(),
//       quantity: product.quantity.toString(),
//       unit: product.unit,
//       taluk: product.taluk,
//       postedBy: adminSession?._id || "",
//       postedByName: adminSession?.name || "",
//       role: adminSession?.role || "",
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     });
//     setUploadedImages(product.images);
//     setModalOpen(true);
//   };

//   const resetForm = () => {
//     setIsEditMode(false);
//     setEditId("");
//     setFormData({
//       productName: "",
//       description: "",
//       categoryId: "",
//       categoryName: "",
//       subCategoryId: "",
//       subCategoryName: "",
//       price: "",
//       quantity: "",
//       unit: "kg",
//       taluk:
//         adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
//       postedBy: adminSession?._id || "",
//       postedByName: adminSession?.name || "",
//       role: adminSession?.role || "",
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     });
//     setUploadedImages([]);
//   };

//   const handleVerifyProduct = async (
//     productId: string,
//     status: "verified" | "rejected",
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ verificationStatus: status }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(`Product ${status}`);
//         fetchProducts();
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const handleToggleActive = async (
//     productId: string,
//     currentStatus: boolean,
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive: !currentStatus }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(
//           `Product ${!currentStatus ? "activated" : "deactivated"}`,
//         );
//         fetchProducts();
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to toggle status");
//     }
//   };

//   const handleDeleteProduct = async (productId: string) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "DELETE",
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success("Product deleted");
//         // If last item on page > 1, go back a page
//         if (products.length === 1 && page > 1) {
//           setPage(page - 1);
//         } else {
//           fetchProducts();
//         }
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//   const openConfirmModal = (
//     type: any,
//     productId: string,
//     productName: string,
//   ) => {
//     setConfirmAction({ type, productId, productName });
//     setConfirmModalOpen(true);
//   };

//   const handleConfirmAction = () => {
//     if (!confirmAction) return;
//     switch (confirmAction.type) {
//       case "verify":
//         handleVerifyProduct(confirmAction.productId, "verified");
//         break;
//       case "reject":
//         handleVerifyProduct(confirmAction.productId, "rejected");
//         break;
//       case "toggleActive":
//         const product = products.find((p) => p._id === confirmAction.productId);
//         if (product)
//           handleToggleActive(confirmAction.productId, product.isActive);
//         break;
//       case "delete":
//         handleDeleteProduct(confirmAction.productId);
//         break;
//     }
//     setConfirmModalOpen(false);
//     setConfirmAction(null);
//   };

//   const handleSort = (field: SortField) => {
//     if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//     setPage(1);
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPage(1);
//   };

//   if (productLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[300px] gap-4">
//         <div className="w-11 h-11 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
//         <p className="text-gray-400 text-sm">Loading products...</p>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   return (
//     <div className="xl:w-auto md:w-[70vw] font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         .row-hover:hover { background: #fafbff !important; }
//         .action-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.15s, color 0.15s; display: flex; align-items: center; justify-content: center; }
//         .action-btn:hover { background: #f3f4f6; }
//         .sort-th:hover { background: #f9fafb; color: #111; }
//         input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
//       `}</style>

//       {/* Header */}
//       <div className="mb-2 -mt-2 animate-[fadeIn_0.4s_ease]">
//         <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
//           <div />
//           <button
//             onClick={() => {
//               resetForm();
//               setModalOpen(true);
//             }}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all duration-150 hover:-translate-y-px hover:shadow-lg"
//           >
//             <Plus size={18} /> Add Product
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 flex-wrap items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//           {/* Search */}
//           <div className="relative flex-1 min-w-[200px]">
//             <Search
//               size={16}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               placeholder="Search products, category, taluk..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               className="w-full py-2.5 pl-10 pr-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//             />
//           </div>

//           {/* Status filter */}
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select
//               value={filterStatus}
//               onChange={(e) => {
//                 setFilterStatus(e.target.value);
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] min-w-[140px]"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="sold">Sold</option>
//             </select>
//           </div>

//           {/* Sort */}
//           <div className="flex items-center gap-2">
//             <ArrowUpDown size={16} className="text-gray-400" />
//             <select
//               value={`${sortField}-${sortOrder}`}
//               onChange={(e) => {
//                 const [field, order] = e.target.value.split("-");
//                 setSortField(field as SortField);
//                 setSortOrder(order as SortOrder);
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] min-w-[160px]"
//             >
//               <option value="createdAt-desc">Newest First</option>
//               <option value="createdAt-asc">Oldest First</option>
//               <option value="productName-asc">Name A–Z</option>
//               <option value="productName-desc">Name Z–A</option>
//               <option value="price-asc">Price Low–High</option>
//               <option value="price-desc">Price High–Low</option>
//               <option value="quantity-desc">Quantity High–Low</option>
//             </select>
//           </div>

//           {/* Rows per page */}
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
//               Rows:
//             </span>
//             <div className="flex gap-1">
//               {LIMIT_OPTIONS.map((opt) => (
//                 <button
//                   key={opt}
//                   onClick={() => handleLimitChange(opt)}
//                   className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all duration-150 cursor-pointer"
//                   style={{
//                     background:
//                       limit === opt
//                         ? "linear-gradient(135deg,#6366f1,#a855f7)"
//                         : "#f9fafb",
//                     color: limit === opt ? "#fff" : "#6b7280",
//                     borderColor: limit === opt ? "#6366f1" : "#e5e7eb",
//                   }}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Clear filters */}
//           {(searchInput || filterStatus !== "all") && (
//             <button
//               onClick={() => {
//                 setSearchInput("");
//                 setSearchTerm("");
//                 setFilterStatus("all");
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-1.5"
//             >
//               <X size={14} /> Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Results info */}
//       <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
//         <p className="text-xs text-gray-500 m-0">
//           Showing{" "}
//           <strong className="text-gray-900">
//             {paginationMeta.total === 0
//               ? 0
//               : (paginationMeta.page - 1) * paginationMeta.limit + 1}
//             –
//             {Math.min(
//               paginationMeta.page * paginationMeta.limit,
//               paginationMeta.total,
//             )}
//           </strong>{" "}
//           of <strong className="text-gray-900">{paginationMeta.total}</strong>{" "}
//           products
//           {paginationMeta.totalPages > 1 && (
//             <span className="text-gray-400">
//               {" "}
//               · Page {paginationMeta.page} of {paginationMeta.totalPages}
//             </span>
//           )}
//         </p>
//         {loading && (
//           <div className="flex items-center gap-1.5 text-xs text-indigo-500">
//             <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
//             Refreshing...
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       {products.length === 0 && !loading ? (
//         <div className="bg-white rounded-2xl py-16 px-6 text-center border border-dashed border-gray-200">
//           <Package size={40} className="text-gray-300 mb-3 mx-auto" />
//           <p className="text-gray-400 text-base m-0">No products found</p>
//           <p className="text-gray-300 text-sm mt-1">
//             Try adjusting your search or filters
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-auto">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse min-w-[800px]">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("productName")}
//                     >
//                       <div className="flex items-center">
//                         Product{" "}
//                         <SortIcon
//                           field="productName"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Images
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Category
//                     </th>
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("price")}
//                     >
//                       <div className="flex items-center">
//                         Price{" "}
//                         <SortIcon
//                           field="price"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("quantity")}
//                     >
//                       <div className="flex items-center">
//                         Qty{" "}
//                         <SortIcon
//                           field="quantity"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Taluk
//                     </th>
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("status")}
//                     >
//                       <div className="flex items-center">
//                         Status{" "}
//                         <SortIcon
//                           field="status"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((product, idx) => (
//                     <tr
//                       key={product._id}
//                       className="row-hover bg-white transition-colors duration-150"
//                       style={{
//                         borderBottom:
//                           idx < products.length - 1
//                             ? "1px solid #f9fafb"
//                             : "none",
//                       }}
//                     >
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-semibold text-gray-900 text-sm">
//                           {product.productName}
//                         </div>
//                         <div className="text-gray-400 text-xs mt-0.5 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
//                           {product.description}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <Tooltip title="Click to preview" arrow>
//                           <div
//                             className="cursor-pointer"
//                             onClick={() => {
//                               setPreviewImages(product.images);
//                               setPreviewIndex(0);
//                               setImagePreviewOpen(true);
//                             }}
//                           >
//                             <AvatarGroup
//                               max={3}
//                               sx={{
//                                 "& .MuiAvatar-root": {
//                                   width: 36,
//                                   height: 36,
//                                   border: "2px solid #fff",
//                                   fontSize: 11,
//                                   fontWeight: 700,
//                                   background: "#f3f4f6",
//                                   color: "#6b7280",
//                                 },
//                                 justifyContent: "flex-start",
//                               }}
//                             >
//                               {product.images.map((img, i) => (
//                                 <Avatar
//                                   key={i}
//                                   src={img}
//                                   alt={`img-${i}`}
//                                   sx={{ width: 36, height: 36 }}
//                                 />
//                               ))}
//                             </AvatarGroup>
//                           </div>
//                         </Tooltip>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-medium text-gray-700 text-sm">
//                           {product.categoryName}
//                         </div>
//                         <div className="text-gray-400 text-xs">
//                           {product.subCategoryName}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-bold text-gray-900">
//                           ₹{product.price}
//                         </div>
//                         <div className="text-gray-400 text-xs">
//                           per {product.unit}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-medium">{product.quantity}</div>
//                         <div className="text-gray-400 text-xs">
//                           {product.unit}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <span className="text-sm text-gray-600">
//                           {product.taluk}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="flex flex-col gap-1">
//                           <StatusBadge status={product.status} />
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="flex gap-1">
//                           <Tooltip title="View Details" arrow>
//                             <button
//                               className="action-btn text-indigo-500"
//                               onClick={() => {
//                                 setSelectedProduct(product);
//                                 setViewModalOpen(true);
//                               }}
//                             >
//                               <Eye size={16} />
//                             </button>
//                           </Tooltip>
//                           <Tooltip title="Edit" arrow>
//                             <button
//                               className="action-btn text-emerald-600"
//                               onClick={() => handleEdit(product)}
//                             >
//                               <Edit size={16} />
//                             </button>
//                           </Tooltip>
//                           {adminSession?.role === "admin" &&
//                             product.verificationStatus === "pending" && (
//                               <>
//                                 <Tooltip title="Verify" arrow>
//                                   <button
//                                     className="action-btn text-emerald-600"
//                                     onClick={() =>
//                                       openConfirmModal(
//                                         "verify",
//                                         product._id,
//                                         product.productName,
//                                       )
//                                     }
//                                   >
//                                     <CheckCircle size={16} />
//                                   </button>
//                                 </Tooltip>
//                                 <Tooltip title="Reject" arrow>
//                                   <button
//                                     className="action-btn text-red-600"
//                                     onClick={() =>
//                                       openConfirmModal(
//                                         "reject",
//                                         product._id,
//                                         product.productName,
//                                       )
//                                     }
//                                   >
//                                     <XCircle size={16} />
//                                   </button>
//                                 </Tooltip>
//                               </>
//                             )}
//                           <Tooltip
//                             title={product.isActive ? "Deactivate" : "Activate"}
//                             arrow
//                           >
//                             <button
//                               className="action-btn text-purple-600"
//                               onClick={() =>
//                                 openConfirmModal(
//                                   "toggleActive",
//                                   product._id,
//                                   product.productName,
//                                 )
//                               }
//                             >
//                               <Power size={16} />
//                             </button>
//                           </Tooltip>
//                           <Tooltip title="Delete" arrow>
//                             <button
//                               className="action-btn text-red-600"
//                               onClick={() =>
//                                 openConfirmModal(
//                                   "delete",
//                                   product._id,
//                                   product.productName,
//                                 )
//                               }
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </Tooltip>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile Cards */}
//           <div className="block md:hidden">
//             <div className="flex flex-col gap-3">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
//                 >
//                   <div className="flex justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-bold text-base text-gray-900 m-0 mb-1">
//                         {product.productName}
//                       </h3>
//                       <p className="text-gray-400 text-xs m-0 line-clamp-2">
//                         {product.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <div
//                       className="flex flex-wrap gap-1 cursor-pointer"
//                       onClick={() => {
//                         setPreviewImages(product.images);
//                         setPreviewIndex(0);
//                         setImagePreviewOpen(true);
//                       }}
//                     >
//                       <AvatarGroup
//                         max={4}
//                         sx={{
//                           "& .MuiAvatar-root": {
//                             width: 40,
//                             height: 40,
//                             border: "2px solid #fff",
//                             fontSize: 12,
//                           },
//                           justifyContent: "flex-start",
//                         }}
//                       >
//                         {product.images.map((img, i) => (
//                           <Avatar key={i} src={img} alt={`img-${i}`} />
//                         ))}
//                       </AvatarGroup>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 gap-x-3 text-sm mb-3">
//                     <div>
//                       <span className="text-gray-400 text-xs">Category:</span>{" "}
//                       <span className="font-medium text-gray-700 text-xs">
//                         {product.categoryName}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Sub:</span>{" "}
//                       <span className="font-medium text-gray-700 text-xs">
//                         {product.subCategoryName}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Price:</span>{" "}
//                       <span className="font-bold text-gray-900 text-sm">
//                         ₹{product.price}/{product.unit}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Qty:</span>{" "}
//                       <span className="font-medium text-gray-700 text-sm">
//                         {product.quantity} {product.unit}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Taluk:</span>{" "}
//                       <span className="font-medium text-gray-700 text-xs">
//                         {product.taluk}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Status:</span>{" "}
//                       <StatusBadge status={product.status} />
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
//                     <button
//                       className="action-btn text-indigo-500"
//                       onClick={() => {
//                         setSelectedProduct(product);
//                         setViewModalOpen(true);
//                       }}
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button
//                       className="action-btn text-emerald-600"
//                       onClick={() => handleEdit(product)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     {adminSession?.role === "admin" &&
//                       product.verificationStatus === "pending" && (
//                         <>
//                           <button
//                             className="action-btn text-emerald-600"
//                             onClick={() =>
//                               openConfirmModal(
//                                 "verify",
//                                 product._id,
//                                 product.productName,
//                               )
//                             }
//                           >
//                             <CheckCircle size={18} />
//                           </button>
//                           <button
//                             className="action-btn text-red-600"
//                             onClick={() =>
//                               openConfirmModal(
//                                 "reject",
//                                 product._id,
//                                 product.productName,
//                               )
//                             }
//                           >
//                             <XCircle size={18} />
//                           </button>
//                         </>
//                       )}
//                     <button
//                       className="action-btn text-purple-600"
//                       onClick={() =>
//                         openConfirmModal(
//                           "toggleActive",
//                           product._id,
//                           product.productName,
//                         )
//                       }
//                     >
//                       <Power size={18} />
//                     </button>
//                     <button
//                       className="action-btn text-red-600"
//                       onClick={() =>
//                         openConfirmModal(
//                           "delete",
//                           product._id,
//                           product.productName,
//                         )
//                       }
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pagination */}
//           {paginationMeta.totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
//               <p className="text-xs text-gray-400 m-0">
//                 {paginationMeta.total} total products · {limit} per page
//               </p>
//               <Pagination
//                 count={paginationMeta.totalPages}
//                 page={page}
//                 onChange={(_, value) => setPage(value)}
//                 color="primary"
//                 size="small"
//                 sx={{
//                   "& .MuiPaginationItem-root": {
//                     borderRadius: 2,
//                     fontWeight: 600,
//                   },
//                 }}
//               />
//             </div>
//           )}
//         </>
//       )}

//       {/* Image Preview Modal */}
//       <Modal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             outline: "none",
//             display: "flex",
//             width: "fit-content",
//           }}
//         >
//           <div className="relative bg-black rounded-2xl overflow-hidden">
//             <button
//               onClick={() => setImagePreviewOpen(false)}
//               className="absolute top-3 right-3 bg-black/60 border-none text-white rounded-lg p-2 cursor-pointer z-10"
//             >
//               <X size={18} />
//             </button>
//             {previewImages[previewIndex] && (
//               <img
//                 src={previewImages[previewIndex]}
//                 alt="preview"
//                 className="block object-cover object-center rounded-lg"
//                 style={{ minWidth: "50vw", minHeight: "50vh" }}
//               />
//             )}
//             {previewImages.length > 1 && (
//               <div className="flex flex-wrap gap-1 py-2 px-3 bg-black/70 justify-start overflow-x-auto">
//                 {previewImages.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img}
//                     alt=""
//                     onClick={() => setPreviewIndex(i)}
//                     className="w-12 h-12 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0"
//                     style={{
//                       border:
//                         i === previewIndex
//                           ? "2px solid #6366f1"
//                           : "2px solid transparent",
//                       opacity: i === previewIndex ? 1 : 0.6,
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </Box>
//       </Modal>

//       {/* Add/Edit Modal */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 m-0">
//                 {isEditMode ? "Edit Product" : "Add New Product"}
//               </h2>
//               <p className="text-gray-400 text-sm m-0 mt-0.5">
//                 {isEditMode
//                   ? "Update product details"
//                   : "Fill in the details below"}
//               </p>
//             </div>
//             <button
//               onClick={() => setModalOpen(false)}
//               className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer text-gray-500"
//             >
//               <X size={18} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6">
//             {/* Images */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                 Product Images
//               </label>
//               <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
//                 <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 mb-3">
//                   {uploadedImages.map((img, idx) => (
//                     <div key={idx} className="relative">
//                       <img
//                         src={img}
//                         alt={`Product ${idx + 1}`}
//                         className="w-full h-[90px] object-cover rounded-xl"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(idx)}
//                         className="absolute top-1 right-1 bg-red-600 border-none text-white rounded-full w-5.5 h-5.5 cursor-pointer flex items-center justify-center p-0"
//                       >
//                         <X size={12} />
//                       </button>
//                     </div>
//                   ))}
//                   <label className="flex flex-col items-center justify-center h-[90px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white transition-colors hover:border-indigo-500">
//                     <Upload size={22} className="text-gray-400" />
//                     <span className="text-xs text-gray-400 mt-1">
//                       {uploading ? "Uploading..." : "Upload"}
//                     </span>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.productName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, productName: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                   placeholder="Enter product name"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y"
//                   placeholder="Describe the product..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.categoryId}
//                   onChange={handleCategoryChange}
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Sub Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.subCategoryId}
//                   onChange={handleSubCategoryChange}
//                   disabled={!formData.categoryId}
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:bg-gray-50"
//                 >
//                   <option value="">Select Sub Category</option>
//                   {filteredSubCategories.map((sub) => (
//                     <option key={sub._id} value={sub._id}>
//                       {sub.subCategoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   step="0.01"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, price: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                   placeholder="0.00"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   step="0.01"
//                   value={formData.quantity}
//                   onChange={(e) =>
//                     setFormData({ ...formData, quantity: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                   placeholder="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Unit *
//                 </label>
//                 <select
//                   required
//                   value={formData.unit}
//                   onChange={(e) =>
//                     setFormData({ ...formData, unit: e.target.value })
//                   }
//                   className="w-full max-w-[200px] py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                 >
//                   <option value="kg">Kilogram (kg)</option>
//                   <option value="g">Gram (g)</option>
//                   <option value="ton">Ton</option>
//                   <option value="piece">Piece</option>
//                   <option value="dozen">Dozen</option>
//                   <option value="bunch">Bunch</option>
//                   <option value="packet">Packet</option>
//                   <option value="quintal">Quintal</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
//               <button
//                 type="button"
//                 onClick={() => setModalOpen(false)}
//                 className="py-2.5 px-5 bg-gray-100 text-gray-700 border-none rounded-xl text-sm font-semibold cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className="py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isEditMode ? "Update Product" : "Create Product"}
//               </button>
//             </div>
//           </form>
//         </Box>
//       </Modal>

//       {/* View Modal */}
//       <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
//         <Box sx={modalStyle}>
//           {selectedProduct && (
//             <>
//               <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
//                 <h2 className="text-lg font-bold text-gray-900 m-0">
//                   Product Details
//                 </h2>
//                 <button
//                   onClick={() => setViewModalOpen(false)}
//                   className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer text-gray-500"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 mb-6">
//                   {selectedProduct.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`Product ${idx + 1}`}
//                       className="w-full h-30 object-cover rounded-xl border border-gray-100 cursor-pointer"
//                       onClick={() => {
//                         setPreviewImages(selectedProduct.images);
//                         setPreviewIndex(idx);
//                         setImagePreviewOpen(true);
//                       }}
//                     />
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     {
//                       label: "Product Name",
//                       value: selectedProduct.productName,
//                     },
//                     { label: "Category", value: selectedProduct.categoryName },
//                     {
//                       label: "Sub Category",
//                       value: selectedProduct.subCategoryName,
//                     },
//                     {
//                       label: "Price",
//                       value: `₹${selectedProduct.price}/${selectedProduct.unit}`,
//                     },
//                     {
//                       label: "Quantity",
//                       value: `${selectedProduct.quantity} ${selectedProduct.unit}`,
//                     },
//                     { label: "Taluk", value: selectedProduct.taluk },
//                     { label: "Posted By", value: selectedProduct.postedByName },
//                     {
//                       label: "Views",
//                       value: selectedProduct.viewCount.toString(),
//                     },
//                     {
//                       label: "Created",
//                       value: new Date(
//                         selectedProduct.createdAt,
//                       ).toLocaleString(),
//                     },
//                     {
//                       label: "Updated",
//                       value: new Date(
//                         selectedProduct.updatedAt,
//                       ).toLocaleString(),
//                     },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="bg-gray-50 p-3 rounded-xl">
//                       <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                         {label}
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900 m-0">
//                         {value}
//                       </p>
//                     </div>
//                   ))}
//                   <div className="bg-gray-50 p-3 rounded-xl flex gap-2">
//                     <div className="flex-1">
//                       <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                         Status
//                       </p>
//                       <StatusBadge status={selectedProduct.status} />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                         Verification
//                       </p>
//                       <StatusBadge
//                         status={selectedProduct.verificationStatus}
//                       />
//                     </div>
//                   </div>
//                   <div className="md:col-span-2 bg-gray-50 p-3 rounded-xl">
//                     <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                       Description
//                     </p>
//                     <p className="text-sm text-gray-700 m-0 leading-relaxed">
//                       {selectedProduct.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>

//       {/* Confirm Modal */}
//       <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 380,
//             maxWidth: "90vw",
//             bgcolor: "background.paper",
//             borderRadius: 3,
//             boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
//             p: 0,
//             outline: "none",
//           }}
//         >
//           <div className="py-8 px-8 text-center">
//             <div
//               className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
//               style={{
//                 background:
//                   confirmAction?.type === "delete" ||
//                   confirmAction?.type === "reject"
//                     ? "#fef2f2"
//                     : confirmAction?.type === "verify"
//                       ? "#ecfdf5"
//                       : "#fdf4ff",
//               }}
//             >
//               {confirmAction?.type === "delete" ? (
//                 <Trash2 size={24} color="#dc2626" />
//               ) : confirmAction?.type === "verify" ? (
//                 <CheckCircle size={24} color="#059669" />
//               ) : confirmAction?.type === "reject" ? (
//                 <XCircle size={24} color="#dc2626" />
//               ) : (
//                 <Power size={24} color="#9333ea" />
//               )}
//             </div>
//             <h3 className="text-lg font-bold text-gray-900 m-0 mb-2">
//               {confirmAction?.type === "verify"
//                 ? "Verify Product"
//                 : confirmAction?.type === "reject"
//                   ? "Reject Product"
//                   : confirmAction?.type === "toggleActive"
//                     ? "Toggle Status"
//                     : "Delete Product"}
//             </h3>
//             <p className="text-gray-500 text-sm m-0 mb-6 leading-relaxed">
//               {confirmAction?.type === "delete" ? (
//                 <>
//                   Are you sure you want to delete{" "}
//                   <strong>"{confirmAction?.productName}"</strong>? This cannot
//                   be undone.
//                 </>
//               ) : confirmAction?.type === "verify" ? (
//                 <>
//                   Verify <strong>"{confirmAction?.productName}"</strong>?
//                 </>
//               ) : confirmAction?.type === "reject" ? (
//                 <>
//                   Reject <strong>"{confirmAction?.productName}"</strong>?
//                 </>
//               ) : (
//                 <>
//                   Change the status of{" "}
//                   <strong>"{confirmAction?.productName}"</strong>?
//                 </>
//               )}
//             </p>
//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => setConfirmModalOpen(false)}
//                 className="py-2.5 px-6 bg-gray-100 text-gray-700 border-none rounded-xl text-sm font-semibold cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className="py-2.5 px-6 text-white border-none rounded-xl text-sm font-semibold cursor-pointer"
//                 style={{
//                   background:
//                     confirmAction?.type === "delete" ||
//                     confirmAction?.type === "reject"
//                       ? "#dc2626"
//                       : confirmAction?.type === "verify"
//                         ? "#059669"
//                         : "#9333ea",
//                 }}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default B2BProducts;
















// "use client";

// import React, { useState, useEffect, } from "react";
// import {
//   Eye,
//   Trash2,
//   Plus,
//   Edit,
//   X,
//   Upload,
//   Search,
//   CheckCircle,
//   XCircle,
//   Power,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   Package,
//   Filter,
// } from "lucide-react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Pagination from "@mui/material/Pagination";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import toast from "react-hot-toast";

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
//   image: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image: string;
// }

// interface Product {
//   _id: string;
//   productName: string;
//   description: string;
//   categoryId: string;
//   categoryName: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   images: string[];
//   price: number;
//   quantity: number;
//   unit: string;
//   taluk: string;
//   postedBy: string;
//   postedByName: string;
//   status: string;
//   viewCount: number;
//   isActive: boolean;
//   verificationStatus: "pending" | "verified" | "rejected";
//   createdAt: string;
//   updatedAt: string;
// }

// interface PaginationMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// interface AdminSession {
//   _id: string;
//   name: string;
//   email: string;
//   role: "admin" | "subadmin";
//   state: string;
//   district: string;
//   taluka: string;
//   verificationStatus?: string;
//   isActive?: boolean;
//   pageAccess: string[];
//   permissions: any;
// }

// interface B2BProductsProps {
//   adminSession: AdminSession | null;
// }

// type SortField = "productName" | "price" | "quantity" | "createdAt" | "status";
// type SortOrder = "asc" | "desc";

// const LIMIT_OPTIONS = [10, 25, 50, 100];

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90%",
//   maxWidth: 900,
//   maxHeight: "90vh",
//   bgcolor: "background.paper",
//   borderRadius: 3,
//   boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
//   overflow: "auto",
//   p: 0,
// };

// const StatusBadge = ({ status }: { status: string }) => {
//   const map: Record<string, { bg: string; color: string; label: string }> = {
//     verified: { bg: "#ecfdf5", color: "#059669", label: "Verified" },
//     rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
//     pending: { bg: "#fffbeb", color: "#d97706", label: "Pending" },
//     active: { bg: "#eff6ff", color: "#2563eb", label: "Active" },
//     inactive: { bg: "#f9fafb", color: "#6b7280", label: "Inactive" },
//     sold: { bg: "#fdf4ff", color: "#9333ea", label: "Sold" },
//   };
//   const style = map[status] || map["pending"];
//   return (
//     <span
//       className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide"
//       style={{ background: style.bg, color: style.color }}
//     >
//       {style.label}
//     </span>
//   );
// };

// const SortIcon = ({
//   field,
//   sortField,
//   sortOrder,
// }: {
//   field: string;
//   sortField: string;
//   sortOrder: string;
// }) => {
//   if (sortField !== field)
//     return <ArrowUpDown size={14} className="opacity-35 ml-1" />;
//   return sortOrder === "asc" ? (
//     <ArrowUp size={14} className="ml-1 text-indigo-500" />
//   ) : (
//     <ArrowDown size={14} className="ml-1 text-indigo-500" />
//   );
// };

// const B2BProducts: React.FC<B2BProductsProps> = ({ adminSession }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterVerification, setFilterVerification] = useState("all"); // ✅ NEW
//   const [sortField, setSortField] = useState<SortField>("createdAt");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
//   const [previewImages, setPreviewImages] = useState<string[]>([]);
//   const [previewIndex, setPreviewIndex] = useState(0);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: "verify" | "reject" | "toggleActive" | "delete";
//     productId: string;
//     productName?: string;
//   } | null>(null);

//   const [formData, setFormData] = useState({
//     productName: "",
//     description: "",
//     categoryId: "",
//     categoryName: "",
//     subCategoryId: "",
//     subCategoryName: "",
//     price: "",
//     quantity: "",
//     unit: "kg",
//     taluk: adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
//     postedBy: adminSession?._id || "",
//     postedByName: adminSession?.name || "",
//     role: adminSession?.role || "",
//     userTaluk: adminSession?.taluka || "",
//     verificationStatus: adminSession?.verificationStatus || "verified",
//     isActive:
//       adminSession?.isActive !== undefined ? adminSession.isActive : true,
//   });

//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState("");
//   const [productLoading, setProductLoading] = useState(true);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   // ✅ Added filterVerification to dependency array
//   useEffect(() => {
//     if (adminSession) {
//       fetchProducts();
//     }
//   }, [
//     adminSession,
//     page,
//     limit,
//     searchTerm,
//     filterStatus,
//     filterVerification,
//     sortField,
//     sortOrder,
//   ]);

//   useEffect(() => {
//     if (adminSession) {
//       fetchCategories();
//       fetchSubCategories();
//     }
//   }, [adminSession]);

//   useEffect(() => {
//     if (formData.categoryId) {
//       const filtered = subCategories.filter(
//         (sub) => sub.categoryId === formData.categoryId,
//       );
//       setFilteredSubCategories(filtered);
//     } else {
//       setFilteredSubCategories([]);
//     }
//   }, [formData.categoryId, subCategories]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();
//       params.set("page", String(page));
//       params.set("limit", String(limit));

//       if (adminSession?.role === "subadmin") {
//         params.set("role", "subadmin");
//         params.set("adminTaluk", adminSession.taluka || "");
//       }

//       if (searchTerm) params.set("search", searchTerm);
//       if (filterStatus !== "all") params.set("status", filterStatus);
//       if (filterVerification !== "all") params.set("verificationStatus", filterVerification); // ✅ NEW

//       params.set("sortField", sortField);
//       params.set("sortOrder", sortOrder);

//       const response = await fetch(`/api/b2b-products?${params.toString()}`);
//       const data = await response.json();

//       if (data.success) {
//         setProducts(data.products);
//         setPaginationMeta(data.pagination);
//       } else {
//         toast.error(data.message || "Failed to fetch products");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch products");
//     } finally {
//       setLoading(false);
//       setProductLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("/api/category");
//       const data = await response.json();
//       if (data.success) setCategories(data.category);
//     } catch {}
//   };

//   const fetchSubCategories = async () => {
//     try {
//       const response = await fetch("/api/subcategory");
//       const data = await response.json();
//       if (data.success) setSubCategories(data.subCat);
//     } catch {}
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
//     const formDataObj = new FormData();
//     for (let i = 0; i < files.length; i++)
//       formDataObj.append("images", files[i]);
//     setUploading(true);
//     try {
//       const response = await fetch("/api/b2b-products/upload", {
//         method: "POST",
//         body: formDataObj,
//       });
//       const data = await response.json();
//       if (data.success) {
//         setUploadedImages([...uploadedImages, ...data.images]);
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to upload images");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeImage = (index: number) => {
//     const newImages = [...uploadedImages];
//     newImages.splice(index, 1);
//     setUploadedImages(newImages);
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const categoryId = e.target.value;
//     const selectedCategory = categories.find((c) => c._id === categoryId);
//     setFormData({
//       ...formData,
//       categoryId,
//       categoryName: selectedCategory?.categoryName || "",
//       subCategoryId: "",
//       subCategoryName: "",
//     });
//   };

//   const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const subCategoryId = e.target.value;
//     const selectedSub = subCategories.find((s) => s._id === subCategoryId);
//     setFormData({
//       ...formData,
//       subCategoryId,
//       subCategoryName: selectedSub?.subCategoryName || "",
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (uploadedImages.length === 0) {
//       toast.error("Please upload at least one image");
//       return;
//     }
//     const productData = {
//       productName: formData.productName,
//       description: formData.description,
//       categoryId: formData.categoryId,
//       categoryName: formData.categoryName,
//       subCategoryId: formData.subCategoryId,
//       subCategoryName: formData.subCategoryName,
//       images: uploadedImages,
//       price: parseFloat(formData.price),
//       quantity: parseFloat(formData.quantity),
//       unit: formData.unit,
//       taluk: adminSession?.taluka || "",
//       postedBy: adminSession?._id,
//       postedByName: adminSession?.name,
//       role: adminSession?.role,
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     };
//     try {
//       const url = isEditMode
//         ? `/api/b2b-products/${editId}`
//         : "/api/b2b-products";
//       const method = isEditMode ? "PATCH" : "POST";
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(productData),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(isEditMode ? "Product updated" : "Product created");
//         resetForm();
//         fetchProducts();
//         setModalOpen(false);
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to save product");
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setIsEditMode(true);
//     setEditId(product._id);
//     setFormData({
//       productName: product.productName,
//       description: product.description,
//       categoryId: product.categoryId,
//       categoryName: product.categoryName,
//       subCategoryId: product.subCategoryId,
//       subCategoryName: product.subCategoryName,
//       price: product.price.toString(),
//       quantity: product.quantity.toString(),
//       unit: product.unit,
//       taluk: product.taluk,
//       postedBy: adminSession?._id || "",
//       postedByName: adminSession?.name || "",
//       role: adminSession?.role || "",
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     });
//     setUploadedImages(product.images);
//     setModalOpen(true);
//   };

//   const resetForm = () => {
//     setIsEditMode(false);
//     setEditId("");
//     setFormData({
//       productName: "",
//       description: "",
//       categoryId: "",
//       categoryName: "",
//       subCategoryId: "",
//       subCategoryName: "",
//       price: "",
//       quantity: "",
//       unit: "kg",
//       taluk:
//         adminSession?.role === "subadmin" ? adminSession?.taluka || "" : "",
//       postedBy: adminSession?._id || "",
//       postedByName: adminSession?.name || "",
//       role: adminSession?.role || "",
//       userTaluk: adminSession?.taluka || "",
//       verificationStatus: adminSession?.verificationStatus || "verified",
//       isActive:
//         adminSession?.isActive !== undefined ? adminSession.isActive : true,
//     });
//     setUploadedImages([]);
//   };

//   const handleVerifyProduct = async (
//     productId: string,
//     status: "verified" | "rejected",
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ verificationStatus: status }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(`Product ${status}`);
//         fetchProducts();
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const handleToggleActive = async (
//     productId: string,
//     currentStatus: boolean,
//   ) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive: !currentStatus }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success(
//           `Product ${!currentStatus ? "activated" : "deactivated"}`,
//         );
//         fetchProducts();
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to toggle status");
//     }
//   };

//   const handleDeleteProduct = async (productId: string) => {
//     try {
//       const response = await fetch(`/api/b2b-products/${productId}`, {
//         method: "DELETE",
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success("Product deleted");
//         if (products.length === 1 && page > 1) {
//           setPage(page - 1);
//         } else {
//           fetchProducts();
//         }
//       } else toast.error(data.message);
//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//   const openConfirmModal = (
//     type: any,
//     productId: string,
//     productName: string,
//   ) => {
//     setConfirmAction({ type, productId, productName });
//     setConfirmModalOpen(true);
//   };

//   const handleConfirmAction = () => {
//     if (!confirmAction) return;
//     switch (confirmAction.type) {
//       case "verify":
//         handleVerifyProduct(confirmAction.productId, "verified");
//         break;
//       case "reject":
//         handleVerifyProduct(confirmAction.productId, "rejected");
//         break;
//       case "toggleActive":
//         const product = products.find((p) => p._id === confirmAction.productId);
//         if (product)
//           handleToggleActive(confirmAction.productId, product.isActive);
//         break;
//       case "delete":
//         handleDeleteProduct(confirmAction.productId);
//         break;
//     }
//     setConfirmModalOpen(false);
//     setConfirmAction(null);
//   };

//   const handleSort = (field: SortField) => {
//     if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//     setPage(1);
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPage(1);
//   };

//   if (productLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[300px] gap-4">
//         <div className="w-11 h-11 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
//         <p className="text-gray-400 text-sm">Loading products...</p>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   return (
//     <div className="xl:w-auto md:w-[70vw] font-['DM_Sans',sans-serif] bg-gray-50">
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         .row-hover:hover { background: #fafbff !important; }
//         .action-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.15s, color 0.15s; display: flex; align-items: center; justify-content: center; }
//         .action-btn:hover { background: #f3f4f6; }
//         .sort-th:hover { background: #f9fafb; color: #111; }
//         input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
//       `}</style>

//       {/* Header */}
//       <div className="mb-2 -mt-2 animate-[fadeIn_0.4s_ease]">
//         <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
//           <div />
//           <button
//             onClick={() => {
//               resetForm();
//               setModalOpen(true);
//             }}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all duration-150 hover:-translate-y-px hover:shadow-lg"
//           >
//             <Plus size={18} /> Add Product
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 flex-wrap items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//           {/* Search */}
//           <div className="relative flex-1 min-w-[200px]">
//             <Search
//               size={16}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               placeholder="Search products, category, taluk..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               className="w-full py-2.5 pl-10 pr-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//             />
//           </div>

//           {/* Status filter */}
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select
//               value={filterStatus}
//               onChange={(e) => {
//                 setFilterStatus(e.target.value);
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] min-w-[140px]"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="sold">Sold</option>
//             </select>
//           </div>

//           {/* ✅ Verification filter — NEW */}
//           <div className="flex items-center gap-2">
//             <CheckCircle size={16} className="text-gray-400" />
//             <select
//               value={filterVerification}
//               onChange={(e) => {
//                 setFilterVerification(e.target.value);
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] min-w-[160px]"
//             >
//               <option value="all">All Verification</option>
//               <option value="pending">Pending</option>
//               <option value="verified">Verified</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Sort */}
//           <div className="flex items-center gap-2">
//             <ArrowUpDown size={16} className="text-gray-400" />
//             <select
//               value={`${sortField}-${sortOrder}`}
//               onChange={(e) => {
//                 const [field, order] = e.target.value.split("-");
//                 setSortField(field as SortField);
//                 setSortOrder(order as SortOrder);
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] min-w-[160px]"
//             >
//               <option value="createdAt-desc">Newest First</option>
//               <option value="createdAt-asc">Oldest First</option>
//               <option value="productName-asc">Name A–Z</option>
//               <option value="productName-desc">Name Z–A</option>
//               <option value="price-asc">Price Low–High</option>
//               <option value="price-desc">Price High–Low</option>
//               <option value="quantity-desc">Quantity High–Low</option>
//             </select>
//           </div>

//           {/* Rows per page */}
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
//               Rows:
//             </span>
//             <div className="flex gap-1">
//               {LIMIT_OPTIONS.map((opt) => (
//                 <button
//                   key={opt}
//                   onClick={() => handleLimitChange(opt)}
//                   className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all duration-150 cursor-pointer"
//                   style={{
//                     background:
//                       limit === opt
//                         ? "linear-gradient(135deg,#6366f1,#a855f7)"
//                         : "#f9fafb",
//                     color: limit === opt ? "#fff" : "#6b7280",
//                     borderColor: limit === opt ? "#6366f1" : "#e5e7eb",
//                   }}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ✅ Clear filters — updated condition */}
//           {(searchInput || filterStatus !== "all" || filterVerification !== "all") && (
//             <button
//               onClick={() => {
//                 setSearchInput("");
//                 setSearchTerm("");
//                 setFilterStatus("all");
//                 setFilterVerification("all");
//                 setPage(1);
//               }}
//               className="py-2.5 px-3.5 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-1.5"
//             >
//               <X size={14} /> Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Results info */}
//       <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
//         <p className="text-xs text-gray-500 m-0">
//           Showing{" "}
//           <strong className="text-gray-900">
//             {paginationMeta.total === 0
//               ? 0
//               : (paginationMeta.page - 1) * paginationMeta.limit + 1}
//             –
//             {Math.min(
//               paginationMeta.page * paginationMeta.limit,
//               paginationMeta.total,
//             )}
//           </strong>{" "}
//           of <strong className="text-gray-900">{paginationMeta.total}</strong>{" "}
//           products
//           {paginationMeta.totalPages > 1 && (
//             <span className="text-gray-400">
//               {" "}
//               · Page {paginationMeta.page} of {paginationMeta.totalPages}
//             </span>
//           )}
//         </p>
//         {loading && (
//           <div className="flex items-center gap-1.5 text-xs text-indigo-500">
//             <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
//             Refreshing...
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       {products.length === 0 && !loading ? (
//         <div className="bg-white rounded-2xl py-16 px-6 text-center border border-dashed border-gray-200">
//           <Package size={40} className="text-gray-300 mb-3 mx-auto" />
//           <p className="text-gray-400 text-base m-0">No products found</p>
//           <p className="text-gray-300 text-sm mt-1">
//             Try adjusting your search or filters
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-auto">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse min-w-[800px]">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("productName")}
//                     >
//                       <div className="flex items-center">
//                         Product{" "}
//                         <SortIcon
//                           field="productName"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Images
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Category
//                     </th>
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("price")}
//                     >
//                       <div className="flex items-center">
//                         Price{" "}
//                         <SortIcon
//                           field="price"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("quantity")}
//                     >
//                       <div className="flex items-center">
//                         Qty{" "}
//                         <SortIcon
//                           field="quantity"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Taluk
//                     </th>
//                     <th
//                       className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
//                       onClick={() => handleSort("status")}
//                     >
//                       <div className="flex items-center">
//                         Status{" "}
//                         <SortIcon
//                           field="status"
//                           sortField={sortField}
//                           sortOrder={sortOrder}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((product, idx) => (
//                     <tr
//                       key={product._id}
//                       className="row-hover bg-white transition-colors duration-150"
//                       style={{
//                         borderBottom:
//                           idx < products.length - 1
//                             ? "1px solid #f9fafb"
//                             : "none",
//                       }}
//                     >
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-semibold text-gray-900 text-sm">
//                           {product.productName}
//                         </div>
//                         <div className="text-gray-400 text-xs mt-0.5 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
//                           {product.description}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <Tooltip title="Click to preview" arrow>
//                           <div
//                             className="cursor-pointer"
//                             onClick={() => {
//                               setPreviewImages(product.images);
//                               setPreviewIndex(0);
//                               setImagePreviewOpen(true);
//                             }}
//                           >
//                             <AvatarGroup
//                               max={3}
//                               sx={{
//                                 "& .MuiAvatar-root": {
//                                   width: 36,
//                                   height: 36,
//                                   border: "2px solid #fff",
//                                   fontSize: 11,
//                                   fontWeight: 700,
//                                   background: "#f3f4f6",
//                                   color: "#6b7280",
//                                 },
//                                 justifyContent: "flex-start",
//                               }}
//                             >
//                               {product.images.map((img, i) => (
//                                 <Avatar
//                                   key={i}
//                                   src={img}
//                                   alt={`img-${i}`}
//                                   sx={{ width: 36, height: 36 }}
//                                 />
//                               ))}
//                             </AvatarGroup>
//                           </div>
//                         </Tooltip>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-medium text-gray-700 text-sm">
//                           {product.categoryName}
//                         </div>
//                         <div className="text-gray-400 text-xs">
//                           {product.subCategoryName}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-bold text-gray-900">
//                           ₹{product.price}
//                         </div>
//                         <div className="text-gray-400 text-xs">
//                           per {product.unit}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="font-medium">{product.quantity}</div>
//                         <div className="text-gray-400 text-xs">
//                           {product.unit}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <span className="text-sm text-gray-600">
//                           {product.taluk}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="flex flex-col gap-1">
//                           <StatusBadge status={product.status} />
//                           <StatusBadge status={product.verificationStatus} />
//                         </div>
//                       </td>
//                       <td className="px-4 py-3.5 align-middle">
//                         <div className="flex gap-1">
//                           <Tooltip title="View Details" arrow>
//                             <button
//                               className="action-btn text-indigo-500"
//                               onClick={() => {
//                                 setSelectedProduct(product);
//                                 setViewModalOpen(true);
//                               }}
//                             >
//                               <Eye size={16} />
//                             </button>
//                           </Tooltip>
//                           <Tooltip title="Edit" arrow>
//                             <button
//                               className="action-btn text-emerald-600"
//                               onClick={() => handleEdit(product)}
//                             >
//                               <Edit size={16} />
//                             </button>
//                           </Tooltip>
//                           {adminSession?.role === "admin" &&
//                             product.verificationStatus === "pending" && (
//                               <>
//                                 <Tooltip title="Verify" arrow>
//                                   <button
//                                     className="action-btn text-emerald-600"
//                                     onClick={() =>
//                                       openConfirmModal(
//                                         "verify",
//                                         product._id,
//                                         product.productName,
//                                       )
//                                     }
//                                   >
//                                     <CheckCircle size={16} />
//                                   </button>
//                                 </Tooltip>
//                                 <Tooltip title="Reject" arrow>
//                                   <button
//                                     className="action-btn text-red-600"
//                                     onClick={() =>
//                                       openConfirmModal(
//                                         "reject",
//                                         product._id,
//                                         product.productName,
//                                       )
//                                     }
//                                   >
//                                     <XCircle size={16} />
//                                   </button>
//                                 </Tooltip>
//                               </>
//                             )}
//                           <Tooltip
//                             title={product.isActive ? "Deactivate" : "Activate"}
//                             arrow
//                           >
//                             <button
//                               className="action-btn text-purple-600"
//                               onClick={() =>
//                                 openConfirmModal(
//                                   "toggleActive",
//                                   product._id,
//                                   product.productName,
//                                 )
//                               }
//                             >
//                               <Power size={16} />
//                             </button>
//                           </Tooltip>
//                           <Tooltip title="Delete" arrow>
//                             <button
//                               className="action-btn text-red-600"
//                               onClick={() =>
//                                 openConfirmModal(
//                                   "delete",
//                                   product._id,
//                                   product.productName,
//                                 )
//                               }
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </Tooltip>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile Cards */}
//           <div className="block md:hidden">
//             <div className="flex flex-col gap-3">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
//                 >
//                   <div className="flex justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-bold text-base text-gray-900 m-0 mb-1">
//                         {product.productName}
//                       </h3>
//                       <p className="text-gray-400 text-xs m-0 line-clamp-2">
//                         {product.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <div
//                       className="flex flex-wrap gap-1 cursor-pointer"
//                       onClick={() => {
//                         setPreviewImages(product.images);
//                         setPreviewIndex(0);
//                         setImagePreviewOpen(true);
//                       }}
//                     >
//                       <AvatarGroup
//                         max={4}
//                         sx={{
//                           "& .MuiAvatar-root": {
//                             width: 40,
//                             height: 40,
//                             border: "2px solid #fff",
//                             fontSize: 12,
//                           },
//                           justifyContent: "flex-start",
//                         }}
//                       >
//                         {product.images.map((img, i) => (
//                           <Avatar key={i} src={img} alt={`img-${i}`} />
//                         ))}
//                       </AvatarGroup>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 gap-x-3 text-sm mb-3">
//                     <div>
//                       <span className="text-gray-400 text-xs">Category:</span>{" "}
//                       <span className="font-medium text-gray-700 text-xs">
//                         {product.categoryName}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Sub:</span>{" "}
//                       <span className="font-medium text-gray-700 text-xs">
//                         {product.subCategoryName}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Price:</span>{" "}
//                       <span className="font-bold text-gray-900 text-sm">
//                         ₹{product.price}/{product.unit}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Qty:</span>{" "}
//                       <span className="font-medium text-gray-700 text-sm">
//                         {product.quantity} {product.unit}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Taluk:</span>{" "}
//                       <span className="font-medium text-gray-700 text-xs">
//                         {product.taluk}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 text-xs">Status:</span>{" "}
//                       <StatusBadge status={product.status} />
//                     </div>
//                     {/* ✅ Verification badge in mobile card */}
//                     <div>
//                       <span className="text-gray-400 text-xs">Verified:</span>{" "}
//                       <StatusBadge status={product.verificationStatus} />
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
//                     <button
//                       className="action-btn text-indigo-500"
//                       onClick={() => {
//                         setSelectedProduct(product);
//                         setViewModalOpen(true);
//                       }}
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button
//                       className="action-btn text-emerald-600"
//                       onClick={() => handleEdit(product)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     {adminSession?.role === "admin" &&
//                       product.verificationStatus === "pending" && (
//                         <>
//                           <button
//                             className="action-btn text-emerald-600"
//                             onClick={() =>
//                               openConfirmModal(
//                                 "verify",
//                                 product._id,
//                                 product.productName,
//                               )
//                             }
//                           >
//                             <CheckCircle size={18} />
//                           </button>
//                           <button
//                             className="action-btn text-red-600"
//                             onClick={() =>
//                               openConfirmModal(
//                                 "reject",
//                                 product._id,
//                                 product.productName,
//                               )
//                             }
//                           >
//                             <XCircle size={18} />
//                           </button>
//                         </>
//                       )}
//                     <button
//                       className="action-btn text-purple-600"
//                       onClick={() =>
//                         openConfirmModal(
//                           "toggleActive",
//                           product._id,
//                           product.productName,
//                         )
//                       }
//                     >
//                       <Power size={18} />
//                     </button>
//                     <button
//                       className="action-btn text-red-600"
//                       onClick={() =>
//                         openConfirmModal(
//                           "delete",
//                           product._id,
//                           product.productName,
//                         )
//                       }
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pagination */}
//           {paginationMeta.totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
//               <p className="text-xs text-gray-400 m-0">
//                 {paginationMeta.total} total products · {limit} per page
//               </p>
//               <Pagination
//                 count={paginationMeta.totalPages}
//                 page={page}
//                 onChange={(_, value) => setPage(value)}
//                 color="primary"
//                 size="small"
//                 sx={{
//                   "& .MuiPaginationItem-root": {
//                     borderRadius: 2,
//                     fontWeight: 600,
//                   },
//                 }}
//               />
//             </div>
//           )}
//         </>
//       )}

//       {/* Image Preview Modal */}
//       <Modal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             outline: "none",
//             display: "flex",
//             width: "fit-content",
//           }}
//         >
//           <div className="relative bg-black rounded-2xl overflow-hidden">
//             <button
//               onClick={() => setImagePreviewOpen(false)}
//               className="absolute top-3 right-3 bg-black/60 border-none text-white rounded-lg p-2 cursor-pointer z-10"
//             >
//               <X size={18} />
//             </button>
//             {previewImages[previewIndex] && (
//               <img
//                 src={previewImages[previewIndex]}
//                 alt="preview"
//                 className="block object-cover object-center rounded-lg"
//                 style={{ minWidth: "50vw", minHeight: "50vh" }}
//               />
//             )}
//             {previewImages.length > 1 && (
//               <div className="flex flex-wrap gap-1 py-2 px-3 bg-black/70 justify-start overflow-x-auto">
//                 {previewImages.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img}
//                     alt=""
//                     onClick={() => setPreviewIndex(i)}
//                     className="w-12 h-12 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0"
//                     style={{
//                       border:
//                         i === previewIndex
//                           ? "2px solid #6366f1"
//                           : "2px solid transparent",
//                       opacity: i === previewIndex ? 1 : 0.6,
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </Box>
//       </Modal>

//       {/* Add/Edit Modal */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 m-0">
//                 {isEditMode ? "Edit Product" : "Add New Product"}
//               </h2>
//               <p className="text-gray-400 text-sm m-0 mt-0.5">
//                 {isEditMode
//                   ? "Update product details"
//                   : "Fill in the details below"}
//               </p>
//             </div>
//             <button
//               onClick={() => setModalOpen(false)}
//               className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer text-gray-500"
//             >
//               <X size={18} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6">
//             {/* Images */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                 Product Images
//               </label>
//               <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
//                 <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 mb-3">
//                   {uploadedImages.map((img, idx) => (
//                     <div key={idx} className="relative">
//                       <img
//                         src={img}
//                         alt={`Product ${idx + 1}`}
//                         className="w-full h-[90px] object-cover rounded-xl"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(idx)}
//                         className="absolute top-1 right-1 bg-red-600 border-none text-white rounded-full w-5.5 h-5.5 cursor-pointer flex items-center justify-center p-0"
//                       >
//                         <X size={12} />
//                       </button>
//                     </div>
//                   ))}
//                   <label className="flex flex-col items-center justify-center h-[90px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white transition-colors hover:border-indigo-500">
//                     <Upload size={22} className="text-gray-400" />
//                     <span className="text-xs text-gray-400 mt-1">
//                       {uploading ? "Uploading..." : "Upload"}
//                     </span>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.productName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, productName: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                   placeholder="Enter product name"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y"
//                   placeholder="Describe the product..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.categoryId}
//                   onChange={handleCategoryChange}
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Sub Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.subCategoryId}
//                   onChange={handleSubCategoryChange}
//                   disabled={!formData.categoryId}
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:bg-gray-50"
//                 >
//                   <option value="">Select Sub Category</option>
//                   {filteredSubCategories.map((sub) => (
//                     <option key={sub._id} value={sub._id}>
//                       {sub.subCategoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   step="0.01"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, price: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                   placeholder="0.00"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   step="0.01"
//                   value={formData.quantity}
//                   onChange={(e) =>
//                     setFormData({ ...formData, quantity: e.target.value })
//                   }
//                   className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                   placeholder="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                   Unit *
//                 </label>
//                 <select
//                   required
//                   value={formData.unit}
//                   onChange={(e) =>
//                     setFormData({ ...formData, unit: e.target.value })
//                   }
//                   className="w-full max-w-[200px] py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
//                 >
//                   <option value="kg">Kilogram (kg)</option>
//                   <option value="g">Gram (g)</option>
//                   <option value="ton">Ton</option>
//                   <option value="piece">Piece</option>
//                   <option value="dozen">Dozen</option>
//                   <option value="bunch">Bunch</option>
//                   <option value="packet">Packet</option>
//                   <option value="quintal">Quintal</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
//               <button
//                 type="button"
//                 onClick={() => setModalOpen(false)}
//                 className="py-2.5 px-5 bg-gray-100 text-gray-700 border-none rounded-xl text-sm font-semibold cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className="py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isEditMode ? "Update Product" : "Create Product"}
//               </button>
//             </div>
//           </form>
//         </Box>
//       </Modal>

//       {/* View Modal */}
//       <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
//         <Box sx={modalStyle}>
//           {selectedProduct && (
//             <>
//               <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
//                 <h2 className="text-lg font-bold text-gray-900 m-0">
//                   Product Details
//                 </h2>
//                 <button
//                   onClick={() => setViewModalOpen(false)}
//                   className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer text-gray-500"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 mb-6">
//                   {selectedProduct.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`Product ${idx + 1}`}
//                       className="w-full h-30 object-cover rounded-xl border border-gray-100 cursor-pointer"
//                       onClick={() => {
//                         setPreviewImages(selectedProduct.images);
//                         setPreviewIndex(idx);
//                         setImagePreviewOpen(true);
//                       }}
//                     />
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     {
//                       label: "Product Name",
//                       value: selectedProduct.productName,
//                     },
//                     { label: "Category", value: selectedProduct.categoryName },
//                     {
//                       label: "Sub Category",
//                       value: selectedProduct.subCategoryName,
//                     },
//                     {
//                       label: "Price",
//                       value: `₹${selectedProduct.price}/${selectedProduct.unit}`,
//                     },
//                     {
//                       label: "Quantity",
//                       value: `${selectedProduct.quantity} ${selectedProduct.unit}`,
//                     },
//                     { label: "Taluk", value: selectedProduct.taluk },
//                     { label: "Posted By", value: selectedProduct.postedByName },
//                     {
//                       label: "Views",
//                       value: selectedProduct.viewCount.toString(),
//                     },
//                     {
//                       label: "Created",
//                       value: new Date(
//                         selectedProduct.createdAt,
//                       ).toLocaleString(),
//                     },
//                     {
//                       label: "Updated",
//                       value: new Date(
//                         selectedProduct.updatedAt,
//                       ).toLocaleString(),
//                     },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="bg-gray-50 p-3 rounded-xl">
//                       <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                         {label}
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900 m-0">
//                         {value}
//                       </p>
//                     </div>
//                   ))}
//                   <div className="bg-gray-50 p-3 rounded-xl flex gap-2">
//                     <div className="flex-1">
//                       <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                         Status
//                       </p>
//                       <StatusBadge status={selectedProduct.status} />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                         Verification
//                       </p>
//                       <StatusBadge
//                         status={selectedProduct.verificationStatus}
//                       />
//                     </div>
//                   </div>
//                   <div className="md:col-span-2 bg-gray-50 p-3 rounded-xl">
//                     <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
//                       Description
//                     </p>
//                     <p className="text-sm text-gray-700 m-0 leading-relaxed">
//                       {selectedProduct.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>

//       {/* Confirm Modal */}
//       <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 380,
//             maxWidth: "90vw",
//             bgcolor: "background.paper",
//             borderRadius: 3,
//             boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
//             p: 0,
//             outline: "none",
//           }}
//         >
//           <div className="py-8 px-8 text-center">
//             <div
//               className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
//               style={{
//                 background:
//                   confirmAction?.type === "delete" ||
//                   confirmAction?.type === "reject"
//                     ? "#fef2f2"
//                     : confirmAction?.type === "verify"
//                       ? "#ecfdf5"
//                       : "#fdf4ff",
//               }}
//             >
//               {confirmAction?.type === "delete" ? (
//                 <Trash2 size={24} color="#dc2626" />
//               ) : confirmAction?.type === "verify" ? (
//                 <CheckCircle size={24} color="#059669" />
//               ) : confirmAction?.type === "reject" ? (
//                 <XCircle size={24} color="#dc2626" />
//               ) : (
//                 <Power size={24} color="#9333ea" />
//               )}
//             </div>
//             <h3 className="text-lg font-bold text-gray-900 m-0 mb-2">
//               {confirmAction?.type === "verify"
//                 ? "Verify Product"
//                 : confirmAction?.type === "reject"
//                   ? "Reject Product"
//                   : confirmAction?.type === "toggleActive"
//                     ? "Toggle Status"
//                     : "Delete Product"}
//             </h3>
//             <p className="text-gray-500 text-sm m-0 mb-6 leading-relaxed">
//               {confirmAction?.type === "delete" ? (
//                 <>
//                   Are you sure you want to delete{" "}
//                   <strong>"{confirmAction?.productName}"</strong>? This cannot
//                   be undone.
//                 </>
//               ) : confirmAction?.type === "verify" ? (
//                 <>
//                   Verify <strong>"{confirmAction?.productName}"</strong>?
//                 </>
//               ) : confirmAction?.type === "reject" ? (
//                 <>
//                   Reject <strong>"{confirmAction?.productName}"</strong>?
//                 </>
//               ) : (
//                 <>
//                   Change the status of{" "}
//                   <strong>"{confirmAction?.productName}"</strong>?
//                 </>
//               )}
//             </p>
//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => setConfirmModalOpen(false)}
//                 className="py-2.5 px-6 bg-gray-100 text-gray-700 border-none rounded-xl text-sm font-semibold cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className="py-2.5 px-6 text-white border-none rounded-xl text-sm font-semibold cursor-pointer"
//                 style={{
//                   background:
//                     confirmAction?.type === "delete" ||
//                     confirmAction?.type === "reject"
//                       ? "#dc2626"
//                       : confirmAction?.type === "verify"
//                         ? "#059669"
//                         : "#9333ea",
//                 }}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default B2BProducts;













"use client";

import React, { useState, useEffect, } from "react";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Filter,
} from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
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

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

type SortField = "productName" | "price" | "quantity" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

const LIMIT_OPTIONS = [10, 25, 50, 100];

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 900,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
  overflow: "auto",
  p: 0,
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    verified: { bg: "#ecfdf5", color: "#059669", label: "Verified" },
    rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
    pending: { bg: "#fffbeb", color: "#d97706", label: "Pending" },
    active: { bg: "#eff6ff", color: "#2563eb", label: "Active" },
    inactive: { bg: "#f9fafb", color: "#6b7280", label: "Inactive" },
    sold: { bg: "#fdf4ff", color: "#9333ea", label: "Sold" },
  };
  const style = map[status] || map["pending"];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
};

const SortIcon = ({
  field,
  sortField,
  sortOrder,
}: {
  field: string;
  sortField: string;
  sortOrder: string;
}) => {
  if (sortField !== field)
    return <ArrowUpDown size={14} className="opacity-35 ml-1" />;
  return sortOrder === "asc" ? (
    <ArrowUp size={14} className="ml-1 text-indigo-500" />
  ) : (
    <ArrowDown size={14} className="ml-1 text-indigo-500" />
  );
};

const B2BProducts: React.FC<B2BProductsProps> = ({ adminSession }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
 const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVerification, setFilterVerification] = useState("all"); // ✅ NEW
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [confirmAction, setConfirmAction] = useState<{
    type: "verify" | "reject" | "toggleActive" | "delete";
    productId: string;
    productName?: string;
  } | null>(null);

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
  const [productLoading, setProductLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ✅ Added filterVerification to dependency array
  useEffect(() => {
    if (adminSession) {
      fetchProducts();
    }
  }, [
    adminSession,
    page,
    limit,
    searchTerm,
    filterStatus,
    filterVerification,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    if (adminSession) {
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

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));

      if (adminSession?.role === "subadmin") {
        params.set("role", "subadmin");
        params.set("adminTaluk", adminSession.taluka || "");
      }

      if (searchTerm) params.set("search", searchTerm);
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterVerification !== "all") params.set("verificationStatus", filterVerification); // ✅ NEW

      params.set("sortField", sortField);
      params.set("sortOrder", sortOrder);

      const response = await fetch(`/api/b2b-products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPaginationMeta(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
      setProductLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (data.success) setCategories(data.category);
    } catch {}
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategory");
      const data = await response.json();
      if (data.success) setSubCategories(data.subCat);
    } catch {}
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formDataObj = new FormData();
    for (let i = 0; i < files.length; i++)
      formDataObj.append("images", files[i]);
    setUploading(true);
    try {
      const response = await fetch("/api/b2b-products/upload", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        setUploadedImages([...uploadedImages, ...data.images]);
      } else toast.error(data.message);
    } catch {
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
        toast.success(isEditMode ? "Product updated" : "Product created");
        resetForm();
        fetchProducts();
        setModalOpen(false);
      } else toast.error(data.message);
    } catch {
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
        body: JSON.stringify({ verificationStatus: status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Product ${status}`);
        fetchProducts();
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to update status");
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
          `Product ${!currentStatus ? "activated" : "deactivated"}`,
        );
        fetchProducts();
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/b2b-products/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Product deleted");
        if (products.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchProducts();
        }
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to delete");
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

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (productLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-4">
        <div className="w-11 h-11 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading products...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 font-['DM_Sans',sans-serif] bg-gray-50">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .row-hover:hover { background: #fafbff !important; }
        .action-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.15s, color 0.15s; display: flex; align-items: center; justify-content: center; }
        .action-btn:hover { background: #f3f4f6; }
        .sort-th:hover { background: #f9fafb; color: #111; }
        input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .filters-wrap { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .filters-wrap > * { flex-shrink: 0; }
        .filter-select { padding: 9px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 13px; outline: none; transition: border-color 0.15s; background: white; min-width: 0; }
        .filter-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        @media (max-width: 640px) {
          .filters-wrap { gap: 8px; }
          .filter-select { font-size: 12px; padding: 8px 10px; }
          .rows-label { display: none; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-2 -mt-2 animate-[fadeIn_0.4s_ease]">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
          <div />
          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all duration-150 hover:-translate-y-px hover:shadow-lg"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="filters-wrap">
            {/* Search */}
            <div className="relative w-full sm:flex-1 sm:min-w-[180px] sm:max-w-[280px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full py-2 pl-9 pr-3 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
              />
            </div>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="sold">Sold</option>
            </select>

            {/* Verification filter */}
            <select
              value={filterVerification}
              onChange={(e) => {
                setFilterVerification(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Verification</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortField(field as SortField);
                setSortOrder(order as SortOrder);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="productName-asc">Name A–Z</option>
              <option value="productName-desc">Name Z–A</option>
              <option value="price-asc">Price Low–High</option>
              <option value="price-desc">Price High–Low</option>
              <option value="quantity-desc">Qty High–Low</option>
            </select>

            {/* Rows per page */}
            <div className="flex items-center gap-1.5">
              <span className="rows-label text-xs text-gray-400 font-medium whitespace-nowrap">
                Rows:
              </span>
              <div className="flex gap-1">
                {LIMIT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleLimitChange(opt)}
                    className="px-2 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all duration-150 cursor-pointer"
                    style={{
                      background:
                        limit === opt
                          ? "linear-gradient(135deg,#6366f1,#a855f7)"
                          : "#f9fafb",
                      color: limit === opt ? "#fff" : "#6b7280",
                      borderColor: limit === opt ? "#6366f1" : "#e5e7eb",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(searchInput || filterStatus !== "all" || filterVerification !== "all") && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterVerification("all");
                  setPage(1);
                }}
                className="py-2 px-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500 m-0">
          Showing{" "}
          <strong className="text-gray-900">
            {paginationMeta.total === 0
              ? 0
              : (paginationMeta.page - 1) * paginationMeta.limit + 1}
            –
            {Math.min(
              paginationMeta.page * paginationMeta.limit,
              paginationMeta.total,
            )}
          </strong>{" "}
          of <strong className="text-gray-900">{paginationMeta.total}</strong>{" "}
          products
          {paginationMeta.totalPages > 1 && (
            <span className="text-gray-400">
              {" "}
              · Page {paginationMeta.page} of {paginationMeta.totalPages}
            </span>
          )}
        </p>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-500">
            <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
            Refreshing...
          </div>
        )}
      </div>

      {/* Content */}
      {products.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl py-16 px-6 text-center border border-dashed border-gray-200">
          <Package size={40} className="text-gray-300 mb-3 mx-auto" />
          <p className="text-gray-400 text-base m-0">No products found</p>
          <p className="text-gray-300 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-full overflow-x-auto">
              <table style={{ minWidth: 780 }} className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th
                      className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                      style={{ width: "22%" }}
                      onClick={() => handleSort("productName")}
                    >
                      <div className="flex items-center">
                        Product{" "}
                        <SortIcon
                          field="productName"
                          sortField={sortField}
                          sortOrder={sortOrder}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap" style={{ width: "10%" }}>
                      Images
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap" style={{ width: "16%" }}>
                      Category
                    </th>
                    <th
                      className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                      style={{ width: "10%" }}
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price{" "}
                        <SortIcon
                          field="price"
                          sortField={sortField}
                          sortOrder={sortOrder}
                        />
                      </div>
                    </th>
                    <th
                      className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                      style={{ width: "9%" }}
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center">
                        Qty{" "}
                        <SortIcon
                          field="quantity"
                          sortField={sortField}
                          sortOrder={sortOrder}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap" style={{ width: "10%" }}>
                      Taluk
                    </th>
                    <th
                      className="sort-th px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                      style={{ width: "12%" }}
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status{" "}
                        <SortIcon
                          field="status"
                          sortField={sortField}
                          sortOrder={sortOrder}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap" style={{ width: "11%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr
                      key={product._id}
                      className="row-hover bg-white transition-colors duration-150"
                      style={{
                        borderBottom:
                          idx < products.length - 1
                            ? "1px solid #f9fafb"
                            : "none",
                      }}
                    >
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">
                          {product.productName}
                        </div>
                        <div className="text-gray-400 text-xs mt-0.5 max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <Tooltip title="Click to preview" arrow>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setPreviewImages(product.images);
                              setPreviewIndex(0);
                              setImagePreviewOpen(true);
                            }}
                          >
                            <AvatarGroup
                              max={3}
                              sx={{
                                "& .MuiAvatar-root": {
                                  width: 32,
                                  height: 32,
                                  border: "2px solid #fff",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: "#f3f4f6",
                                  color: "#6b7280",
                                },
                                justifyContent: "flex-start",
                              }}
                            >
                              {product.images.map((img, i) => (
                                <Avatar
                                  key={i}
                                  src={img}
                                  alt={`img-${i}`}
                                  sx={{ width: 32, height: 32 }}
                                />
                              ))}
                            </AvatarGroup>
                          </div>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-medium text-gray-700 text-sm truncate max-w-[120px]">
                          {product.categoryName}
                        </div>
                        <div className="text-gray-400 text-xs truncate max-w-[120px]">
                          {product.subCategoryName}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm">
                          ₹{product.price}
                        </div>
                        <div className="text-gray-400 text-xs">
                          per {product.unit}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                        <div className="font-medium text-sm">{product.quantity}</div>
                        <div className="text-gray-400 text-xs">
                          {product.unit}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <span className="text-sm text-gray-600 truncate block max-w-[80px]">
                          {product.taluk}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={product.status} />
                          <StatusBadge status={product.verificationStatus} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex gap-0.5 flex-wrap">
                          <Tooltip title="View Details" arrow>
                            <button
                              className="action-btn text-indigo-500"
                              onClick={() => {
                                setSelectedProduct(product);
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye size={15} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Edit" arrow>
                            <button
                              className="action-btn text-emerald-600"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit size={15} />
                            </button>
                          </Tooltip>
                          {adminSession?.role === "admin" &&
                            product.verificationStatus === "pending" && (
                              <>
                                <Tooltip title="Verify" arrow>
                                  <button
                                    className="action-btn text-emerald-600"
                                    onClick={() =>
                                      openConfirmModal(
                                        "verify",
                                        product._id,
                                        product.productName,
                                      )
                                    }
                                  >
                                    <CheckCircle size={15} />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Reject" arrow>
                                  <button
                                    className="action-btn text-red-600"
                                    onClick={() =>
                                      openConfirmModal(
                                        "reject",
                                        product._id,
                                        product.productName,
                                      )
                                    }
                                  >
                                    <XCircle size={15} />
                                  </button>
                                </Tooltip>
                              </>
                            )}
                          <Tooltip
                            title={product.isActive ? "Deactivate" : "Activate"}
                            arrow
                          >
                            <button
                              className="action-btn text-purple-600"
                              onClick={() =>
                                openConfirmModal(
                                  "toggleActive",
                                  product._id,
                                  product.productName,
                                )
                              }
                            >
                              <Power size={15} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <button
                              className="action-btn text-red-600"
                              onClick={() =>
                                openConfirmModal(
                                  "delete",
                                  product._id,
                                  product.productName,
                                )
                              }
                            >
                              <Trash2 size={15} />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 m-0 mb-1 truncate">
                        {product.productName}
                      </h3>
                      <p className="text-gray-400 text-xs m-0 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <StatusBadge status={product.status} />
                      <StatusBadge status={product.verificationStatus} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div
                      className="flex flex-wrap gap-1 cursor-pointer"
                      onClick={() => {
                        setPreviewImages(product.images);
                        setPreviewIndex(0);
                        setImagePreviewOpen(true);
                      }}
                    >
                      <AvatarGroup
                        max={4}
                        sx={{
                          "& .MuiAvatar-root": {
                            width: 38,
                            height: 38,
                            border: "2px solid #fff",
                            fontSize: 11,
                          },
                          justifyContent: "flex-start",
                        }}
                      >
                        {product.images.map((img, i) => (
                          <Avatar key={i} src={img} alt={`img-${i}`} />
                        ))}
                      </AvatarGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm mb-3">
                    <div className="min-w-0">
                      <span className="text-gray-400 text-xs">Category: </span>
                      <span className="font-medium text-gray-700 text-xs truncate">
                        {product.categoryName}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-400 text-xs">Sub: </span>
                      <span className="font-medium text-gray-700 text-xs truncate">
                        {product.subCategoryName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Price: </span>
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{product.price}/{product.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Qty: </span>
                      <span className="font-medium text-gray-700 text-sm">
                        {product.quantity} {product.unit}
                      </span>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <span className="text-gray-400 text-xs">Taluk: </span>
                      <span className="font-medium text-gray-700 text-xs">
                        {product.taluk}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-3 border-t border-gray-50 flex-wrap">
                    <button
                      className="action-btn text-indigo-500"
                      onClick={() => {
                        setSelectedProduct(product);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      className="action-btn text-emerald-600"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit size={17} />
                    </button>
                    {adminSession?.role === "admin" &&
                      product.verificationStatus === "pending" && (
                        <>
                          <button
                            className="action-btn text-emerald-600"
                            onClick={() =>
                              openConfirmModal(
                                "verify",
                                product._id,
                                product.productName,
                              )
                            }
                          >
                            <CheckCircle size={17} />
                          </button>
                          <button
                            className="action-btn text-red-600"
                            onClick={() =>
                              openConfirmModal(
                                "reject",
                                product._id,
                                product.productName,
                              )
                            }
                          >
                            <XCircle size={17} />
                          </button>
                        </>
                      )}
                    <button
                      className="action-btn text-purple-600"
                      onClick={() =>
                        openConfirmModal(
                          "toggleActive",
                          product._id,
                          product.productName,
                        )
                      }
                    >
                      <Power size={17} />
                    </button>
                    <button
                      className="action-btn text-red-600"
                      onClick={() =>
                        openConfirmModal(
                          "delete",
                          product._id,
                          product.productName,
                        )
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {paginationMeta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
              <p className="text-xs text-gray-400 m-0">
                {paginationMeta.total} total products · {limit} per page
              </p>
              <Pagination
                count={paginationMeta.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: 600,
                  },
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Image Preview Modal */}
      <Modal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            display: "flex",
            width: "fit-content",
            maxWidth: "95vw",
          }}
        >
          <div className="relative bg-black rounded-2xl overflow-hidden w-full">
            <button
              onClick={() => setImagePreviewOpen(false)}
              className="absolute top-3 right-3 bg-black/60 border-none text-white rounded-lg p-2 cursor-pointer z-10"
            >
              <X size={18} />
            </button>
            {previewImages[previewIndex] && (
              <img
                src={previewImages[previewIndex]}
                alt="preview"
                className="block object-cover object-center rounded-lg"
                style={{ minWidth: "min(50vw, 300px)", minHeight: "min(50vh, 300px)", maxWidth: "90vw", maxHeight: "80vh" }}
              />
            )}
            {previewImages.length > 1 && (
              <div className="flex flex-wrap gap-1 py-2 px-3 bg-black/70 justify-start overflow-x-auto">
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setPreviewIndex(i)}
                    className="w-10 h-10 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0"
                    style={{
                      border:
                        i === previewIndex
                          ? "2px solid #6366f1"
                          : "2px solid transparent",
                      opacity: i === previewIndex ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900 m-0">
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-gray-400 text-sm m-0 mt-0.5">
                {isEditMode
                  ? "Update product details"
                  : "Fill in the details below"}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3 mb-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-[80px] object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 border-none text-white rounded-full w-5 h-5 cursor-pointer flex items-center justify-center p-0"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center h-[80px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white transition-colors hover:border-indigo-500">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">
                      {uploading ? "Uploading..." : "Upload"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  placeholder="Enter product name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y"
                  placeholder="Describe the product..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Sub Category *
                </label>
                <select
                  required
                  value={formData.subCategoryId}
                  onChange={handleSubCategoryChange}
                  disabled={!formData.categoryId}
                  className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:bg-gray-50"
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full max-w-[200px] py-2.5 px-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
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

            <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="py-2.5 px-5 bg-gray-100 text-gray-700 border-none rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isEditMode ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* View Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box sx={modalStyle}>
          {selectedProduct && (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 m-0">
                  Product Details
                </h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 mb-6">
                  {selectedProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-28 object-cover rounded-xl border border-gray-100 cursor-pointer"
                      onClick={() => {
                        setPreviewImages(selectedProduct.images);
                        setPreviewIndex(idx);
                        setImagePreviewOpen(true);
                      }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Product Name",
                      value: selectedProduct.productName,
                    },
                    { label: "Category", value: selectedProduct.categoryName },
                    {
                      label: "Sub Category",
                      value: selectedProduct.subCategoryName,
                    },
                    {
                      label: "Price",
                      value: `₹${selectedProduct.price}/${selectedProduct.unit}`,
                    },
                    {
                      label: "Quantity",
                      value: `${selectedProduct.quantity} ${selectedProduct.unit}`,
                    },
                    { label: "Taluk", value: selectedProduct.taluk },
                    { label: "Posted By", value: selectedProduct.postedByName },
                    {
                      label: "Views",
                      value: selectedProduct.viewCount.toString(),
                    },
                    {
                      label: "Created",
                      value: new Date(
                        selectedProduct.createdAt,
                      ).toLocaleString(),
                    },
                    {
                      label: "Updated",
                      value: new Date(
                        selectedProduct.updatedAt,
                      ).toLocaleString(),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 m-0 break-words">
                        {value}
                      </p>
                    </div>
                  ))}
                  <div className="bg-gray-50 p-3 rounded-xl flex gap-2">
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
                        Status
                      </p>
                      <StatusBadge status={selectedProduct.status} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
                        Verification
                      </p>
                      <StatusBadge
                        status={selectedProduct.verificationStatus}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-gray-50 p-3 rounded-xl">
                    <p className="text-[11px] font-semibold text-gray-400 m-0 mb-1 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 m-0 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Confirm Modal */}
      <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            maxWidth: "90vw",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            p: 0,
            outline: "none",
          }}
        >
          <div className="py-8 px-8 text-center">
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background:
                  confirmAction?.type === "delete" ||
                  confirmAction?.type === "reject"
                    ? "#fef2f2"
                    : confirmAction?.type === "verify"
                      ? "#ecfdf5"
                      : "#fdf4ff",
              }}
            >
              {confirmAction?.type === "delete" ? (
                <Trash2 size={24} color="#dc2626" />
              ) : confirmAction?.type === "verify" ? (
                <CheckCircle size={24} color="#059669" />
              ) : confirmAction?.type === "reject" ? (
                <XCircle size={24} color="#dc2626" />
              ) : (
                <Power size={24} color="#9333ea" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 m-0 mb-2">
              {confirmAction?.type === "verify"
                ? "Verify Product"
                : confirmAction?.type === "reject"
                  ? "Reject Product"
                  : confirmAction?.type === "toggleActive"
                    ? "Toggle Status"
                    : "Delete Product"}
            </h3>
            <p className="text-gray-500 text-sm m-0 mb-6 leading-relaxed">
              {confirmAction?.type === "delete" ? (
                <>
                  Are you sure you want to delete{" "}
                  <strong>"{confirmAction?.productName}"</strong>? This cannot
                  be undone.
                </>
              ) : confirmAction?.type === "verify" ? (
                <>
                  Verify <strong>"{confirmAction?.productName}"</strong>?
                </>
              ) : confirmAction?.type === "reject" ? (
                <>
                  Reject <strong>"{confirmAction?.productName}"</strong>?
                </>
              ) : (
                <>
                  Change the status of{" "}
                  <strong>"{confirmAction?.productName}"</strong>?
                </>
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="py-2.5 px-6 bg-gray-100 text-gray-700 border-none rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="py-2.5 px-6 text-white border-none rounded-xl text-sm font-semibold cursor-pointer"
                style={{
                  background:
                    confirmAction?.type === "delete" ||
                    confirmAction?.type === "reject"
                      ? "#dc2626"
                      : confirmAction?.type === "verify"
                        ? "#059669"
                        : "#9333ea",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default B2BProducts;