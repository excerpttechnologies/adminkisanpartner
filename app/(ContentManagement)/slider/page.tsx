// "use client";

// import { useState, useEffect, useRef } from 'react';

// interface Slider {
//   _id: string;
//   menuName: string;
//   menuIcon: string;
//   sliderImage: string;
//   status: 'active' | 'inactive';
//   createdAt: string;
// }

// export default function SliderManagementPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState({
//     menuName: '',
//     menuIcon: '',
//     sliderImage: '',
//     status: 'active' as 'active' | 'inactive'
//   });
  
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   const iconFileRef = useRef<HTMLInputElement>(null);
//   const sliderFileRef = useRef<HTMLInputElement>(null);

//   // Fetch sliders from backend
//   const fetchSliders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/adminslider');
//       const data = await res.json();
      
//       if (data.success && data.data) {
//         setSliders(data.data);
//       } else {
//         console.error('Failed to fetch sliders:', data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching sliders:', error);
//       alert('Failed to load sliders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSliders();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle icon upload
//   const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         alert('Icon file size must be less than 2MB');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           menuIcon: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle slider image upload
//   const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Slider image file size must be less than 5MB');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           sliderImage: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.menuName.trim()) {
//       alert('Please enter a menu name');
//       return;
//     }

//     if (!formData.menuIcon && !editingId) {
//       alert('Please upload a menu icon');
//       return;
//     }

//     if (!formData.sliderImage && !editingId) {
//       alert('Please upload a slider image');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       if (editingId) {
//         // Update existing slider
//         const res = await fetch(`/api/adminslider/${editingId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await res.json();
        
//         if (data.success) {
//           alert('Slider updated successfully!');
//           fetchSliders();
//           resetForm();
//         } else {
//           alert(data.message || 'Failed to update slider');
//         }
//       } else {
//         // Add new slider
//         const res = await fetch('/api/adminslider', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await res.json();
        
//         if (data.success) {
//           alert('Slider added successfully!');
//           fetchSliders();
//           resetForm();
//         } else {
//           alert(data.message || 'Failed to add slider');
//         }
//       }
//     } catch (error) {
//       console.error('Error saving slider:', error);
//       alert('Failed to save slider. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       menuName: '',
//       menuIcon: '',
//       sliderImage: '',
//       status: 'active'
//     });
//     setEditingId(null);
//     if (iconFileRef.current) iconFileRef.current.value = '';
//     if (sliderFileRef.current) sliderFileRef.current.value = '';
//   };

//   // Handle edit
//   const handleEdit = (slider: Slider) => {
//     setFormData({
//       menuName: slider.menuName,
//       menuIcon: slider.menuIcon,
//       sliderImage: slider.sliderImage,
//       status: slider.status
//     });
//     setEditingId(slider._id);
    
//     // Scroll to form
//     setTimeout(() => {
//       document.getElementById('slider-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this slider? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'DELETE'
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         alert('Slider deleted successfully!');
//         fetchSliders();
        
//         // If we were editing this slider, reset the form
//         if (editingId === id) {
//           resetForm();
//         }
//       } else {
//         alert(data.message || 'Failed to delete slider');
//       }
//     } catch (error) {
//       console.error('Error deleting slider:', error);
//       alert('Failed to delete slider. Please try again.');
//     }
//   };

//   // Toggle status
//   const toggleStatus = async (id: string) => {
//     try {
//       const slider = sliders.find(s => s._id === id);
//       if (!slider) return;
      
//       const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...slider,
//           status: newStatus
//         })
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         fetchSliders();
//       } else {
//         alert(data.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error toggling status:', error);
//       alert('Failed to update status');
//     }
//   };

//   // Statistics
//   const activeCount = sliders.filter(s => s.status === 'active').length;
//   const inactiveCount = sliders.filter(s => s.status === 'inactive').length;

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <h1 style={styles.title}>🎚️ Slider Management</h1>
//         <p style={styles.subtitle}>Create and manage website sliders with images and icons</p>
//       </div>

//       {/* Stats Cards */}
//       <div style={styles.statsContainer}>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>📊</div>
//           <div>
//             <div style={styles.statNumber}>{sliders.length}</div>
//             <div style={styles.statLabel}>Total Sliders</div>
//           </div>
//         </div>
//         <div style={{...styles.statCard, borderColor: '#10b981'}}>
//           <div style={{...styles.statIcon, backgroundColor: '#d1fae5'}}>✅</div>
//           <div>
//             <div style={{...styles.statNumber, color: '#10b981'}}>{activeCount}</div>
//             <div style={styles.statLabel}>Active</div>
//           </div>
//         </div>
//         <div style={{...styles.statCard, borderColor: '#f59e0b'}}>
//           <div style={{...styles.statIcon, backgroundColor: '#fef3c7'}}>⏸️</div>
//           <div>
//             <div style={{...styles.statNumber, color: '#f59e0b'}}>{inactiveCount}</div>
//             <div style={styles.statLabel}>Inactive</div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Form */}
//       <div id="slider-form" style={styles.formContainer}>
//         <div style={styles.formHeader}>
//           <h2 style={styles.formTitle}>
//             {editingId ? '✏️ Edit Slider' : '➕ Add New Slider'}
//           </h2>
//           {editingId && (
//             <button onClick={resetForm} style={styles.cancelButton}>
//               ✕ Cancel Edit
//             </button>
//           )}
//         </div>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.formGrid}>
//             {/* Menu Name */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 Menu Name *
//                 <input
//                   type="text"
//                   name="menuName"
//                   value={formData.menuName}
//                   onChange={handleInputChange}
//                   placeholder="Enter menu name (e.g., Home, Products)"
//                   style={styles.input}
//                   required
//                 />
//               </label>
//             </div>

//             {/* Status */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 Status
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   style={styles.select}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </label>
//             </div>

//             {/* Menu Icon Upload */}
//             <div style={styles.uploadGroup}>
//               <label style={styles.label}>Menu Icon {!editingId && '*'}</label>
//               <div style={styles.uploadArea} onClick={() => iconFileRef.current?.click()}>
//                 {formData.menuIcon ? (
//                   <div style={styles.previewContainer}>
//                     <img src={formData.menuIcon} alt="Icon Preview" style={styles.previewImage} />
//                     <div style={styles.previewOverlay}>
//                       <span style={styles.uploadText}>Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div style={styles.uploadIcon}>📁</div>
//                     <div style={styles.uploadText}>Click to upload icon</div>
//                     <div style={styles.uploadHint}>PNG, JPG, SVG (Max 2MB)</div>
//                   </>
//                 )}
//                 <input
//                   ref={iconFileRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleIconUpload}
//                   style={{ display: 'none' }}
//                 />
//               </div>
//             </div>

