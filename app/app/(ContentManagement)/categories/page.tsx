

// "use client";

// import { useEffect, useState } from "react";

// /* ================== Interfaces ================== */
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
//   categoryName?: string;
//   image?: string;
// }

// // API Response Interfaces
// interface ApiResponse<T> {
//   data?: T[];
//   total?: number;
//   message?: string;
//   success?: boolean;
// }

// /* ================== Main Component ================== */
// export default function CategoryManagementPage() {
//   // State for tabs
//   const [activeTab, setActiveTab] = useState<"category" | "subcategory">("category");

//   // Category States
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
//   const [editCategoryName, setEditCategoryName] = useState("");
//   const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null);
//   const [categoryImage, setCategoryImage] = useState<File | null>(null);
//   const [isCategoryLoading, setIsCategoryLoading] = useState(true);
//   const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
//   const [isCategoryImageUploading, setIsCategoryImageUploading] = useState(false);

//   // SubCategory States
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [subCategoryName, setSubCategoryName] = useState("");
//   const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
//   const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
//   const [editSubCategoryName, setEditSubCategoryName] = useState("");
//   const [editSubCategoryImage, setEditSubCategoryImage] = useState<File | null>(null);
//   const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(true);
//   const [isSubCategorySubmitting, setIsSubCategorySubmitting] = useState(false);
//   const [isSubCategoryImageUploading, setIsSubCategoryImageUploading] = useState(false);

//   // Pagination States
//   const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
//   const [categoryItemsPerPage, setCategoryItemsPerPage] = useState(10);
//   const [totalCategories, setTotalCategories] = useState(0);
  
//   const [currentSubCategoryPage, setCurrentSubCategoryPage] = useState(1);
//   const [subCategoryItemsPerPage, setSubCategoryItemsPerPage] = useState(10);
//   const [totalSubCategories, setTotalSubCategories] = useState(0);

//   /* ================== Helper Functions ================== */
//   const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
//     const fileType = file.type.toLowerCase();
    
//     if (!fileType.startsWith('image/')) {
//       return {
//         isValid: false,
//         error: `File type not supported. Please upload an image file.`
//       };
//     }
    
//     // Check file size (5MB max)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       return {
//         isValid: false,
//         error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`
//       };
//     }
    
//     return { isValid: true };
//   };

//   const clearFileInput = (inputId: string) => {
//     const fileInput = document.getElementById(inputId) as HTMLInputElement;
//     if (fileInput) fileInput.value = "";
//   };

//   // Pagination helper functions
//   const calculateTotalPages = (totalItems: number, itemsPerPage: number) => {
//     return Math.ceil(totalItems / itemsPerPage);
//   };

//   const getPageNumbers = (currentPage: number, totalPages: number) => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push('...');
//         pageNumbers.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pageNumbers.push(1);
//         pageNumbers.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           pageNumbers.push(i);
//         }
//       } else {
//         pageNumbers.push(1);
//         pageNumbers.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push('...');
//         pageNumbers.push(totalPages);
//       }
//     }
    
//     return pageNumbers;
//   };

//   const goToPage = (page: number, type: 'category' | 'subcategory') => {
//     const totalPages = type === 'category' 
//       ? calculateTotalPages(totalCategories, categoryItemsPerPage)
//       : calculateTotalPages(totalSubCategories, subCategoryItemsPerPage);
    
//     if (page >= 1 && page <= totalPages) {
//       if (type === 'category') {
//         setCurrentCategoryPage(page);
//       } else {
//         setCurrentSubCategoryPage(page);
//       }
//     }
//   };

//   /* ================== Fetch Data Functions ================== */
//   const fetchCategories = async (page: number = 1, limit: number = categoryItemsPerPage) => {
//     try {
//       setIsCategoryLoading(true);
//       const res = await fetch(`https://kisan.etpl.ai/category/all?page=${page}&limit=${limit}`);
      
//       if (!res.ok) {
//         throw new Error(`Failed to fetch categories: ${res.status}`);
//       }
      
//       const data: ApiResponse<Category> = await res.json();
      
//       // Handle different API response structures
//       if (Array.isArray(data)) {
//         // If API returns direct array
//         setCategories(data);
//         setTotalCategories(data.length);
//       } else if (data.data && Array.isArray(data.data)) {
//         // If API returns { data: [], total: number }
//         setCategories(data.data);
//         setTotalCategories(data.total || data.data.length);
//       } else {
//         // Fallback
//         setCategories([]);
//         setTotalCategories(0);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategories([]);
//       setTotalCategories(0);
//     } finally {
//       setIsCategoryLoading(false);
//     }
//   };

//   const fetchSubCategories = async (page: number = 1, limit: number = subCategoryItemsPerPage) => {
//     try {
//       setIsSubCategoryLoading(true);
//       const res = await fetch(`https://kisan.etpl.ai/subcategory/all?page=${page}&limit=${limit}`);
      
//       if (!res.ok) {
//         throw new Error(`Failed to fetch subcategories: ${res.status}`);
//       }
      
//       const data: ApiResponse<SubCategory> = await res.json();
      
