




// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import { 
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaPrint,
//   FaPlus,
// } from "react-icons/fa";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface Breed {
//   id: string;
//   name: string;
//   sortOrder: number;
//   selected?: boolean;
// }

// export default function BreedOptionsPage() {
//   const [breeds, setBreeds] = useState<Breed[]>([]);
//   const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
//   const [newBreedName, setNewBreedName] = useState("");
//   const [newBreedSortOrder, setNewBreedSortOrder] = useState<string>("");
//   const [editBreedId, setEditBreedId] = useState<string | null>(null);
//   const [deleteBreedId, setDeleteBreedId] = useState<string | null>(null);
//   const [deleteBreedName, setDeleteBreedName] = useState<string>("");
//   const [tableSortOrder, setTableSortOrder] = useState<"asc" | "desc">("asc");
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
  
//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   // Ref for printing
//   const printRef = useRef<HTMLDivElement>(null);

//   /* ---------- FETCH BREEDS ---------- */
//   const fetchBreeds = async (sortOrder: "asc" | "desc" = "asc") => {
//     try {
//       setLoading(true);
//       // Sort by sortOrder field by default
//       const response = await fetch(`/api/breeds?sort=${sortOrder}&sortBy=sortOrder`);
//       const data = await response.json();
      
//       if (data.success) {
//         setBreeds(data.data);
//         setFilteredBreeds(data.data);
//         setTotalItems(data.data.length);
//         calculatePagination(data.data);
//       } else {
//         setMessage("Error fetching breeds");
//       }
//     } catch (error) {
//       console.error("Error fetching breeds:", error);
//       setMessage("Failed to load breeds");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBreeds(tableSortOrder);
//   }, [tableSortOrder]);

//   /* ---------- SEARCH FUNCTIONALITY ---------- */
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredBreeds(breeds);
//       setTotalItems(breeds.length);
//       setCurrentPage(1);
//       calculatePagination(breeds);
//     } else {
//       const searchLower = searchTerm.toLowerCase();
//       const filtered = breeds.filter(breed => 
//         breed.name.toLowerCase().includes(searchLower) ||
//         breed.id.toLowerCase().includes(searchLower)
//       );
//       setFilteredBreeds(filtered);
//       setTotalItems(filtered.length);
//       setCurrentPage(1);
//       calculatePagination(filtered);
//     }
//   }, [searchTerm, breeds]);

//   /* ---------- PAGINATION CALCULATIONS ---------- */
//   const calculatePagination = useCallback((data: Breed[]) => {
//     const totalPages = Math.ceil(data.length / itemsPerPage);
//     setTotalPages(totalPages);
    
//     // Adjust current page if it exceeds total pages
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     }
//   }, [itemsPerPage, currentPage]);

//   // Get current page data
//   const getCurrentPageData = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredBreeds.slice(startIndex, endIndex);
//   };

//   /* ---------- COPY TO CLIPBOARD FUNCTIONALITY ---------- */
//   const copyToClipboard = () => {
//     try {
//       const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
//       if (exportData.length === 0) {
//         setMessage("No data to copy");
//         return;
//       }

//       // Create table text with Sort Order
//       let tableText = "ID\tBreed Name\tSort Order\tCreated Date\n";
//       tableText += exportData.map((breed, index) => 
//         `${index + 1}\t${breed.name}\t${breed.sortOrder}\t${new Date().toLocaleDateString()}`
//       ).join("\n");

//       // Copy to clipboard
//       navigator.clipboard.writeText(tableText)
//         .then(() => {
//           showSuccess(`Copied ${exportData.length} breeds to clipboard`);
//         })
//         .catch((err) => {
//           console.error("Failed to copy: ", err);
//           setMessage("Failed to copy to clipboard");
//         });
//     } catch (error) {
//       console.error("Error copying to clipboard:", error);
//       setMessage("Failed to copy data");
//     }
//   };

//   /* ---------- EXPORT TO EXCEL FUNCTIONALITY ---------- */
//   const exportToExcel = () => {
//     try {
//       const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
//       if (exportData.length === 0) {
//         setMessage("No data to export");
//         return;
//       }

//       // Create Excel XML format with Sort Order
//       const xmlHeader = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
//       const workbook = `
//         <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
//           xmlns:o="urn:schemas-microsoft-com:office:office"
//           xmlns:x="urn:schemas-microsoft-com:office:excel"
//           xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
//           xmlns:html="http://www.w3.org/TR/REC-html40">
//           <Worksheet ss:Name="Breeds">
//             <Table>
//               <Row>
//                 <Cell><Data ss:Type="String">ID</Data></Cell>
//                 <Cell><Data ss:Type="String">Breed Name</Data></Cell>
//                 <Cell><Data ss:Type="String">Sort Order</Data></Cell>
//                 <Cell><Data ss:Type="String">Created Date</Data></Cell>
//               </Row>
//               ${exportData.map((breed, index) => `
//                 <Row>
//                   <Cell><Data ss:Type="Number">${index + 1}</Data></Cell>
//                   <Cell><Data ss:Type="String">${breed.name}</Data></Cell>
//                   <Cell><Data ss:Type="Number">${breed.sortOrder}</Data></Cell>
//                   <Cell><Data ss:Type="String">${new Date().toLocaleDateString()}</Data></Cell>
//                 </Row>
//               `).join('')}
//             </Table>
//           </Worksheet>
//         </Workbook>
//       `;

//       // Create blob and download
//       const blob = new Blob([xmlHeader + workbook], { 
//         type: "application/vnd.ms-excel" 
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `breeds_${new Date().toISOString().split('T')[0]}.xls`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       showSuccess(`Exported ${exportData.length} breeds to Excel`);
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       setMessage("Failed to export to Excel");
//     }
//   };

//   /* ---------- EXPORT TO CSV FUNCTIONALITY ---------- */
//   const exportToCSV = () => {
//     try {
//       const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
//       if (exportData.length === 0) {
//         setMessage("No data to export");
//         return;
//       }

//       // Create CSV content with Sort Order
//       const headers = ["ID", "Breed Name", "Sort Order", "Created Date"];
//       const rows = exportData.map((breed, index) => [
//         index + 1,
//         `"${breed.name.replace(/"/g, '""')}"`,
//         breed.sortOrder,
//         new Date().toLocaleDateString()
//       ]);
      
