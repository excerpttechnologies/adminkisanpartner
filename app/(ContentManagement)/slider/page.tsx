


// "use client";

// import { useState, useEffect, useRef } from 'react';

// interface Slider {
//   _id: string;
//   menuName: string;
//   menuIcon: string;
//   sliderImage: string;
//   status: 'active' | 'inactive';
//   role: string;
//   createdAt: string;
// }

// interface Toast {
//   id: number;
//   message: string;
//   type: 'success' | 'error' | 'info';
// }

// export default function SliderManagementPage() {
//   const [sliders, setSliders] = useState<Slider[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [sliderToDelete, setSliderToDelete] = useState<{id: string, name: string} | null>(null);
  
//   const [formData, setFormData] = useState({
//     menuName: '',
//     menuIcon: '',
//     sliderImage: '',
//     role: '',
//     status: 'active' as 'active' | 'inactive'
//   });
  
//   const [iconFile, setIconFile] = useState<File | null>(null);
//   const [sliderFile, setSliderFile] = useState<File | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   const iconFileRef = useRef<HTMLInputElement>(null);
//   const sliderFileRef = useRef<HTMLInputElement>(null);
//   const toastIdCounter = useRef(0);

//   // Toast notification system
//   const showToast = (message: string, type: 'success' | 'error' | 'info') => {
//     const id = toastIdCounter.current++;
//     const newToast = { id, message, type };
//     setToasts(prev => [...prev, newToast]);
    
//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, 4000);
//   };

//   const removeToast = (id: number) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   // Fetch sliders from backend
//   const fetchSliders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/adminslider');
//       const data = await res.json();
      
//       if (data.success && data.data) {
//         setSliders(data.data);
//       } else {
//         showToast(data.message || 'Failed to fetch sliders', 'error');
//       }
//     } catch (error) {
//       console.error('Error fetching sliders:', error);
//       showToast('Failed to load sliders', 'error');
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
//         showToast('Icon file size must be less than 2MB', 'error');
//         return;
//       }
      
//       setIconFile(file);
      
//       // Create preview URL
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           menuIcon: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//       showToast('Icon selected successfully', 'success');
//     }
//   };

//   // Handle slider image upload
//   const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         showToast('Slider image file size must be less than 5MB', 'error');
//         return;
//       }
      
//       setSliderFile(file);
      