//             {/* Slider Image Upload */}
//             <div style={styles.uploadGroup}>
//               <label style={styles.label}>Slider Image {!editingId && '*'}</label>
//               <div style={styles.uploadArea} onClick={() => sliderFileRef.current?.click()}>
//                 {formData.sliderImage ? (
//                   <div style={styles.previewContainer}>
//                     <img src={formData.sliderImage} alt="Slider Preview" style={styles.previewImage} />
//                     <div style={styles.previewOverlay}>
//                       <span style={styles.uploadText}>Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div style={styles.uploadIcon}>🖼️</div>
//                     <div style={styles.uploadText}>Click to upload slider image</div>
//                     <div style={styles.uploadHint}>Recommended: 1920×800px (Max 5MB)</div>
//                   </>
//                 )}
//                 <input
//                   ref={sliderFileRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleSliderUpload}
//                   style={{ display: 'none' }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div style={styles.formActions}>
//             <button 
//               type="submit" 
//               style={{
//                 ...styles.submitButton,
//                 opacity: submitting ? 0.6 : 1,
//                 cursor: submitting ? 'not-allowed' : 'pointer'
//               }} 
//               disabled={submitting}
//             >
//               {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? '💾 Update Slider' : '➕ Add Slider')}
//             </button>
//             <button 
//               type="button" 
//               onClick={resetForm} 
//               style={styles.resetButton}
//               disabled={submitting}
//             >
//               🔄 Clear Form
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Sliders Table */}
//       <div style={styles.tableContainer}>
//         <div style={styles.tableHeader}>
//           <h2 style={styles.tableTitle}>📋 Sliders List</h2>
//           <div style={styles.tableStats}>
//             Showing {sliders.length} slider{sliders.length !== 1 ? 's' : ''}
//           </div>
//         </div>

//         {loading ? (
//           <div style={styles.loading}>
//             <div style={styles.loadingSpinner}>⏳</div>
//             <div>Loading sliders...</div>
//           </div>
//         ) : sliders.length === 0 ? (
//           <div style={styles.emptyState}>
//             <div style={styles.emptyIcon}>📄</div>
//             <h3 style={styles.emptyTitle}>No Sliders Found</h3>
//             <p style={styles.emptyText}>Start by adding your first slider using the form above</p>
//           </div>
//         ) : (
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr style={styles.tableHead}>
//                   <th style={styles.th}>ID</th>
//                   <th style={styles.th}>Menu Name</th>
//                   <th style={styles.th}>Icon</th>
//                   <th style={styles.th}>Slider Preview</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Created</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sliders.map((slider, index) => (
//                   <tr key={slider._id} style={styles.tableRow}>
//                     <td style={styles.td}>
//                       <span style={styles.idBadge}>#{index + 1}</span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.menuName}>
//                         <strong>{slider.menuName}</strong>
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.iconCell}>
//                         {slider.menuIcon ? (
//                           <img 
//                             src={slider.menuIcon} 
//                             alt="Icon" 
//                             style={styles.iconImage}
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div style={styles.noImage}>No icon</div>
//                         )}
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.imageCell}>
//                         {slider.sliderImage ? (
//                           <img 
//                             src={slider.sliderImage} 
//                             alt="Slider" 
//                             style={styles.sliderImage}
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div style={styles.noImage}>No image</div>
//                         )}
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <button
//                         onClick={() => toggleStatus(slider._id)}
//                         style={{
//                           ...styles.statusBadge,
//                           ...(slider.status === 'active' ? styles.statusActive : styles.statusInactive)
//                         }}
//                         title="Click to toggle status"
//                       >
//                         {slider.status === 'active' ? '✓ Active' : '✕ Inactive'}
//                       </button>
//                     </td>
//                     <td style={styles.td}>
//                       <span style={styles.date}>
//                         {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.actions}>
//                         <button
//                           onClick={() => handleEdit(slider)}
//                           style={styles.editButton}
//                           title="Edit this slider"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(slider._id)}
//                           style={styles.deleteButton}
//                           title="Delete this slider"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div style={styles.footer}>
//         <p style={styles.footerText}>
//           💡 Tip: Upload high-quality images for better slider performance. Keep file sizes under 5MB.
//         </p>
//         <p style={styles.footerText}>
//           Total: {sliders.length} sliders • Active: {activeCount} • Inactive: {inactiveCount}
//         </p>
//       </div>
//     </div>
//   );
// }