//       const csvContent = [
//         headers.join(","),
//         ...rows.map(row => row.join(","))
//       ].join("\n");
      
//       // Create blob and download
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `breeds_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       showSuccess(`Exported ${exportData.length} breeds to CSV`);
//     } catch (error) {
//       console.error("Error exporting to CSV:", error);
//       setMessage("Failed to export to CSV");
//     }
//   };

//   /* ---------- EXPORT TO PDF FUNCTIONALITY ---------- */
//   const exportToPDF = () => {
//     try {
//       const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
//       if (exportData.length === 0) {
//         setMessage("No data to export");
//         return;
//       }

//       const printWindow = window.open('', '_blank', 'width=900,height=700');
//       if (!printWindow) {
//         setMessage("Please allow popups to export PDF");
//         return;
//       }

//       const printDate = new Date().toLocaleDateString();
//       const printTime = new Date().toLocaleTimeString();

//       const printContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Breeds Report</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 20px;
//               color: #333;
//             }
//             .header {
//               text-align: center;
//               margin-bottom: 30px;
//               padding-bottom: 15px;
//               border-bottom: 2px solid #4CAF50;
//             }
//             .header h1 {
//               margin: 0 0 10px 0;
//               color: #1f2937;
//               font-size: 24px;
//             }
//             .header-info {
//               color: #6b7280;
//               font-size: 14px;
//               margin: 5px 0;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//               font-size: 12px;
//             }
//             th {
//               background-color: #f3f4f6;
//               color: #374151;
//               font-weight: 600;
//               padding: 12px 8px;
//               text-align: left;
//               border: 1px solid #d1d5db;
//             }
//             td {
//               padding: 10px 8px;
//               border: 1px solid #e5e7eb;
//               vertical-align: top;
//             }
//             tr:nth-child(even) {
//               background-color: #f9fafb;
//             }
//             .sort-badge {
//               padding: 4px 10px;
//               border-radius: 12px;
//               font-size: 11px;
//               font-weight: 600;
//               display: inline-block;
//               background-color: #dbeafe;
//               color: #1e40af;
//             }
//             .footer {
//               margin-top: 40px;
//               padding-top: 20px;
//               border-top: 1px solid #e5e7eb;
//               font-size: 12px;
//               color: #6b7280;
//               text-align: center;
//             }
//             @media print {
//               @page {
//                 margin: 0.5in;
//               }
//               body {
//                 margin: 0;
//                 -webkit-print-color-adjust: exact;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>🐄 Breeds Report</h1>
//             <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//             <div class="header-info">Total Breeds: ${exportData.length}</div>
//             ${searchTerm ? `<div class="header-info">Search filter: "${searchTerm}"</div>` : ''}
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th>Sr.</th>
//                 <th>Breed Name</th>
//                 <th>Sort Order</th>
//                 <th>Created Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${exportData.map((breed, index) => {
//                 return `
//                   <tr>
//                     <td>${index + 1}</td>
//                     <td><strong>${breed.name}</strong></td>
//                     <td><span class="sort-badge">${breed.sortOrder}</span></td>
//                     <td>${new Date().toLocaleDateString()}</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>
          
//           <div class="footer">
//             <p>Printed from Breeds Management System | ${window.location.hostname}</p>
//             <p>© ${new Date().getFullYear()} All rights reserved.</p>
//           </div>
          
//           <script>
//             window.onload = function() {
//               window.print();
//               setTimeout(() => {
//                 window.close();
//               }, 500);
//             };
//           </script>
//         </body>
//         </html>
//       `;

//       printWindow.document.write(printContent);
//       printWindow.document.close();
//       printWindow.focus();

//       showSuccess("PDF export opened - please use browser's print dialog and select 'Save as PDF'");
//     } catch (error) {
//       console.error("Error exporting to PDF:", error);
//       setMessage("Failed to export to PDF");
//     }
//   };

//   /* ---------- PRINT FUNCTIONALITY ---------- */
//   const printTable = () => {
//     try {
//       const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
//       if (exportData.length === 0) {
//         setMessage("No data to print");
//         return;
//       }

//       // Create print window content with Sort Order
//       const printWindow = window.open('', '_blank');
//       if (!printWindow) {
//         setMessage("Please allow popups to print");
//         return;
//       }

//       const printContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Breeds Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th { background-color: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
//             td { padding: 10px; border: 1px solid #ddd; }
//             .info { margin: 20px 0; color: #666; }
//             @media print {
//               @page { margin: 0.5in; }
//               body { margin: 0; }
//               .no-print { display: none; }
//               button { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <h1>Breeds Report</h1>
//           <div class="info">
//             Generated on: ${new Date().toLocaleString()}<br>
//             Total breeds: ${exportData.length}<br>
//             ${searchTerm ? `Search filter: "${searchTerm}"` : ''}
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Breed Name</th>
//                 <th>Sort Order</th>
//                 <th>Created Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${exportData.map((breed, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${breed.name}</td>
//                   <td>${breed.sortOrder}</td>
//                   <td>${new Date().toLocaleDateString()}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//           <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
//             Report generated from Breed Management System
//           </div>
//           <div style="text-align: center; margin-top: 20px;" class="no-print">
//             <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
//               Print Report
//             </button>
//             <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
//               Close
//             </button>
//           </div>
//         </body>
//         </html>
//       `;

//       printWindow.document.write(printContent);
//       printWindow.document.close();
//       printWindow.focus();

//       // Auto-print after a short delay
//       setTimeout(() => {
//         printWindow.print();
//       }, 500);

//       showSuccess("Print dialog opened");
//     } catch (error) {
//       console.error("Error printing:", error);
//       setMessage("Failed to print");
//     }
//   };

//   /* ---------- SORT ---------- */
//   const toggleTableSortOrder = () => {
//     const newTableSortOrder = tableSortOrder === "asc" ? "desc" : "asc";
//     setTableSortOrder(newTableSortOrder);
    
//     // Re-fetch breeds with new sort order
//     fetchBreeds(newTableSortOrder);
//   };

