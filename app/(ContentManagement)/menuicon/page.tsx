

// "use client";

// import { useState, useEffect, useRef } from 'react';

// interface MenuIcon {
//   _id: string;
//   menuName: string;
//   menuIcon: string;
//   isActive: boolean;
//   createdAt: string;
// }

// interface Toast {
//   id: number;
//   message: string;
//   type: 'success' | 'error' | 'info';
// }

// export default function MenuIconsPage() {
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     menuName: '',
//     menuIcon: '',
//   });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [menuIcons, setMenuIcons] = useState<MenuIcon[]>([]);
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [iconToDelete, setIconToDelete] = useState<{id: string, name: string} | null>(null);
  
//   const toastIdCounter = useRef(0);

//   // Toast notification system
//   const showToast = (message: string, type: 'success' | 'error' | 'info') => {
//     const id = toastIdCounter.current++;
//     const newToast = { id, message, type };
//     setToasts(prev => [...prev, newToast]);
    
//     // Auto remove toast after 4 seconds
//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, 4000);
//   };

//   const removeToast = (id: number) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   // Fetch menu icons
//   const fetchMenuIcons = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching menu icons...');
      
//       const res = await fetch('/api/menuicon');
      
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || `HTTP ${res.status}`);
//       }
      
//       const data = await res.json();
//       console.log('Fetched data:', data);
      
//       if (data.success && data.data) {
//         setMenuIcons(data.data);
//       } else {
//         throw new Error(data.error || 'Failed to fetch menu icons');
//       }
//     } catch (error) {
//       console.error('Failed to fetch menu icons:', error);
//       showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenuIcons();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         showToast('File size must be less than 5MB', 'error');
//         return;
//       }

//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         showToast('Please upload an image file', 'error');
//         return;
//       }
      