// // Inline Styles
// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: '#f8fafc',
//     padding: '24px',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//   },
//   header: {
//     marginBottom: '32px',
//   },
//   title: {
//     fontSize: '32px',
//     fontWeight: 'bold',
//     color: '#1e293b',
//     marginBottom: '8px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px'
//   },
//   subtitle: {
//     fontSize: '16px',
//     color: '#64748b',
//     margin: 0
//   },
//   statsContainer: {
//     display: 'flex',
//     gap: '16px',
//     marginBottom: '32px',
//     flexWrap: 'wrap' as const
//   },
//   statCard: {
//     flex: 1,
//     minWidth: '200px',
//     backgroundColor: 'white',
//     border: '2px solid #e2e8f0',
//     borderRadius: '12px',
//     padding: '20px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//   },
//   statIcon: {
//     width: '56px',
//     height: '56px',
//     backgroundColor: '#f1f5f9',
//     borderRadius: '12px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '24px'
//   },
//   statNumber: {
//     fontSize: '28px',
//     fontWeight: 'bold',
//     color: '#3b82f6',
//     lineHeight: 1
//   },
//   statLabel: {
//     fontSize: '14px',
//     color: '#64748b',
//     marginTop: '4px'
//   },
//   formContainer: {
//     backgroundColor: 'white',
//     borderRadius: '16px',
//     padding: '32px',
//     marginBottom: '32px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: '1px solid #e2e8f0'
//   },
//   formHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '24px'
//   },
//   formTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#1e293b',
//     margin: 0,
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   },
//   cancelButton: {
//     padding: '8px 16px',
//     backgroundColor: '#f1f5f9',
//     color: '#64748b',
//     border: '1px solid #cbd5e1',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '24px'
//   },
//   formGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//     gap: '24px'
//   },
//   formGroup: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '8px'
//   },
//   uploadGroup: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '8px'
//   },
//   label: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#475569',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '6px'
//   },
//   input: {
//     padding: '12px 16px',
//     border: '2px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '14px',
//     transition: 'border-color 0.2s',
//     outline: 'none'
//   },
//   select: {
//     padding: '12px 16px',
//     border: '2px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '14px',
//     backgroundColor: 'white',
//     cursor: 'pointer',
//     outline: 'none'
//   },
//   uploadArea: {
//     border: '2px dashed #cbd5e1',
//     borderRadius: '12px',
//     padding: '32px 24px',
//     backgroundColor: '#f8fafc',
//     textAlign: 'center' as const,
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     minHeight: '140px',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px'
//   },
//   uploadIcon: {
//     fontSize: '32px',
//     color: '#94a3b8'
//   },
//   uploadText: {
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#475569'
//   },
//   uploadHint: {
//     fontSize: '12px',
//     color: '#94a3b8'
//   },
//   previewContainer: {
//     position: 'relative' as const,
//     width: '100%',
//     height: '100%'
//   },
//   previewImage: {
//     width: '100%',
//     maxHeight: '200px',
//     objectFit: 'cover' as const,
//     borderRadius: '8px'
//   },
//   previewOverlay: {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: '8px'
//   },
//   formActions: {
//     display: 'flex',
//     gap: '12px',
//     paddingTop: '16px',
//     borderTop: '1px solid #e2e8f0'
//   },
//   submitButton: {
//     padding: '12px 32px',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   },
//   resetButton: {
//     padding: '12px 24px',
//     backgroundColor: '#f1f5f9',
//     color: '#475569',
//     border: '1px solid #cbd5e1',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   tableContainer: {
//     backgroundColor: 'white',
//     borderRadius: '16px',
//     padding: '32px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: '1px solid #e2e8f0'
//   },
//   tableHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '24px'
//   },
//   tableTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#1e293b',
//     margin: 0,
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   },
//   tableStats: {
//     fontSize: '14px',
//     color: '#64748b',
//     backgroundColor: '#f1f5f9',
//     padding: '6px 12px',
//     borderRadius: '20px'
//   },
//   tableWrapper: {
//     overflowX: 'auto' as const
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse' as const
//   },
//   tableHead: {
//     backgroundColor: '#f8fafc',
//     borderBottom: '2px solid #e2e8f0'
//   },
//   th: {
//     padding: '16px',
//     textAlign: 'left' as const,
//     fontSize: '12px',
//     fontWeight: '600',
//     color: '#64748b',
//     textTransform: 'uppercase' as const,
//     letterSpacing: '0.05em',
//     whiteSpace: 'nowrap' as const
//   },
//   tableRow: {
//     borderBottom: '1px solid #f1f5f9',
//     transition: 'background-color 0.2s'
//   },
//   td: {
//     padding: '16px',
//     fontSize: '14px',
//     color: '#334155',
//     verticalAlign: 'middle' as const
//   },
//   idBadge: {
//     backgroundColor: '#f1f5f9',
//     color: '#475569',
//     padding: '4px 8px',
//     borderRadius: '4px',
//     fontSize: '12px',
//     fontWeight: '500',
//     fontFamily: 'monospace'
//   },
//   menuName: {
//     fontWeight: '500',
//     color: '#1e293b'
//   },
//   iconCell: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   iconImage: {
//     width: '40px',
//     height: '40px',
//     objectFit: 'cover' as const,
//     borderRadius: '8px',
//     backgroundColor: '#f1f5f9'
//   },
//   imageCell: {
//     display: 'flex',
//     alignItems: 'center'
//   },
//   sliderImage: {
//     width: '120px',
//     height: '60px',
//     objectFit: 'cover' as const,
//     borderRadius: '6px',
//     backgroundColor: '#f1f5f9'
//   },
//   statusBadge: {
//     padding: '6px 12px',
//     borderRadius: '20px',
//     fontSize: '12px',
//     fontWeight: '600',
//     border: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     minWidth: '80px'
//   },
//   statusActive: {
//     backgroundColor: '#d1fae5',
//     color: '#065f46'
//   },
//   statusInactive: {
//     backgroundColor: '#fee2e2',
//     color: '#991b1b'
//   },
//   date: {
//     fontSize: '12px',
//     color: '#64748b',
//     whiteSpace: 'nowrap' as const
//   },
//   actions: {
//     display: 'flex',
//     gap: '8px',
//     flexWrap: 'wrap' as const
//   },
//   editButton: {
//     padding: '6px 12px',
//     backgroundColor: '#dbeafe',
//     color: '#1d4ed8',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '12px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     minWidth: '70px'
//   },
//   deleteButton: {
//     padding: '6px 12px',
//     backgroundColor: '#fee2e2',
//     color: '#dc2626',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '12px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     minWidth: '70px'
//   },
//   emptyState: {
//     textAlign: 'center' as const,
//     padding: '64px 32px'
//   },
//   emptyIcon: {
//     fontSize: '48px',
//     color: '#cbd5e1',
//     marginBottom: '16px'
//   },
//   emptyTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#64748b',
//     marginBottom: '8px'
//   },
//   emptyText: {
//     fontSize: '14px',
//     color: '#94a3b8',
//     margin: 0
//   },
//   loading: {
//     textAlign: 'center' as const,
//     padding: '40px 20px',
//     color: '#64748b',
//   },
//   footer: {
//     marginTop: '32px',
//     padding: '20px',
//     textAlign: 'center' as const,
//     color: '#64748b',
//     fontSize: '13px',
//     borderTop: '1px solid #e2e8f0'
//   },
//   footerText: {
//     margin: '4px 0',
//     fontSize: '13px',
//     color: '#64748b'
//   }
// };













// "use client";

// import { useState, useEffect, useRef } from 'react';

// interface Slider {
//   _id: string;
//   menuName: string;
//   menuIcon: string;
//   sliderImage: string;
//   status: 'active' | 'inactive';
//   createdAt: string;
// }

// export default function SliderManagementPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState({
//     menuName: '',
//     menuIcon: '',
//     sliderImage: '',
//     status: 'active' as 'active' | 'inactive'
//   });
  
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   const iconFileRef = useRef<HTMLInputElement>(null);
//   const sliderFileRef = useRef<HTMLInputElement>(null);

//   // Fetch sliders from backend
//   const fetchSliders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/adminslider');
//       const data = await res.json();
      
//       if (data.success && data.data) {
//         setSliders(data.data);
//       } else {
//         console.error('Failed to fetch sliders:', data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching sliders:', error);
//       alert('Failed to load sliders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSliders();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle icon upload
//   const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         alert('Icon file size must be less than 2MB');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           menuIcon: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle slider image upload
//   const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Slider image file size must be less than 5MB');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           sliderImage: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.menuName.trim()) {
//       alert('Please enter a menu name');
//       return;
//     }

//     if (!formData.menuIcon && !editingId) {
//       alert('Please upload a menu icon');
//       return;
//     }

//     if (!formData.sliderImage && !editingId) {
//       alert('Please upload a slider image');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       if (editingId) {
//         // Update existing slider
//         const res = await fetch(`/api/adminslider/${editingId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await res.json();
        
//         if (data.success) {
//           alert('Slider updated successfully!');
//           fetchSliders();
//           resetForm();
//         } else {
//           alert(data.message || 'Failed to update slider');
//         }
//       } else {
//         // Add new slider
//         const res = await fetch('/api/adminslider', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await res.json();
        
//         if (data.success) {
//           alert('Slider added successfully!');
//           fetchSliders();
//           resetForm();
//         } else {
//           alert(data.message || 'Failed to add slider');
//         }
//       }
//     } catch (error) {
//       console.error('Error saving slider:', error);
//       alert('Failed to save slider. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       menuName: '',
//       menuIcon: '',
//       sliderImage: '',
//       status: 'active'
//     });
//     setEditingId(null);
//     if (iconFileRef.current) iconFileRef.current.value = '';
//     if (sliderFileRef.current) sliderFileRef.current.value = '';
//   };

//   // Handle edit
//   const handleEdit = (slider: Slider) => {
//     setFormData({
//       menuName: slider.menuName,
//       menuIcon: slider.menuIcon,
//       sliderImage: slider.sliderImage,
//       status: slider.status
//     });
//     setEditingId(slider._id);
    
//     // Scroll to form
//     setTimeout(() => {
//       document.getElementById('slider-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this slider? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'DELETE'
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         alert('Slider deleted successfully!');
//         fetchSliders();
        
//         // If we were editing this slider, reset the form
//         if (editingId === id) {
//           resetForm();
//         }
//       } else {
//         alert(data.message || 'Failed to delete slider');
//       }
//     } catch (error) {
//       console.error('Error deleting slider:', error);
//       alert('Failed to delete slider. Please try again.');
//     }
//   };

//   // Toggle status
//   const toggleStatus = async (id: string) => {
//     try {
//       const slider = sliders.find(s => s._id === id);
//       if (!slider) return;
      
//       const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...slider,
//           status: newStatus
//         })
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         fetchSliders();
//       } else {
//         alert(data.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error toggling status:', error);
//       alert('Failed to update status');
//     }
//   };