//   /* ---------- SUCCESS ---------- */
//   const showSuccess = (text: string) => {
//     setMessage(text);
//     setTimeout(() => setMessage(null), 2500);
//   };

//   /* ---------- ADD ---------- */
//   const saveNewBreed = async () => {
//     if (!newBreedName.trim()) {
//       setMessage("Please enter a breed name");
//       return;
//     }

//     const sortOrderValue = parseInt(newBreedSortOrder) || 0;

//     try {
//       const response = await fetch("/api/breeds", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           name: newBreedName.trim(),
//           sortOrder: sortOrderValue 
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         const newBreed = data.data;
//         setBreeds((prev) => [...prev, newBreed]);
        
//         // Update filtered breeds if search term matches
//         if (searchTerm === "" || 
//             newBreed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             newBreed.id.toLowerCase().includes(searchTerm.toLowerCase())) {
//           setFilteredBreeds((prev) => [...prev, newBreed]);
//           setTotalItems(prev => prev + 1);
//           calculatePagination([...filteredBreeds, newBreed]);
//         }
        
//         setShowAddModal(false);
//         setNewBreedName("");
//         setNewBreedSortOrder("");
//         showSuccess("Breed added successfully");
        
//         // Refresh the breeds list to get correct sorting
//         fetchBreeds(tableSortOrder);
//       } else {
//         setMessage(data.error || "Failed to add breed");
//       }
//     } catch (error) {
//       console.error("Error adding breed:", error);
//       setMessage("Failed to add breed");
//     }
//   };

//   /* ---------- EDIT ---------- */
//   const openEditModal = (breed: Breed) => {
//     console.log('Opening edit modal for breed:', breed);
//     setEditBreedId(breed.id);
//     setNewBreedName(breed.name);
//     setNewBreedSortOrder(breed.sortOrder.toString());
//     setShowEditModal(true);
//   };

//   const saveEditBreed = async () => {
//     if (!newBreedName.trim() || !editBreedId) {
//       console.log('Missing breed name or ID');
//       return;
//     }

//     const sortOrderValue = parseInt(newBreedSortOrder) || 0;

//     try {
//       console.log('Saving edit for breed ID:', editBreedId, 'New name:', newBreedName, 'Sort order:', sortOrderValue);
      
//       const response = await fetch(`/api/breeds/${editBreedId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           name: newBreedName.trim(),
//           sortOrder: sortOrderValue 
//         }),
//       });

//       const data = await response.json();
//       console.log('Edit response:', data);
      
//       if (data.success) {
//         const updatedBreed = data.data;
        
//         // Update breeds array
//         setBreeds((prev) =>
//           prev.map((b) =>
//             b.id === editBreedId ? { ...b, name: updatedBreed.name, sortOrder: updatedBreed.sortOrder } : b
//           )
//         );
        
//         // Update filtered breeds array
//         setFilteredBreeds((prev) =>
//           prev.map((b) =>
//             b.id === editBreedId ? { ...b, name: updatedBreed.name, sortOrder: updatedBreed.sortOrder } : b
//           )
//         );
        
//         setShowEditModal(false);
//         setEditBreedId(null);
//         setNewBreedName("");
//         setNewBreedSortOrder("");
//         showSuccess("Breed updated successfully");
        
//         // Refresh the breeds list to get correct sorting
//         fetchBreeds(tableSortOrder);
//       } else {
//         setMessage(data.error || "Failed to update breed");
//       }
//     } catch (error) {
//       console.error("Error updating breed:", error);
//       setMessage("Failed to update breed");
//     }
//   };

//   /* ---------- DELETE ---------- */
//   const openDeleteModal = (id: string, name: string) => {
//     setDeleteBreedId(id);
//     setDeleteBreedName(name);
//     setShowDeleteModal(true);
//   };

//   const confirmDeleteBreed = async () => {
//     if (!deleteBreedId) return;

//     try {
//       console.log('Deleting breed ID:', deleteBreedId);
      
//       const response = await fetch(`/api/breeds/${deleteBreedId}`, {
//         method: "DELETE",
//       });
//       const data = await response.json();
//       console.log('Delete response:', data);

//       if (data.success) {
//         // Update breeds array
//         setBreeds((prev) => prev.filter((b) => b.id !== deleteBreedId));
        
//         // Update filtered breeds array
//         const newFiltered = filteredBreeds.filter((b) => b.id !== deleteBreedId);
//         setFilteredBreeds(newFiltered);
//         setTotalItems(newFiltered.length);
//         calculatePagination(newFiltered);
        
//         // If we deleted the last item on the page, go to previous page
//         if (getCurrentPageData().length === 0 && currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         }
        
//         showSuccess("Breed deleted successfully");
//       } else {
//         setMessage(data.error || "Failed to delete breed");
//       }
//     } catch (error) {
//       console.error("Error deleting breed:", error);
//       setMessage("Failed to delete breed");
//     } finally {
//       setShowDeleteModal(false);
//       setDeleteBreedId(null);
//       setDeleteBreedName("");
//     }
//   };

//   /* ---------- BULK DELETE ---------- */
//   const openBulkDeleteModal = () => {
//     const selectedCount = filteredBreeds.filter((b) => b.selected).length;
//     if (selectedCount === 0) {
//       setMessage("No breeds selected");
//       return;
//     }
//     setShowBulkDeleteModal(true);
//   };

//   const confirmBulkDelete = async () => {
//     const selectedIds = filteredBreeds
//       .filter((b) => b.selected)
//       .map((b) => b.id);

//     if (selectedIds.length === 0) {
//       setMessage("No breeds selected");
//       return;
//     }

//     try {
//       const response = await fetch("/api/breeds/bulk", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ids: selectedIds }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Update breeds array
//         const newBreeds = breeds.filter((b) => !selectedIds.includes(b.id));
//         setBreeds(newBreeds);
        
//         // Update filtered breeds array
//         const newFilteredBreeds = filteredBreeds.filter((b) => !selectedIds.includes(b.id));
//         setFilteredBreeds(newFilteredBreeds);
//         setTotalItems(newFilteredBreeds.length);
//         calculatePagination(newFilteredBreeds);
        