//       // Convert file to base64
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           menuIcon: reader.result as string,
//         }));
//         showToast('Image uploaded successfully', 'success');
//       };
//       reader.onerror = () => {
//         showToast('Failed to read file', 'error');
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.menuName.trim()) {
//       showToast('Please enter menu name', 'error');
//       return;
//     }

//     if (!formData.menuIcon) {
//       showToast('Please upload an icon image', 'error');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const payload = {
//         menuName: formData.menuName,
//         menuIcon: formData.menuIcon,
//         isActive: true
//       };

//       console.log('Sending payload:', { ...payload, menuIcon: 'base64...' });
      
//       let res;
//       if (editingId !== null) {
//         res = await fetch(`/api/menuicon/${editingId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });
//       } else {
//         res = await fetch('/api/menuicon', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });
//       }
      
//       const result = await res.json();
//       console.log('Response:', result);
      
//       if (result.success) {
//         showToast(editingId ? 'Menu icon updated successfully!' : 'Menu icon created successfully!', 'success');
//         fetchMenuIcons();
//         handleResetForm();
//       } else {
//         showToast(`Failed to save: ${result.error || 'Unknown error'}`, 'error');
//       }
//     } catch (error) {
//       console.error('Failed to save menu icon:', error);
//       showToast('Failed to save menu icon', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (icon: MenuIcon) => {
//     setFormData({
//       menuName: icon.menuName,
//       menuIcon: icon.menuIcon,
//     });
//     setEditingId(icon._id);
//     setIsFormVisible(true);
//     showToast(`Editing "${icon.menuName}" menu icon`, 'info');
    
//     // Scroll to top
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Delete confirmation
//   const confirmDelete = (id: string, name: string) => {
//     setIconToDelete({ id, name });
//     setShowDeleteModal(true);
//   };

//   // Execute delete
//   const handleDelete = async () => {
//     if (!iconToDelete) return;

//     try {
//       setLoading(true);
//       const res = await fetch(`/api/menuicon/${iconToDelete.id}`, {
//         method: 'DELETE'
//       });
      
//       const result = await res.json();
      
//       if (result.success) {
//         showToast('Menu icon deleted successfully!', 'success');
//         fetchMenuIcons();
        
//         // If we're editing the deleted icon, reset form
//         if (editingId === iconToDelete.id) {
//           handleResetForm();
//         }
//       } else {
//         showToast(`Failed to delete: ${result.error || 'Unknown error'}`, 'error');
//       }
//     } catch (error) {
//       console.error('Failed to delete menu icon:', error);
//       showToast('Failed to delete menu icon', 'error');
//     } finally {
//       setLoading(false);
//       setShowDeleteModal(false);
//       setIconToDelete(null);
//     }
//   };

//   // Cancel delete
//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setIconToDelete(null);
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       const icon = menuIcons.find(m => m._id === id);
//       if (!icon) return;
      
//       const res = await fetch(`/api/menuicon/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           isActive: !icon.isActive
//         })
//       });
      
//       const result = await res.json();
      
//       if (result.success) {
//         // Update local state immediately
//         setMenuIcons(menuIcons.map(m => 
//           m._id === id ? { ...m, isActive: !m.isActive } : m
//         ));
//         showToast(`Status changed to ${!icon.isActive ? 'Active' : 'Inactive'}`, 'success');
//       } else {
//         showToast(`Failed to update status: ${result.error}`, 'error');
//         fetchMenuIcons(); // Refresh on error
//       }
//     } catch (error) {
//       console.error('Failed to toggle status:', error);
//       showToast('Failed to toggle status', 'error');
//       fetchMenuIcons(); // Refresh on error
//     }
//   };

//   const handleResetForm = () => {
//     setFormData({
//       menuName: '',
//       menuIcon: '',
//     });
//     setEditingId(null);
//     setIsFormVisible(false);
//     showToast('Form cleared', 'info');
//   };

//   const handleCancel = () => {
//     handleResetForm();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 font-sans relative">
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
//       {showDeleteModal && iconToDelete && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <span className="text-red-600 text-2xl">⚠️</span>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">Delete Menu Icon</h3>
//                 <p className="text-sm text-gray-600">This action cannot be undone</p>
//               </div>
//             </div>
            
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete the menu icon <span className="font-semibold text-red-700">"{iconToDelete.name}"</span>?
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
//                 Delete Menu Icon
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Icons Management</h1>
//         <p className="text-gray-600">Manage your menu icons</p>
//       </div>

//       {/* Add Button */}
//       <div className="mb-8">
//         <button 
//           onClick={() => setIsFormVisible(true)}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
//         >
//           <span className="text-xl">+</span> Add New Menu Icon
//         </button>
//       </div>

//       {/* Form Section */}
//       {isFormVisible && (
//         <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
//           <div className="p-8">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900">
//                 {editingId ? 'Edit Menu Icon' : 'Add New Menu Icon'}
//               </h2>
//               <button 
//                 onClick={handleCancel}
//                 className="text-gray-500 text-2xl hover:text-gray-700 hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
//               >
//                 ×
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Menu Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="menuName"
//                   value={formData.menuName}
//                   onChange={handleInputChange}
//                   placeholder="Enter menu name"
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Icon Image *
//                 </label>
//                 <div className="w-full">
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer bg-gray-50 hover:border-indigo-400 transition-colors relative">
//                     {formData.menuIcon ? (
//                       <div className="max-w-xs mx-auto relative group">
//                         <img 
//                           src={formData.menuIcon} 
//                           alt="Preview"
//                           className="w-full h-40 object-cover rounded-lg"
//                         />
//                         <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                           <span className="text-white font-semibold">Change Image</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center gap-3">
//                         <div className="text-5xl text-gray-400">📁</div>
//                         <span className="text-base font-semibold text-gray-700">Click to upload icon image</span>
//                         <span className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</span>
//                       </div>
//                     )}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       required={!editingId}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-4 pt-5">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   disabled={loading}
//                   className="px-6 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
//                 >
//                   {loading ? 'Saving...' : editingId ? 'Update Menu Icon' : 'Add Menu Icon'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Menu Icons Table */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="p-8">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-6">Menu Icons List</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ID</th>
//                   <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Menu Name</th>
//                   <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Icon Preview</th>
//                   <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Status</th>
//                   <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Created Date</th>
//                   <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {menuIcons.map((icon, index) => (
//                   <tr key={icon._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                     <td className="py-5 px-5 text-gray-700">{index + 1}</td>
//                     <td className="py-5 px-5">
//                       <div className="flex items-center">
//                         <span className="font-medium text-gray-900">{icon.menuName}</span>
//                         {editingId === icon._id && (
//                           <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
//                             Editing
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-5 px-5">
//                       <div className="flex items-center gap-3">
//                         <img 
//                           src={icon.menuIcon} 
//                           alt={icon.menuName}
//                           className="w-16 h-16 object-cover rounded-lg"
//                         />
//                         <span className="text-xs text-gray-500">Icon Image</span>
//                       </div>
//                     </td>
//                     <td className="py-5 px-5">
//                       <button
//                         onClick={() => handleToggleStatus(icon._id)}
//                         className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
//                           icon.isActive 
//                             ? 'bg-green-100 text-green-800 hover:bg-green-200' 
//                             : 'bg-red-100 text-red-800 hover:bg-red-200'
//                         }`}
//                       >
//                         {icon.isActive ? 'Active' : 'Inactive'}
//                       </button>
//                     </td>
//                     <td className="py-5 px-5 text-gray-700">
//                       {new Date(icon.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })}
//                     </td>
//                     <td className="py-5 px-5">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(icon)}
//                           className="px-4 py-2 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => confirmDelete(icon._id, icon.menuName)}
//                           className="px-4 py-2 border-2 border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {menuIcons.length === 0 && !loading && (
//               <div className="py-20 text-center text-gray-500">
//                 <div className="text-6xl mb-4">📷</div>
//                 <h3 className="text-xl font-semibold mb-2">No Menu Icons Found</h3>
//                 <p>Click "Add New Menu Icon" to create your first icon</p>
//               </div>
//             )}
            
//             {loading && (
//               <div className="py-10 text-center text-gray-500">
//                 Loading menu icons...
//               </div>
//             )}
//           </div>
          
//           {/* Summary */}
//           <div className="flex justify-end gap-8 pt-6 mt-6 border-t border-gray-200">
//             <div className="text-center">
//               <div className="text-sm text-gray-600 mb-1">Total Icons</div>
//               <div className="text-2xl font-bold text-gray-900">{menuIcons.length}</div>
//             </div>
//             <div className="text-center">
//               <div className="text-sm text-gray-600 mb-1">Active</div>
//               <div className="text-2xl font-bold text-green-600">{menuIcons.filter(s => s.isActive).length}</div>
//             </div>
//             <div className="text-center">
//               <div className="text-sm text-gray-600 mb-1">Inactive</div>
//               <div className="text-2xl font-bold text-red-600">{menuIcons.filter(s => !s.isActive).length}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }












"use client";

import { useState, useEffect, useRef } from 'react';

interface MenuIcon {
  _id: string;
  menuName: string;
  menuIcon: string;
  isActive: boolean;
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function MenuIconsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    menuName: '',
    menuIcon: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuIcons, setMenuIcons] = useState<MenuIcon[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iconToDelete, setIconToDelete] = useState<{id: string, name: string} | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
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

  // Fetch menu icons with pagination
  const fetchMenuIcons = async (page: number = 1, limit: number = itemsPerPage) => {
    try {
      setLoading(true);
      console.log(`Fetching menu icons... Page: ${page}, Limit: ${limit}`);
      
      const res = await fetch(`/api/menuicon?page=${page}&limit=${limit}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched data:', data);
      
      if (data.success) {
        setMenuIcons(data.data || []);
        setTotalItems(data.total || data.data?.length || 0);
        setCurrentPage(data.page || page);
      } else {
        throw new Error(data.error || 'Failed to fetch menu icons');
      }
    } catch (error) {
      console.error('Failed to fetch menu icons:', error);
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuIcons(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
      }
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          menuIcon: reader.result as string,
        }));
        showToast('Image uploaded successfully', 'success');
      };
      reader.onerror = () => {
        showToast('Failed to read file', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.menuName.trim()) {
      showToast('Please enter menu name', 'error');
      return;
    }

    if (!formData.menuIcon) {
      showToast('Please upload an icon image', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        menuName: formData.menuName,
        menuIcon: formData.menuIcon,
        isActive: true
      };

      console.log('Sending payload:', { ...payload, menuIcon: 'base64...' });
      
      let res;
      if (editingId !== null) {
        res = await fetch(`/api/menuicon/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/menuicon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      const result = await res.json();
      console.log('Response:', result);
      
      if (result.success) {
        showToast(editingId ? 'Menu icon updated successfully!' : 'Menu icon created successfully!', 'success');
        fetchMenuIcons(currentPage, itemsPerPage);
        handleResetForm();
      } else {
        showToast(`Failed to save: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Failed to save menu icon:', error);
      showToast('Failed to save menu icon', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (icon: MenuIcon) => {
    setFormData({
      menuName: icon.menuName,
      menuIcon: icon.menuIcon,
    });
    setEditingId(icon._id);
    setIsFormVisible(true);
    showToast(`Editing "${icon.menuName}" menu icon`, 'info');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete confirmation
  const confirmDelete = (id: string, name: string) => {
    setIconToDelete({ id, name });
    setShowDeleteModal(true);
  };

  // Execute delete
  const handleDelete = async () => {
    if (!iconToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/menuicon/${iconToDelete.id}`, {
        method: 'DELETE'
      });
      
      const result = await res.json();
      
      if (result.success) {
        showToast('Menu icon deleted successfully!', 'success');
        fetchMenuIcons(currentPage, itemsPerPage);
        
        // If we're editing the deleted icon, reset form
        if (editingId === iconToDelete.id) {
          handleResetForm();
        }
      } else {
        showToast(`Failed to delete: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Failed to delete menu icon:', error);
      showToast('Failed to delete menu icon', 'error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setIconToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIconToDelete(null);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const icon = menuIcons.find(m => m._id === id);
      if (!icon) return;
      
      const res = await fetch(`/api/menuicon/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !icon.isActive
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        // Update local state immediately
        setMenuIcons(menuIcons.map(m => 
          m._id === id ? { ...m, isActive: !m.isActive } : m
        ));
        showToast(`Status changed to ${!icon.isActive ? 'Active' : 'Inactive'}`, 'success');
      } else {
        showToast(`Failed to update status: ${result.error}`, 'error');
        fetchMenuIcons(currentPage, itemsPerPage); // Refresh on error
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showToast('Failed to toggle status', 'error');
      fetchMenuIcons(currentPage, itemsPerPage); // Refresh on error
    }
  };

  const handleResetForm = () => {
    setFormData({
      menuName: '',
      menuIcon: '',
    });
    setEditingId(null);
    setIsFormVisible(false);
    showToast('Form cleared', 'info');
  };

  const handleCancel = () => {
    handleResetForm();
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans relative">
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
      {showDeleteModal && iconToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Menu Icon</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the menu icon <span className="font-semibold text-red-700">"{iconToDelete.name}"</span>?
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
                Delete Menu Icon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Menu Icons Management</h1>
        <p className="text-gray-600">Manage your menu icons</p>
      </div>

      {/* Add Button */}
      <div className="mb-8">
        <button 
          onClick={() => setIsFormVisible(true)}
          className="bg-indigo-600 text-white px-4 py-3 md:px-6 md:py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors w-full md:w-auto justify-center"
        >
          <span className="text-xl">+</span> Add New Menu Icon
        </button>
      </div>

      {/* Form Section */}
      {isFormVisible && (
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {editingId ? 'Edit Menu Icon' : 'Add New Menu Icon'}
              </h2>
              <button 
                onClick={handleCancel}
                className="text-gray-500 text-2xl hover:text-gray-700 hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Menu Name *
                </label>
                <input
                  type="text"
                  name="menuName"
                  value={formData.menuName}
                  onChange={handleInputChange}
                  placeholder="Enter menu name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Icon Image *
                </label>
                <div className="w-full">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-10 text-center cursor-pointer bg-gray-50 hover:border-indigo-400 transition-colors relative">
                    {formData.menuIcon ? (
                      <div className="max-w-xs mx-auto relative group">
                        <img 
                          src={formData.menuIcon} 
                          alt="Preview"
                          className="w-full h-32 md:h-40 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-semibold text-sm md:text-base">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-4xl md:text-5xl text-gray-400">📁</div>
                        <span className="text-sm md:text-base font-semibold text-gray-700">Click to upload icon image</span>
                        <span className="text-xs md:text-sm text-gray-500">PNG, JPG, GIF up to 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!editingId}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-4 pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors order-2 md:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors order-1 md:order-2"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Menu Icon' : 'Add Menu Icon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Icons Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Menu Icons List</h2>
            
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ID</th>
                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Menu Name</th>
                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Icon Preview</th>
                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Status</th>
                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Created Date</th>
                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuIcons.map((icon, index) => (
                    <tr key={icon._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-5 text-gray-700">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="py-5 px-5">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{icon.menuName}</span>
                          {editingId === icon._id && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Editing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={icon.menuIcon} 
                            alt={icon.menuName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <span className="text-xs text-gray-500">Icon Image</span>
                        </div>
                      </td>
                      <td className="py-5 px-5">
                        <button
                          onClick={() => handleToggleStatus(icon._id)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                            icon.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {icon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-5 px-5 text-gray-700">
                        {new Date(icon.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-5 px-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(icon)}
                            className="px-4 py-2 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(icon._id, icon.menuName)}
                            className="px-4 py-2 border-2 border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {menuIcons.map((icon, index) => (
                <div key={icon._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                        <span className="font-semibold text-gray-900">{icon.menuName}</span>
                        {editingId === icon._id && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Editing
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(icon.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(icon._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        icon.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {icon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={icon.menuIcon} 
                      alt={icon.menuName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Icon Preview</div>
                      <div className="text-xs text-gray-500">Click to view full size</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(icon)}
                      className="flex-1 px-4 py-2 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(icon._id, icon.menuName)}
                      className="flex-1 px-4 py-2 border-2 border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {menuIcons.length === 0 && !loading && (
              <div className="py-16 md:py-20 text-center text-gray-500">
                <div className="text-5xl md:text-6xl mb-4">📷</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">No Menu Icons Found</h3>
                <p className="text-sm md:text-base">Click "Add New Menu Icon" to create your first icon</p>
              </div>
            )}
            
            {loading && (
              <div className="py-10 text-center text-gray-500">
                Loading menu icons...
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{' '}
                of <span className="font-semibold">{totalItems}</span> menu icons
              </div>
              
              <div className="flex items-center gap-1">
                {/* First Page Button */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">First page</span>
                  <span aria-hidden="true">«</span>
                </button>
                
                {/* Previous Page Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Previous page</span>
                  <span aria-hidden="true">‹</span>
                </button>
                
                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNum === 'number' ? goToPage(pageNum) : null}
                    disabled={pageNum === '...'}
                    className={`min-w-[40px] px-3 py-2 rounded-lg border ${
                      pageNum === currentPage
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                {/* Next Page Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Next page</span>
                  <span aria-hidden="true">›</span>
                </button>
                
                {/* Last Page Button */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Last page</span>
                  <span aria-hidden="true">»</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Summary */}
          {menuIcons.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 pt-6 mt-6 border-t border-gray-200">
              <div className="text-center min-w-[100px]">
                <div className="text-sm text-gray-600 mb-1">Total Icons</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{totalItems}</div>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="text-sm text-gray-600 mb-1">Active</div>
                <div className="text-xl md:text-2xl font-bold text-green-600">{menuIcons.filter(s => s.isActive).length}</div>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="text-sm text-gray-600 mb-1">Inactive</div>
                <div className="text-xl md:text-2xl font-bold text-red-600">{menuIcons.filter(s => !s.isActive).length}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