//   // Statistics
//   const activeCount = sliders.filter(s => s.status === 'active').length;
//   const inactiveCount = sliders.filter(s => s.status === 'inactive').length;

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <h1 style={styles.title}>🎚️ Slider Management</h1>
//         <p style={styles.subtitle}>Create and manage website sliders with images and icons</p>
//       </div>

//       {/* Stats Cards */}
//       <div style={styles.statsContainer}>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>📊</div>
//           <div>
//             <div style={styles.statNumber}>{sliders.length}</div>
//             <div style={styles.statLabel}>Total Sliders</div>
//           </div>
//         </div>
//         <div style={{...styles.statCard, borderColor: '#10b981'}}>
//           <div style={{...styles.statIcon, backgroundColor: '#d1fae5'}}>✅</div>
//           <div>
//             <div style={{...styles.statNumber, color: '#10b981'}}>{activeCount}</div>
//             <div style={styles.statLabel}>Active</div>
//           </div>
//         </div>
//         <div style={{...styles.statCard, borderColor: '#f59e0b'}}>
//           <div style={{...styles.statIcon, backgroundColor: '#fef3c7'}}>⏸️</div>
//           <div>
//             <div style={{...styles.statNumber, color: '#f59e0b'}}>{inactiveCount}</div>
//             <div style={styles.statLabel}>Inactive</div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Form */}
//       <div id="slider-form" style={styles.formContainer}>
//         <div style={styles.formHeader}>
//           <h2 style={styles.formTitle}>
//             {editingId ? '✏️ Edit Slider' : '➕ Add New Slider'}
//           </h2>
//           {editingId && (
//             <button onClick={resetForm} style={styles.cancelButton}>
//               ✕ Cancel Edit
//             </button>
//           )}
//         </div>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.formGrid}>
//             {/* Menu Name */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 Menu Name *
//                 <input
//                   type="text"
//                   name="menuName"
//                   value={formData.menuName}
//                   onChange={handleInputChange}
//                   placeholder="Enter menu name (e.g., Home, Products)"
//                   style={styles.input}
//                   required
//                 />
//               </label>
//             </div>

//             {/* Status */}
//             <div style={styles.formGroup}>
//               <label style={styles.label}>
//                 Status
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   style={styles.select}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </label>
//             </div>

//             {/* Menu Icon Upload */}
//             <div style={styles.uploadGroup}>
//               <label style={styles.label}>Menu Icon {!editingId && '*'}</label>
//               <div style={styles.uploadArea} onClick={() => iconFileRef.current?.click()}>
//                 {formData.menuIcon ? (
//                   <div style={styles.previewContainer}>
//                     <img src={formData.menuIcon} alt="Icon Preview" style={styles.previewImage} />
//                     <div style={styles.previewOverlay}>
//                       <span style={styles.uploadText}>Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div style={styles.uploadIcon}>📁</div>
//                     <div style={styles.uploadText}>Click to upload icon</div>
//                     <div style={styles.uploadHint}>PNG, JPG, SVG (Max 2MB)</div>
//                   </>
//                 )}
//                 <input
//                   ref={iconFileRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleIconUpload}
//                   style={{ display: 'none' }}
//                 />
//               </div>
//             </div>

//             {/* Slider Image Upload */}
//             <div style={styles.uploadGroup}>
//               <label style={styles.label}>Slider Image {!editingId && '*'}</label>
//               <div style={styles.uploadArea} onClick={() => sliderFileRef.current?.click()}>
//                 {formData.sliderImage ? (
//                   <div style={styles.previewContainer}>
//                     <img src={formData.sliderImage} alt="Slider Preview" style={styles.previewImage} />
//                     <div style={styles.previewOverlay}>
//                       <span style={styles.uploadText}>Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div style={styles.uploadIcon}>🖼️</div>
//                     <div style={styles.uploadText}>Click to upload slider image</div>
//                     <div style={styles.uploadHint}>Recommended: 1920×800px (Max 5MB)</div>
//                   </>
//                 )}
//                 <input
//                   ref={sliderFileRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleSliderUpload}
//                   style={{ display: 'none' }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div style={styles.formActions}>
//             <button 
//               type="submit" 
//               style={{
//                 ...styles.submitButton,
//                 opacity: submitting ? 0.6 : 1,
//                 cursor: submitting ? 'not-allowed' : 'pointer'
//               }} 
//               disabled={submitting}
//             >
//               {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? '💾 Update Slider' : '➕ Add Slider')}
//             </button>
//             <button 
//               type="button" 
//               onClick={resetForm} 
//               style={styles.resetButton}
//               disabled={submitting}
//             >
//               🔄 Clear Form
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Sliders Table */}
//       <div style={styles.tableContainer}>
//         <div style={styles.tableHeader}>
//           <h2 style={styles.tableTitle}>📋 Sliders List</h2>
//           <div style={styles.tableStats}>
//             Showing {sliders.length} slider{sliders.length !== 1 ? 's' : ''}
//           </div>
//         </div>

//         {loading ? (
//           <div style={styles.loading}>
//             <div style={styles.loadingSpinner}>⏳</div>
//             <div>Loading sliders...</div>
//           </div>
//         ) : sliders.length === 0 ? (
//           <div style={styles.emptyState}>
//             <div style={styles.emptyIcon}>📄</div>
//             <h3 style={styles.emptyTitle}>No Sliders Found</h3>
//             <p style={styles.emptyText}>Start by adding your first slider using the form above</p>
//           </div>
//         ) : (
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr style={styles.tableHead}>
//                   <th style={styles.th}>ID</th>
//                   <th style={styles.th}>Menu Name</th>
//                   <th style={styles.th}>Icon</th>
//                   <th style={styles.th}>Slider Preview</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Created</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sliders.map((slider, index) => (
//                   <tr key={slider._id} style={styles.tableRow}>
//                     <td style={styles.td}>
//                       <span style={styles.idBadge}>#{index + 1}</span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.menuName}>
//                         <strong>{slider.menuName}</strong>
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.iconCell}>
//                         {slider.menuIcon ? (
//                           <img 
//                             src={slider.menuIcon} 
//                             alt="Icon" 
//                             style={styles.iconImage}
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div style={styles.noImage}>No icon</div>
//                         )}
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.imageCell}>
//                         {slider.sliderImage ? (
//                           <img 
//                             src={slider.sliderImage} 
//                             alt="Slider" 
//                             style={styles.sliderImage}
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div style={styles.noImage}>No image</div>
//                         )}
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <button
//                         onClick={() => toggleStatus(slider._id)}
//                         style={{
//                           ...styles.statusBadge,
//                           ...(slider.status === 'active' ? styles.statusActive : styles.statusInactive)
//                         }}
//                         title="Click to toggle status"
//                       >
//                         {slider.status === 'active' ? '✓ Active' : '✕ Inactive'}
//                       </button>
//                     </td>
//                     <td style={styles.td}>
//                       <span style={styles.date}>
//                         {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.actions}>
//                         <button
//                           onClick={() => handleEdit(slider)}
//                           style={styles.editButton}
//                           title="Edit this slider"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(slider._id)}
//                           style={styles.deleteButton}
//                           title="Delete this slider"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div style={styles.footer}>
//         <p style={styles.footerText}>
//           💡 Tip: Upload high-quality images for better slider performance. Keep file sizes under 5MB.
//         </p>
//         <p style={styles.footerText}>
//           Total: {sliders.length} sliders • Active: {activeCount} • Inactive: {inactiveCount}
//         </p>
//       </div>
//     </div>
//   );
// }