//       // Handle different API response structures
//       if (Array.isArray(data)) {
//         setSubCategories(data);
//         setTotalSubCategories(data.length);
//       } else if (data.data && Array.isArray(data.data)) {
//         setSubCategories(data.data);
//         setTotalSubCategories(data.total || data.data.length);
//       } else {
//         setSubCategories([]);
//         setTotalSubCategories(0);
//       }
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       setSubCategories([]);
//       setTotalSubCategories(0);
//     } finally {
//       setIsSubCategoryLoading(false);
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       if (activeTab === 'category') {
//         await fetchCategories(currentCategoryPage, categoryItemsPerPage);
//       } else {
//         await fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       }
//     };
//     loadData();
//   }, [
//     activeTab, 
//     currentCategoryPage, 
//     categoryItemsPerPage, 
//     currentSubCategoryPage, 
//     subCategoryItemsPerPage
//   ]);

//   // Handle items per page change
//   const handleCategoryItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = parseInt(e.target.value);
//     setCategoryItemsPerPage(value);
//     setCurrentCategoryPage(1);
//   };

//   const handleSubCategoryItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = parseInt(e.target.value);
//     setSubCategoryItemsPerPage(value);
//     setCurrentSubCategoryPage(1);
//   };

//   /* ================== Category Functions ================== */
//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!categoryName.trim()) {
//       alert("Please enter a category name");
//       return;
//     }

//     try {
//       setIsCategorySubmitting(true);
//       const formData = new FormData();
//       formData.append("categoryName", categoryName.trim());
      
//       if (categoryImage) {
//         const validation = validateImageFile(categoryImage);
//         if (!validation.isValid) {
//           alert(validation.error);
//           setIsCategorySubmitting(false);
//           clearFileInput("category-image-upload");
//           setCategoryImage(null);
//           return;
//         }
//         formData.append("image", categoryImage);
//       }

//       const response = await fetch("https://kisan.etpl.ai/category/add", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to add category: ${response.status} - ${errorText}`);
//       }

//       setCategoryName("");
//       setCategoryImage(null);
//       clearFileInput("category-image-upload");

//       fetchCategories(currentCategoryPage, categoryItemsPerPage);
//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Category added successfully!");
//     } catch (error) {
//       console.error("Error adding category:", error);
//       alert(`Failed to add category: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setIsCategorySubmitting(false);
//     }
//   };

//   const startCategoryEdit = (cat: Category) => {
//     setEditingCategoryId(cat._id);
//     setEditCategoryName(cat.categoryName);
//     setEditCategoryImage(null);
//   };

//   const saveCategoryEdit = async (id: string) => {
//     if (!editCategoryName.trim()) {
//       alert("Category name cannot be empty");
//       return;
//     }

//     try {
//       const response = await fetch(`https://kisan.etpl.ai/category/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ categoryName: editCategoryName.trim() }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update category");
//       }

//       setEditingCategoryId(null);
//       fetchCategories(currentCategoryPage, categoryItemsPerPage);
//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Category name updated successfully!");
//     } catch (error) {
//       console.error("Error updating category:", error);
//       alert(error instanceof Error ? error.message : "Failed to update category");
//     }
//   };

//   const updateCategoryImage = async (id: string) => {
//     if (!editCategoryImage) {
//       alert("Please select an image to upload");
//       return;
//     }

//     try {
//       setIsCategoryImageUploading(true);
//       const validation = validateImageFile(editCategoryImage);
//       if (!validation.isValid) {
//         alert(validation.error);
//         setIsCategoryImageUploading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("image", editCategoryImage);
//       formData.append("categoryName", editCategoryName);

//       const response = await fetch(`https://kisan.etpl.ai/category/update/${id}`, {
//         method: "PUT",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update category image");
//       }

//       setEditCategoryImage(null);
//       clearFileInput(`category-image-edit-${id}`);
//       fetchCategories(currentCategoryPage, categoryItemsPerPage);
//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Category image updated successfully!");
//     } catch (error) {
//       console.error("Error updating category image:", error);
//       alert(error instanceof Error ? error.message : "Failed to update category image");
//     } finally {
//       setIsCategoryImageUploading(false);
//     }
//   };

//   const cancelCategoryEdit = () => {
//     setEditingCategoryId(null);
//     setEditCategoryName("");
//     setEditCategoryImage(null);
//   };

//   const deleteCategory = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this category? This may affect sub-categories.")) {
//       return;
//     }

//     try {
//       const response = await fetch(`https://kisan.etpl.ai/category/delete/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete category");
//       }

//       fetchCategories(currentCategoryPage, categoryItemsPerPage);
//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Category deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       alert("Failed to delete category");
//     }
//   };

//   const handleCategoryImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//     const target = e.target as HTMLImageElement;
//     target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
//   };

//   /* ================== SubCategory Functions ================== */
//   const addSubCategory = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedCategoryId || !subCategoryName.trim()) {
//       alert("Please select a category and enter sub-category name");
//       return;
//     }

//     try {
//       setIsSubCategorySubmitting(true);
//       const formData = new FormData();
//       formData.append("subCategoryName", subCategoryName.trim());
//       formData.append("categoryId", selectedCategoryId);
      
//       if (subCategoryImage) {
//         const validation = validateImageFile(subCategoryImage);
//         if (!validation.isValid) {
//           alert(validation.error);
//           setIsSubCategorySubmitting(false);
//           clearFileInput("subcat-image");
//           setSubCategoryImage(null);
//           return;
//         }
//         formData.append("image", subCategoryImage);
//       }

//       const response = await fetch("https://kisan.etpl.ai/subcategory/add", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Failed to add sub-category: ${response.status}`);
//       }

//       setSubCategoryName("");
//       setSelectedCategoryId("");
//       setSubCategoryImage(null);
//       clearFileInput("subcat-image");

//       await fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Sub-category added successfully!");
//     } catch (error) {
//       console.error("Error adding sub-category:", error);
//       alert(error instanceof Error ? error.message : "Failed to add sub-category");
//     } finally {
//       setIsSubCategorySubmitting(false);
//     }
//   };

//   const startSubCategoryEdit = (subCat: SubCategory) => {
//     setEditingSubCategoryId(subCat._id);
//     setEditSubCategoryName(subCat.subCategoryName);
//     setEditSubCategoryImage(null);
//   };

//   const saveSubCategoryEdit = async (id: string) => {
//     if (!editSubCategoryName.trim()) {
//       alert("Sub-category name cannot be empty");
//       return;
//     }

//     try {
//       const response = await fetch(`https://kisan.etpl.ai/subcategory/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ subCategoryName: editSubCategoryName.trim() }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update sub-category");
//       }

//       setEditingSubCategoryId(null);
//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Sub-category name updated successfully!");
//     } catch (error) {
//       console.error("Error updating sub-category:", error);
//       alert(error instanceof Error ? error.message : "Failed to update sub-category");
//     }
//   };

//   const updateSubCategoryImage = async (id: string) => {
//     if (!editSubCategoryImage) {
//       alert("Please select an image to upload");
//       return;
//     }

//     try {
//       setIsSubCategoryImageUploading(true);
//       const validation = validateImageFile(editSubCategoryImage);
//       if (!validation.isValid) {
//         alert(validation.error);
//         setIsSubCategoryImageUploading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("image", editSubCategoryImage);
//       formData.append("subCategoryName", editSubCategoryName);

//       const response = await fetch(`https://kisan.etpl.ai/subcategory/update/${id}`, {
//         method: "PUT",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update sub-category image");
//       }

//       setEditSubCategoryImage(null);
//       clearFileInput(`subcategory-image-edit-${id}`);
//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Sub-category image updated successfully!");
//     } catch (error) {
//       console.error("Error updating sub-category image:", error);
//       alert(error instanceof Error ? error.message : "Failed to update sub-category image");
//     } finally {
//       setIsSubCategoryImageUploading(false);
//     }
//   };

//   const cancelSubCategoryEdit = () => {
//     setEditingSubCategoryId(null);
//     setEditSubCategoryName("");
//     setEditSubCategoryImage(null);
//   };

//   const deleteSubCategory = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this sub-category?")) {
//       return;
//     }

//     try {
//       const response = await fetch(`https://kisan.etpl.ai/subcategory/delete/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete sub-category");
//       }

//       fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
//       alert("Sub-category deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting sub-category:", error);
//       alert("Failed to delete sub-category");
//     }
//   };

//   const getCategoryName = (catId: string) => {
//     const category = categories.find(c => c._id === catId);
//     return category ? category.categoryName : "Unknown Category";
//   };

//   // Calculate pagination values
//   const categoryTotalPages = calculateTotalPages(totalCategories, categoryItemsPerPage);
//   const subCategoryTotalPages = calculateTotalPages(totalSubCategories, subCategoryItemsPerPage);

//   // Get image URL safely
//   const getImageUrl = (imagePath: string | undefined) => {
//     if (!imagePath) return '';
//     return imagePath.startsWith('http') ? imagePath : `https://kisan.etpl.ai/uploads/${imagePath}`;
//   };

//   /* ================== UI ================== */
//   return (
//     <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 15px" }}>
//       <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#1f2937" }}>
//         Category & Sub-Category Management
//       </h1>

//       {/* Tabs Navigation */}
//       <div style={{
//         display: "flex",
//         borderBottom: "1px solid #e5e7eb",
//         marginBottom: "20px",
//         flexWrap: "wrap"
//       }}>
//         <button
//           onClick={() => setActiveTab("category")}
//           style={{
//             padding: "10px 20px",
//             fontSize: "14px",
//             fontWeight: "600",
//             color: activeTab === "category" ? "#2563eb" : "#6b7280",
//             backgroundColor: "transparent",
//             border: "none",
//             borderBottom: activeTab === "category" ? "2px solid #2563eb" : "none",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             flex: "1",
//             minWidth: "120px"
//           }}
//           onMouseEnter={(e) => {
//             if (activeTab !== "category") e.currentTarget.style.color = "#374151";
//           }}
//           onMouseLeave={(e) => {
//             if (activeTab !== "category") e.currentTarget.style.color = "#6b7280";
//           }}
//         >
//           Categories
//           {isCategoryLoading && activeTab === "category" && (
//             <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6b7280" }}>(Loading...)</span>
//           )}
//         </button>
//         <button
//           onClick={() => setActiveTab("subcategory")}
//           style={{
//             padding: "10px 20px",
//             fontSize: "14px",
//             fontWeight: "600",
//             color: activeTab === "subcategory" ? "#059669" : "#6b7280",
//             backgroundColor: "transparent",
//             border: "none",
//             borderBottom: activeTab === "subcategory" ? "2px solid #059669" : "none",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             flex: "1",
//             minWidth: "120px"
//           }}
//           onMouseEnter={(e) => {
//             if (activeTab !== "subcategory") e.currentTarget.style.color = "#374151";
//           }}
//           onMouseLeave={(e) => {
//             if (activeTab !== "subcategory") e.currentTarget.style.color = "#6b7280";
//           }}
//         >
//           Sub-Categories
//           {isSubCategoryLoading && activeTab === "subcategory" && (
//             <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6b7280" }}>(Loading...)</span>
//           )}
//         </button>
//       </div>

//       {/* Category Tab Content */}
//       {activeTab === "category" && (
//         <>
//           {/* Add Category Card */}
//           <div style={{
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//             padding: "20px",
//             marginBottom: "24px"
//           }}>
//             <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#374151" }}>
//               Add New Category
//             </h2>

//             <form onSubmit={handleCategorySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
//                   Category Name *
//                 </label>
//                 <input
//                   id="categoryName"
//                   type="text"
//                   placeholder="Enter category name"
//                   value={categoryName}
//                   onChange={(e) => setCategoryName(e.target.value)}
//                   required
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "1px solid #d1d5db",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     outline: "none",
//                     transition: "all 0.2s"
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                   onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                 />
//               </div>

//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
//                   Category Image (Optional)
//                 </label>
//                 <input
//                   id="category-image-upload"
//                   type="file"
//                   accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
//                   onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "1px solid #d1d5db",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     outline: "none"
//                   }}
//                 />
//                 <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
//                   Accepted: JPG, PNG, GIF, WebP, SVG, BMP (Max 5MB)
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isCategorySubmitting}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   backgroundColor: isCategorySubmitting ? "#93c5fd" : "#2563eb",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   cursor: isCategorySubmitting ? "not-allowed" : "pointer",
//                   transition: "background-color 0.2s"
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isCategorySubmitting) e.currentTarget.style.backgroundColor = "#1d4ed8";
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isCategorySubmitting) e.currentTarget.style.backgroundColor = "#2563eb";
//                 }}
//               >
//                 {isCategorySubmitting ? "Adding..." : "Add Category"}
//               </button>
//             </form>
//           </div>