//         // If we deleted all items on the page and there's a previous page, go to it
//         if (selectedIds.length === getCurrentPageData().length && currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         }
        
//         showSuccess(data.message || "Selected breeds deleted successfully");
//       } else {
//         setMessage(data.error || "Failed to delete selected breeds");
//       }
//     } catch (error) {
//       console.error("Error deleting selected breeds:", error);
//       setMessage("Failed to delete selected breeds");
//     } finally {
//       setShowBulkDeleteModal(false);
//     }
//   };

//   const toggleSelect = (id: string) => {
//     const updateSelection = (breedsArray: Breed[]) => 
//       breedsArray.map((b) =>
//         b.id === id ? { ...b, selected: !b.selected } : b
//       );
    
//     setBreeds(updateSelection);
//     setFilteredBreeds(updateSelection);
//   };

//   /* ---------- PAGINATION FUNCTIONS ---------- */
//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = parseInt(e.target.value);
//     setItemsPerPage(value);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       // Show all pages
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       // Show limited pages with ellipsis
//       if (currentPage <= 3) {
//         // Near the start
//         for (let i = 1; i <= 4; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push('...');
//         pageNumbers.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         // Near the end
//         pageNumbers.push(1);
//         pageNumbers.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           pageNumbers.push(i);
//         }
//       } else {
//         // In the middle
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

//   // Calculate starting index for current page
//   const startIndex = (currentPage - 1) * itemsPerPage + 1;
//   const currentPageData = getCurrentPageData();

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
//         </div>
//       )}

//       {/* Message Alert */}
//       {message && (
//         <div className={`mb-4 px-4 py-3 rounded text-sm ${
//           message.includes('Error') || message.includes('Failed') 
//             ? "bg-red-100 text-red-800 border border-red-200" 
//             : "bg-green-100 text-green-800 border border-green-200"
//         }`}>
//           {message}
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Breeds</h1>
//           <p className="text-gray-600 mt-1">
//             Manage breed options for your farm. {totalItems} breeds found.
//           </p>
//         </div>
//         {/* Add Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
//           >
//             <FaPlus className="text-sm" />
//             Add New Breed
//           </button>
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="bg-white rounded-lg shadow mb-4 border border-gray-200">
//         <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
//           {/* Left Side: Selection Actions */}
//           <div className="flex items-center gap-2">
//             <label className="flex items-center space-x-2 text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={currentPageData.length > 0 && currentPageData.every(b => b.selected)}
//                 onChange={() => {
//                   const allSelected = currentPageData.every(b => b.selected);
//                   currentPageData.forEach(b => {
//                     if (!allSelected) {
//                       toggleSelect(b.id);
//                     } else if (b.selected) {
//                       toggleSelect(b.id);
//                     }
//                   });
//                 }}
//                 className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//               />
//               <span>Select All on Page</span>
//             </label>
            
//             {filteredBreeds.some(b => b.selected) && (
//               <button
//                 onClick={openBulkDeleteModal}
//                 className="ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
//               >
//                 <FaTrash className="text-sm" />
//                 Delete Selected ({filteredBreeds.filter(b => b.selected).length})
//               </button>
//             )}
//           </div>

//           {/* Right Side: Export Buttons - Mobile */}
//           <div className="lg:hidden flex flex-wrap gap-2">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: copyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: filteredBreeds.length === 0 },
//               { label: "Excel", icon: FaFileExcel, onClick: exportToExcel, color: "bg-green-100 hover:bg-green-200", disabled: filteredBreeds.length === 0 },
//               { label: "CSV", icon: FaFileCsv, onClick: exportToCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: filteredBreeds.length === 0 },
//               { label: "PDF", icon: FaFilePdf, onClick: exportToPDF, color: "bg-red-100 hover:bg-red-200", disabled: filteredBreeds.length === 0 },
//               { label: "Print", icon: FaPrint, onClick: printTable, color: "bg-purple-100 hover:bg-purple-200", disabled: filteredBreeds.length === 0 },
//             ].map((btn, i) => (
//               <div key={i} className="relative group" title={btn.label}>
//                 <button
//                   onClick={btn.onClick}
//                   disabled={btn.disabled}
//                   className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   <btn.icon />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                   {btn.label}
//                 </div>
//               </div>
//             ))}

//             {/* Rows Per Page Selector */}
//             <div className="relative">
//               <select
//                 value={itemsPerPage}
//                 onChange={handleItemsPerPageChange}
//                 className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value={5}>5 rows</option>
//                 <option value={10}>10 rows</option>
//                 <option value={25}>25 rows</option>
//                 <option value={50}>50 rows</option>
//                 <option value={100}>100 rows</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200">
//           <div className="relative max-w-md">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search breeds..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                 </svg>
//               </button>
//             )}
//           </div>
//           <div className="lg:flex flex-wrap gap-2 hidden">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: copyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: filteredBreeds.length === 0 },
//               { label: "Excel", icon: FaFileExcel, onClick: exportToExcel, color: "bg-green-100 hover:bg-green-200", disabled: filteredBreeds.length === 0 },
//               { label: "CSV", icon: FaFileCsv, onClick: exportToCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: filteredBreeds.length === 0 },
//               { label: "PDF", icon: FaFilePdf, onClick: exportToPDF, color: "bg-red-100 hover:bg-red-200", disabled: filteredBreeds.length === 0 },
//               { label: "Print", icon: FaPrint, onClick: printTable, color: "bg-purple-100 hover:bg-purple-200", disabled: filteredBreeds.length === 0 },
//             ].map((btn, i) => (
//               <div key={i} className="relative group" title={btn.label}>
//                 <button
//                   onClick={btn.onClick}
//                   disabled={btn.disabled}
//                   className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   <btn.icon />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                   {btn.label}
//                 </div>
//               </div>
//             ))}

