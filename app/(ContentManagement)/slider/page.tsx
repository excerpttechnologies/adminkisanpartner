


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

import { useState, useEffect, useRef } from 'react';
import { Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface Slider {
  _id: string;
  menuName: string;
  menuIcon: string;
  sliderImage: string;
  status: 'active' | 'inactive';
  role: string;
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function SliderManagementPage() {
  const [allSliders, setAllSliders] = useState<Slider[]>([]);
  const [displayedSliders, setDisplayedSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<{id: string, name: string} | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  const [formData, setFormData] = useState({
    menuName: '',
    menuIcon: '',
    sliderImage: '',
    role: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [sliderFile, setSliderFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const iconFileRef = useRef<HTMLInputElement>(null);
  const sliderFileRef = useRef<HTMLInputElement>(null);
  const toastIdCounter = useRef(0);

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = toastIdCounter.current++;
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
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
        setAllSliders(data.data);
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

  // Apply pagination to displayed sliders
  useEffect(() => {
    if (allSliders.length === 0) {
      setDisplayedSliders([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    // Calculate total pages
    const totalPagesCount = Math.ceil(allSliders.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    // Ensure current page is valid
    if (currentPage > totalPagesCount) {
      setCurrentPage(1);
    }
    
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Get sliders for current page
    const slidersForPage = allSliders.slice(startIndex, endIndex);
    setDisplayedSliders(slidersForPage);
    
  }, [allSliders, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination range
  const getPaginationRange = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, allSliders.length);
    return { startItem, endItem };
  };

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
      
      setIconFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          menuIcon: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
      showToast('Icon selected successfully', 'success');
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
      
      setSliderFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          sliderImage: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
      showToast('Slider image selected successfully', 'success');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.menuName.trim()) {
      showToast('Please enter a menu name', 'error');
      return;
    }

    if (!editingId && (!iconFile || !sliderFile)) {
      showToast('Please upload both icon and slider image', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('menuName', formData.menuName);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('status', formData.status);
      
      // Only append files if they exist
      if (iconFile) {
        formDataToSend.append('menuIcon', iconFile);
      }
      
      if (sliderFile) {
        formDataToSend.append('sliderImage', sliderFile);
      }

      let url = '/api/adminslider';
      let method = 'POST';
      
      if (editingId) {
        url = `/api/adminslider/${editingId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        body: formDataToSend
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast(editingId ? 'Slider updated successfully!' : 'Slider added successfully!', 'success');
        fetchSliders();
        resetForm();
      } else {
        showToast(data.message || (editingId ? 'Failed to update slider' : 'Failed to add slider'), 'error');
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
      role: '',
      status: 'active'
    });
    setIconFile(null);
    setSliderFile(null);
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
      role: slider.role,
      status: slider.status
    });
    setIconFile(null); // Reset file since we're using existing URL
    setSliderFile(null); // Reset file since we're using existing URL
    setEditingId(slider._id);
    showToast(`Editing "${slider.menuName}" slider`, 'info');
    
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
      const slider = allSliders.find(s => s._id === id);
      if (!slider) return;
      
      const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      
      const formData = new FormData();
      formData.append('menuName', slider.menuName);
      formData.append('role', slider.role);
      formData.append('status', newStatus);
      
      const res = await fetch(`/api/adminslider/${id}`, {
        method: 'PUT',
        body: formData
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

  // Statistics - use allSliders for accurate counts
  const activeCount = allSliders.filter(s => s.status === 'active').length;
  const inactiveCount = allSliders.filter(s => s.status === 'inactive').length;
  const { startItem, endItem } = getPaginationRange();

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
            <div className="text-2xl font-bold text-blue-500 leading-none">{allSliders.length}</div>
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

            {/* Role */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex flex-col gap-1.5">
                Role
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Enter role (e.g., admin, user, guest)"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-colors outline-none focus:border-blue-300"
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
              <label className="text-sm font-semibold text-gray-700">
                Menu Icon {!editingId && '*'}
                {editingId && <span className="text-gray-500 ml-2">(Leave empty to keep current)</span>}
              </label>
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
              <label className="text-sm font-semibold text-gray-700">
                Slider Image {!editingId && '*'}
                {editingId && <span className="text-gray-500 ml-2">(Leave empty to keep current)</span>}
              </label>
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
            Showing {displayedSliders.length} of {allSliders.length} slider{allSliders.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600">
            <div className="text-3xl mb-4 animate-spin">⏳</div>
            <div>Loading sliders...</div>
          </div>
        ) : allSliders.length === 0 ? (
          <div className="text-center py-16 px-8">
            <div className="text-5xl text-gray-300 mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sliders Found</h3>
            <p className="text-sm text-gray-400 m-0">
              Start by adding your first slider using the form above
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">SI NO</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Role</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Menu Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Icon</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Slider Preview</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Created</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSliders.map((slider, index) => {
                    // Calculate actual index considering pagination
                    const actualIndex = (currentPage - 1) * itemsPerPage + index;
                    
                    return (
                      <tr key={slider._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium font-mono">
                            #{actualIndex + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 align-middle">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            slider.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : slider.role === 'user'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slider.role || 'Not specified'}
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
                                className="w-20 h-10 object-cover rounded-md bg-gray-100"
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination and Limit Controls - Only show if there are sliders */}
            {allSliders.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">Show</div>
                    <FormControl size="small" className="w-32">
                      <Select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        displayEmpty
                        className="text-sm"
                      >
                        <MenuItem value={5}>5 per page</MenuItem>
                        <MenuItem value={10}>10 per page</MenuItem>
                        <MenuItem value={20}>20 per page</MenuItem>
                        <MenuItem value={50}>50 per page</MenuItem>
                        <MenuItem value={100}>100 per page</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <div className="text-sm text-gray-600">
                      Showing {startItem} to {endItem} of {allSliders.length} sliders
                    </div>
                  </div>

                  {/* Pagination component */}
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 hidden md:block">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                      size="medium"
                      showFirstButton
                      showLastButton
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 py-5 text-center text-gray-600 text-sm border-t border-gray-200">
        <p className="my-1 text-sm text-gray-600">
          💡 Tip: Upload high-quality images for better slider performance. Keep file sizes under 5MB.
        </p>
        <p className="my-1 text-sm text-gray-600">
          Total: {allSliders.length} sliders • Active: {activeCount} • Inactive: {inactiveCount}
        </p>
      </div>
    </div>
  );
}