//           {/* Categories List Card */}
//           <div style={{
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//             overflow: "hidden"
//           }}>
//             <div style={{ 
//               padding: "20px", 
//               borderBottom: "1px solid #e5e7eb",
//               display: "flex",
//               flexDirection: "column",
//               gap: "10px"
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
//                 <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151" }}>Category List</h3>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>Show:</span>
//                   <select
//                     value={categoryItemsPerPage}
//                     onChange={handleCategoryItemsPerPageChange}
//                     style={{
//                       padding: "6px 10px",
//                       border: "1px solid #d1d5db",
//                       borderRadius: "4px",
//                       fontSize: "13px",
//                       backgroundColor: "white",
//                       outline: "none",
//                       cursor: "pointer"
//                     }}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="25">25</option>
//                     <option value="50">50</option>
//                     <option value="100">100</option>
//                   </select>
//                   <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>per page</span>
//                 </div>
//               </div>
//               <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "0" }}>
//                 Showing {((currentCategoryPage - 1) * categoryItemsPerPage) + 1} to {Math.min(currentCategoryPage * categoryItemsPerPage, totalCategories)} of {totalCategories} categories
//               </p>
//             </div>

//             {isCategoryLoading ? (
//               <div style={{ padding: "40px", textAlign: "center" }}>
//                 <div style={{
//                   display: "inline-block",
//                   width: "32px",
//                   height: "32px",
//                   border: "2px solid #e5e7eb",
//                   borderTop: "2px solid #2563eb",
//                   borderRadius: "50%",
//                   animation: "spin 1s linear infinite"
//                 }}></div>
//                 <p style={{ marginTop: "12px", color: "#4b5563" }}>Loading categories...</p>
//               </div>
//             ) : categories.length === 0 ? (
//               <div style={{ padding: "40px", textAlign: "center" }}>
//                 <p style={{ color: "#6b7280" }}>No categories found. Add your first category above.</p>
//               </div>
//             ) : (
//               <>
//                 {/* Desktop Table View */}
//                 <div style={{ overflowX: "auto", display: "none" }}>
//                   <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
//                     <thead style={{ backgroundColor: "#f9fafb" }}>
//                       <tr>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           ID
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Name
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Image
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {categories.map((cat) => (
//                         <tr key={cat._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                           <td style={{ padding: "14px 16px" }}>
//                             <span style={{ fontSize: "13px", fontWeight: "500", color: "#111827" }}>
//                               {cat.categoryId}
//                             </span>
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             {editingCategoryId === cat._id ? (
//                               <input
//                                 value={editCategoryName}
//                                 onChange={(e) => setEditCategoryName(e.target.value)}
//                                 style={{
//                                   padding: "6px 10px",
//                                   border: "1px solid #d1d5db",
//                                   borderRadius: "4px",
//                                   fontSize: "14px",
//                                   outline: "none",
//                                   transition: "all 0.2s",
//                                   width: "100%",
//                                   maxWidth: "200px"
//                                 }}
//                                 onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                                 onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                                 autoFocus
//                               />
//                             ) : (
//                               <span style={{ fontSize: "14px", color: "#111827" }}>{cat.categoryName}</span>
//                             )}
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                               <img
//                                 src={getImageUrl(cat.image)}
//                                 alt={cat.categoryName}
//                                 style={{
//                                   width: "50px",
//                                   height: "50px",
//                                   objectFit: "cover",
//                                   borderRadius: "6px"
//                                 }}
//                                 onError={handleCategoryImageError}
//                               />
//                               {editingCategoryId === cat._id && (
//                                 <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//                                   <input
//                                     id={`category-image-edit-${cat._id}`}
//                                     type="file"
//                                     accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
//                                     onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
//                                     style={{
//                                       width: "100%",
//                                       padding: "4px 8px",
//                                       border: "1px solid #d1d5db",
//                                       borderRadius: "4px",
//                                       fontSize: "12px",
//                                       maxWidth: "200px"
//                                     }}
//                                   />
//                                   <button
//                                     onClick={() => updateCategoryImage(cat._id)}
//                                     disabled={isCategoryImageUploading || !editCategoryImage}
//                                     style={{
//                                       padding: "4px 8px",
//                                       fontSize: "11px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: isCategoryImageUploading || !editCategoryImage ? "#93c5fd" : "#2563eb",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: isCategoryImageUploading || !editCategoryImage ? "not-allowed" : "pointer",
//                                       transition: "background-color 0.2s",
//                                       maxWidth: "200px"
//                                     }}
//                                     onMouseEnter={(e) => {
//                                       if (!isCategoryImageUploading && editCategoryImage) {
//                                         e.currentTarget.style.backgroundColor = "#1d4ed8";
//                                       }
//                                     }}
//                                     onMouseLeave={(e) => {
//                                       if (!isCategoryImageUploading && editCategoryImage) {
//                                         e.currentTarget.style.backgroundColor = "#2563eb";
//                                       }
//                                     }}
//                                   >
//                                     {isCategoryImageUploading ? "Uploading..." : "Update Image"}
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//                               {editingCategoryId === cat._id ? (
//                                 <>
//                                   <button
//                                     onClick={() => saveCategoryEdit(cat._id)}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: "#059669",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
//                                   >
//                                     Save Name
//                                   </button>
//                                   <button
//                                     onClick={cancelCategoryEdit}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "#374151",
//                                       backgroundColor: "#e5e7eb",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
//                                   >
//                                     Cancel
//                                   </button>
//                                 </>
//                               ) : (
//                                 <>
//                                   <button
//                                     onClick={() => startCategoryEdit(cat)}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: "#2563eb",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//                                   >
//                                     Edit
//                                   </button>
//                                   <button
//                                     onClick={() => deleteCategory(cat._id)}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: "#dc2626",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
//                                   >
//                                     Delete
//                                   </button>
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Mobile Card View */}
//                 <div style={{ 
//                   display: "block", 
//                   padding: "15px"
//                 }}>
//                   {categories.map((cat) => (
//                     <div key={cat._id} style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "8px",
//                       padding: "16px",
//                       marginBottom: "12px",
//                       backgroundColor: "#f9fafb"
//                     }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
//                         <div>
//                           <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>ID: {cat.categoryId}</div>
//                           {editingCategoryId === cat._id ? (
//                             <input
//                               value={editCategoryName}
//                               onChange={(e) => setEditCategoryName(e.target.value)}
//                               style={{
//                                 padding: "6px 10px",
//                                 border: "1px solid #d1d5db",
//                                 borderRadius: "4px",
//                                 fontSize: "14px",
//                                 outline: "none",
//                                 transition: "all 0.2s",
//                                 width: "100%",
//                                 marginBottom: "8px"
//                               }}
//                               onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                               onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                               autoFocus
//                             />
//                           ) : (
//                             <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
//                               {cat.categoryName}
//                             </div>
//                           )}
//                         </div>
//                         <div style={{ display: "flex", gap: "8px" }}>
//                           {editingCategoryId === cat._id ? (
//                             <>
//                               <button
//                                 onClick={() => saveCategoryEdit(cat._id)}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "white",
//                                   backgroundColor: "#059669",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer",
//                                   transition: "background-color 0.2s"
//                                 }}
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 onClick={cancelCategoryEdit}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "#374151",
//                                   backgroundColor: "#e5e7eb",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer",
//                                   transition: "background-color 0.2s"
//                                 }}
//                               >
//                                 Cancel
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => startCategoryEdit(cat)}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "white",
//                                   backgroundColor: "#2563eb",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer"
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => deleteCategory(cat._id)}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "white",
//                                   backgroundColor: "#dc2626",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer"
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
//                         <img
//                           src={getImageUrl(cat.image)}
//                           alt={cat.categoryName}
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                             borderRadius: "6px"
//                           }}
//                           onError={handleCategoryImageError}
//                         />
//                         {editingCategoryId === cat._id && (
//                           <div style={{ flex: 1 }}>
//                             <input
//                               id={`category-image-edit-${cat._id}`}
//                               type="file"
//                               accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
//                               onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
//                               style={{
//                                 width: "100%",
//                                 padding: "6px 10px",
//                                 border: "1px solid #d1d5db",
//                                 borderRadius: "4px",
//                                 fontSize: "12px",
//                                 marginBottom: "8px"
//                               }}
//                             />
//                             <button
//                               onClick={() => updateCategoryImage(cat._id)}
//                               disabled={isCategoryImageUploading || !editCategoryImage}
//                               style={{
//                                 width: "100%",
//                                 padding: "6px 10px",
//                                 fontSize: "12px",
//                                 fontWeight: "500",
//                                 color: "white",
//                                 backgroundColor: isCategoryImageUploading || !editCategoryImage ? "#93c5fd" : "#2563eb",
//                                 border: "none",
//                                 borderRadius: "4px",
//                                 cursor: isCategoryImageUploading || !editCategoryImage ? "not-allowed" : "pointer"
//                               }}
//                             >
//                               {isCategoryImageUploading ? "Uploading..." : "Update Image"}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Category Pagination */}
//                 {totalCategories > 0 && (
//                   <div style={{ 
//                     padding: "20px", 
//                     borderTop: "1px solid #e5e7eb",
//                     display: "flex", 
//                     flexDirection: "column",
//                     gap: "15px"
//                   }}>
//                     <div style={{ fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
//                       Page {currentCategoryPage} of {categoryTotalPages}
//                     </div>
                    
//                     <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
//                       <button
//                         onClick={() => goToPage(1, 'category')}
//                         disabled={currentCategoryPage === 1}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentCategoryPage === 1 ? "#9ca3af" : "#374151",
//                           backgroundColor: currentCategoryPage === 1 ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentCategoryPage === 1 ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         First
//                       </button>
                      
//                       <button
//                         onClick={() => goToPage(currentCategoryPage - 1, 'category')}
//                         disabled={currentCategoryPage === 1}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentCategoryPage === 1 ? "#9ca3af" : "#374151",
//                           backgroundColor: currentCategoryPage === 1 ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentCategoryPage === 1 ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         Previous
//                       </button>
                      
//                       {getPageNumbers(currentCategoryPage, categoryTotalPages).map((pageNum, index) => (
//                         <button
//                           key={index}
//                           onClick={() => typeof pageNum === 'number' ? goToPage(pageNum, 'category') : null}
//                           disabled={pageNum === '...'}
//                           style={{
//                             padding: "8px 12px",
//                             minWidth: "40px",
//                             fontSize: "12px",
//                             fontWeight: "500",
//                             color: pageNum === currentCategoryPage ? "white" : "#374151",
//                             backgroundColor: pageNum === currentCategoryPage ? "#2563eb" : "white",
//                             border: "1px solid #d1d5db",
//                             borderRadius: "6px",
//                             cursor: pageNum === '...' ? "default" : "pointer",
//                             transition: "all 0.2s"
//                           }}
//                         >
//                           {pageNum}
//                         </button>
//                       ))}
                      
//                       <button
//                         onClick={() => goToPage(currentCategoryPage + 1, 'category')}
//                         disabled={currentCategoryPage === categoryTotalPages}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentCategoryPage === categoryTotalPages ? "#9ca3af" : "#374151",
//                           backgroundColor: currentCategoryPage === categoryTotalPages ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentCategoryPage === categoryTotalPages ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         Next
//                       </button>
                      
//                       <button
//                         onClick={() => goToPage(categoryTotalPages, 'category')}
//                         disabled={currentCategoryPage === categoryTotalPages}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentCategoryPage === categoryTotalPages ? "#9ca3af" : "#374151",
//                           backgroundColor: currentCategoryPage === categoryTotalPages ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentCategoryPage === categoryTotalPages ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         Last
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </>
//       )}

//       {/* Sub-Category Tab Content */}
//       {activeTab === "subcategory" && (
//         <>
//           {/* Add Sub-Category Card */}
//           <div style={{
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//             padding: "20px",
//             marginBottom: "24px"
//           }}>
//             <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#374151" }}>
//               Add New Sub-Category
//             </h2>

//             <form onSubmit={addSubCategory} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
//                   Select Category *
//                 </label>
//                 <select
//                   required
//                   value={selectedCategoryId}
//                   onChange={(e) => setSelectedCategoryId(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "1px solid #d1d5db",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     backgroundColor: "white",
//                     outline: "none",
//                     cursor: "pointer",
//                     transition: "all 0.2s"
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                   onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.categoryName} (ID: {c.categoryId})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
//                   Sub-Category Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="Enter sub-category name"
//                   value={subCategoryName}
//                   onChange={(e) => setSubCategoryName(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "1px solid #d1d5db",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     outline: "none",
//                     transition: "all 0.2s"
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                   onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                 />
//               </div>

//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
//                   Sub-Category Image (Optional)
//                 </label>
//                 <input
//                   id="subcat-image"
//                   type="file"
//                   accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
//                   onChange={(e) => setSubCategoryImage(e.target.files?.[0] || null)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "1px solid #d1d5db",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     outline: "none"
//                   }}
//                 />
//                 <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
//                   Accepted: JPG, PNG, GIF, WebP, SVG, BMP (Max 5MB)
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubCategorySubmitting}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   backgroundColor: isSubCategorySubmitting ? "#86efac" : "#16a34a",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   cursor: isSubCategorySubmitting ? "not-allowed" : "pointer",
//                   transition: "background-color 0.2s"
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isSubCategorySubmitting) e.currentTarget.style.backgroundColor = "#15803d";
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isSubCategorySubmitting) e.currentTarget.style.backgroundColor = "#16a34a";
//                 }}
//               >
//                 {isSubCategorySubmitting ? "Adding..." : "Add Sub-Category"}
//               </button>
//             </form>
//           </div>

