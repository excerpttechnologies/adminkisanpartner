



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
//   Search,
//   Filter,
//   Eye,
//   Layers,
//   RefreshCw,
//   ChevronDown,
//   ChevronUp,
//   User,
//   AlertCircle,
//   ChevronsLeft,
//   ChevronsRight,
//   MoreVertical,
//   ExternalLink
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
//   const [filteredSliders, setFilteredSliders] = useState<Slider[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [totalSliders, setTotalSliders] = useState(0);
//   const [allSliders, setAllSliders] = useState<Slider[]>([]);
//   const [expandedCard, setExpandedCard] = useState<string | null>(null);
//   const [itemsPerPage, setItemsPerPage] = useState(8);

//   const loadSliders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/slider`);
//       if (!res.ok) throw new Error("Failed to fetch sliders");
//       const data = await res.json();
      
//       // Handle both array and object response formats
//       const sliderData = data.data || data || [];
//       setAllSliders(sliderData);
//       setTotalSliders(sliderData.length);
//       setSliders(sliderData);
//       setFilteredSliders(sliderData);
      
//       // Calculate initial pagination
//       const newTotalPages = Math.ceil(sliderData.length / itemsPerPage);
//       setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
      
//     } catch (error) {
//       console.error("Failed to load sliders:", error);
//       alert("Failed to load sliders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadSliders();
//   }, []);

//   // Filter sliders when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredSliders(allSliders);
//     } else {
//       const filtered = allSliders.filter(slider =>
//         slider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (slider.role && slider.role.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredSliders(filtered);
//     }
//     setCurrentPage(1); // Reset to first page when searching
//   }, [searchTerm, allSliders]);

//   // Update pagination when filtered sliders or items per page changes
//   useEffect(() => {
//     const newTotalPages = Math.ceil(filteredSliders.length / itemsPerPage);
//     setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
    
//     // Adjust current page if it's out of bounds
//     if (currentPage > newTotalPages && newTotalPages > 0) {
//       setCurrentPage(newTotalPages);
//     } else if (filteredSliders.length === 0) {
//       setCurrentPage(1);
//     }
//   }, [filteredSliders, itemsPerPage, currentPage]);

//   // Get current page sliders
//   const getCurrentPageSliders = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredSliders.slice(startIndex, endIndex);
//   };

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
//       loadSliders();
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
//       loadSliders();
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

//       loadSliders();
//       // If we're on a page that becomes empty, go back one page
//       if (getCurrentPageSliders().length === 1 && currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     } catch (error) {
//       console.error("Delete slider error:", error);
//       alert("Failed to delete slider");
//     }
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       setExpandedCard(null);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleItemsPerPageChange = (newLimit: number) => {
//     setItemsPerPage(newLimit);
//     setCurrentPage(1);
//     setExpandedCard(null);
//   };

//   const toggleCardExpansion = (id: string) => {
//     setExpandedCard(expandedCard === id ? null : id);
//   };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//   };

//   const handleResetFilters = () => {
//     setSearchTerm("");
//     setCurrentPage(1);
//     setExpandedCard(null);
//   };

//   const handleRefresh = () => {
//     loadSliders();
//     setCurrentPage(1);
//     setExpandedCard(null);
//   };

//   // Calculate pagination numbers
//   const getPageNumbers = () => {
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

//   // Pagination Component
//   const Pagination = () => {
//     const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
//     const showingTo = Math.min(currentPage * itemsPerPage, filteredSliders.length);
//     const pageNumbers = getPageNumbers();
    
//     return (
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-100">
//         {/* Items per page selector */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-600">Show:</span>
//           <div className="relative">
//             <select
//               value={itemsPerPage}
//               onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//               className="appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white pr-8 cursor-pointer hover:border-gray-300 transition-colors"
//             >
//               <option value={4}>4 per page</option>
//               <option value={8}>8 per page</option>
//               <option value={12}>12 per page</option>
//               <option value={16}>16 per page</option>
//               <option value={20}>20 per page</option>
//               <option value={50}>50 per page</option>
//             </select>
//             <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//           </div>
//         </div>

//         {/* Page info */}
//         <div className="text-sm text-gray-600">
//           Showing <span className="font-semibold text-gray-900">{showingFrom}</span> to{" "}
//           <span className="font-semibold text-gray-900">{showingTo}</span> of{" "}
//           <span className="font-semibold text-gray-900">{filteredSliders.length}</span> sliders
//         </div>

//         {/* Pagination buttons */}
//         <div className="flex items-center gap-1">
//           {/* First Page Button */}
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//             className={`p-2 rounded-lg border transition-all duration-200 ${
//               currentPage === 1
//                 ? 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
//                 : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5 hover:border-gray-300'
//             }`}
//             title="First page"
//           >
//             <ChevronsLeft className="h-4 w-4" />
//           </button>
          
//           {/* Previous Page Button */}
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`p-2 rounded-lg border transition-all duration-200 ${
//               currentPage === 1
//                 ? 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
//                 : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5 hover:border-gray-300'
//             }`}
//             title="Previous page"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
          
