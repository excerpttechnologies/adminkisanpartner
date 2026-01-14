




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
//   Eye,
//   Tag
// } from "lucide-react";

// interface Slider {
//   _id: string;
//   name: string;
//   image: string;
//   role: string;
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

//   const filteredSliders = sliders.filter(slider =>
//     slider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (slider.role && slider.role.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const handleAddSlider = async (name: string, role: string, imageFile: File) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("role", role);
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

//   const handleUpdateSlider = async (id: string, name: string, role: string, imageFile: File | null) => {
//     try {
//       const formData = new FormData();
//       formData.append("id", id);
//       formData.append("name", name);
//       formData.append("role", role);
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

//       <div style={searchSection}>
//         <div style={searchBox}>
//           <Search size={20} style={{ color: "#6b7280" }} />
//           <input
//             type="text"
//             placeholder="Search by slider name or role..."
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
//             <div style={tableWrapper}>
//               <table style={table}>
//                 <thead>
//                   <tr style={tableHeader}>
//                     <th style={tableHeaderCell}>Sr.</th>
//                     <th style={tableHeaderCell}>Slider Name</th>
//                     <th style={tableHeaderCell}>Role</th>
//                     <th style={tableHeaderCell}>Image Preview</th>
//                     <th style={tableHeaderCell}>Created Date</th>
//                     <th style={tableHeaderCell}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSliders.map((slider, index) => (
//                     <tr key={slider._id} style={tableRow}>
//                       <td style={tableCell}>
//                         <div style={srNumber}>
//                           {((currentPage - 1) * limit) + index + 1}
//                         </div>
//                       </td>
//                       <td style={tableCell}>
//                         <div style={sliderDetails}>
//                           <div style={sliderName}>
//                             <strong>{slider.name}</strong>
//                           </div>
//                           <div style={sliderInfo}>
//                             <span style={infoItem}>
                              
                            
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td style={tableCell}>
//                         <div style={roleContainer}>
//                           <span style={roleText}>
//                             {slider.role || ""}
//                           </span>
//                         </div>
//                       </td>
//                       <td style={tableCell}>
//                         <div style={imagePreviewContainer}>
//                           <img 
//                             src={slider.image} 
//                             alt={slider.name} 
//                             style={previewImage}
//                           />
//                           <button 
//                             style={viewImageBtn}
//                             onClick={() => window.open(slider.image, '_blank')}
//                           >
//                             <Eye size={16} />
//                             View
//                           </button>
//                         </div>
//                       </td>
//                       <td style={tableCell}>
//                         <div style={dateContainer}>
//                           <Calendar size={14} style={{ color: "#6b7280" }} />
//                           <span style={dateText}>
//                             {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'short',
//                               day: 'numeric'
//                             })}
//                           </span>
//                         </div>
//                       </td>
//                       <td style={tableCell}>
//                         <div style={actionButtons}>
//                           <button
//                             onClick={() => setEditingSlider(slider)}
//                             style={editTableBtn}
//                           >
//                             <Edit2 size={16} />
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteSlider(slider._id)}
//                             style={deleteTableBtn}
//                           >
//                             <Trash2 size={16} />
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

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

//       {open && (
//         <SliderModal
//           onClose={() => setOpen(false)}
//           onSave={(name: string, role: string, imageFile: File | null) => {
//             if (imageFile) {
//               handleAddSlider(name, role, imageFile);
//             }
//           }}
//           title="Add New Slider"
//         />
//       )}

//       {editingSlider && (
//         <SliderModal
//           onClose={() => setEditingSlider(null)}
//           onSave={(name: string, role: string, imageFile: File | null) =>
//             handleUpdateSlider(editingSlider._id, name, role, imageFile)
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

// const tableWrapper: React.CSSProperties = {
//   overflowX: "auto"
// };

// const table: React.CSSProperties = {
//   width: "100%",
//   borderCollapse: "collapse",
//   minWidth: "1000px"
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

// const roleContainer: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   // padding: "8px 12px",
//   // background: "#246a98",
//   borderRadius: "6px",
//   // border: "1px solid #e0f2fe",
// fontWeight:"bold",

  
// };

