// "use client";
// import { useState, useEffect, useRef } from "react";

// interface SliderModalProps {
//   onClose: () => void;
//   onSave: (name: string, imageFile: File | null) => void;
//   slider?: {
//     _id: string;
//     name: string;
//     image: string;
//   };
//   title: string;
// }

// export default function SliderModal({ onClose, onSave, slider, title }: SliderModalProps) {
//   const [name, setName] = useState("");
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (slider) {
//       setName(slider.name);
//       setImagePreview(slider.image);
//     }
//   }, [slider]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file size (10MB limit)
//     if (file.size > 10 * 1024 * 1024) {
//       alert("Image must be less than 10MB");
//       return;
//     }

//     // Validate file type
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
//     if (!allowedTypes.includes(file.type)) {
//       alert("Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed");
//       return;
//     }

//     setImageFile(file);

//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setImageFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       alert("Please enter a name for the slider");
//       return;
//     }

//     if (!slider && !imageFile) {
//       alert("Please select an image");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await onSave(name, imageFile);
//     } catch (error) {
//       console.error("Error saving slider:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div style={overlay}>
//       <div style={modal}>
//         <div style={modalHeader}>
//           <h3 style={{ margin: 0 }}>{title}</h3>
//           <button onClick={onClose} style={closeButton}>
//             ×
//           </button>
//         </div>

//         <div style={modalBody}>
//           <div style={formGroup}>
//             <label style={label}>
//               Slider Name <span style={{ color: "#dc3545" }}>*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter slider name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               style={input}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div style={formGroup}>
//             <label style={label}>
//               Slider Image {!slider && <span style={{ color: "#dc3545" }}>*</span>}
//             </label>
//             {!imagePreview && !slider?.image && (
//               <div
//                 style={uploadArea}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
//                   onChange={handleImageChange}
//                   style={{ display: "none" }}
//                   disabled={isSubmitting}
//                 />
//                 <div style={{ fontSize: 48, color: "#666", marginBottom: 10 }}>📁</div>
//                 <p style={{ margin: "0 0 10px 0", color: "#333", fontWeight: "500" }}>
//                   Click to upload image
//                 </p>
//                 <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
//                   JPEG, JPG, PNG, GIF, WebP (Max 10MB)
//                 </p>
//               </div>
//             )}

//             {(imagePreview || slider?.image) && (
//               <div style={imagePreviewContainer}>
//                 <img
//                   src={imagePreview || slider?.image}
//                   alt="Preview"
//                   style={previewImage}
//                 />
//                 <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     style={replaceButton}
//                     disabled={isSubmitting}
//                   >
//                     Replace Image
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleRemoveImage}
//                     style={removeButton}
//                     disabled={isSubmitting}
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
//                   onChange={handleImageChange}
//                   style={{ display: "none" }}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={modalFooter}>
//           <button
//             onClick={handleSubmit}
//             style={saveButton}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span style={{ marginRight: 8 }}>⏳</span>
//                 {slider ? "Updating..." : "Saving..."}
//               </>
//             ) : slider ? (
//               "Update Slider"
//             ) : (
//               "Save Slider"
//             )}
//           </button>
//           <button
//             onClick={onClose}
//             style={cancelButton}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const overlay = {
//   position: "fixed" as const,
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
//   padding: 20,
// };

// const modal = {
//   backgroundColor: "#fff",
//   borderRadius: 8,
//   width: "100%",
//   maxWidth: 500,
//   maxHeight: "90vh",
//   overflow: "auto",
//   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
// };

// const modalHeader = {
//   padding: "20px",
//   borderBottom: "1px solid #e0e0e0",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// };

// const closeButton = {
//   background: "none",
//   border: "none",
//   fontSize: "24px",
//   cursor: "pointer",
//   color: "#666",
//   padding: 0,
//   width: 30,
//   height: 30,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: "50%",
//   ":hover": {
//     backgroundColor: "#f5f5f5",
//   },
// };

// const modalBody = {
//   padding: "20px",
// };

// const modalFooter = {
//   padding: "20px",
//   borderTop: "1px solid #e0e0e0",
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: 10,
// };

// const formGroup = {
//   marginBottom: 20,
// };

// const label = {
//   display: "block",
//   marginBottom: 8,
//   fontWeight: "500" as const,
//   color: "#333",
//   fontSize: 14,
// };

// const input = {
//   width: "100%",
//   padding: "10px 12px",
//   border: "1px solid #ddd",
//   borderRadius: 4,
//   fontSize: 14,
//   boxSizing: "border-box" as const,
//   ":focus": {
//     outline: "none",
//     borderColor: "#0070f3",
//     boxShadow: "0 0 0 2px rgba(0, 112, 243, 0.1)",
//   },
//   ":disabled": {
//     backgroundColor: "#f5f5f5",
//     cursor: "not-allowed",
//   },
// };

// const uploadArea = {
//   border: "2px dashed #ddd",
//   borderRadius: 8,
//   padding: "40px 20px",
//   textAlign: "center" as const,
//   cursor: "pointer",
//   transition: "all 0.2s",
//   backgroundColor: "#fafafa",
//   ":hover": {
//     borderColor: "#0070f3",
//     backgroundColor: "#f0f7ff",
//   },
// };

