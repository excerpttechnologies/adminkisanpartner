





// "use client";
// import { useEffect, useState } from "react";
// import SliderModal from "../../_components/SliderModal";
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Calendar,
//   Image as ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   Search,
//   Filter,
//   Eye
// } from "lucide-react";

// interface Slider {
//   _id: string;
//   name: string;
//   image: string;
//   createdAt: string;
// }

// export default function SliderPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(8);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [totalSliders, setTotalSliders] = useState(0);

//   const loadSliders = async (page: number = 1) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/slider`);
//       if (!res.ok) throw new Error("Failed to fetch sliders");
//       const data = await res.json();
      
//       // For now, simulate pagination on client side since API doesn't support it
//       const startIndex = (page - 1) * limit;
//       const endIndex = startIndex + limit;
//       const paginatedSliders = data.slice(startIndex, endIndex);
      
//       setSliders(paginatedSliders);
//       setTotalSliders(data.length);
//       setTotalPages(Math.ceil(data.length / limit));
//       setCurrentPage(page);
//     } catch (error) {
//       console.error("Failed to load sliders:", error);
//       alert("Failed to load sliders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadSliders(1);
//   }, []);

//   // Filter sliders based on search term
//   const filteredSliders = sliders.filter(slider =>
//     slider.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddSlider = async (name: string, imageFile: File) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("image", imageFile);

//       const res = await fetch("/api/slider", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         alert(`Failed to add slider: ${error.error}`);
//         return;
//       }

//       setOpen(false);
//       loadSliders(1);
//     } catch (error) {
//       console.error("Add slider error:", error);
//       alert("Failed to add slider");
//     }
//   };