// // Inline Styles
// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: '#f8fafc',
//     padding: '24px',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//   },
//   header: {
//     marginBottom: '32px',
//   },
//   title: {
//     fontSize: '32px',
//     fontWeight: 'bold',
//     color: '#1e293b',
//     marginBottom: '8px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px'
//   },
//   subtitle: {
//     fontSize: '16px',
//     color: '#64748b',
//     margin: 0
//   },
//   statsContainer: {
//     display: 'flex',
//     gap: '16px',
//     marginBottom: '32px',
//     flexWrap: 'wrap' as const
//   },
//   statCard: {
//     flex: 1,
//     minWidth: '200px',
//     backgroundColor: 'white',
//     border: '2px solid #e2e8f0',
//     borderRadius: '12px',
//     padding: '20px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//   },
//   statIcon: {
//     width: '56px',
//     height: '56px',
//     backgroundColor: '#f1f5f9',
//     borderRadius: '12px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '24px'
//   },
//   statNumber: {
//     fontSize: '28px',
//     fontWeight: 'bold',
//     color: '#3b82f6',
//     lineHeight: 1
//   },
//   statLabel: {
//     fontSize: '14px',
//     color: '#64748b',
//     marginTop: '4px'
//   },
//   formContainer: {
//     backgroundColor: 'white',
//     borderRadius: '16px',
//     padding: '32px',
//     marginBottom: '32px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: '1px solid #e2e8f0'
//   },
//   formHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '24px'
//   },
//   formTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#1e293b',
//     margin: 0,
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   },
//   cancelButton: {
//     padding: '8px 16px',
//     backgroundColor: '#f1f5f9',
//     color: '#64748b',
//     border: '1px solid #cbd5e1',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '24px'
//   },
//   formGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//     gap: '24px'
//   },
//   formGroup: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '8px'
//   },
//   uploadGroup: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '8px'
//   },
//   label: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#475569',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '6px'
//   },
//   input: {
//     padding: '12px 16px',
//     border: '2px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '14px',
//     transition: 'border-color 0.2s',
//     outline: 'none'
//   },
//   select: {
//     padding: '12px 16px',
//     border: '2px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '14px',
//     backgroundColor: 'white',
//     cursor: 'pointer',
//     outline: 'none'
//   },
//   uploadArea: {
//     border: '2px dashed #cbd5e1',
//     borderRadius: '12px',
//     padding: '32px 24px',
//     backgroundColor: '#f8fafc',
//     textAlign: 'center' as const,
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     minHeight: '140px',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px'
//   },
//   uploadIcon: {
//     fontSize: '32px',
//     color: '#94a3b8'
//   },
//   uploadText: {
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#475569'
//   },
//   uploadHint: {
//     fontSize: '12px',
//     color: '#94a3b8'
//   },
//   previewContainer: {
//     position: 'relative' as const,
//     width: '100%',
//     height: '100%'
//   },
//   previewImage: {
//     width: '100%',
//     maxHeight: '200px',
//     objectFit: 'cover' as const,
//     borderRadius: '8px'
//   },
//   previewOverlay: {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: '8px'
//   },
//   formActions: {
//     display: 'flex',
//     gap: '12px',
//     paddingTop: '16px',
//     borderTop: '1px solid #e2e8f0'
//   },
//   submitButton: {
//     padding: '12px 32px',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   },
//   resetButton: {
//     padding: '12px 24px',
//     backgroundColor: '#f1f5f9',
//     color: '#475569',
//     border: '1px solid #cbd5e1',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   tableContainer: {
//     backgroundColor: 'white',
//     borderRadius: '16px',
//     padding: '32px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: '1px solid #e2e8f0'
//   },
//   tableHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '24px'
//   },
//   tableTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#1e293b',
//     margin: 0,
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   },
//   tableStats: {
//     fontSize: '14px',
//     color: '#64748b',
//     backgroundColor: '#f1f5f9',
//     padding: '6px 12px',
//     borderRadius: '20px'
//   },
//   tableWrapper: {
//     overflowX: 'auto' as const
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse' as const
//   },
//   tableHead: {
//     backgroundColor: '#f8fafc',
//     borderBottom: '2px solid #e2e8f0'
//   },
//   th: {
//     padding: '16px',
//     textAlign: 'left' as const,
//     fontSize: '12px',
//     fontWeight: '600',
//     color: '#64748b',
//     textTransform: 'uppercase' as const,
//     letterSpacing: '0.05em',
//     whiteSpace: 'nowrap' as const
//   },
//   tableRow: {
//     borderBottom: '1px solid #f1f5f9',
//     transition: 'background-color 0.2s'
//   },
//   td: {
//     padding: '16px',
//     fontSize: '14px',
//     color: '#334155',
//     verticalAlign: 'middle' as const
//   },
//   idBadge: {
//     backgroundColor: '#f1f5f9',
//     color: '#475569',
//     padding: '4px 8px',
//     borderRadius: '4px',
//     fontSize: '12px',
//     fontWeight: '500',
//     fontFamily: 'monospace'
//   },
//   menuName: {
//     fontWeight: '500',
//     color: '#1e293b'
//   },
//   iconCell: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   iconImage: {
//     width: '40px',
//     height: '40px',
//     objectFit: 'cover' as const,
//     borderRadius: '8px',
//     backgroundColor: '#f1f5f9'
//   },
//   imageCell: {
//     display: 'flex',
//     alignItems: 'center'
//   },
//   sliderImage: {
//     width: '120px',
//     height: '60px',
//     objectFit: 'cover' as const,
//     borderRadius: '6px',
//     backgroundColor: '#f1f5f9'
//   },
//   noImage: {
//     fontSize: '12px',
//     color: '#94a3b8',
//     fontStyle: 'italic',
//     padding: '8px'
//   },
//   statusBadge: {
//     padding: '6px 12px',
//     borderRadius: '20px',
//     fontSize: '12px',
//     fontWeight: '600',
//     border: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     minWidth: '80px'
//   },
//   statusActive: {
//     backgroundColor: '#d1fae5',
//     color: '#065f46'
//   },
//   statusInactive: {
//     backgroundColor: '#fee2e2',
//     color: '#991b1b'
//   },
//   date: {
//     fontSize: '12px',
//     color: '#64748b',
//     whiteSpace: 'nowrap' as const
//   },
//   actions: {
//     display: 'flex',
//     gap: '8px',
//     flexWrap: 'wrap' as const
//   },
//   editButton: {
//     padding: '6px 12px',
//     backgroundColor: '#dbeafe',
//     color: '#1d4ed8',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '12px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     minWidth: '70px'
//   },
//   deleteButton: {
//     padding: '6px 12px',
//     backgroundColor: '#fee2e2',
//     color: '#dc2626',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '12px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     minWidth: '70px'
//   },
//   emptyState: {
//     textAlign: 'center' as const,
//     padding: '64px 32px'
//   },
//   emptyIcon: {
//     fontSize: '48px',
//     color: '#cbd5e1',
//     marginBottom: '16px'
//   },
//   emptyTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#64748b',
//     marginBottom: '8px'
//   },
//   emptyText: {
//     fontSize: '14px',
//     color: '#94a3b8',
//     margin: 0
//   },
//   loading: {
//     textAlign: 'center' as const,
//     padding: '40px 20px',
//     color: '#64748b',
//   },
//   loadingSpinner: {
//     fontSize: '2rem',
//     marginBottom: '1rem',
//     animation: 'spin 1s linear infinite',
//   },
//   '@keyframes spin': {
//     from: { transform: 'rotate(0deg)' },
//     to: { transform: 'rotate(360deg)' },
//   },
//   footer: {
//     marginTop: '32px',
//     padding: '20px',
//     textAlign: 'center' as const,
//     color: '#64748b',
//     fontSize: '13px',
//     borderTop: '1px solid #e2e8f0'
//   },
//   footerText: {
//     margin: '4px 0',
//     fontSize: '13px',
//     color: '#64748b'
//   }
// };
