//           {/* Page numbers */}
//           <div className="flex items-center gap-1">
//             {pageNumbers.map((pageNum, index) => (
//               pageNum === '...' ? (
//                 <span key={index} className="px-2 text-gray-400">...</span>
//               ) : (
//                 <button
//                   key={index}
//                   onClick={() => handlePageChange(pageNum as number)}
//                   className={`px-3 py-1.5 min-w-[36px] text-sm rounded-lg transition-all duration-200 ${
//                     pageNum === currentPage
//                       ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
//                       : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 hover:border-gray-300'
//                   }`}
//                 >
//                   {pageNum}
//                 </button>
//               )
//             ))}
//           </div>
          
//           {/* Next Page Button */}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`p-2 rounded-lg border transition-all duration-200 ${
//               currentPage === totalPages
//                 ? 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
//                 : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5 hover:border-gray-300'
//             }`}
//             title="Next page"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
          
//           {/* Last Page Button */}
//           <button
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//             className={`p-2 rounded-lg border transition-all duration-200 ${
//               currentPage === totalPages
//                 ? 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
//                 : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5 hover:border-gray-300'
//             }`}
//             title="Last page"
//           >
//             <ChevronsRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Mobile Pagination Component
//   const MobilePagination = () => {
//     const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
//     const showingTo = Math.min(currentPage * itemsPerPage, filteredSliders.length);
//     const pageNumbers = getPageNumbers();
    
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
//         <div className="flex flex-col gap-4">
//           {/* Stats row */}
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-600">
//               Showing <span className="font-semibold">{showingFrom}-{showingTo}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">Show:</span>
//               <select
//                 value={itemsPerPage}
//                 onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                 className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
//               >
//                 <option value={4}>4</option>
//                 <option value={8}>8</option>
//                 <option value={12}>12</option>
//                 <option value={16}>16</option>
//               </select>
//             </div>
//           </div>
          
//           {/* Pagination controls */}
//           <div className="flex items-center justify-between">
//             {/* First & Previous buttons */}
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => handlePageChange(1)}
//                 disabled={currentPage === 1}
//                 className={`p-2 rounded-lg transition-all duration-200 ${
//                   currentPage === 1
//                     ? 'text-gray-400 cursor-not-allowed bg-gray-50'
//                     : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:-translate-y-0.5 hover:border-gray-300'
//                 }`}
//                 title="First page"
//               >
//                 <ChevronsLeft className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
//                   currentPage === 1
//                     ? 'text-gray-400 cursor-not-allowed bg-gray-50'
//                     : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:-translate-y-0.5 hover:border-gray-300'
//                 }`}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Prev
//               </button>
//             </div>
            
//             {/* Page numbers */}
//             <div className="flex items-center gap-1">
//               {pageNumbers.map((pageNum, index) => (
//                 pageNum === '...' ? (
//                   <span key={index} className="px-1 text-gray-500">...</span>
//                 ) : (
//                   <button
//                     key={index}
//                     onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
//                     className={`px-3 py-1 text-sm rounded-lg min-w-8 transition-all duration-200 ${
//                       pageNum === currentPage
//                         ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
//                         : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 hover:border-gray-300'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 )
//               ))}
//             </div>
            