//   const handleUpdateSlider = async (id: string, name: string, imageFile: File | null) => {
//     try {
//       const formData = new FormData();
//       formData.append("id", id);
//       formData.append("name", name);
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       const res = await fetch("/api/slider", {
//         method: "PUT",
//         body: formData,
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         alert(`Failed to update slider: ${error.error}`);
//         return;
//       }

//       setEditingSlider(null);
//       loadSliders(currentPage);
//     } catch (error) {
//       console.error("Update slider error:", error);
//       alert("Failed to update slider");
//     }
//   };

//   const handleDeleteSlider = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this slider?")) {
//       return;
//     }

//     try {
//       const res = await fetch("/api/slider", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         alert(`Failed to delete slider: ${error.error}`);
//         return;
//       }

//       if (sliders.length === 1 && currentPage > 1) {
//         loadSliders(currentPage - 1);
//       } else {
//         loadSliders(currentPage);
//       }
//     } catch (error) {
//       console.error("Delete slider error:", error);
//       alert("Failed to delete slider");
//     }
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       loadSliders(page);
//     }
//   };

//   const renderPagination = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
//           style={paginationBtn}
//         >
//           {i}
//         </button>
//       );
//     }

//     return (
//       <div style={paginationContainer}>
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           style={paginationArrow}
//         >
//           <ChevronLeft size={20} />
//         </button>
        
//         {startPage > 1 && (
//           <>
//             <button
//               onClick={() => handlePageChange(1)}
//               style={paginationBtn}
//             >
//               1
//             </button>
//             {startPage > 2 && <span style={ellipsis}>...</span>}
//           </>
//         )}
        
//         {pages}
        
//         {endPage < totalPages && (
//           <>
//             {endPage < totalPages - 1 && <span style={ellipsis}>...</span>}
//             <button
//               onClick={() => handlePageChange(totalPages)}
//               style={paginationBtn}
//             >
//               {totalPages}
//             </button>
//           </>
//         )}
        
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           style={paginationArrow}
//         >
//           <ChevronRight size={20} />
//         </button>
//       </div>
//     );
//   };

//   if (loading && sliders.length === 0) {
//     return (
//       <div style={loadingContainer}>
//         <Loader2 size={40} className="spinner" />
//         <p>Loading sliders...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={container}>
//       {/* Header Section */}
//       <div style={header}>
//         <div>
//           <h1 style={title}>Slider Management</h1>
//           <p style={subtitle}>Manage your website sliders and banners. {totalSliders} sliders found.</p>
//         </div>
//         <button
//           onClick={() => setOpen(true)}
//           style={addButton}
//         >
//           <Plus size={20} />
//           Add New Slider
//         </button>
//       </div>

//       {/* Search and Filter Section */}
//       <div style={searchSection}>
//         <div style={searchBox}>
//           <Search size={20} style={{ color: "#6b7280" }} />
//           <input
//             type="text"
//             placeholder="Search by slider name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={searchInput}
//           />
//         </div>
//         <div style={filterButtons}>
//           <button style={filterBtn}>
//             <Filter size={16} />
//             Filter
//           </button>
//           <button style={resetBtn} onClick={() => setSearchTerm("")}>
//             Reset
//           </button>
//           <button style={applyBtn}>
//             Apply
//           </button>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div style={tableContainer}>
//         {filteredSliders.length === 0 ? (
//           <div style={emptyState}>
//             <ImageIcon size={80} style={{ color: "#6b7280", marginBottom: 20 }} />
//             <h3 style={emptyTitle}>No sliders found</h3>
//             <p style={emptyText}>Get started by adding your first slider</p>
//             <button
//               onClick={() => setOpen(true)}
//               style={emptyButton}
//             >
//               <Plus size={20} />
//               Add First Slider
//             </button>
//           </div>
//         ) : (
//           <>
//             <table style={table}>
//               <thead>
//                 <tr style={tableHeader}>
//                   <th style={tableHeaderCell}>Sr.</th>
//                   <th style={tableHeaderCell}>Slider Details</th>
//                   <th style={tableHeaderCell}>Image Preview</th>
//                   <th style={tableHeaderCell}>Created Date</th>
//                   <th style={tableHeaderCell}>Edit</th>
//                   <th style={tableHeaderCell}>Delete</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSliders.map((slider, index) => (
//                   <tr key={slider._id} style={tableRow}>
//                     <td style={tableCell}>
//                       <div style={srNumber}>
//                         {((currentPage - 1) * limit) + index + 1}
//                       </div>
//                     </td>
//                     <td style={tableCell}>
//                       <div style={sliderDetails}>
//                         <div style={sliderName}>
//                           <strong>{slider.name}</strong>
//                         </div>
//                         <div style={sliderInfo}>
//                           <span style={infoItem}>
//                             <ImageIcon size={14} />
//                             Slider Image
//                           </span>
//                         </div>
//                         <div style={sliderPath}>
//                           <code style={pathText}>{slider.image}</code>
//                         </div>
//                       </div>
//                     </td>
//                     <td style={tableCell}>
//                       <div style={imagePreviewContainer}>
//                         <img 
//                           src={slider.image} 
//                           alt={slider.name} 
//                           style={previewImage}
//                         />
//                         <button 
//                           style={viewImageBtn}
//                           onClick={() => window.open(slider.image, '_blank')}
//                         >
//                           <Eye size={16} />
//                           View
//                         </button>
//                       </div>
//                     </td>
//                     <td style={tableCell}>
//                       <div style={dateContainer}>
//                         <Calendar size={14} style={{ color: "#6b7280" }} />
//                         <span style={dateText}>
//                           {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </span>
//                       </div>
//                     </td>
//                     {/* <td style={tableCell}>
//                       <span style={activeStatus}>
//                         <Eye size={14} />
//                         Active
//                       </span>
//                     </td> */}
//                     <td style={tableCell}>
//                       <div style={actionButtons}>
//                         <button
//                           onClick={() => setEditingSlider(slider)}
//                           style={editTableBtn}
//                         >
//                           <Edit2 size={16} />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteSlider(slider._id)}
//                           style={deleteTableBtn}
//                         >
//                           <Trash2 size={16} />
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div style={paginationSection}>
//                 <div style={paginationInfo}>
//                   Showing <strong>{(currentPage - 1) * limit + 1}</strong> to{" "}
//                   <strong>{Math.min(currentPage * limit, totalSliders)}</strong> of{" "}
//                   <strong>{totalSliders}</strong> sliders
//                 </div>
//                 {renderPagination()}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Modals */}
//       {open && (
//         <SliderModal
//           onClose={() => setOpen(false)}
//           onSave={(name: string, imageFile: File | null) => {
//             if (imageFile) {
//               handleAddSlider(name, imageFile);
//             }
//           }}
//           title="Add New Slider"
//         />
//       )}

//       {editingSlider && (
//         <SliderModal
//           onClose={() => setEditingSlider(null)}
//           onSave={(name: string, imageFile: File | null) =>
//             handleUpdateSlider(editingSlider._id, name, imageFile)
//           }
//           slider={editingSlider}
//           title="Edit Slider"
//         />
//       )}
//     </div>
//   );
// }

// // Styles
// const container: React.CSSProperties = {
//   padding: "24px",
//   maxWidth: "1440px",
//   margin: "0 auto",
//   minHeight: "100vh",
//   background: "#f8f9fa"
// };

// const header: React.CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "flex-start",
//   marginBottom: "24px",
//   flexWrap: "wrap",
//   gap: "16px"
// };

// const title: React.CSSProperties = {
//   fontSize: "24px",
//   fontWeight: "700",
//   color: "#1f2937",
//   marginBottom: "4px"
// };

// const subtitle: React.CSSProperties = {
//   fontSize: "14px",
//   color: "#6b7280",
//   margin: 0
// };

// const addButton: React.CSSProperties = {
//   padding: "10px 20px",
//   background: "#2563eb",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   fontWeight: "500",
//   fontSize: "14px",
//   transition: "all 0.2s ease"
// };

// const searchSection: React.CSSProperties = {
//   background: "white",
//   padding: "16px",
//   borderRadius: "8px",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//   marginBottom: "20px",
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "12px",
//   alignItems: "center",
//   justifyContent: "space-between"
// };

// const searchBox: React.CSSProperties = {
//   flex: 1,
//   minWidth: "300px",
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   padding: "10px 12px",
//   border: "1px solid #e5e7eb",
//   borderRadius: "6px",
//   background: "#f9fafb"
// };

// const searchInput: React.CSSProperties = {
//   flex: 1,
//   border: "none",
//   background: "transparent",
//   outline: "none",
//   fontSize: "14px",
//   color: "#1f2937"
// };

// const filterButtons: React.CSSProperties = {
//   display: "flex",
//   gap: "8px",
//   flexWrap: "wrap"
// };

// const filterBtn: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "#f3f4f6",
//   color: "#374151",
//   border: "1px solid #d1d5db",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: "500",
//   display: "flex",
//   alignItems: "center",
//   gap: "6px",
//   transition: "all 0.2s ease"
// };

// const resetBtn: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "white",
//   color: "#dc2626",
//   border: "1px solid #dc2626",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: "500",
//   transition: "all 0.2s ease"
// };

// const applyBtn: React.CSSProperties = {
//   padding: "8px 20px",
//   background: "#2563eb",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: "500",
//   transition: "all 0.2s ease"
// };

// const tableContainer: React.CSSProperties = {
//   background: "white",
//   borderRadius: "8px",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//   overflow: "hidden"
// };

// const table: React.CSSProperties = {
//   width: "100%",
//   borderCollapse: "collapse",
//   tableLayout: "fixed"
// };

// const tableHeader: React.CSSProperties = {
//   background: "#f9fafb",
//   borderBottom: "2px solid #e5e7eb"
// };

// const tableHeaderCell: React.CSSProperties = {
//   padding: "16px 12px",
//   textAlign: "left",
//   fontSize: "12px",
//   fontWeight: "600",
//   color: "#6b7280",
//   textTransform: "uppercase",
//   letterSpacing: "0.05em",
//   borderBottom: "1px solid #e5e7eb"
// };

// const tableRow: React.CSSProperties = {
//   borderBottom: "1px solid #f3f4f6"
// };

// const tableCell: React.CSSProperties = {
//   padding: "16px 12px",
//   verticalAlign: "top"
// };

// const srNumber: React.CSSProperties = {
//   width: "40px",
//   height: "40px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "#f3f4f6",
//   borderRadius: "6px",
//   fontSize: "14px",
//   fontWeight: "600",
//   color: "#374151"
// };

// const sliderDetails: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "8px"
// };

// const sliderName: React.CSSProperties = {
//   fontSize: "15px",
//   fontWeight: "600",
//   color: "#111827"
// };

// const sliderInfo: React.CSSProperties = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "12px",
//   fontSize: "13px",
//   color: "#6b7280"
// };

// const infoItem: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "4px"
// };

// const sliderPath: React.CSSProperties = {
//   marginTop: "4px"
// };

// const pathText: React.CSSProperties = {
//   fontSize: "12px",
//   color: "#9ca3af",
//   background: "#f3f4f6",
//   padding: "4px 8px",
//   borderRadius: "4px",
//   fontFamily: "monospace"
// };

// const imagePreviewContainer: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   gap: "8px"
// };

// const previewImage: React.CSSProperties = {
//   width: "80px",
//   height: "60px",
//   objectFit: "cover",
//   borderRadius: "6px",
//   border: "1px solid #e5e7eb"
// };

// const viewImageBtn: React.CSSProperties = {
//   padding: "4px 12px",
//   background: "#f3f4f6",
//   color: "#374151",
//   border: "1px solid #d1d5db",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontSize: "12px",
//   display: "flex",
//   alignItems: "center",
//   gap: "4px",
//   transition: "all 0.2s ease"
// };

// const dateContainer: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "8px"
// };

// const dateText: React.CSSProperties = {
//   fontSize: "14px",
//   color: "#374151"
// };

// const activeStatus: React.CSSProperties = {
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "6px",
//   padding: "6px 12px",
//   background: "#d1fae5",
//   color: "#065f46",
//   borderRadius: "20px",
//   fontSize: "13px",
//   fontWeight: "500"
// };

// const actionButtons: React.CSSProperties = {
//   display: "flex",
//   gap: "8px"
// };

// const editTableBtn: React.CSSProperties = {
//   padding: "6px 12px",
//   background: "#dbeafe",
//   color: "#1e40af",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontSize: "13px",
//   fontWeight: "500",
//   display: "flex",
//   alignItems: "center",
//   gap: "4px",
//   transition: "all 0.2s ease"
// };

// const deleteTableBtn: React.CSSProperties = {
//   padding: "6px 12px",
//   background: "#fee2e2",
//   color: "#dc2626",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontSize: "13px",
//   fontWeight: "500",
//   display: "flex",
//   alignItems: "center",
//   gap: "4px",
//   transition: "all 0.2s ease"
// };

// const paginationSection: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   gap: "16px",
//   padding: "20px",
//   background: "#f9fafb",
//   borderTop: "1px solid #e5e7eb"
// };

// const paginationInfo: React.CSSProperties = {
//   fontSize: "14px",
//   color: "#6b7280",
//   textAlign: "center"
// };

// const paginationContainer: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "4px"
// };

// const paginationBtn: React.CSSProperties = {
//   padding: "8px 12px",
//   background: "white",
//   color: "#4b5563",
//   border: "1px solid #d1d5db",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   minWidth: "40px",
//   transition: "all 0.2s ease"
// };

// const paginationArrow: React.CSSProperties = {
//   padding: "8px",
//   background: "white",
//   color: "#4b5563",
//   border: "1px solid #d1d5db",
//   borderRadius: "6px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   transition: "all 0.2s ease"
// };

// const ellipsis: React.CSSProperties = {
//   padding: "8px 4px",
//   color: "#9ca3af",
//   userSelect: "none"
// };

// const emptyState: React.CSSProperties = {
//   textAlign: "center",
//   padding: "60px 20px",
//   background: "white",
// };

// const emptyTitle: React.CSSProperties = {
//   fontSize: "18px",
//   fontWeight: "600",
//   color: "#111827",
//   marginBottom: "8px"
// };

// const emptyText: React.CSSProperties = {
//   fontSize: "14px",
//   color: "#6b7280",
//   marginBottom: "24px"
// };

// const emptyButton: React.CSSProperties = {
//   padding: "10px 20px",
//   background: "#2563eb",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "8px",
//   fontWeight: "500",
//   fontSize: "14px",
//   transition: "all 0.2s ease"
// };

// const loadingContainer: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   minHeight: "400px",
//   gap: "16px",
//   color: "#6b7280"
// };




























"use client";
import { useEffect, useState } from "react";
import SliderModal from "../../_components/SliderModal";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  Eye,
  Tag
} from "lucide-react";

interface Slider {
  _id: string;
  name: string;
  image: string;
  role: string;
  createdAt: string;
}

export default function SliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSliders, setTotalSliders] = useState(0);

  const loadSliders = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/slider`);
      if (!res.ok) throw new Error("Failed to fetch sliders");
      const data = await res.json();
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSliders = data.slice(startIndex, endIndex);
      
      setSliders(paginatedSliders);
      setTotalSliders(data.length);
      setTotalPages(Math.ceil(data.length / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load sliders:", error);
      alert("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSliders(1);
  }, []);

  const filteredSliders = sliders.filter(slider =>
    slider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (slider.role && slider.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSlider = async (name: string, role: string, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("image", imageFile);

      const res = await fetch("/api/slider", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to add slider: ${error.error}`);
        return;
      }

      setOpen(false);
      loadSliders(1);
    } catch (error) {
      console.error("Add slider error:", error);
      alert("Failed to add slider");
    }
  };

  const handleUpdateSlider = async (id: string, name: string, role: string, imageFile: File | null) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("role", role);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/slider", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to update slider: ${error.error}`);
        return;
      }

      setEditingSlider(null);
      loadSliders(currentPage);
    } catch (error) {
      console.error("Update slider error:", error);
      alert("Failed to update slider");
    }
  };

  const handleDeleteSlider = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) {
      return;
    }

    try {
      const res = await fetch("/api/slider", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to delete slider: ${error.error}`);
        return;
      }

      if (sliders.length === 1 && currentPage > 1) {
        loadSliders(currentPage - 1);
      } else {
        loadSliders(currentPage);
      }
    } catch (error) {
      console.error("Delete slider error:", error);
      alert("Failed to delete slider");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadSliders(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          style={paginationBtn}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={paginationContainer}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationArrow}
        >
          <ChevronLeft size={20} />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              style={paginationBtn}
            >
              1
            </button>
            {startPage > 2 && <span style={ellipsis}>...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={ellipsis}>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              style={paginationBtn}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationArrow}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  if (loading && sliders.length === 0) {
    return (
      <div style={loadingContainer}>
        <Loader2 size={40} className="spinner" />
        <p>Loading sliders...</p>
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={title}>Slider Management</h1>
          <p style={subtitle}>Manage your website sliders and banners. {totalSliders} sliders found.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={addButton}
        >
          <Plus size={20} />
          Add New Slider
        </button>
      </div>

      <div style={searchSection}>
        <div style={searchBox}>
          <Search size={20} style={{ color: "#6b7280" }} />
          <input
            type="text"
            placeholder="Search by slider name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
        </div>
        <div style={filterButtons}>
          <button style={filterBtn}>
            <Filter size={16} />
            Filter
          </button>
          <button style={resetBtn} onClick={() => setSearchTerm("")}>
            Reset
          </button>
          <button style={applyBtn}>
            Apply
          </button>
        </div>
      </div>

      <div style={tableContainer}>
        {filteredSliders.length === 0 ? (
          <div style={emptyState}>
            <ImageIcon size={80} style={{ color: "#6b7280", marginBottom: 20 }} />
            <h3 style={emptyTitle}>No sliders found</h3>
            <p style={emptyText}>Get started by adding your first slider</p>
            <button
              onClick={() => setOpen(true)}
              style={emptyButton}
            >
              <Plus size={20} />
              Add First Slider
            </button>
          </div>
        ) : (
          <>
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr style={tableHeader}>
                    <th style={tableHeaderCell}>Sr.</th>
                    <th style={tableHeaderCell}>Slider Name</th>
                    <th style={tableHeaderCell}>Role</th>
                    <th style={tableHeaderCell}>Image Preview</th>
                    <th style={tableHeaderCell}>Created Date</th>
                    <th style={tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSliders.map((slider, index) => (
                    <tr key={slider._id} style={tableRow}>
                      <td style={tableCell}>
                        <div style={srNumber}>
                          {((currentPage - 1) * limit) + index + 1}
                        </div>
                      </td>
                      <td style={tableCell}>
                        <div style={sliderDetails}>
                          <div style={sliderName}>
                            <strong>{slider.name}</strong>
                          </div>
                          <div style={sliderInfo}>
                            <span style={infoItem}>
                              
                            
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={tableCell}>
                        <div style={roleContainer}>
                          <span style={roleText}>
                            {slider.role || ""}
                          </span>
                        </div>
                      </td>
                      <td style={tableCell}>
                        <div style={imagePreviewContainer}>
                          <img 
                            src={slider.image} 
                            alt={slider.name} 
                            style={previewImage}
                          />
                          <button 
                            style={viewImageBtn}
                            onClick={() => window.open(slider.image, '_blank')}
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </div>
                      </td>
                      <td style={tableCell}>
                        <div style={dateContainer}>
                          <Calendar size={14} style={{ color: "#6b7280" }} />
                          <span style={dateText}>
                            {new Date(slider.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td style={tableCell}>
                        <div style={actionButtons}>
                          <button
                            onClick={() => setEditingSlider(slider)}
                            style={editTableBtn}
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlider(slider._id)}
                            style={deleteTableBtn}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={paginationSection}>
                <div style={paginationInfo}>
                  Showing <strong>{(currentPage - 1) * limit + 1}</strong> to{" "}
                  <strong>{Math.min(currentPage * limit, totalSliders)}</strong> of{" "}
                  <strong>{totalSliders}</strong> sliders
                </div>
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>

      {open && (
        <SliderModal
          onClose={() => setOpen(false)}
          onSave={(name: string, role: string, imageFile: File | null) => {
            if (imageFile) {
              handleAddSlider(name, role, imageFile);
            }
          }}
          title="Add New Slider"
        />
      )}

      {editingSlider && (
        <SliderModal
          onClose={() => setEditingSlider(null)}
          onSave={(name: string, role: string, imageFile: File | null) =>
            handleUpdateSlider(editingSlider._id, name, role, imageFile)
          }
          slider={editingSlider}
          title="Edit Slider"
        />
      )}
    </div>
  );
}

// Styles
const container: React.CSSProperties = {
  padding: "24px",
  maxWidth: "1440px",
  margin: "0 auto",
  minHeight: "100vh",
  background: "#f8f9fa"
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "16px"
};

const title: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "4px"
};

const subtitle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  margin: 0
};

const addButton: React.CSSProperties = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "500",
  fontSize: "14px",
  transition: "all 0.2s ease"
};

const searchSection: React.CSSProperties = {
  background: "white",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  justifyContent: "space-between"
};

const searchBox: React.CSSProperties = {
  flex: 1,
  minWidth: "300px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  background: "#f9fafb"
};

const searchInput: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: "14px",
  color: "#1f2937"
};

const filterButtons: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap"
};

const filterBtn: React.CSSProperties = {
  padding: "8px 16px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.2s ease"
};

const resetBtn: React.CSSProperties = {
  padding: "8px 16px",
  background: "white",
  color: "#dc2626",
  border: "1px solid #dc2626",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease"
};

const applyBtn: React.CSSProperties = {
  padding: "8px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease"
};

const tableContainer: React.CSSProperties = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  overflow: "hidden"
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto"
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1000px"
};

const tableHeader: React.CSSProperties = {
  background: "#f9fafb",
  borderBottom: "2px solid #e5e7eb"
};

const tableHeaderCell: React.CSSProperties = {
  padding: "16px 12px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid #e5e7eb"
};

const tableRow: React.CSSProperties = {
  borderBottom: "1px solid #f3f4f6"
};

const tableCell: React.CSSProperties = {
  padding: "16px 12px",
  verticalAlign: "top"
};

const srNumber: React.CSSProperties = {
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f3f4f6",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151"
};

const sliderDetails: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const sliderName: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#111827"
};

const sliderInfo: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  fontSize: "13px",
  color: "#6b7280"
};

const infoItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px"
};

const roleContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // padding: "8px 12px",
  // background: "#246a98",
  borderRadius: "6px",
  // border: "1px solid #e0f2fe",
fontWeight:"bold",

  
};

const roleText: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#090020",

};

const imagePreviewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px"
};

const previewImage: React.CSSProperties = {
  width: "80px",
  height: "60px",
  objectFit: "cover",
  borderRadius: "6px",
  border: "1px solid #e5e7eb"
};

const viewImageBtn: React.CSSProperties = {
  padding: "4px 12px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease"
};

const dateContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const dateText: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151"
};

const actionButtons: React.CSSProperties = {
  display: "flex",
  gap: "8px"
};

const editTableBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#dbeafe",
  color: "#1e40af",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease"
};

const deleteTableBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fee2e2",
  color: "#dc2626",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease"
};

const paginationSection: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  padding: "20px",
  background: "#f9fafb",
  borderTop: "1px solid #e5e7eb"
};

const paginationInfo: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  textAlign: "center"
};

const paginationContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px"
};

const paginationBtn: React.CSSProperties = {
  padding: "8px 12px",
  background: "white",
  color: "#4b5563",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  minWidth: "40px",
  transition: "all 0.2s ease"
};

const paginationArrow: React.CSSProperties = {
  padding: "8px",
  background: "white",
  color: "#4b5563",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease"
};

const ellipsis: React.CSSProperties = {
  padding: "8px 4px",
  color: "#9ca3af",
  userSelect: "none"
};

const emptyState: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
};

const emptyTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "8px"
};

const emptyText: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "24px"
};

const emptyButton: React.CSSProperties = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "500",
  fontSize: "14px",
  transition: "all 0.2s ease"
};

const loadingContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
  gap: "16px",
  color: "#6b7280"
};