// "use client";

// import { useState, useEffect, useRef } from 'react';

// interface Slider {
//   _id: string;
//   menuName: string;
//   menuIcon: string;
//   sliderImage: string;
//   status: 'active' | 'inactive';
//   createdAt: string;
// }

// export default function SliderManagementPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState({
//     menuName: '',
//     menuIcon: '',
//     sliderImage: '',
//     status: 'active' as 'active' | 'inactive'
//   });
  
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   const iconFileRef = useRef<HTMLInputElement>(null);
//   const sliderFileRef = useRef<HTMLInputElement>(null);

//   // Fetch sliders from backend
//   const fetchSliders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/adminslider');
//       const data = await res.json();
      
//       if (data.success && data.data) {
//         setSliders(data.data);
//       } else {
//         console.error('Failed to fetch sliders:', data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching sliders:', error);
//       alert('Failed to load sliders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSliders();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle icon upload
//   const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         alert('Icon file size must be less than 2MB');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           menuIcon: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle slider image upload
//   const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Slider image file size must be less than 5MB');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           sliderImage: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.menuName.trim()) {
//       alert('Please enter a menu name');
//       return;
//     }

//     if (!formData.menuIcon && !editingId) {
//       alert('Please upload a menu icon');
//       return;
//     }

//     if (!formData.sliderImage && !editingId) {
//       alert('Please upload a slider image');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       if (editingId) {
//         // Update existing slider
//         const res = await fetch(`/api/adminslider/${editingId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await res.json();
        
//         if (data.success) {
//           alert('Slider updated successfully!');
//           fetchSliders();
//           resetForm();
//         } else {
//           alert(data.message || 'Failed to update slider');
//         }
//       } else {
//         // Add new slider
//         const res = await fetch('/api/adminslider', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await res.json();
        
//         if (data.success) {
//           alert('Slider added successfully!');
//           fetchSliders();
//           resetForm();
//         } else {
//           alert(data.message || 'Failed to add slider');
//         }
//       }
//     } catch (error) {
//       console.error('Error saving slider:', error);
//       alert('Failed to save slider. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       menuName: '',
//       menuIcon: '',
//       sliderImage: '',
//       status: 'active'
//     });
//     setEditingId(null);
//     if (iconFileRef.current) iconFileRef.current.value = '';
//     if (sliderFileRef.current) sliderFileRef.current.value = '';
//   };

//   // Handle edit
//   const handleEdit = (slider: Slider) => {
//     setFormData({
//       menuName: slider.menuName,
//       menuIcon: slider.menuIcon,
//       sliderImage: slider.sliderImage,
//       status: slider.status
//     });
//     setEditingId(slider._id);
    
//     // Scroll to form
//     setTimeout(() => {
//       document.getElementById('slider-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this slider? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'DELETE'
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         alert('Slider deleted successfully!');
//         fetchSliders();
        
//         // If we were editing this slider, reset the form
//         if (editingId === id) {
//           resetForm();
//         }
//       } else {
//         alert(data.message || 'Failed to delete slider');
//       }
//     } catch (error) {
//       console.error('Error deleting slider:', error);
//       alert('Failed to delete slider. Please try again.');
//     }
//   };

//   // Toggle status
//   const toggleStatus = async (id: string) => {
//     try {
//       const slider = sliders.find(s => s._id === id);
//       if (!slider) return;
      
//       const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...slider,
//           status: newStatus
//         })
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         fetchSliders();
//       } else {
//         alert(data.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error toggling status:', error);
//       alert('Failed to update status');
//     }
//   };

//   // Statistics
//   const activeCount = sliders.filter(s => s.status === 'active').length;
//   const inactiveCount = sliders.filter(s => s.status === 'inactive').length;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
//           🎚️ Slider Management
//         </h1>
//         <p className="text-gray-600 text-base">
//           Create and manage website sliders with images and icons
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="flex gap-4 mb-8 flex-wrap">
//         <div className="flex-1 min-w-[200px] bg-white border-2 border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
//           <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
//             📊
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-blue-500 leading-none">{sliders.length}</div>
//             <div className="text-sm text-gray-600 mt-1">Total Sliders</div>
//           </div>
//         </div>
//         <div className="flex-1 min-w-[200px] bg-white border-2 border-emerald-500 rounded-xl p-5 flex items-center gap-4 shadow-sm">
//           <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
//             ✅
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-emerald-600 leading-none">{activeCount}</div>
//             <div className="text-sm text-gray-600 mt-1">Active</div>
//           </div>
//         </div>
//         <div className="flex-1 min-w-[200px] bg-white border-2 border-amber-500 rounded-xl p-5 flex items-center gap-4 shadow-sm">
//           <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
//             ⏸️
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-amber-500 leading-none">{inactiveCount}</div>
//             <div className="text-sm text-gray-600 mt-1">Inactive</div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Form */}
//       <div id="slider-form" className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
//             {editingId ? '✏️ Edit Slider' : '➕ Add New Slider'}
//           </h2>
//           {editingId && (
//             <button
//               onClick={resetForm}
//               className="px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-gray-200"
//             >
//               ✕ Cancel Edit
//             </button>
//           )}
//         </div>
        
//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Menu Name */}
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-semibold text-gray-700 flex flex-col gap-1.5">
//                 Menu Name *
//                 <input
//                   type="text"
//                   name="menuName"
//                   value={formData.menuName}
//                   onChange={handleInputChange}
//                   placeholder="Enter menu name (e.g., Home, Products)"
//                   className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-colors outline-none focus:border-blue-300"
//                   required
//                 />
//               </label>
//             </div>

//             {/* Status */}
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-semibold text-gray-700 flex flex-col gap-1.5">
//                 Status
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-blue-300"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </label>
//             </div>