//           {/* Sub-Categories List Card */}
//           <div style={{
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//             overflow: "hidden"
//           }}>
//             <div style={{ 
//               padding: "20px", 
//               borderBottom: "1px solid #e5e7eb",
//               display: "flex",
//               flexDirection: "column",
//               gap: "10px"
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
//                 <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151" }}>Sub-Category List</h3>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>Show:</span>
//                   <select
//                     value={subCategoryItemsPerPage}
//                     onChange={handleSubCategoryItemsPerPageChange}
//                     style={{
//                       padding: "6px 10px",
//                       border: "1px solid #d1d5db",
//                       borderRadius: "4px",
//                       fontSize: "13px",
//                       backgroundColor: "white",
//                       outline: "none",
//                       cursor: "pointer"
//                     }}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="25">25</option>
//                     <option value="50">50</option>
//                     <option value="100">100</option>
//                   </select>
//                   <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>per page</span>
//                 </div>
//               </div>
//               <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "0" }}>
//                 Showing {((currentSubCategoryPage - 1) * subCategoryItemsPerPage) + 1} to {Math.min(currentSubCategoryPage * subCategoryItemsPerPage, totalSubCategories)} of {totalSubCategories} sub-categories
//               </p>
//             </div>

//             {isSubCategoryLoading ? (
//               <div style={{ padding: "40px", textAlign: "center" }}>
//                 <div style={{
//                   display: "inline-block",
//                   width: "32px",
//                   height: "32px",
//                   border: "2px solid #e5e7eb",
//                   borderTop: "2px solid #16a34a",
//                   borderRadius: "50%",
//                   animation: "spin 1s linear infinite"
//                 }}></div>
//                 <p style={{ marginTop: "12px", color: "#4b5563" }}>Loading sub-categories...</p>
//               </div>
//             ) : subCategories.length === 0 ? (
//               <div style={{ padding: "40px", textAlign: "center" }}>
//                 <p style={{ color: "#6b7280" }}>No sub-categories found. Add your first sub-category above.</p>
//               </div>
//             ) : (
//               <>
//                 {/* Desktop Table View */}
//                 <div style={{ overflowX: "auto", display: "none" }}>
//                   <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
//                     <thead style={{ backgroundColor: "#f9fafb" }}>
//                       <tr>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           ID
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Sub-Category
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Category
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Image
//                         </th>
//                         <th style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#6b7280",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.05em"
//                         }}>
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {subCategories.map((s) => (
//                         <tr key={s._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                           <td style={{ padding: "14px 16px" }}>
//                             <span style={{ fontSize: "13px", fontWeight: "500", color: "#111827" }}>
//                               {s.subCategoryId}
//                             </span>
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             {editingSubCategoryId === s._id ? (
//                               <input
//                                 value={editSubCategoryName}
//                                 onChange={(e) => setEditSubCategoryName(e.target.value)}
//                                 style={{
//                                   padding: "6px 10px",
//                                   border: "1px solid #d1d5db",
//                                   borderRadius: "4px",
//                                   fontSize: "14px",
//                                   outline: "none",
//                                   transition: "all 0.2s",
//                                   width: "100%",
//                                   maxWidth: "200px"
//                                 }}
//                                 onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                                 onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                                 autoFocus
//                               />
//                             ) : (
//                               <span style={{ fontSize: "14px", color: "#111827" }}>{s.subCategoryName}</span>
//                             )}
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             <span style={{
//                               fontSize: "13px",
//                               color: "#4b5563",
//                               backgroundColor: "#f3f4f6",
//                               padding: "4px 8px",
//                               borderRadius: "4px",
//                               display: "inline-block"
//                             }}>
//                               {getCategoryName(s.categoryId)}
//                             </span>
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                               {s.image && (
//                                 <img
//                                   src={getImageUrl(s.image)}
//                                   alt={s.subCategoryName}
//                                   style={{
//                                     width: "50px",
//                                     height: "50px",
//                                     objectFit: "cover",
//                                     borderRadius: "6px"
//                                   }}
//                                   onError={handleCategoryImageError}
//                                 />
//                               )}
//                               {editingSubCategoryId === s._id && (
//                                 <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//                                   <input
//                                     id={`subcategory-image-edit-${s._id}`}
//                                     type="file"
//                                     accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
//                                     onChange={(e) => setEditSubCategoryImage(e.target.files?.[0] || null)}
//                                     style={{
//                                       width: "100%",
//                                       padding: "4px 8px",
//                                       border: "1px solid #d1d5db",
//                                       borderRadius: "4px",
//                                       fontSize: "12px",
//                                       maxWidth: "200px"
//                                     }}
//                                   />
//                                   <button
//                                     onClick={() => updateSubCategoryImage(s._id)}
//                                     disabled={isSubCategoryImageUploading || !editSubCategoryImage}
//                                     style={{
//                                       padding: "4px 8px",
//                                       fontSize: "11px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: isSubCategoryImageUploading || !editSubCategoryImage ? "#86efac" : "#16a34a",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: isSubCategoryImageUploading || !editSubCategoryImage ? "not-allowed" : "pointer",
//                                       transition: "background-color 0.2s",
//                                       maxWidth: "200px"
//                                     }}
//                                     onMouseEnter={(e) => {
//                                       if (!isSubCategoryImageUploading && editSubCategoryImage) {
//                                         e.currentTarget.style.backgroundColor = "#15803d";
//                                       }
//                                     }}
//                                     onMouseLeave={(e) => {
//                                       if (!isSubCategoryImageUploading && editSubCategoryImage) {
//                                         e.currentTarget.style.backgroundColor = "#16a34a";
//                                       }
//                                     }}
//                                   >
//                                     {isSubCategoryImageUploading ? "Uploading..." : "Update Image"}
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </td>

//                           <td style={{ padding: "14px 16px" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//                               {editingSubCategoryId === s._id ? (
//                                 <>
//                                   <button
//                                     onClick={() => saveSubCategoryEdit(s._id)}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: "#059669",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
//                                   >
//                                     Save Name
//                                   </button>
//                                   <button
//                                     onClick={cancelSubCategoryEdit}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "#374151",
//                                       backgroundColor: "#e5e7eb",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
//                                   >
//                                     Cancel
//                                   </button>
//                                 </>
//                               ) : (
//                                 <>
//                                   <button
//                                     onClick={() => startSubCategoryEdit(s)}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: "#2563eb",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//                                   >
//                                     Edit
//                                   </button>
//                                   <button
//                                     onClick={() => deleteSubCategory(s._id)}
//                                     style={{
//                                       padding: "6px 12px",
//                                       fontSize: "12px",
//                                       fontWeight: "500",
//                                       color: "white",
//                                       backgroundColor: "#dc2626",
//                                       border: "none",
//                                       borderRadius: "4px",
//                                       cursor: "pointer",
//                                       transition: "background-color 0.2s"
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
//                                   >
//                                     Delete
//                                   </button>
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Mobile Card View */}
//                 <div style={{ 
//                   display: "block", 
//                   padding: "15px"
//                 }}>
//                   {subCategories.map((s) => (
//                     <div key={s._id} style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "8px",
//                       padding: "16px",
//                       marginBottom: "12px",
//                       backgroundColor: "#f9fafb"
//                     }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
//                         <div>
//                           <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>ID: {s.subCategoryId}</div>
//                           {editingSubCategoryId === s._id ? (
//                             <input
//                               value={editSubCategoryName}
//                               onChange={(e) => setEditSubCategoryName(e.target.value)}
//                               style={{
//                                 padding: "6px 10px",
//                                 border: "1px solid #d1d5db",
//                                 borderRadius: "4px",
//                                 fontSize: "14px",
//                                 outline: "none",
//                                 transition: "all 0.2s",
//                                 width: "100%",
//                                 marginBottom: "8px"
//                               }}
//                               onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                               onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                               autoFocus
//                             />
//                           ) : (
//                             <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
//                               {s.subCategoryName}
//                             </div>
//                           )}
//                           <div style={{
//                             fontSize: "13px",
//                             color: "#4b5563",
//                             backgroundColor: "#f3f4f6",
//                             padding: "4px 8px",
//                             borderRadius: "4px",
//                             display: "inline-block"
//                           }}>
//                             {getCategoryName(s.categoryId)}
//                           </div>
//                         </div>
//                         <div style={{ display: "flex", gap: "8px" }}>
//                           {editingSubCategoryId === s._id ? (
//                             <>
//                               <button
//                                 onClick={() => saveSubCategoryEdit(s._id)}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "white",
//                                   backgroundColor: "#059669",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer"
//                                 }}
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 onClick={cancelSubCategoryEdit}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "#374151",
//                                   backgroundColor: "#e5e7eb",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer"
//                                 }}
//                               >
//                                 Cancel
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => startSubCategoryEdit(s)}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "white",
//                                   backgroundColor: "#2563eb",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer"
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => deleteSubCategory(s._id)}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   fontWeight: "500",
//                                   color: "white",
//                                   backgroundColor: "#dc2626",
//                                   border: "none",
//                                   borderRadius: "4px",
//                                   cursor: "pointer"
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
//                         {s.image && (
//                           <img
//                             src={getImageUrl(s.image)}
//                             alt={s.subCategoryName}
//                             style={{
//                               width: "60px",
//                               height: "60px",
//                               objectFit: "cover",
//                               borderRadius: "6px"
//                             }}
//                             onError={handleCategoryImageError}
//                           />
//                         )}
//                         {editingSubCategoryId === s._id && (
//                           <div style={{ flex: 1 }}>
//                             <input
//                               id={`subcategory-image-edit-${s._id}`}
//                               type="file"
//                               accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
//                               onChange={(e) => setEditSubCategoryImage(e.target.files?.[0] || null)}
//                               style={{
//                                 width: "100%",
//                                 padding: "6px 10px",
//                                 border: "1px solid #d1d5db",
//                                 borderRadius: "4px",
//                                 fontSize: "12px",
//                                 marginBottom: "8px"
//                               }}
//                             />
//                             <button
//                               onClick={() => updateSubCategoryImage(s._id)}
//                               disabled={isSubCategoryImageUploading || !editSubCategoryImage}
//                               style={{
//                                 width: "100%",
//                                 padding: "6px 10px",
//                                 fontSize: "12px",
//                                 fontWeight: "500",
//                                 color: "white",
//                                 backgroundColor: isSubCategoryImageUploading || !editSubCategoryImage ? "#86efac" : "#16a34a",
//                                 border: "none",
//                                 borderRadius: "4px",
//                                 cursor: isSubCategoryImageUploading || !editSubCategoryImage ? "not-allowed" : "pointer"
//                               }}
//                             >
//                               {isSubCategoryImageUploading ? "Uploading..." : "Update Image"}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Sub-Category Pagination */}
//                 {totalSubCategories > 0 && (
//                   <div style={{ 
//                     padding: "20px", 
//                     borderTop: "1px solid #e5e7eb",
//                     display: "flex", 
//                     flexDirection: "column",
//                     gap: "15px"
//                   }}>
//                     <div style={{ fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
//                       Page {currentSubCategoryPage} of {subCategoryTotalPages}
//                     </div>
                    
//                     <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
//                       <button
//                         onClick={() => goToPage(1, 'subcategory')}
//                         disabled={currentSubCategoryPage === 1}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentSubCategoryPage === 1 ? "#9ca3af" : "#374151",
//                           backgroundColor: currentSubCategoryPage === 1 ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentSubCategoryPage === 1 ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         First
//                       </button>
                      
//                       <button
//                         onClick={() => goToPage(currentSubCategoryPage - 1, 'subcategory')}
//                         disabled={currentSubCategoryPage === 1}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentSubCategoryPage === 1 ? "#9ca3af" : "#374151",
//                           backgroundColor: currentSubCategoryPage === 1 ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentSubCategoryPage === 1 ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         Previous
//                       </button>
                      
//                       {getPageNumbers(currentSubCategoryPage, subCategoryTotalPages).map((pageNum, index) => (
//                         <button
//                           key={index}
//                           onClick={() => typeof pageNum === 'number' ? goToPage(pageNum, 'subcategory') : null}
//                           disabled={pageNum === '...'}
//                           style={{
//                             padding: "8px 12px",
//                             minWidth: "40px",
//                             fontSize: "12px",
//                             fontWeight: "500",
//                             color: pageNum === currentSubCategoryPage ? "white" : "#374151",
//                             backgroundColor: pageNum === currentSubCategoryPage ? "#16a34a" : "white",
//                             border: "1px solid #d1d5db",
//                             borderRadius: "6px",
//                             cursor: pageNum === '...' ? "default" : "pointer",
//                             transition: "all 0.2s"
//                           }}
//                         >
//                           {pageNum}
//                         </button>
//                       ))}
                      
//                       <button
//                         onClick={() => goToPage(currentSubCategoryPage + 1, 'subcategory')}
//                         disabled={currentSubCategoryPage === subCategoryTotalPages}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentSubCategoryPage === subCategoryTotalPages ? "#9ca3af" : "#374151",
//                           backgroundColor: currentSubCategoryPage === subCategoryTotalPages ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentSubCategoryPage === subCategoryTotalPages ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         Next
//                       </button>
                      
//                       <button
//                         onClick={() => goToPage(subCategoryTotalPages, 'subcategory')}
//                         disabled={currentSubCategoryPage === subCategoryTotalPages}
//                         style={{
//                           padding: "8px 12px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: currentSubCategoryPage === subCategoryTotalPages ? "#9ca3af" : "#374151",
//                           backgroundColor: currentSubCategoryPage === subCategoryTotalPages ? "#f3f4f6" : "white",
//                           border: "1px solid #d1d5db",
//                           borderRadius: "6px",
//                           cursor: currentSubCategoryPage === subCategoryTotalPages ? "not-allowed" : "pointer",
//                           transition: "all 0.2s"
//                         }}
//                       >
//                         Last
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </>
//       )}

//       {/* Add CSS for spinner animation */}
//       <style jsx global>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         @media (min-width: 768px) {
//           .mobile-only {
//             display: none !important;
//           }
//           .desktop-only {
//             display: block !important;
//           }
//         }
        
//         @media (max-width: 767px) {
//           .mobile-only {
//             display: block !important;
//           }
//           .desktop-only {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }














"use client";

import { useEffect, useState } from "react";

/* ================== Interfaces ================== */
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
  categoryName?: string;
  image?: string;
}

// API Response Interfaces
interface ApiResponse<T> {
  data?: T[];
  total?: number;
  message?: string;
  success?: boolean;
}

/* ================== Main Component ================== */
export default function CategoryManagementPage() {
  // State for tabs
  const [activeTab, setActiveTab] = useState<"category" | "subcategory">("category");

  // Category States
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [isCategoryImageUploading, setIsCategoryImageUploading] = useState(false);

  // SubCategory States
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState("");
  const [editSubCategoryImage, setEditSubCategoryImage] = useState<File | null>(null);
  const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(true);
  const [isSubCategorySubmitting, setIsSubCategorySubmitting] = useState(false);
  const [isSubCategoryImageUploading, setIsSubCategoryImageUploading] = useState(false);

  // Pagination States
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [categoryItemsPerPage, setCategoryItemsPerPage] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  
  const [currentSubCategoryPage, setCurrentSubCategoryPage] = useState(1);
  const [subCategoryItemsPerPage, setSubCategoryItemsPerPage] = useState(10);
  const [totalSubCategories, setTotalSubCategories] = useState(0);

  /* ================== Helper Functions ================== */
  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    const fileType = file.type.toLowerCase();
    
    if (!fileType.startsWith('image/')) {
      return {
        isValid: false,
        error: `File type not supported. Please upload an image file.`
      };
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`
      };
    }
    
    return { isValid: true };
  };

  const clearFileInput = (inputId: string) => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Pagination helper functions
  const calculateTotalPages = (totalItems: number, itemsPerPage: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const goToPage = (page: number, type: 'category' | 'subcategory') => {
    const totalPages = type === 'category' 
      ? calculateTotalPages(totalCategories, categoryItemsPerPage)
      : calculateTotalPages(totalSubCategories, subCategoryItemsPerPage);
    
    if (page >= 1 && page <= totalPages) {
      if (type === 'category') {
        setCurrentCategoryPage(page);
      } else {
        setCurrentSubCategoryPage(page);
      }
    }
  };

  /* ================== Fetch Data Functions ================== */
  const fetchCategories = async (page: number = 1, limit: number = categoryItemsPerPage) => {
    try {
      setIsCategoryLoading(true);
      const res = await fetch(`https://kisan.etpl.ai/category/all?page=${page}&limit=${limit}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }
      
      const data: ApiResponse<Category> = await res.json();
      
      // Handle different API response structures
      if (Array.isArray(data)) {
        // If API returns direct array
        setCategories(data);
        setTotalCategories(data.length);
      } else if (data.data && Array.isArray(data.data)) {
        // If API returns { data: [], total: number }
        setCategories(data.data);
        setTotalCategories(data.total || data.data.length);
      } else {
        // Fallback
        setCategories([]);
        setTotalCategories(0);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setTotalCategories(0);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const fetchSubCategories = async (page: number = 1, limit: number = subCategoryItemsPerPage) => {
    try {
      setIsSubCategoryLoading(true);
      const res = await fetch(`https://kisan.etpl.ai/subcategory/all?page=${page}&limit=${limit}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch subcategories: ${res.status}`);
      }
      
      const data: ApiResponse<SubCategory> = await res.json();
      
      // Handle different API response structures
      if (Array.isArray(data)) {
        setSubCategories(data);
        setTotalSubCategories(data.length);
      } else if (data.data && Array.isArray(data.data)) {
        setSubCategories(data.data);
        setTotalSubCategories(data.total || data.data.length);
      } else {
        setSubCategories([]);
        setTotalSubCategories(0);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
      setTotalSubCategories(0);
    } finally {
      setIsSubCategoryLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === 'category') {
        await fetchCategories(currentCategoryPage, categoryItemsPerPage);
      } else {
        await fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      }
    };
    loadData();
  }, [
    activeTab, 
    currentCategoryPage, 
    categoryItemsPerPage, 
    currentSubCategoryPage, 
    subCategoryItemsPerPage
  ]);

  // Handle items per page change
  const handleCategoryItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setCategoryItemsPerPage(value);
    setCurrentCategoryPage(1);
  };

  const handleSubCategoryItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSubCategoryItemsPerPage(value);
    setCurrentSubCategoryPage(1);
  };

  /* ================== Category Functions ================== */
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      setIsCategorySubmitting(true);
      const formData = new FormData();
      formData.append("categoryName", categoryName.trim());
      
      if (categoryImage) {
        const validation = validateImageFile(categoryImage);
        if (!validation.isValid) {
          alert(validation.error);
          setIsCategorySubmitting(false);
          clearFileInput("category-image-upload");
          setCategoryImage(null);
          return;
        }
        formData.append("image", categoryImage);
      }

      const response = await fetch("https://kisan.etpl.ai/category/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add category: ${response.status} - ${errorText}`);
      }

      setCategoryName("");
      setCategoryImage(null);
      clearFileInput("category-image-upload");

      fetchCategories(currentCategoryPage, categoryItemsPerPage);
      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert(`Failed to add category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const startCategoryEdit = (cat: Category) => {
    setEditingCategoryId(cat._id);
    setEditCategoryName(cat.categoryName);
    setEditCategoryImage(null);
  };

  const saveCategoryEdit = async (id: string) => {
    if (!editCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`https://kisan.etpl.ai/category/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: editCategoryName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      setEditingCategoryId(null);
      fetchCategories(currentCategoryPage, categoryItemsPerPage);
      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Category name updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error instanceof Error ? error.message : "Failed to update category");
    }
  };

  const updateCategoryImage = async (id: string) => {
    if (!editCategoryImage) {
      alert("Please select an image to upload");
      return;
    }

    try {
      setIsCategoryImageUploading(true);
      const validation = validateImageFile(editCategoryImage);
      if (!validation.isValid) {
        alert(validation.error);
        setIsCategoryImageUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", editCategoryImage);
      formData.append("categoryName", editCategoryName);

      const response = await fetch(`https://kisan.etpl.ai/category/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category image");
      }

      setEditCategoryImage(null);
      clearFileInput(`category-image-edit-${id}`);
      fetchCategories(currentCategoryPage, categoryItemsPerPage);
      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Category image updated successfully!");
    } catch (error) {
      console.error("Error updating category image:", error);
      alert(error instanceof Error ? error.message : "Failed to update category image");
    } finally {
      setIsCategoryImageUploading(false);
    }
  };

  const cancelCategoryEdit = () => {
    setEditingCategoryId(null);
    setEditCategoryName("");
    setEditCategoryImage(null);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This may affect sub-categories.")) {
      return;
    }

    try {
      const response = await fetch(`https://kisan.etpl.ai/category/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      fetchCategories(currentCategoryPage, categoryItemsPerPage);
      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleCategoryImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  /* ================== SubCategory Functions ================== */
  const addSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryId || !subCategoryName.trim()) {
      alert("Please select a category and enter sub-category name");
      return;
    }

    try {
      setIsSubCategorySubmitting(true);
      const formData = new FormData();
      formData.append("subCategoryName", subCategoryName.trim());
      formData.append("categoryId", selectedCategoryId);
      
      if (subCategoryImage) {
        const validation = validateImageFile(subCategoryImage);
        if (!validation.isValid) {
          alert(validation.error);
          setIsSubCategorySubmitting(false);
          clearFileInput("subcat-image");
          setSubCategoryImage(null);
          return;
        }
        formData.append("image", subCategoryImage);
      }

      const response = await fetch("https://kisan.etpl.ai/subcategory/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add sub-category: ${response.status}`);
      }

      setSubCategoryName("");
      setSelectedCategoryId("");
      setSubCategoryImage(null);
      clearFileInput("subcat-image");

      await fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Sub-category added successfully!");
    } catch (error) {
      console.error("Error adding sub-category:", error);
      alert(error instanceof Error ? error.message : "Failed to add sub-category");
    } finally {
      setIsSubCategorySubmitting(false);
    }
  };

  const startSubCategoryEdit = (subCat: SubCategory) => {
    setEditingSubCategoryId(subCat._id);
    setEditSubCategoryName(subCat.subCategoryName);
    setEditSubCategoryImage(null);
  };

  const saveSubCategoryEdit = async (id: string) => {
    if (!editSubCategoryName.trim()) {
      alert("Sub-category name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`https://kisan.etpl.ai/subcategory/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subCategoryName: editSubCategoryName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sub-category");
      }

      setEditingSubCategoryId(null);
      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Sub-category name updated successfully!");
    } catch (error) {
      console.error("Error updating sub-category:", error);
      alert(error instanceof Error ? error.message : "Failed to update sub-category");
    }
  };

  const updateSubCategoryImage = async (id: string) => {
    if (!editSubCategoryImage) {
      alert("Please select an image to upload");
      return;
    }

    try {
      setIsSubCategoryImageUploading(true);
      const validation = validateImageFile(editSubCategoryImage);
      if (!validation.isValid) {
        alert(validation.error);
        setIsSubCategoryImageUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", editSubCategoryImage);
      formData.append("subCategoryName", editSubCategoryName);

      const response = await fetch(`https://kisan.etpl.ai/subcategory/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sub-category image");
      }

      setEditSubCategoryImage(null);
      clearFileInput(`subcategory-image-edit-${id}`);
      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Sub-category image updated successfully!");
    } catch (error) {
      console.error("Error updating sub-category image:", error);
      alert(error instanceof Error ? error.message : "Failed to update sub-category image");
    } finally {
      setIsSubCategoryImageUploading(false);
    }
  };

  const cancelSubCategoryEdit = () => {
    setEditingSubCategoryId(null);
    setEditSubCategoryName("");
    setEditSubCategoryImage(null);
  };

  const deleteSubCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-category?")) {
      return;
    }

    try {
      const response = await fetch(`https://kisan.etpl.ai/subcategory/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sub-category");
      }

      fetchSubCategories(currentSubCategoryPage, subCategoryItemsPerPage);
      alert("Sub-category deleted successfully!");
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      alert("Failed to delete sub-category");
    }
  };

  const getCategoryName = (catId: string) => {
    const category = categories.find(c => c._id === catId);
    return category ? category.categoryName : "Unknown Category";
  };

  // Calculate pagination values
  const categoryTotalPages = calculateTotalPages(totalCategories, categoryItemsPerPage);
  const subCategoryTotalPages = calculateTotalPages(totalSubCategories, subCategoryItemsPerPage);

  // Get image URL safely
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `https://kisan.etpl.ai/uploads/${imagePath}`;
  };

  /* ================== UI ================== */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Category & Sub-Category Management
      </h1>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("category")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "category"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Categories
            {isCategoryLoading && activeTab === "category" && (
              <span className="ml-2 text-xs text-gray-500">(Loading...)</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("subcategory")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "subcategory"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Sub-Categories
            {isSubCategoryLoading && activeTab === "subcategory" && (
              <span className="ml-2 text-xs text-gray-500">(Loading...)</span>
            )}
          </button>
        </nav>
      </div>

      {/* Category Tab Content */}
      {activeTab === "category" && (
        <>
          {/* Add Category Card */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Category
            </h2>

            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  id="categoryName"
                  type="text"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image (Optional)
                </label>
                <input
                  id="category-image-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                  onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Accepted: JPG, PNG, GIF, WebP, SVG, BMP (Max 5MB)
                </p>
              </div>

              <button
                type="submit"
                disabled={isCategorySubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isCategorySubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isCategorySubmitting ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>

          {/* Categories List Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Category List</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
                  <select
                    value={categoryItemsPerPage}
                    onChange={handleCategoryItemsPerPageChange}
                    className="block w-20 px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-sm text-gray-600 whitespace-nowrap">per page</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Showing {((currentCategoryPage - 1) * categoryItemsPerPage) + 1} to{" "}
                {Math.min(currentCategoryPage * categoryItemsPerPage, totalCategories)} of{" "}
                {totalCategories} categories
              </p>
            </div>

            {isCategoryLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No categories found. Add your first category above.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((cat) => (
                        <tr key={cat._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {cat.categoryId}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editingCategoryId === cat._id ? (
                              <input
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                              />
                            ) : (
                              <span className="text-sm text-gray-900">{cat.categoryName}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <img
                                src={getImageUrl(cat.image)}
                                alt={cat.categoryName}
                                className="w-12 h-12 object-cover rounded"
                                onError={handleCategoryImageError}
                              />
                              {editingCategoryId === cat._id && (
                                <div className="space-y-2">
                                  <input
                                    id={`category-image-edit-${cat._id}`}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                                    onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                  <button
                                    onClick={() => updateCategoryImage(cat._id)}
                                    disabled={isCategoryImageUploading || !editCategoryImage}
                                    className={`px-3 py-1 text-xs rounded-md ${
                                      isCategoryImageUploading || !editCategoryImage
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    } text-white`}
                                  >
                                    {isCategoryImageUploading ? "Uploading..." : "Update Image"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {editingCategoryId === cat._id ? (
                                <>
                                  <button
                                    onClick={() => saveCategoryEdit(cat._id)}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                  >
                                    Save Name
                                  </button>
                                  <button
                                    onClick={cancelCategoryEdit}
                                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startCategoryEdit(cat)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteCategory(cat._id)}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">ID: {cat.categoryId}</div>
                          {editingCategoryId === cat._id ? (
                            <input
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div className="text-lg font-semibold text-gray-900">
                              {cat.categoryName}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {editingCategoryId === cat._id ? (
                            <>
                              <button
                                onClick={() => saveCategoryEdit(cat._id)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-md"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelCategoryEdit}
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-md"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startCategoryEdit(cat)}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCategory(cat._id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-md"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <img
                          src={getImageUrl(cat.image)}
                          alt={cat.categoryName}
                          className="w-16 h-16 object-cover rounded"
                          onError={handleCategoryImageError}
                        />
                        {editingCategoryId === cat._id && (
                          <div className="flex-1">
                            <input
                              id={`category-image-edit-${cat._id}`}
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                              onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
                              className="block w-full mb-2 text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700"
                            />
                            <button
                              onClick={() => updateCategoryImage(cat._id)}
                              disabled={isCategoryImageUploading || !editCategoryImage}
                              className={`w-full px-3 py-2 text-sm rounded-md ${
                                isCategoryImageUploading || !editCategoryImage
                                  ? "bg-blue-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              } text-white`}
                            >
                              {isCategoryImageUploading ? "Uploading..." : "Update Image"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Pagination */}
                {totalCategories > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                        Page {currentCategoryPage} of {categoryTotalPages}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => goToPage(1, 'category')}
                          disabled={currentCategoryPage === 1}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentCategoryPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          First
                        </button>
                        <button
                          onClick={() => goToPage(currentCategoryPage - 1, 'category')}
                          disabled={currentCategoryPage === 1}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentCategoryPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          Previous
                        </button>
                        {getPageNumbers(currentCategoryPage, categoryTotalPages).map((pageNum, index) => (
                          <button
                            key={index}
                            onClick={() => typeof pageNum === 'number' ? goToPage(pageNum, 'category') : null}
                            disabled={pageNum === '...'}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              pageNum === currentCategoryPage
                                ? "bg-blue-600 text-white"
                                : pageNum === '...'
                                ? "bg-white text-gray-700 cursor-default"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          onClick={() => goToPage(currentCategoryPage + 1, 'category')}
                          disabled={currentCategoryPage === categoryTotalPages}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentCategoryPage === categoryTotalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          Next
                        </button>
                        <button
                          onClick={() => goToPage(categoryTotalPages, 'category')}
                          disabled={currentCategoryPage === categoryTotalPages}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentCategoryPage === categoryTotalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          Last
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Sub-Category Tab Content */}
      {activeTab === "subcategory" && (
        <>
          {/* Add Sub-Category Card */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Sub-Category
            </h2>

            <form onSubmit={addSubCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category *
                </label>
                <select
                  required
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.categoryName} (ID: {c.categoryId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter sub-category name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category Image (Optional)
                </label>
                <input
                  id="subcat-image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                  onChange={(e) => setSubCategoryImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Accepted: JPG, PNG, GIF, WebP, SVG, BMP (Max 5MB)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubCategorySubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubCategorySubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {isSubCategorySubmitting ? "Adding..." : "Add Sub-Category"}
              </button>
            </form>
          </div>

          {/* Sub-Categories List Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Sub-Category List</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
                  <select
                    value={subCategoryItemsPerPage}
                    onChange={handleSubCategoryItemsPerPageChange}
                    className="block w-20 px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-sm text-gray-600 whitespace-nowrap">per page</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Showing {((currentSubCategoryPage - 1) * subCategoryItemsPerPage) + 1} to{" "}
                {Math.min(currentSubCategoryPage * subCategoryItemsPerPage, totalSubCategories)} of{" "}
                {totalSubCategories} sub-categories
              </p>
            </div>

            {isSubCategoryLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading sub-categories...</p>
              </div>
            ) : subCategories.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No sub-categories found. Add your first sub-category above.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sub-Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subCategories.map((s) => (
                        <tr key={s._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {s.subCategoryId}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editingSubCategoryId === s._id ? (
                              <input
                                value={editSubCategoryName}
                                onChange={(e) => setEditSubCategoryName(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                autoFocus
                              />
                            ) : (
                              <span className="text-sm text-gray-900">{s.subCategoryName}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {getCategoryName(s.categoryId)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              {s.image && (
                                <img
                                  src={getImageUrl(s.image)}
                                  alt={s.subCategoryName}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={handleCategoryImageError}
                                />
                              )}
                              {editingSubCategoryId === s._id && (
                                <div className="space-y-2">
                                  <input
                                    id={`subcategory-image-edit-${s._id}`}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                                    onChange={(e) => setEditSubCategoryImage(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                  />
                                  <button
                                    onClick={() => updateSubCategoryImage(s._id)}
                                    disabled={isSubCategoryImageUploading || !editSubCategoryImage}
                                    className={`px-3 py-1 text-xs rounded-md ${
                                      isSubCategoryImageUploading || !editSubCategoryImage
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                    } text-white`}
                                  >
                                    {isSubCategoryImageUploading ? "Uploading..." : "Update Image"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {editingSubCategoryId === s._id ? (
                                <>
                                  <button
                                    onClick={() => saveSubCategoryEdit(s._id)}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                  >
                                    Save Name
                                  </button>
                                  <button
                                    onClick={cancelSubCategoryEdit}
                                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startSubCategoryEdit(s)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteSubCategory(s._id)}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4">
                  {subCategories.map((s) => (
                    <div
                      key={s._id}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">ID: {s.subCategoryId}</div>
                          {editingSubCategoryId === s._id ? (
                            <input
                              value={editSubCategoryName}
                              onChange={(e) => setEditSubCategoryName(e.target.value)}
                              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              autoFocus
                            />
                          ) : (
                            <div className="text-lg font-semibold text-gray-900">
                              {s.subCategoryName}
                            </div>
                          )}
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {getCategoryName(s.categoryId)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {editingSubCategoryId === s._id ? (
                            <>
                              <button
                                onClick={() => saveSubCategoryEdit(s._id)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-md"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelSubCategoryEdit}
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-md"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startSubCategoryEdit(s)}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteSubCategory(s._id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-md"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {s.image && (
                          <img
                            src={getImageUrl(s.image)}
                            alt={s.subCategoryName}
                            className="w-16 h-16 object-cover rounded"
                            onError={handleCategoryImageError}
                          />
                        )}
                        {editingSubCategoryId === s._id && (
                          <div className="flex-1">
                            <input
                              id={`subcategory-image-edit-${s._id}`}
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                              onChange={(e) => setEditSubCategoryImage(e.target.files?.[0] || null)}
                              className="block w-full mb-2 text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700"
                            />
                            <button
                              onClick={() => updateSubCategoryImage(s._id)}
                              disabled={isSubCategoryImageUploading || !editSubCategoryImage}
                              className={`w-full px-3 py-2 text-sm rounded-md ${
                                isSubCategoryImageUploading || !editSubCategoryImage
                                  ? "bg-green-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              } text-white`}
                            >
                              {isSubCategoryImageUploading ? "Uploading..." : "Update Image"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-Category Pagination */}
                {totalSubCategories > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                        Page {currentSubCategoryPage} of {subCategoryTotalPages}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => goToPage(1, 'subcategory')}
                          disabled={currentSubCategoryPage === 1}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentSubCategoryPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          First
                        </button>
                        <button
                          onClick={() => goToPage(currentSubCategoryPage - 1, 'subcategory')}
                          disabled={currentSubCategoryPage === 1}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentSubCategoryPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          Previous
                        </button>
                        {getPageNumbers(currentSubCategoryPage, subCategoryTotalPages).map((pageNum, index) => (
                          <button
                            key={index}
                            onClick={() => typeof pageNum === 'number' ? goToPage(pageNum, 'subcategory') : null}
                            disabled={pageNum === '...'}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              pageNum === currentSubCategoryPage
                                ? "bg-green-600 text-white"
                                : pageNum === '...'
                                ? "bg-white text-gray-700 cursor-default"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          onClick={() => goToPage(currentSubCategoryPage + 1, 'subcategory')}
                          disabled={currentSubCategoryPage === subCategoryTotalPages}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentSubCategoryPage === subCategoryTotalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          Next
                        </button>
                        <button
                          onClick={() => goToPage(subCategoryTotalPages, 'subcategory')}
                          disabled={currentSubCategoryPage === subCategoryTotalPages}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentSubCategoryPage === subCategoryTotalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          Last
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}