//             {/* Rows Per Page Selector */}
//             <div className="relative">
//               <select
//                 value={itemsPerPage}
//                 onChange={handleItemsPerPageChange}
//                 className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value={10}>10 rows</option>
//                 <option value={25}>25 rows</option>
//                 <option value={50}>50 rows</option>
//                 <option value={100}>100 rows</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="w-12 px-4 py-3">
//                   <input
//                     type="checkbox"
//                     checked={currentPageData.length > 0 && currentPageData.every(b => b.selected)}
//                     onChange={() => {
//                       const allSelected = currentPageData.every(b => b.selected);
//                       currentPageData.forEach(b => {
//                         if (!allSelected) {
//                           toggleSelect(b.id);
//                         } else if (b.selected) {
//                           toggleSelect(b.id);
//                         }
//                       });
//                     }}
//                     className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Sr.
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Breed Name
//                 </th>
//                 <th 
//                   onClick={toggleTableSortOrder}
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 >
//                   <div className="flex items-center gap-1">
//                     Sort
//                     {tableSortOrder === "asc" ? (
//                       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
//                       </svg>
//                     ) : (
//                       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                       </svg>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentPageData.map((b, index) => (
//                 <tr key={b.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={!!b.selected}
//                       onChange={() => toggleSelect(b.id)}
//                       className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {startIndex + index}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <div className="font-medium">{b.name}</div>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       {b.sortOrder}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="relative group">
//                         <button
//                           onClick={() => openEditModal(b)}
//                           className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                           Edit
//                         </div>
//                       </div>
//                       <div className="relative group">
//                         <button
//                           onClick={() => openDeleteModal(b.id, b.name)}
//                           className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                           Delete
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty State */}
//         {filteredBreeds.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-5xl mb-4">🐄</div>
//             <h3 className="text-lg font-semibold mb-2">No breeds found</h3>
//             <p className="text-gray-500 mb-4">
//               {searchTerm ? `No results for "${searchTerm}". Try a different search.` : "Add your first breed to get started."}
//             </p>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto"
//             >
//               <FaPlus className="text-lg" />
//               Add New Breed
//             </button>
//           </div>
//         )}

//         {/* Pagination */}
//         {filteredBreeds.length > 0 && (
//           <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-semibold">{startIndex}</span> to{" "}
//                 <span className="font-semibold">
//                   {Math.min(startIndex + currentPageData.length - 1, totalItems)}
//                 </span> of{" "}
//                 <span className="font-semibold">{totalItems}</span> entries
//               </div>
//             </div>
            
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => goToPage(1)}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="sr-only">First</span>
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
//                 </svg>
//               </button>
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
                