//             {/* Menu Icon Upload */}
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-semibold text-gray-700">Menu Icon {!editingId && '*'}</label>
//               <div 
//                 className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center cursor-pointer transition-all hover:border-gray-400 min-h-[140px] flex flex-col items-center justify-center gap-2"
//                 onClick={() => iconFileRef.current?.click()}
//               >
//                 {formData.menuIcon ? (
//                   <div className="relative w-full h-full">
//                     <img src={formData.menuIcon} alt="Icon Preview" className="w-full max-h-[200px] object-cover rounded-lg" />
//                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
//                       <span className="text-sm font-medium text-white">Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="text-3xl text-gray-400">📁</div>
//                     <div className="text-sm font-medium text-gray-700">Click to upload icon</div>
//                     <div className="text-xs text-gray-400">PNG, JPG, SVG (Max 2MB)</div>
//                   </>
//                 )}
//                 <input
//                   ref={iconFileRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleIconUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             {/* Slider Image Upload */}
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-semibold text-gray-700">Slider Image {!editingId && '*'}</label>
//               <div 
//                 className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center cursor-pointer transition-all hover:border-gray-400 min-h-[140px] flex flex-col items-center justify-center gap-2"
//                 onClick={() => sliderFileRef.current?.click()}
//               >
//                 {formData.sliderImage ? (
//                   <div className="relative w-full h-full">
//                     <img src={formData.sliderImage} alt="Slider Preview" className="w-full max-h-[200px] object-cover rounded-lg" />
//                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
//                       <span className="text-sm font-medium text-white">Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="text-3xl text-gray-400">🖼️</div>
//                     <div className="text-sm font-medium text-gray-700">Click to upload slider image</div>
//                     <div className="text-xs text-gray-400">Recommended: 1920×800px (Max 5MB)</div>
//                   </>
//                 )}
//                 <input
//                   ref={sliderFileRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleSliderUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex gap-3 pt-4 border-t border-gray-200">
//             <button 
//               type="submit" 
//               className={`px-8 py-3 bg-blue-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 hover:bg-blue-600 ${
//                 submitting ? 'opacity-60 cursor-not-allowed' : ''
//               }`} 
//               disabled={submitting}
//             >
//               {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? '💾 Update Slider' : '➕ Add Slider')}
//             </button>
//             <button 
//               type="button" 
//               onClick={resetForm} 
//               className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-gray-200 disabled:opacity-50"
//               disabled={submitting}
//             >
//               🔄 Clear Form
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Sliders Table */}
//       <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
//             📋 Sliders List
//           </h2>
//           <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
//             Showing {sliders.length} slider{sliders.length !== 1 ? 's' : ''}
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-10 text-gray-600">
//             <div className="text-3xl mb-4 animate-spin">⏳</div>
//             <div>Loading sliders...</div>
//           </div>
//         ) : sliders.length === 0 ? (
//           <div className="text-center py-16 px-8">
//             <div className="text-5xl text-gray-300 mb-4">📄</div>
//             <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sliders Found</h3>
//             <p className="text-sm text-gray-400 m-0">
//               Start by adding your first slider using the form above
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 border-b-2 border-gray-200">
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">ID</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Menu Name</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Icon</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Slider Preview</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Created</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sliders.map((slider, index) => (
//                   <tr key={slider._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium font-mono">
//                         #{index + 1}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <div className="font-medium text-gray-800">
//                         <strong>{slider.menuName}</strong>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <div className="flex items-center justify-center">
//                         {slider.menuIcon ? (
//                           <img 
//                             src={slider.menuIcon} 
//                             alt="Icon" 
//                             className="w-10 h-10 object-cover rounded-lg bg-gray-100"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div className="text-xs text-gray-400 italic px-2 py-2">No icon</div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <div className="flex items-center">
//                         {slider.sliderImage ? (
//                           <img 
//                             src={slider.sliderImage} 
//                             alt="Slider" 
//                             className="w-32 h-16 object-cover rounded-md bg-gray-100"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div className="text-xs text-gray-400 italic px-2 py-2">No image</div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <button
//                         onClick={() => toggleStatus(slider._id)}
//                         className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-all min-w-[80px] ${
//                           slider.status === 'active' 
//                             ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
//                             : 'bg-red-100 text-red-800 hover:bg-red-200'
//                         }`}
//                         title="Click to toggle status"
//                       >
//                         {slider.status === 'active' ? '✓ Active' : '✕ Inactive'}
//                       </button>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <span className="text-xs text-gray-600 whitespace-nowrap">
//                         {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-800 align-middle">
//                       <div className="flex gap-2 flex-wrap">
//                         <button
//                           onClick={() => handleEdit(slider)}
//                           className="px-3 py-1.5 bg-blue-50 text-blue-700 border-none rounded text-xs font-medium cursor-pointer transition-all hover:bg-blue-100 flex items-center gap-1 min-w-[70px]"
//                           title="Edit this slider"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(slider._id)}
//                           className="px-3 py-1.5 bg-red-50 text-red-600 border-none rounded text-xs font-medium cursor-pointer transition-all hover:bg-red-100 flex items-center gap-1 min-w-[70px]"
//                           title="Delete this slider"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="mt-8 py-5 text-center text-gray-600 text-sm border-t border-gray-200">
//         <p className="my-1 text-sm text-gray-600">
//           💡 Tip: Upload high-quality images for better slider performance. Keep file sizes under 5MB.
//         </p>
//         <p className="my-1 text-sm text-gray-600">
//           Total: {sliders.length} sliders • Active: {activeCount} • Inactive: {inactiveCount}
//         </p>
//       </div>
//     </div>
//   );
// }










"use client";

import { useState, useEffect, useRef } from 'react';

interface Slider {
  _id: string;
  menuName: string;
  menuIcon: string;
  sliderImage: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function SliderManagementPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<{id: string, name: string} | null>(null);
  