// const roleText: React.CSSProperties = {
//   fontSize: "14px",
//   fontWeight: "500",
//   color: "#090020",

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
  Search,
  Filter,
  Eye,
  Layers,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  AlertCircle
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
  const [filteredSliders, setFilteredSliders] = useState<Slider[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSliders, setTotalSliders] = useState(0);
  const [allSliders, setAllSliders] = useState<Slider[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const loadSliders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/slider`);
      if (!res.ok) throw new Error("Failed to fetch sliders");
      const data = await res.json();
      
      // Handle both array and object response formats
      const sliderData = data.data || data || [];
      setAllSliders(sliderData);
      setTotalSliders(sliderData.length);
      setSliders(sliderData);
      setFilteredSliders(sliderData);
      
      // Calculate initial pagination
      const newTotalPages = Math.ceil(sliderData.length / itemsPerPage);
      setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
      
    } catch (error) {
      console.error("Failed to load sliders:", error);
      alert("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSliders();
  }, []);

  // Filter sliders when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSliders(allSliders);
    } else {
      const filtered = allSliders.filter(slider =>
        slider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (slider.role && slider.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSliders(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, allSliders]);

  // Update pagination when filtered sliders or items per page changes
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredSliders.length / itemsPerPage);
    setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
    
    // Adjust current page if it's out of bounds
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (filteredSliders.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredSliders, itemsPerPage, currentPage]);

  // Get current page sliders
  const getCurrentPageSliders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSliders.slice(startIndex, endIndex);
  };

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
      loadSliders();
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
      loadSliders();
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

      loadSliders();
      // If we're on a page that becomes empty, go back one page
      if (getCurrentPageSliders().length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Delete slider error:", error);
      alert("Failed to delete slider");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedCard(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    setExpandedCard(null);
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setExpandedCard(null);
  };

  const handleRefresh = () => {
    loadSliders();
    setCurrentPage(1);
    setExpandedCard(null);
  };

  // Calculate pagination numbers
  const getPageNumbers = () => {
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

  const renderPagination = () => {
    const pageNumbers = getPageNumbers();
    const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
    const showingTo = Math.min(currentPage * itemsPerPage, filteredSliders.length);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={20}>20</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            Showing <strong>{filteredSliders.length > 0 ? showingFrom : 0}</strong> to{" "}
            <strong>{showingTo}</strong> of{" "}
            <strong>{filteredSliders.length}</strong> sliders
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${currentPage === 1 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100' 
                : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm bg-white'}`}
              title="First page"
            >
              «
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${currentPage === 1 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100' 
                : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm bg-white'}`}
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            {pageNumbers.map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={index} className="px-3 py-1 text-gray-500 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`px-3 py-1.5 min-w-9 text-sm rounded-md ${
                    pageNum === currentPage 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${currentPage === totalPages 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100' 
                : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm bg-white'}`}
              title="Next page"
            >
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${currentPage === totalPages 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100' 
                : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm bg-white'}`}
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && allSliders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading sliders...</p>
      </div>
    );
  }

  const currentSliders = getCurrentPageSliders();

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Slider Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your website sliders and banners • {filteredSliders.length} sliders found
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
          >
            <Plus size={20} />
            Add New Slider
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sliders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{allSliders.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Showing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredSliders.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPages}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by slider name or role..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button 
              onClick={handleResetFilters}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Reset
            </button>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slider
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSliders.map((slider, index) => (
                <tr key={slider._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {slider.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={slider.image}
                        alt={slider.name}
                        className="h-16 w-24 object-cover rounded border border-gray-200"
                      />
                      <button
                        onClick={() => window.open(slider.image, '_blank')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {slider.role || "No Role"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(slider.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSlider(slider)}
                        className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(slider.image, '_blank')}
                        className="text-green-600 hover:text-green-900 p-1.5 hover:bg-green-50 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlider(slider._id)}
                        className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination for Desktop */}
        {totalPages > 1 && renderPagination()}
        
        {/* Empty State for Desktop */}
        {currentSliders.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sliders found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm ? "No results match your search criteria. Try a different search term." : "Get started by adding your first slider."}
            </p>
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all mx-auto"
            >
              <Plus size={20} />
              Add First Slider
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="md:hidden">
        {/* Mobile Pagination Info */}
        {filteredSliders.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {currentSliders.map((slider, index) => (
            <div key={slider._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header - Always Visible */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{slider.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {slider.role || "No Role"}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(slider.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Preview (Always Visible) */}
                    <div className="mt-3">
                      <div className="relative overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={slider.image}
                          alt={slider.name}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          onClick={() => window.open(slider.image, '_blank')}
                          className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Full View
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleCardExpansion(slider._id)}
                    className="ml-2 p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedCard === slider._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard === slider._id && (
                <div className="p-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-500 mb-1">Slider ID</div>
                      <div className="font-medium truncate" title={slider._id}>
                        #{slider._id.slice(-8)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-500 mb-1">Serial No.</div>
                      <div className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-500 mb-1">Created Date</div>
                      <div className="font-medium">
                        {new Date(slider.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-500 mb-1">Status</div>
                      <div className="font-medium text-green-600">
                        Active
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setEditingSlider(slider)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSlider(slider._id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions - Always Visible */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => setEditingSlider(slider)}
                  className="flex-1 py-3 text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <div className="w-px bg-gray-100"></div>
                <button
                  onClick={() => window.open(slider.image, '_blank')}
                  className="flex-1 py-3 text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <div className="w-px bg-gray-100"></div>
                <button
                  onClick={() => handleDeleteSlider(slider._id)}
                  className="flex-1 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {/* Empty State for Mobile */}
          {currentSliders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sliders found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "No results match your search criteria." : "Get started by adding your first slider."}
              </p>
              <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all w-full"
              >
                <Plus size={20} />
                Add First Slider
              </button>
            </div>
          )}
        </div>

        {/* Mobile Pagination Controls */}
        {totalPages > 1 && filteredSliders.length > 0 && (
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col gap-3">
              <div className="text-center text-sm text-gray-600">
                Showing {Math.min(currentPage * itemsPerPage, filteredSliders.length)} of {filteredSliders.length} sliders
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={index} className="px-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md min-w-8 ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* Page jump */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  className="w-16 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredSliders.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Total Sliders</div>
              <div className="text-2xl font-bold text-gray-900">{allSliders.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Filtered</div>
              <div className="text-2xl font-bold text-blue-600">{filteredSliders.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Current Page</div>
              <div className="text-2xl font-bold text-green-600">{currentPage}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Total Pages</div>
              <div className="text-2xl font-bold text-purple-600">{totalPages}</div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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