//       // Create preview URL
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ 
//           ...prev, 
//           sliderImage: reader.result as string 
//         }));
//       };
//       reader.readAsDataURL(file);
//       showToast('Slider image selected successfully', 'success');
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.menuName.trim()) {
//       showToast('Please enter a menu name', 'error');
//       return;
//     }

//     if (!editingId && (!iconFile || !sliderFile)) {
//       showToast('Please upload both icon and slider image', 'error');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const formDataToSend = new FormData();
//       formDataToSend.append('menuName', formData.menuName);
//       formDataToSend.append('role', formData.role);
//       formDataToSend.append('status', formData.status);
      
//       // Only append files if they exist
//       if (iconFile) {
//         formDataToSend.append('menuIcon', iconFile);
//       }
      
//       if (sliderFile) {
//         formDataToSend.append('sliderImage', sliderFile);
//       }

//       let url = '/api/adminslider';
//       let method = 'POST';
      
//       if (editingId) {
//         url = `/api/adminslider/${editingId}`;
//         method = 'PUT';
//       }

//       const res = await fetch(url, {
//         method: method,
//         body: formDataToSend
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         showToast(editingId ? 'Slider updated successfully!' : 'Slider added successfully!', 'success');
//         fetchSliders();
//         resetForm();
//       } else {
//         showToast(data.message || (editingId ? 'Failed to update slider' : 'Failed to add slider'), 'error');
//       }
//     } catch (error) {
//       console.error('Error saving slider:', error);
//       showToast('Failed to save slider. Please try again.', 'error');
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
//       role: '',
//       status: 'active'
//     });
//     setIconFile(null);
//     setSliderFile(null);
//     setEditingId(null);
    
//     if (iconFileRef.current) iconFileRef.current.value = '';
//     if (sliderFileRef.current) sliderFileRef.current.value = '';
//     showToast('Form cleared', 'info');
//   };

//   // Handle edit
//   const handleEdit = (slider: Slider) => {
//     setFormData({
//       menuName: slider.menuName,
//       menuIcon: slider.menuIcon,
//       sliderImage: slider.sliderImage,
//       role: slider.role,
//       status: slider.status
//     });
//     setIconFile(null); // Reset file since we're using existing URL
//     setSliderFile(null); // Reset file since we're using existing URL
//     setEditingId(slider._id);
//     showToast(`Editing "${slider.menuName}" slider`, 'info');
    
//     setTimeout(() => {
//       document.getElementById('slider-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   // Handle delete confirmation
//   const confirmDelete = (id: string, name: string) => {
//     setSliderToDelete({ id, name });
//     setShowDeleteModal(true);
//   };

//   // Handle delete execution
//   const handleDelete = async () => {
//     if (!sliderToDelete) return;

//     try {
//       const res = await fetch(`/api/adminslider/${sliderToDelete.id}`, {
//         method: 'DELETE'
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         showToast(`"${sliderToDelete.name}" deleted successfully!`, 'success');
//         fetchSliders();
        
//         if (editingId === sliderToDelete.id) {
//           resetForm();
//         }
//       } else {
//         showToast(data.message || 'Failed to delete slider', 'error');
//       }
//     } catch (error) {
//       console.error('Error deleting slider:', error);
//       showToast('Failed to delete slider. Please try again.', 'error');
//     } finally {
//       setShowDeleteModal(false);
//       setSliderToDelete(null);
//     }
//   };

//   // Cancel delete
//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setSliderToDelete(null);
//   };

//   // Toggle status
//   const toggleStatus = async (id: string) => {
//     try {
//       const slider = sliders.find(s => s._id === id);
//       if (!slider) return;
      
//       const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      
//       const formData = new FormData();
//       formData.append('menuName', slider.menuName);
//       formData.append('role', slider.role);
//       formData.append('status', newStatus);
      
//       const res = await fetch(`/api/adminslider/${id}`, {
//         method: 'PUT',
//         body: formData
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         showToast(`Status changed to ${newStatus}`, 'success');
//         fetchSliders();
//       } else {
//         showToast(data.message || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       console.error('Error toggling status:', error);
//       showToast('Failed to update status', 'error');
//     }
//   };

//   // Statistics
//   const activeCount = sliders.filter(s => s.status === 'active').length;
//   const inactiveCount = sliders.filter(s => s.status === 'inactive').length;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans relative">
//       {/* Toast Notifications Container */}
//       <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-full">
//         {toasts.map(toast => (
//           <div
//             key={toast.id}
//             className={`rounded-lg p-4 shadow-lg border-l-4 flex items-center justify-between transform transition-all duration-300 ${
//               toast.type === 'success'
//                 ? 'bg-green-50 text-green-800 border-l-green-500'
//                 : toast.type === 'error'
//                 ? 'bg-red-50 text-red-800 border-l-red-500'
//                 : 'bg-blue-50 text-blue-800 border-l-blue-500'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               {toast.type === 'success' && (
//                 <span className="text-green-500 text-xl">✓</span>
//               )}
//               {toast.type === 'error' && (
//                 <span className="text-red-500 text-xl">✕</span>
//               )}
//               {toast.type === 'info' && (
//                 <span className="text-blue-500 text-xl">ℹ️</span>
//               )}
//               <span className="text-sm font-medium">{toast.message}</span>
//             </div>
//             <button
//               onClick={() => removeToast(toast.id)}
//               className="text-gray-400 hover:text-gray-600 text-lg ml-2"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && sliderToDelete && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <span className="text-red-600 text-2xl">⚠️</span>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">Delete Slider</h3>
//                 <p className="text-sm text-gray-600">This action cannot be undone</p>
//               </div>
//             </div>
            
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete the slider <span className="font-semibold text-red-700">"{sliderToDelete.name}"</span>?
//               </p>
//               <p className="text-xs text-gray-500 mt-2">
//                 All associated data will be permanently removed from the system.
//               </p>
//             </div>
            
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={cancelDelete}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white border border-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
//               >
//                 <span>🗑️</span>
//                 Delete Slider
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

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

//             {/* Role */}
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-semibold text-gray-700 flex flex-col gap-1.5">
//                 Role
//                 <input
//                   type="text"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   placeholder="Enter role (e.g., admin, user, guest)"
//                   className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-colors outline-none focus:border-blue-300"
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
//               <label className="text-sm font-semibold text-gray-700">
//                 Menu Icon {!editingId && '*'}
//                 {editingId && <span className="text-gray-500 ml-2">(Leave empty to keep current)</span>}
//               </label>
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
//               <label className="text-sm font-semibold text-gray-700">
//                 Slider Image {!editingId && '*'}
//                 {editingId && <span className="text-gray-500 ml-2">(Leave empty to keep current)</span>}
//               </label>
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
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">SI NO</th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Role</th>
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
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         slider.role === 'admin' 
//                           ? 'bg-purple-100 text-purple-800' 
//                           : slider.role === 'user'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {slider.role || 'Not specified'}
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
//                             className="w-20 h-10 object-cover rounded-md bg-gray-100"
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
//                           onClick={() => confirmDelete(slider._id, slider.menuName)}
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
  Eye
} from "lucide-react";