  const [formData, setFormData] = useState({
    menuName: '',
    menuIcon: '',
    sliderImage: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const iconFileRef = useRef<HTMLInputElement>(null);
  const sliderFileRef = useRef<HTMLInputElement>(null);
  const toastIdCounter = useRef(0);

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = toastIdCounter.current++;
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch sliders from backend
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/adminslider');
      const data = await res.json();
      
      if (data.success && data.data) {
        setSliders(data.data);
      } else {
        showToast(data.message || 'Failed to fetch sliders', 'error');
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      showToast('Failed to load sliders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle icon upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Icon file size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          menuIcon: reader.result as string 
        }));
        showToast('Icon uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle slider image upload
  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Slider image file size must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          sliderImage: reader.result as string 
        }));
        showToast('Slider image uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.menuName.trim()) {
      showToast('Please enter a menu name', 'error');
      return;
    }

    if (!formData.menuIcon && !editingId) {
      showToast('Please upload a menu icon', 'error');
      return;
    }

    if (!formData.sliderImage && !editingId) {
      showToast('Please upload a slider image', 'error');
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing slider
        const res = await fetch(`/api/adminslider/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        if (data.success) {
          showToast('Slider updated successfully!', 'success');
          fetchSliders();
          resetForm();
        } else {
          showToast(data.message || 'Failed to update slider', 'error');
        }
      } else {
        // Add new slider
        const res = await fetch('/api/adminslider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        if (data.success) {
          showToast('Slider added successfully!', 'success');
          fetchSliders();
          resetForm();
        } else {
          showToast(data.message || 'Failed to add slider', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving slider:', error);
      showToast('Failed to save slider. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      menuName: '',
      menuIcon: '',
      sliderImage: '',
      status: 'active'
    });
    setEditingId(null);
    if (iconFileRef.current) iconFileRef.current.value = '';
    if (sliderFileRef.current) sliderFileRef.current.value = '';
    showToast('Form cleared', 'info');
  };

  // Handle edit
  const handleEdit = (slider: Slider) => {
    setFormData({
      menuName: slider.menuName,
      menuIcon: slider.menuIcon,
      sliderImage: slider.sliderImage,
      status: slider.status
    });
    setEditingId(slider._id);
    showToast(`Editing "${slider.menuName}" slider`, 'info');
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('slider-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle delete confirmation
  const confirmDelete = (id: string, name: string) => {
    setSliderToDelete({ id, name });
    setShowDeleteModal(true);
  };

  // Handle delete execution
  const handleDelete = async () => {
    if (!sliderToDelete) return;

    try {
      const res = await fetch(`/api/adminslider/${sliderToDelete.id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast(`"${sliderToDelete.name}" deleted successfully!`, 'success');
        fetchSliders();
        
        // If we were editing this slider, reset the form
        if (editingId === sliderToDelete.id) {
          resetForm();
        }
      } else {
        showToast(data.message || 'Failed to delete slider', 'error');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      showToast('Failed to delete slider. Please try again.', 'error');
    } finally {
      setShowDeleteModal(false);
      setSliderToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSliderToDelete(null);
  };

  // Toggle status
  const toggleStatus = async (id: string) => {
    try {
      const slider = sliders.find(s => s._id === id);
      if (!slider) return;
      
      const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      
      const res = await fetch(`/api/adminslider/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...slider,
          status: newStatus
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast(`Status changed to ${newStatus}`, 'success');
        fetchSliders();
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  // Statistics
  const activeCount = sliders.filter(s => s.status === 'active').length;
  const inactiveCount = sliders.filter(s => s.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans relative">
      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`rounded-lg p-4 shadow-lg border-l-4 flex items-center justify-between transform transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-800 border-l-green-500'
                : toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-l-red-500'
                : 'bg-blue-50 text-blue-800 border-l-blue-500'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <span className="text-green-500 text-xl">✓</span>
              )}
              {toast.type === 'error' && (
                <span className="text-red-500 text-xl">✕</span>
              )}
              {toast.type === 'info' && (
                <span className="text-blue-500 text-xl">ℹ️</span>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 text-lg ml-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && sliderToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Slider</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the slider <span className="font-semibold text-red-700">"{sliderToDelete.name}"</span>?
              </p>
              <p className="text-xs text-gray-500 mt-2">
                All associated data will be permanently removed from the system.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white border border-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <span>🗑️</span>
                Delete Slider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          🎚️ Slider Management
        </h1>
        <p className="text-gray-600 text-base">
          Create and manage website sliders with images and icons
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex-1 min-w-[200px] bg-white border-2 border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
            📊
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500 leading-none">{sliders.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Sliders</div>
          </div>
        </div>
        <div className="flex-1 min-w-[200px] bg-white border-2 border-emerald-500 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
            ✅
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 leading-none">{activeCount}</div>
            <div className="text-sm text-gray-600 mt-1">Active</div>
          </div>
        </div>
        <div className="flex-1 min-w-[200px] bg-white border-2 border-amber-500 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
            ⏸️
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500 leading-none">{inactiveCount}</div>
            <div className="text-sm text-gray-600 mt-1">Inactive</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div id="slider-form" className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
            {editingId ? '✏️ Edit Slider' : '➕ Add New Slider'}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-gray-200"
            >
              ✕ Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Menu Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex flex-col gap-1.5">
                Menu Name *
                <input
                  type="text"
                  name="menuName"
                  value={formData.menuName}
                  onChange={handleInputChange}
                  placeholder="Enter menu name (e.g., Home, Products)"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-colors outline-none focus:border-blue-300"
                  required
                />
              </label>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex flex-col gap-1.5">
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-blue-300"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            {/* Menu Icon Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Menu Icon {!editingId && '*'}</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center cursor-pointer transition-all hover:border-gray-400 min-h-[140px] flex flex-col items-center justify-center gap-2"
                onClick={() => iconFileRef.current?.click()}
              >
                {formData.menuIcon ? (
                  <div className="relative w-full h-full">
                    <img src={formData.menuIcon} alt="Icon Preview" className="w-full max-h-[200px] object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <span className="text-sm font-medium text-white">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl text-gray-400">📁</div>
                    <div className="text-sm font-medium text-gray-700">Click to upload icon</div>
                    <div className="text-xs text-gray-400">PNG, JPG, SVG (Max 2MB)</div>
                  </>
                )}
                <input
                  ref={iconFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Slider Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Slider Image {!editingId && '*'}</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center cursor-pointer transition-all hover:border-gray-400 min-h-[140px] flex flex-col items-center justify-center gap-2"
                onClick={() => sliderFileRef.current?.click()}
              >
                {formData.sliderImage ? (
                  <div className="relative w-full h-full">
                    <img src={formData.sliderImage} alt="Slider Preview" className="w-full max-h-[200px] object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <span className="text-sm font-medium text-white">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl text-gray-400">🖼️</div>
                    <div className="text-sm font-medium text-gray-700">Click to upload slider image</div>
                    <div className="text-xs text-gray-400">Recommended: 1920×800px (Max 5MB)</div>
                  </>
                )}
                <input
                  ref={sliderFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSliderUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              className={`px-8 py-3 bg-blue-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 hover:bg-blue-600 ${
                submitting ? 'opacity-60 cursor-not-allowed' : ''
              }`} 
              disabled={submitting}
            >
              {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? '💾 Update Slider' : '➕ Add Slider')}
            </button>
            <button 
              type="button" 
              onClick={resetForm} 
              className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-gray-200 disabled:opacity-50"
              disabled={submitting}
            >
              🔄 Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Sliders Table */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
            📋 Sliders List
          </h2>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            Showing {sliders.length} slider{sliders.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600">
            <div className="text-3xl mb-4 animate-spin">⏳</div>
            <div>Loading sliders...</div>
          </div>
        ) : sliders.length === 0 ? (
          <div className="text-center py-16 px-8">
            <div className="text-5xl text-gray-300 mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sliders Found</h3>
            <p className="text-sm text-gray-400 m-0">
              Start by adding your first slider using the form above
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">ID</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Menu Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Icon</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Slider Preview</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Created</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sliders.map((slider, index) => (
                  <tr key={slider._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium font-mono">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <div className="font-medium text-gray-800">
                        <strong>{slider.menuName}</strong>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <div className="flex items-center justify-center">
                        {slider.menuIcon ? (
                          <img 
                            src={slider.menuIcon} 
                            alt="Icon" 
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-xs text-gray-400 italic px-2 py-2">No icon</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <div className="flex items-center">
                        {slider.sliderImage ? (
                          <img 
                            src={slider.sliderImage} 
                            alt="Slider" 
                            className="w-32 h-16 object-cover rounded-md bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-xs text-gray-400 italic px-2 py-2">No image</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <button
                        onClick={() => toggleStatus(slider._id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-all min-w-[80px] ${
                          slider.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {slider.status === 'active' ? '✓ Active' : '✕ Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {new Date(slider.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(slider)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 border-none rounded text-xs font-medium cursor-pointer transition-all hover:bg-blue-100 flex items-center gap-1 min-w-[70px]"
                          title="Edit this slider"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(slider._id, slider.menuName)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 border-none rounded text-xs font-medium cursor-pointer transition-all hover:bg-red-100 flex items-center gap-1 min-w-[70px]"
                          title="Delete this slider"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 py-5 text-center text-gray-600 text-sm border-t border-gray-200">
        <p className="my-1 text-sm text-gray-600">
          💡 Tip: Upload high-quality images for better slider performance. Keep file sizes under 5MB.
        </p>
        <p className="my-1 text-sm text-gray-600">
          Total: {sliders.length} sliders • Active: {activeCount} • Inactive: {inactiveCount}
        </p>
      </div>
    </div>
  );
}