// const imagePreviewContainer = {
//   textAlign: "center" as const,
// };

// const previewImage = {
//   maxWidth: "100%",
//   maxHeight: 200,
//   borderRadius: 6,
//   border: "1px solid #e0e0e0",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// };

// const replaceButton = {
//   padding: "8px 16px",
//   backgroundColor: "#6c757d",
//   color: "#fff",
//   border: "none",
//   borderRadius: 4,
//   cursor: "pointer",
//   fontSize: 14,
//   fontWeight: "500" as const,
//   transition: "background-color 0.2s",
//   ":hover": {
//     backgroundColor: "#5a6268",
//   },
//   ":disabled": {
//     backgroundColor: "#c6c7c8",
//     cursor: "not-allowed",
//   },
// };

// const removeButton = {
//   padding: "8px 16px",
//   backgroundColor: "transparent",
//   color: "#dc3545",
//   border: "1px solid #dc3545",
//   borderRadius: 4,
//   cursor: "pointer",
//   fontSize: 14,
//   fontWeight: "500" as const,
//   transition: "all 0.2s",
//   ":hover": {
//     backgroundColor: "#dc3545",
//     color: "#fff",
//   },
//   ":disabled": {
//     opacity: 0.6,
//     cursor: "not-allowed",
//   },
// };

// const saveButton = {
//   padding: "10px 20px",
//   backgroundColor: "#28a745",
//   color: "#fff",
//   border: "none",
//   borderRadius: 4,
//   cursor: "pointer",
//   fontSize: 14,
//   fontWeight: "500" as const,
//   minWidth: 120,
//   transition: "background-color 0.2s",
//   ":hover": {
//     backgroundColor: "#218838",
//   },
//   ":disabled": {
//     backgroundColor: "#94d3a2",
//     cursor: "not-allowed",
//   },
// };

// const cancelButton = {
//   padding: "10px 20px",
//   backgroundColor: "transparent",
//   color: "#666",
//   border: "1px solid #ddd",
//   borderRadius: 4,
//   cursor: "pointer",
//   fontSize: 14,
//   fontWeight: "500" as const,
//   transition: "all 0.2s",
//   ":hover": {
//     backgroundColor: "#f5f5f5",
//   },
//   ":disabled": {
//     opacity: 0.6,
//     cursor: "not-allowed",
//   },
// };























// app/_components/SliderModal.tsx
"use client";
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

interface SliderModalProps {
  onClose: () => void;
  onSave: (name: string, role: string, imageFile: File | null) => void;
  slider?: any;
  title: string;
}

export default function SliderModal({ onClose, onSave, slider, title }: SliderModalProps) {
  const [name, setName] = useState(slider?.name || "");
  const [role, setRole] = useState(slider?.role || "General"); // Default value
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(slider?.image || "");
  const [loading, setLoading] = useState(false);

  // Role options
  const roleOptions = [
    "Farmer",
    "Trader",
    "Employee",
    "Partner",
    "Transport",
    "Other's",
  ];

  useEffect(() => {
    if (slider?.image) {
      setPreview(slider.image);
    }
  }, [slider]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a slider name");
      return;
    }
    
    if (!slider && !imageFile) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    try {
      onSave(name, role, imageFile);
    } catch (error) {
      console.error("Error saving slider:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <div style={modalHeader}>
          <h2 style={modalTitle}>{title}</h2>
          <button onClick={onClose} style={closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={form}>
          <div style={formGroup}>
            <label style={label}>Slider Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter slider name"
              style={input}
              required
            />
          </div>

          <div style={formGroup}>
            <label style={label}>Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={select}
              required
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroup}>
            <label style={label}>Image {!slider && "*"}</label>
            <div style={imageUploadContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={fileInput}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={uploadButton}>
                <Upload size={20} />
                Choose Image
              </label>
              
              {preview && (
                <div style={previewContainer}>
                  <img src={preview} alt="Preview" style={previewImage} />
                </div>
              )}
              
              <p style={fileInfo}>
                Accepted formats: JPEG, JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          </div>

          <div style={modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Slider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal Styles
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalContent: React.CSSProperties = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  width: "100%",
  maxWidth: "500px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const modalHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  borderBottom: "1px solid #e5e7eb",
};

const modalTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  margin: 0,
};

const closeButton: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#6b7280",
  padding: "4px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const form: React.CSSProperties = {
  padding: "24px",
};

const formGroup: React.CSSProperties = {
  marginBottom: "20px",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "6px",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const select: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "white",
  cursor: "pointer",
};

const imageUploadContainer: React.CSSProperties = {
  border: "2px dashed #d1d5db",
  borderRadius: "6px",
  padding: "20px",
  textAlign: "center",
};

const fileInput: React.CSSProperties = {
  display: "none",
};

const uploadButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "16px",
};

const previewContainer: React.CSSProperties = {
  marginTop: "16px",
};

const previewImage: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "200px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

const fileInfo: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  marginTop: "8px",
};

const modalActions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  paddingTop: "20px",
  borderTop: "1px solid #e5e7eb",
};

const cancelButton: React.CSSProperties = {
  padding: "10px 20px",
  background: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const saveButton: React.CSSProperties = {
  padding: "10px 24px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};