interface Slider {
  _id: string;
  name: string;
  image: string;
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
      
      // For now, simulate pagination on client side since API doesn't support it
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

  // Filter sliders based on search term
  const filteredSliders = sliders.filter(slider =>
    slider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSlider = async (name: string, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
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

  const handleUpdateSlider = async (id: string, name: string, imageFile: File | null) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
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
      {/* Header Section */}
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

      {/* Search and Filter Section */}
      <div style={searchSection}>
        <div style={searchBox}>
          <Search size={20} style={{ color: "#6b7280" }} />
          <input
            type="text"
            placeholder="Search by slider name..."
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

      {/* Table Section */}
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
            <table style={table}>
              <thead>
                <tr style={tableHeader}>
                  <th style={tableHeaderCell}>Sr.</th>
                  <th style={tableHeaderCell}>Slider Details</th>
                  <th style={tableHeaderCell}>Image Preview</th>
                  <th style={tableHeaderCell}>Created Date</th>
                  <th style={tableHeaderCell}>Edit</th>
                  <th style={tableHeaderCell}>Delete</th>
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
                            <ImageIcon size={14} />
                            Slider Image
                          </span>
                        </div>
                        <div style={sliderPath}>
                          <code style={pathText}>{slider.image}</code>
                        </div>
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
                    {/* <td style={tableCell}>
                      <span style={activeStatus}>
                        <Eye size={14} />
                        Active
                      </span>
                    </td> */}
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

            {/* Pagination */}
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

      {/* Modals */}
      {open && (
        <SliderModal
          onClose={() => setOpen(false)}
          onSave={(name: string, imageFile: File | null) => {
            if (imageFile) {
              handleAddSlider(name, imageFile);
            }
          }}
          title="Add New Slider"
        />
      )}

      {editingSlider && (
        <SliderModal
          onClose={() => setEditingSlider(null)}
          onSave={(name: string, imageFile: File | null) =>
            handleUpdateSlider(editingSlider._id, name, imageFile)
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

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed"
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

const sliderPath: React.CSSProperties = {
  marginTop: "4px"
};

const pathText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  background: "#f3f4f6",
  padding: "4px 8px",
  borderRadius: "4px",
  fontFamily: "monospace"
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

const activeStatus: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  background: "#d1fae5",
  color: "#065f46",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "500"
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