//                 return (
//                   <button
//                     key={i}
//                     onClick={() => goToPage(pageNum)}
//                     className={`px-3 py-1 rounded ${
//                       currentPage === pageNum
//                         ? "bg-blue-600 text-white"
//                         : "border border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
              
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//               <button
//                 onClick={() => goToPage(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="sr-only">Last</span>
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ADD/EDIT MODAL */}
//       <div className={`fixed inset-0 z-50 ${showAddModal || showEditModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {showEditModal ? "Edit Breed" : "Add New Breed"}
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Breed Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={newBreedName}
//                   onChange={(e) => setNewBreedName(e.target.value)}
//                   placeholder="Enter breed name"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       showEditModal ? saveEditBreed() : saveNewBreed();
//                     }
//                   }}
//                   autoFocus
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort Order
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   value={newBreedSortOrder}
//                   onChange={(e) => setNewBreedSortOrder(e.target.value)}
//                   placeholder="Enter sort order (optional)"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       showEditModal ? saveEditBreed() : saveNewBreed();
//                     }
//                   }}
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Lower numbers appear first. Leave empty for automatic ordering.
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setShowEditModal(false);
//                   setNewBreedName("");
//                   setNewBreedSortOrder("");
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={showEditModal ? saveEditBreed : saveNewBreed}
//                 disabled={!newBreedName.trim()}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {showEditModal ? "Save Changes" : "Add Breed"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SINGLE DELETE MODAL */}
//       <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//           <div className="p-6 text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Delete Breed?
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete "{deleteBreedName}"?
//               This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setDeleteBreedId(null);
//                   setDeleteBreedName("");
//                 }}
//                 className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDeleteBreed}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* BULK DELETE MODAL */}
//       <div className={`fixed inset-0 z-50 ${showBulkDeleteModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//           <div className="p-6 text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Delete Selected Breeds?
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete {filteredBreeds.filter(b => b.selected).length} selected breed(s)?
//               This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setShowBulkDeleteModal(false)}
//                 className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmBulkDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//               >
//                 Delete {filteredBreeds.filter(b => b.selected).length} Breeds
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { 
  FaEdit,
  FaTrash,
  FaSearch,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaPlus,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Breed {
  id: string;
  name: string;
  sortOrder: number;
  selected?: boolean;
}

export default function BreedOptionsPage() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [newBreedName, setNewBreedName] = useState("");
  const [newBreedSortOrder, setNewBreedSortOrder] = useState<string>("");
  const [editBreedId, setEditBreedId] = useState<string | null>(null);
  const [deleteBreedId, setDeleteBreedId] = useState<string | null>(null);
  const [deleteBreedName, setDeleteBreedName] = useState<string>("");
  const [tableSortOrder, setTableSortOrder] = useState<"asc" | "desc">("asc");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  /* ---------- FETCH BREEDS ---------- */
  const fetchBreeds = async (sortOrder: "asc" | "desc" = "asc") => {
    try {
      setLoading(true);
      // Sort by sortOrder field by default
      const response = await fetch(`/api/breeds?sort=${sortOrder}&sortBy=sortOrder`);
      const data = await response.json();
      
      if (data.success) {
        setBreeds(data.data);
        setFilteredBreeds(data.data);
        setTotalItems(data.data.length);
        calculatePagination(data.data);
      } else {
        setMessage("Error fetching breeds");
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
      setMessage("Failed to load breeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds(tableSortOrder);
  }, [tableSortOrder]);

  /* ---------- SEARCH FUNCTIONALITY ---------- */
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBreeds(breeds);
      setTotalItems(breeds.length);
      setCurrentPage(1);
      calculatePagination(breeds);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = breeds.filter(breed => 
        breed.name.toLowerCase().includes(searchLower) ||
        breed.id.toLowerCase().includes(searchLower)
      );
      setFilteredBreeds(filtered);
      setTotalItems(filtered.length);
      setCurrentPage(1);
      calculatePagination(filtered);
    }
  }, [searchTerm, breeds]);

  /* ---------- PAGINATION CALCULATIONS ---------- */
  const calculatePagination = useCallback((data: Breed[]) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    setTotalPages(totalPages);
    
    // Adjust current page if it exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [itemsPerPage, currentPage]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBreeds.slice(startIndex, endIndex);
  };

  /* ---------- COPY TO CLIPBOARD FUNCTIONALITY ---------- */
  const copyToClipboard = () => {
    try {
      const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
      if (exportData.length === 0) {
        setMessage("No data to copy");
        return;
      }

      // Create table text with Sort Order
      let tableText = "ID\tBreed Name\tSort Order\tCreated Date\n";
      tableText += exportData.map((breed, index) => 
        `${index + 1}\t${breed.name}\t${breed.sortOrder}\t${new Date().toLocaleDateString()}`
      ).join("\n");

      // Copy to clipboard
      navigator.clipboard.writeText(tableText)
        .then(() => {
          showSuccess(`Copied ${exportData.length} breeds to clipboard`);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          setMessage("Failed to copy to clipboard");
        });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setMessage("Failed to copy data");
    }
  };

  /* ---------- EXPORT TO EXCEL FUNCTIONALITY ---------- */
  const exportToExcel = () => {
    try {
      const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
      if (exportData.length === 0) {
        setMessage("No data to export");
        return;
      }

      // Create Excel XML format with Sort Order
      const xmlHeader = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
      const workbook = `
        <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:html="http://www.w3.org/TR/REC-html40">
          <Worksheet ss:Name="Breeds">
            <Table>
              <Row>
                <Cell><Data ss:Type="String">ID</Data></Cell>
                <Cell><Data ss:Type="String">Breed Name</Data></Cell>
                <Cell><Data ss:Type="String">Sort Order</Data></Cell>
                <Cell><Data ss:Type="String">Created Date</Data></Cell>
              </Row>
              ${exportData.map((breed, index) => `
                <Row>
                  <Cell><Data ss:Type="Number">${index + 1}</Data></Cell>
                  <Cell><Data ss:Type="String">${breed.name}</Data></Cell>
                  <Cell><Data ss:Type="Number">${breed.sortOrder}</Data></Cell>
                  <Cell><Data ss:Type="String">${new Date().toLocaleDateString()}</Data></Cell>
                </Row>
              `).join('')}
            </Table>
          </Worksheet>
        </Workbook>
      `;

      // Create blob and download
      const blob = new Blob([xmlHeader + workbook], { 
        type: "application/vnd.ms-excel" 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `breeds_${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess(`Exported ${exportData.length} breeds to Excel`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setMessage("Failed to export to Excel");
    }
  };

  /* ---------- EXPORT TO CSV FUNCTIONALITY ---------- */
  const exportToCSV = () => {
    try {
      const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
      if (exportData.length === 0) {
        setMessage("No data to export");
        return;
      }

      // Create CSV content with Sort Order
      const headers = ["ID", "Breed Name", "Sort Order", "Created Date"];
      const rows = exportData.map((breed, index) => [
        index + 1,
        `"${breed.name.replace(/"/g, '""')}"`,
        breed.sortOrder,
        new Date().toLocaleDateString()
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `breeds_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess(`Exported ${exportData.length} breeds to CSV`);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      setMessage("Failed to export to CSV");
    }
  };

  /* ---------- EXPORT TO PDF FUNCTIONALITY ---------- */
  const exportToPDF = () => {
    try {
      const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
      if (exportData.length === 0) {
        setMessage("No data to export");
        return;
      }

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        setMessage("Please allow popups to export PDF");
        return;
      }

      const printDate = new Date().toLocaleDateString();
      const printTime = new Date().toLocaleTimeString();

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Breeds Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 2px solid #4CAF50;
            }
            .header h1 {
              margin: 0 0 10px 0;
              color: #1f2937;
              font-size: 24px;
            }
            .header-info {
              color: #6b7280;
              font-size: 14px;
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }
            th {
              background-color: #f3f4f6;
              color: #374151;
              font-weight: 600;
              padding: 12px 8px;
              text-align: left;
              border: 1px solid #d1d5db;
            }
            td {
              padding: 10px 8px;
              border: 1px solid #e5e7eb;
              vertical-align: top;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .sort-badge {
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              display: inline-block;
              background-color: #dbeafe;
              color: #1e40af;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            @media print {
              @page {
                margin: 0.5in;
              }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🐄 Breeds Report</h1>
            <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
            <div class="header-info">Total Breeds: ${exportData.length}</div>
            ${searchTerm ? `<div class="header-info">Search filter: "${searchTerm}"</div>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Breed Name</th>
                <th>Sort Order</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${exportData.map((breed, index) => {
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td><strong>${breed.name}</strong></td>
                    <td><span class="sort-badge">${breed.sortOrder}</span></td>
                    <td>${new Date().toLocaleDateString()}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Printed from Breeds Management System | ${window.location.hostname}</p>
            <p>© ${new Date().getFullYear()} All rights reserved.</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 500);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      showSuccess("PDF export opened - please use browser's print dialog and select 'Save as PDF'");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      setMessage("Failed to export to PDF");
    }
  };

  /* ---------- PRINT FUNCTIONALITY ---------- */
  const printTable = () => {
    try {
      const exportData = filteredBreeds.length > 0 ? filteredBreeds : breeds;
      
      if (exportData.length === 0) {
        setMessage("No data to print");
        return;
      }

      // Create print window content with Sort Order
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setMessage("Please allow popups to print");
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Breeds Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
            td { padding: 10px; border: 1px solid #ddd; }
            .info { margin: 20px 0; color: #666; }
            @media print {
              @page { margin: 0.5in; }
              body { margin: 0; }
              .no-print { display: none; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Breeds Report</h1>
          <div class="info">
            Generated on: ${new Date().toLocaleString()}<br>
            Total breeds: ${exportData.length}<br>
            ${searchTerm ? `Search filter: "${searchTerm}"` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Breed Name</th>
                <th>Sort Order</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${exportData.map((breed, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${breed.name}</td>
                  <td>${breed.sortOrder}</td>
                  <td>${new Date().toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            Report generated from Breed Management System
          </div>
          <div style="text-align: center; margin-top: 20px;" class="no-print">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Report
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
              Close
            </button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);

      showSuccess("Print dialog opened");
    } catch (error) {
      console.error("Error printing:", error);
      setMessage("Failed to print");
    }
  };

  /* ---------- SORT ---------- */
  const toggleTableSortOrder = () => {
    const newTableSortOrder = tableSortOrder === "asc" ? "desc" : "asc";
    setTableSortOrder(newTableSortOrder);
    
    // Re-fetch breeds with new sort order
    fetchBreeds(newTableSortOrder);
  };

  /* ---------- SUCCESS ---------- */
  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  /* ---------- ADD ---------- */
  const saveNewBreed = async () => {
    if (!newBreedName.trim()) {
      setMessage("Please enter a breed name");
      return;
    }

    const sortOrderValue = parseInt(newBreedSortOrder) || 0;

    try {
      const response = await fetch("/api/breeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: newBreedName.trim(),
          sortOrder: sortOrderValue 
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newBreed = data.data;
        setBreeds((prev) => [...prev, newBreed]);
        
        // Update filtered breeds if search term matches
        if (searchTerm === "" || 
            newBreed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newBreed.id.toLowerCase().includes(searchTerm.toLowerCase())) {
          setFilteredBreeds((prev) => [...prev, newBreed]);
          setTotalItems(prev => prev + 1);
          calculatePagination([...filteredBreeds, newBreed]);
        }
        
        setShowAddModal(false);
        setNewBreedName("");
        setNewBreedSortOrder("");
        showSuccess("Breed added successfully");
        
        // Refresh the breeds list to get correct sorting
        fetchBreeds(tableSortOrder);
      } else {
        setMessage(data.error || "Failed to add breed");
      }
    } catch (error) {
      console.error("Error adding breed:", error);
      setMessage("Failed to add breed");
    }
  };

  /* ---------- EDIT ---------- */
  const openEditModal = (breed: Breed) => {
    console.log('Opening edit modal for breed:', breed);
    setEditBreedId(breed.id);
    setNewBreedName(breed.name);
    setNewBreedSortOrder(breed.sortOrder.toString());
    setShowEditModal(true);
  };

  const saveEditBreed = async () => {
    if (!newBreedName.trim() || !editBreedId) {
      console.log('Missing breed name or ID');
      return;
    }

    const sortOrderValue = parseInt(newBreedSortOrder) || 0;

    try {
      console.log('Saving edit for breed ID:', editBreedId, 'New name:', newBreedName, 'Sort order:', sortOrderValue);
      
      const response = await fetch(`/api/breeds/${editBreedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: newBreedName.trim(),
          sortOrder: sortOrderValue 
        }),
      });

      const data = await response.json();
      console.log('Edit response:', data);
      
      if (data.success) {
        const updatedBreed = data.data;
        
        // Update breeds array
        setBreeds((prev) =>
          prev.map((b) =>
            b.id === editBreedId ? { ...b, name: updatedBreed.name, sortOrder: updatedBreed.sortOrder } : b
          )
        );
        
        // Update filtered breeds array
        setFilteredBreeds((prev) =>
          prev.map((b) =>
            b.id === editBreedId ? { ...b, name: updatedBreed.name, sortOrder: updatedBreed.sortOrder } : b
          )
        );
        
        setShowEditModal(false);
        setEditBreedId(null);
        setNewBreedName("");
        setNewBreedSortOrder("");
        showSuccess("Breed updated successfully");
        
        // Refresh the breeds list to get correct sorting
        fetchBreeds(tableSortOrder);
      } else {
        setMessage(data.error || "Failed to update breed");
      }
    } catch (error) {
      console.error("Error updating breed:", error);
      setMessage("Failed to update breed");
    }
  };

  /* ---------- DELETE ---------- */
  const openDeleteModal = (id: string, name: string) => {
    setDeleteBreedId(id);
    setDeleteBreedName(name);
    setShowDeleteModal(true);
  };

  const confirmDeleteBreed = async () => {
    if (!deleteBreedId) return;

    try {
      console.log('Deleting breed ID:', deleteBreedId);
      
      const response = await fetch(`/api/breeds/${deleteBreedId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log('Delete response:', data);

      if (data.success) {
        // Update breeds array
        setBreeds((prev) => prev.filter((b) => b.id !== deleteBreedId));
        
        // Update filtered breeds array
        const newFiltered = filteredBreeds.filter((b) => b.id !== deleteBreedId);
        setFilteredBreeds(newFiltered);
        setTotalItems(newFiltered.length);
        calculatePagination(newFiltered);
        
        // If we deleted the last item on the page, go to previous page
        if (getCurrentPageData().length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        showSuccess("Breed deleted successfully");
      } else {
        setMessage(data.error || "Failed to delete breed");
      }
    } catch (error) {
      console.error("Error deleting breed:", error);
      setMessage("Failed to delete breed");
    } finally {
      setShowDeleteModal(false);
      setDeleteBreedId(null);
      setDeleteBreedName("");
    }
  };

  /* ---------- BULK DELETE ---------- */
  const openBulkDeleteModal = () => {
    const selectedCount = filteredBreeds.filter((b) => b.selected).length;
    if (selectedCount === 0) {
      setMessage("No breeds selected");
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    const selectedIds = filteredBreeds
      .filter((b) => b.selected)
      .map((b) => b.id);

    if (selectedIds.length === 0) {
      setMessage("No breeds selected");
      return;
    }

    try {
      const response = await fetch("/api/breeds/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await response.json();

      if (data.success) {
        // Update breeds array
        const newBreeds = breeds.filter((b) => !selectedIds.includes(b.id));
        setBreeds(newBreeds);
        
        // Update filtered breeds array
        const newFilteredBreeds = filteredBreeds.filter((b) => !selectedIds.includes(b.id));
        setFilteredBreeds(newFilteredBreeds);
        setTotalItems(newFilteredBreeds.length);
        calculatePagination(newFilteredBreeds);
        
        // If we deleted all items on the page and there's a previous page, go to it
        if (selectedIds.length === getCurrentPageData().length && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        showSuccess(data.message || "Selected breeds deleted successfully");
      } else {
        setMessage(data.error || "Failed to delete selected breeds");
      }
    } catch (error) {
      console.error("Error deleting selected breeds:", error);
      setMessage("Failed to delete selected breeds");
    } finally {
      setShowBulkDeleteModal(false);
    }
  };

  const toggleSelect = (id: string) => {
    const updateSelection = (breedsArray: Breed[]) => 
      breedsArray.map((b) =>
        b.id === id ? { ...b, selected: !b.selected } : b
      );
    
    setBreeds(updateSelection);
    setFilteredBreeds(updateSelection);
  };

  /* ---------- PAGINATION FUNCTIONS ---------- */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
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

  // Calculate starting index for current page
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const currentPageData = getCurrentPageData();

  /* ---------- UI ---------- */
  return (
    <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
        </div>
      )}

      {/* Message Alert */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded text-sm ${
          message.includes('Error') || message.includes('Failed') 
            ? "bg-red-100 text-red-800 border border-red-200" 
            : "bg-green-100 text-green-800 border border-green-200"
        }`}>
          {message}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Breeds</h1>
          <p className="text-gray-600 mt-1">
            Manage breed options for your farm. {totalItems} breeds found.
          </p>
        </div>
        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add New Breed
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow mb-4 border border-gray-200">
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
          {/* Left Side: Selection Actions */}
          <div className="flex items-center gap-2">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={currentPageData.length > 0 && currentPageData.every(b => b.selected)}
                onChange={() => {
                  const allSelected = currentPageData.every(b => b.selected);
                  currentPageData.forEach(b => {
                    if (!allSelected) {
                      toggleSelect(b.id);
                    } else if (b.selected) {
                      toggleSelect(b.id);
                    }
                  });
                }}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>Select All on Page</span>
            </label>
            
            {filteredBreeds.some(b => b.selected) && (
              <button
                onClick={openBulkDeleteModal}
                className="ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete Selected ({filteredBreeds.filter(b => b.selected).length})
              </button>
            )}
          </div>

          {/* Right Side: Export Buttons - Mobile */}
          <div className="lg:hidden flex flex-wrap gap-2">
            {[
              { label: "Copy", icon: FaCopy, onClick: copyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: filteredBreeds.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: exportToExcel, color: "bg-green-100 hover:bg-green-200", disabled: filteredBreeds.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: exportToCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: filteredBreeds.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: exportToPDF, color: "bg-red-100 hover:bg-red-200", disabled: filteredBreeds.length === 0 },
              { label: "Print", icon: FaPrint, onClick: printTable, color: "bg-purple-100 hover:bg-purple-200", disabled: filteredBreeds.length === 0 },
            ].map((btn, i) => (
              <div key={i} className="relative group" title={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <btn.icon />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search breeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
          <div className="lg:flex flex-wrap gap-2 hidden">
            {[
              { label: "Copy", icon: FaCopy, onClick: copyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: filteredBreeds.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: exportToExcel, color: "bg-green-100 hover:bg-green-200", disabled: filteredBreeds.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: exportToCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: filteredBreeds.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: exportToPDF, color: "bg-red-100 hover:bg-red-200", disabled: filteredBreeds.length === 0 },
              { label: "Print", icon: FaPrint, onClick: printTable, color: "bg-purple-100 hover:bg-purple-200", disabled: filteredBreeds.length === 0 },
            ].map((btn, i) => (
              <div key={i} className="relative group" title={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <btn.icon />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={currentPageData.length > 0 && currentPageData.every(b => b.selected)}
                    onChange={() => {
                      const allSelected = currentPageData.every(b => b.selected);
                      currentPageData.forEach(b => {
                        if (!allSelected) {
                          toggleSelect(b.id);
                        } else if (b.selected) {
                          toggleSelect(b.id);
                        }
                      });
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breed Name
                </th>
                <th 
                  onClick={toggleTableSortOrder}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Sort
                    {tableSortOrder === "asc" ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPageData.map((b, index) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={!!b.selected}
                      onChange={() => toggleSelect(b.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {startIndex + index}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">{b.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {b.sortOrder}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => openEditModal(b)}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Edit
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => openDeleteModal(b.id, b.name)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Delete
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBreeds.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🐄</div>
            <h3 className="text-lg font-semibold mb-2">No breeds found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No results for "${searchTerm}". Try a different search.` : "Add your first breed to get started."}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto"
            >
              <FaPlus className="text-lg" />
              Add New Breed
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredBreeds.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startIndex}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(startIndex + currentPageData.length - 1, totalItems)}
                </span> of{" "}
                <span className="font-semibold">{totalItems}</span> entries
              </div>
              {/* Rows Per Page Selector - MOVED TO BOTTOM */}
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">First</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Last</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <div className={`fixed inset-0 z-50 ${showAddModal || showEditModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {showEditModal ? "Edit Breed" : "Add New Breed"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breed Name *
                </label>
                <input
                  type="text"
                  value={newBreedName}
                  onChange={(e) => setNewBreedName(e.target.value)}
                  placeholder="Enter breed name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      showEditModal ? saveEditBreed() : saveNewBreed();
                    }
                  }}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={newBreedSortOrder}
                  onChange={(e) => setNewBreedSortOrder(e.target.value)}
                  placeholder="Enter sort order (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      showEditModal ? saveEditBreed() : saveNewBreed();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Leave empty for automatic ordering.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setNewBreedName("");
                  setNewBreedSortOrder("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? saveEditBreed : saveNewBreed}
                disabled={!newBreedName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showEditModal ? "Save Changes" : "Add Breed"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SINGLE DELETE MODAL */}
      <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Breed?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteBreedName}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteBreedId(null);
                  setDeleteBreedName("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBreed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BULK DELETE MODAL */}
      <div className={`fixed inset-0 z-50 ${showBulkDeleteModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Selected Breeds?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {filteredBreeds.filter(b => b.selected).length} selected breed(s)?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete {filteredBreeds.filter(b => b.selected).length} Breeds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}