//             {/* Next & Last buttons */}
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
//                   currentPage === totalPages
//                     ? 'text-gray-400 cursor-not-allowed bg-gray-50'
//                     : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:-translate-y-0.5 hover:border-gray-300'
//                 }`}
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className={`p-2 rounded-lg transition-all duration-200 ${
//                   currentPage === totalPages
//                     ? 'text-gray-400 cursor-not-allowed bg-gray-50'
//                     : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:-translate-y-0.5 hover:border-gray-300'
//                 }`}
//                 title="Last page"
//               >
//                 <ChevronsRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
          
//           {/* Page jump */}
//           <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
//             <span className="text-sm text-gray-600">Go to:</span>
//             <input
//               type="number"
//               min="1"
//               max={totalPages}
//               value={currentPage}
//               onChange={(e) => {
//                 const page = parseInt(e.target.value);
//                 if (!isNaN(page) && page >= 1 && page <= totalPages) {
//                   handlePageChange(page);
//                 }
//               }}
//               className="w-16 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-colors"
//             />
//             <span className="text-sm text-gray-600">of {totalPages}</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading && allSliders.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/20 p-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600 font-medium">Loading sliders...</p>
//       </div>
//     );
//   }

//   const currentSliders = getCurrentPageSliders();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-3 sm:p-6">
//       {/* Header Section */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Slider Management</h1>
//             <p className="text-gray-600 mt-1 text-sm sm:text-base">
//               Manage your website sliders and banners
//             </p>
//           </div>
//           <button
//             onClick={() => setOpen(true)}
//             className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto active:scale-95"
//           >
//             <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
//             Add New Slider
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Sliders</p>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{allSliders.length}</p>
//               </div>
//               <div className="p-2 bg-blue-50 rounded-xl">
//                 <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Filtered</p>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{filteredSliders.length}</p>
//               </div>
//               <div className="p-2 bg-green-50 rounded-xl">
//                 <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Current Page</p>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{currentPage}</p>
//               </div>
//               <div className="p-2 bg-purple-50 rounded-xl">
//                 <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Per Page</p>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{itemsPerPage}</p>
//               </div>
//               <div className="p-2 bg-amber-50 rounded-xl">
//                 <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 hover:shadow-md transition-shadow duration-200">
//         <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//           <div className="relative flex-1">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by slider name or role..."
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base hover:border-gray-300 transition-colors"
//             />
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 text-sm">
//               <Filter className="h-4 w-4" />
//               Filter
//             </button>
//             <button 
//               onClick={handleResetFilters}
//               className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 active:scale-95 text-sm"
//             >
//               Reset
//             </button>
//             <button 
//               onClick={handleRefresh}
//               className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 active:scale-95 text-sm"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 hover:shadow-md transition-shadow duration-200">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-100">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   SI. No.
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Slider Details
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Image Preview
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Created Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {currentSliders.map((slider, index) => (
//                 <tr key={slider._id} className="hover:bg-gray-50 transition-colors duration-200 group">
//                   <td className="px-6 py-5 whitespace-nowrap text-center">
//                     <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mx-auto group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-200">
//                       <span className="text-sm font-bold text-blue-700">{(currentPage - 1) * itemsPerPage + index + 1}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-3">
                   
//                       <div>
//                         <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
//                           {slider.name}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-0.5">
//                           ID: {slider._id.slice(-8)}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center space-x-3">
//                       <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
//                         <img
//                           src={slider.image}
//                           alt={slider.name}
//                           className="h-16 w-24 object-cover"
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
//                           <button
//                             onClick={() => window.open(slider.image, '_blank')}
//                             className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 bg-white/90 text-gray-700 px-3 py-1 rounded text-xs font-medium flex items-center gap-1 hover:bg-white"
//                           >
//                             <ExternalLink className="h-3 w-3" />
//                             Preview
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap">
//                     <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
//                       {slider.role || "No Role"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-gray-400" />
//                       {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => setEditingSlider(slider)}
//                         className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-blue-200"
//                         title="Edit"
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => window.open(slider.image, '_blank')}
//                         className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200"
//                         title="View"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteSlider(slider._id)}
//                         className="p-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-red-200"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => toggleCardExpansion(slider._id)}
//                         className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200 md:hidden"
//                         title="More options"
//                       >
//                         <MoreVertical className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination for Desktop */}
//         {filteredSliders.length > 0 && <Pagination />}
        
//         {/* Empty State for Desktop */}
//         {currentSliders.length === 0 && (
//           <div className="text-center py-16 px-4">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-6">
//               <ImageIcon className="h-10 w-10 text-blue-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No sliders found</h3>
//             <p className="text-gray-500 mb-6 max-w-md mx-auto">
//               {searchTerm ? "No results match your search criteria. Try a different search term." : "Get started by adding your first slider."}
//             </p>
//             <button
//               onClick={() => setOpen(true)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-md"
//             >
//               <Plus className="h-5 w-5 mr-2 inline" />
//               Add First Slider
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="md:hidden space-y-3">
//         {currentSliders.map((slider, index) => (
//           <div key={slider._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
//             {/* Card Header - Always Visible */}
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
//                       <span className="text-sm font-bold text-blue-600">{index + 1}</span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-bold text-gray-900 text-sm truncate">{slider.name}</h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
//                           {slider.role || "No Role"}
//                         </span>
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <Calendar className="h-3 w-3" />
//                           {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Image Preview (Always Visible) */}
//                   <div className="mt-3">
//                     <div className="relative overflow-hidden rounded-lg border border-gray-200">
//                       <img
//                         src={slider.image}
//                         alt={slider.name}
//                         className="w-full h-40 object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                       <button
//                         onClick={() => window.open(slider.image, '_blank')}
//                         className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-lg text-xs flex items-center gap-1 hover:bg-white transition-colors duration-200"
//                       >
//                         <ExternalLink className="h-3 w-3" />
//                         Full View
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={() => toggleCardExpansion(slider._id)}
//                   className="ml-2 p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 active:scale-95"
//                 >
//                   {expandedCard === slider._id ? (
//                     <ChevronUp className="h-4 w-4" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Expanded Details */}
//             {expandedCard === slider._id && (
//               <div className="p-4 border-t border-gray-100 bg-gray-50/50">
//                 <div className="grid grid-cols-2 gap-3 text-xs mb-4">
//                   <div className="bg-white p-3 rounded-lg border border-gray-100">
//                     <div className="text-gray-500 mb-1">Slider ID</div>
//                     <div className="font-medium truncate" title={slider._id}>
//                       #{slider._id.slice(-8)}
//                     </div>
//                   </div>
//                   <div className="bg-white p-3 rounded-lg border border-gray-100">
//                     <div className="text-gray-500 mb-1">Serial No.</div>
//                     <div className="font-medium">
//                       {(currentPage - 1) * itemsPerPage + index + 1}
//                     </div>
//                   </div>
//                   <div className="bg-white p-3 rounded-lg border border-gray-100">
//                     <div className="text-gray-500 mb-1">Created Date</div>
//                     <div className="font-medium">
//                       {new Date(slider.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })}
//                     </div>
//                   </div>
//                   <div className="bg-white p-3 rounded-lg border border-gray-100">
//                     <div className="text-gray-500 mb-1">Status</div>
//                     <div className="font-medium text-green-600 flex items-center gap-1">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       Active
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => setEditingSlider(slider)}
//                     className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 active:scale-95 shadow-sm"
//                   >
//                     <Edit2 className="h-4 w-4" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteSlider(slider._id)}
//                     className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-rose-600 transition-all duration-200 active:scale-95 shadow-sm"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Quick Actions - Always Visible */}
//             <div className="flex border-t border-gray-100">
//               <button
//                 onClick={() => setEditingSlider(slider)}
//                 className="flex-1 py-3 text-blue-600 hover:bg-blue-50 transition-colors duration-200 active:scale-95 flex items-center justify-center gap-1 text-sm font-medium"
//               >
//                 <Edit2 className="h-4 w-4" />
//                 Edit
//               </button>
//               <div className="w-px bg-gray-100"></div>
//               <button
//                 onClick={() => window.open(slider.image, '_blank')}
//                 className="flex-1 py-3 text-green-600 hover:bg-green-50 transition-colors duration-200 active:scale-95 flex items-center justify-center gap-1 text-sm font-medium"
//               >
//                 <Eye className="h-4 w-4" />
//                 View
//               </button>
//               <div className="w-px bg-gray-100"></div>
//               <button
//                 onClick={() => handleDeleteSlider(slider._id)}
//                 className="flex-1 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 active:scale-95 flex items-center justify-center gap-1 text-sm font-medium"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
        
//         {/* Empty State for Mobile */}
//         {currentSliders.length === 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
//             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mx-auto mb-4">
//               <ImageIcon className="h-8 w-8 text-blue-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No sliders found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchTerm ? "No results match your search criteria." : "Get started by adding your first slider."}
//             </p>
//             <button
//               onClick={() => setOpen(true)}
//               className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all w-full active:scale-95"
//             >
//               <Plus size={20} />
//               Add First Slider
//             </button>
//           </div>
//         )}

//         {/* Mobile Pagination Controls */}
//         {filteredSliders.length > 0 && <MobilePagination />}
//       </div>

//       {/* Modals */}
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













"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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
  AlertCircle,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

interface Slider {
  _id: string;
  name: string;
  image: string;
  role: string;
  createdAt: string;
}

// Helper component for image with fallback
const SliderImage = ({ src, alt, className, onClick }: { src: string; alt: string; className: string; onClick?: () => void }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Try multiple possible paths for an image
  const getPossiblePaths = (originalPath: string): string[] => {
    if (!originalPath) return ['/favicon.ico'];
    
    const paths: string[] = [];
    
    // If it's already a full URL, proxy it through the server
    if (originalPath.startsWith('http')) {
      paths.push(`/api/image-proxy?url=${encodeURIComponent(originalPath)}`);
    } else if (originalPath.startsWith('/')) {
      // For paths like /uploads/ads/filename, use the proxy with full path
      paths.push(`/api/image-proxy?path=${encodeURIComponent(originalPath)}`);
      // Fallback to local path
      paths.push(originalPath);
    } else {
      // For bare filenames, use the proxy
      paths.push(`/api/image-proxy?file=${encodeURIComponent(originalPath)}`);
      // Fallback to local uploads
      paths.push(`/uploads/${originalPath}`);
    }
    
    // Final fallback
    paths.push('/favicon.ico');
    
    return paths;
  };

  const possiblePaths = getPossiblePaths(imageSrc);
  const currentPath = possiblePaths[Math.min(attemptCount, possiblePaths.length - 1)];

  const handleError = () => {
    const nextAttempt = attemptCount + 1;
    
    if (nextAttempt < possiblePaths.length) {
      console.log(`[Image Debug] Path failed: ${possiblePaths[attemptCount]}, trying: ${possiblePaths[nextAttempt]}`);
      setAttemptCount(nextAttempt);
    } else {
      // All paths exhausted
      setHasError(true);
      console.error(`[Image Debug] All paths failed for: ${imageSrc}`);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`} onClick={onClick}>
      <img
        key={currentPath}
        src={currentPath}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 flex-col gap-2">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <div className="text-xs text-gray-500 text-center px-2">Image not found</div>
        </div>
      )}
    </div>
  );
}

// Helper function to format image paths consistently
const getFormattedImagePath = (path: string): string => {
  if (!path) return '/favicon.ico';
  
  // If it's already a full URL, proxy it
  if (path.startsWith('http')) return `/api/image-proxy?url=${encodeURIComponent(path)}`;
  
  // If it starts with /, use proxy with full path
  if (path.startsWith('/')) {
    return `/api/image-proxy?path=${encodeURIComponent(path)}`;
  }
  
  // Bare filename - use proxy with file parameter
  return `/api/image-proxy?file=${encodeURIComponent(path)}`;
};

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

  // Pagination Component
  const Pagination = () => {
    const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
    const showingTo = Math.min(currentPage * itemsPerPage, filteredSliders.length);
    const pageNumbers = getPageNumbers();
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-200">
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="appearance-none px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white pr-8 cursor-pointer"
            >
              <option value={4}>4 per page</option>
              <option value={8}>8 per page</option>
              <option value={12}>12 per page</option>
              <option value={16}>16 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Page info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{showingFrom}</span> to{" "}
          <span className="font-semibold text-gray-900">{showingTo}</span> of{" "}
          <span className="font-semibold text-gray-900">{filteredSliders.length}</span> sliders
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          {/* First Page Button */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5'
            }`}
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5'
            }`}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={index} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`px-3 py-1.5 min-w-[36px] text-sm rounded-lg transition-all duration-200 ${
                    pageNum === currentPage
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>
          
          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5'
            }`}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          {/* Last Page Button */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-white hover:-translate-y-0.5'
            }`}
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Mobile Pagination Component
  const MobilePagination = () => {
    const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
    const showingTo = Math.min(currentPage * itemsPerPage, filteredSliders.length);
    const pageNumbers = getPageNumbers();
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
        <div className="flex flex-col gap-4">
          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{showingFrom}-{showingTo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center justify-between">
            {/* First & Previous buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:-translate-y-0.5 transition-all duration-200'
                }`}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:-translate-y-0.5 transition-all duration-200'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
            </div>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={index} className="px-1 text-gray-500">...</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg min-w-8 transition-all duration-200 ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-y-0.5'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>
            
            {/* Next & Last buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:-translate-y-0.5 transition-all duration-200'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:-translate-y-0.5 transition-all duration-200'
                }`}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Page jump */}
          <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              className="w-16 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading && allSliders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/20 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading sliders...</p>
      </div>
    );
  }

  const currentSliders = getCurrentPageSliders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-3 sm:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Slider Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your website sliders and banners
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Add New Slider
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sliders</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{allSliders.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{filteredSliders.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{currentPage}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Per Page</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{itemsPerPage}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
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
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-sm"
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
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Slider
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSliders.map((slider, index) => (
                <tr key={slider._id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mx-auto">
                      <span className="text-sm font-bold text-blue-700">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      <div className="font-bold text-gray-900">{slider.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="h-16 w-24 rounded-lg border border-gray-200 overflow-hidden">
                        <SliderImage
                          src={slider.image}
                          alt={slider.name}
                          className="h-full w-full"
                        />
                      </div>
                      <button
                        onClick={() => window.open(getFormattedImagePath(slider.image), '_blank')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                      {slider.role || "No Role"}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {new Date(slider.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSlider(slider)}
                        className="p-2.5 bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-700 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(getFormattedImagePath(slider.image), '_blank')}
                        className="p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlider(slider._id)}
                        className="p-2.5 bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 text-red-700 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
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
        {filteredSliders.length > 0 && <Pagination />}
        
        {/* Empty State for Desktop */}
        {currentSliders.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-6">
              <ImageIcon className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sliders found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm ? "No results match your search criteria. Try a different search term." : "Get started by adding your first slider."}
            </p>
            <button
              onClick={() => setOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md"
            >
              <Plus className="h-5 w-5 mr-2 inline" />
              Add First Slider
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="md:hidden space-y-3">
        {currentSliders.map((slider, index) => (
          <div key={slider._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header - Always Visible */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{slider.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
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
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 h-40">
                      <SliderImage
                        src={slider.image}
                        alt={slider.name}
                        className="h-full w-full"
                      />
                      <button
                        onClick={() => window.open(getFormattedImagePath(slider.image), '_blank')}
                        className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 hover:bg-black/90 transition-colors"
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
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 mb-1">Slider ID</div>
                    <div className="font-medium truncate" title={slider._id}>
                      #{slider._id.slice(-8)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 mb-1">Serial No.</div>
                    <div className="font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 mb-1">Created Date</div>
                    <div className="font-medium">
                      {new Date(slider.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
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
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSlider(slider._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-rose-600 transition-all duration-200"
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
                onClick={() => window.open(getFormattedImagePath(slider.image), '_blank')}
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sliders found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No results match your search criteria." : "Get started by adding your first slider."}
            </p>
            <button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all w-full"
            >
              <Plus size={20} />
              Add First Slider
            </button>
          </div>
        )}

        {/* Mobile Pagination Controls */}
        {filteredSliders.length > 0 && <MobilePagination />}
      </div>

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










