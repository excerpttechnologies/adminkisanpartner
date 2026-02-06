












// "use client";

// import { useState, useRef, useEffect } from "react";
// import { 
//   FaTrash, FaEdit, FaFileExcel, FaFileCsv, FaFilePdf, 
//   FaPrint, FaCopy, FaSearch, FaFilter, FaPlus, FaEye, 
//   FaChevronDown, FaCalendarAlt, FaSeedling, FaWeight, 
//   FaMapMarkerAlt, FaTag, FaCheck, FaUser, FaBox, FaLeaf,
//   FaDollarSign, FaHashtag, FaClock, FaIdBadge,
//   FaPhone, FaEnvelope, FaMapPin, FaBuilding, FaCheckCircle,
//   FaUserTag, FaShieldAlt, FaGlobeAsia
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { Dialog, Pagination, CircularProgress } from "@mui/material";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { getAdminSessionAction } from "@/app/actions/auth-actions";
// import { AiOutlineClose } from "react-icons/ai";

// /* ================= TYPES ================= */

// export interface Quality {
//   _id: string;
//   grade: "A" | "B" | "C";
//   pricePerPack: number;
//   quantity: number;
// }

// export interface UserDetails {
//   name: string;
//   mobileNo: string;
//   email: string;
//   taluk: string;
//   district: string;
//   state: string;
//   address: string;
//   village: string;
//   userId: string;
//   role: string;
//   registrationStatus: string;
//   isActive: boolean;
// }

// export interface Requirement {
//   _id: string;
//   userType: "Trader" | "Farmer";
//   category: string;
//   subCategory: string;
//   farmingType: string;
//   variety: string;
//   packType: string;
//   weightPerPack: number;
//   qualities: Quality[];
//   requirementDate: string;
//   location: string;
//   status: "Active" | "Inactive";
//   createdAt: string;
//   __v: number;
//   postedBy?: string;
//   userDetails?: UserDetails | null;
// }

// type Cat = {
//   _id: string,
//   categoryName: string,
//   categoryId: string,
// }

// /* ================= PAGE ================= */

// export default function RequirementsPage() {
//   const [rows, setRows] = useState<Requirement[]>([]);
//   const [page, setPage] = useState(1);
//   const [ID, setID] = useState<string>("");
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const [filterCategory, setFilterCategory] = useState<string>("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [addOpen, setAddOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [status, setStatus] = useState("Active");
//   const [change, setChange] = useState<any>();
//   const [category, setCategory] = useState<Cat[]>([]);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
//   const [userDetailsExpanded, setUserDetailsExpanded] = useState(false);
  
//   const tableRef = useRef<HTMLTableElement>(null);
//   const [user, setUser] = useState<{
//     role: string,
//     taluka: string
//   }>();

//   /* ================= DATA FETCHING ================= */

//   const getRequirements = async () => {
//     try {
//       setLoading(true);
//       const params: any = {
//           search: searchTerm,
//           status: filterStatus !== "all" ? filterStatus : undefined,
//           category: filterCategory !== "all" ? filterCategory : undefined,
//           page,
//           limit: rowsPerPage,
//         }
//           const session = await getAdminSessionAction();
//           setUser(session?.admin);
//               if (session?.admin) {
//                 if (session.admin.role === 'subadmin') {
//                   params.taluk = session?.admin?.taluka;
//                 }
//               }
//       const response = await axios.get('/api/requirements', {
//        params
//       });
      
//       if (response.data.success) {
//         setRows(response.data.data || []);
//         setTotalItems(response.data.total || 0);
//         setTotalPages(Math.ceil(response.data.total / rowsPerPage) || 1);
//         setError(null);
//         setSelectedIds([]);
//         setSelectAll(false);
//       } else {
//         setError('Failed to fetch requirements');
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Error loading requirements. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCategory = async () => {
//     try {
//       const response = await axios.get('/api/category');
//       if (response.data.success) {
//         setCategory(response.data.category);
//         setError(null);
//       } else {
//         setError('Failed to fetch category');
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Error loading category. Please try again.');
//     }
//   };

//   useEffect(() => {
//     getRequirements();
//     getCategory();
//   }, [searchTerm, filterStatus, filterCategory, page, rowsPerPage, change]);

//   /* ================= VIEW FUNCTION ================= */

//   const handleView = (requirement: Requirement) => {
//     setSelectedRequirement(requirement);
//     setViewOpen(true);
//   };

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allIds = rows.map(row => row._id);
//       setSelectedIds(allIds);
//       setSelectAll(true);
//     } else {
//       setSelectedIds([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedIds([...selectedIds, id]);
//     } else {
//       setSelectedIds(selectedIds.filter(itemId => itemId !== id));
//       setSelectAll(false);
//     }
//   };

//   /* ================= BULK DELETE ================= */

//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       toast.error("No requirements selected");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post('/api/requirements/bulk-delete', {
//         ids: selectedIds
//       });
      
//       if (response.data.success) {
//         toast.success(response.data.message);
//         setSelectedIds([]);
//         setSelectAll(false);
//         setBulkDeleteOpen(false);
//         getRequirements();
//       } else {
//         toast.error("Failed to delete requirements");
//       }
//     } catch (err) {
//       console.error('Bulk delete error:', err);
//       toast.error("Error deleting requirements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SINGLE DELETE ================= */

//   const handleDelete = async (id: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.delete(`/api/requirements/${id}`);
//       if (response.data.success) {
//         toast.success("Requirement deleted successfully");
//         setChange(response.data);
//         setDeleteOpen(false);
//       } else {
//         toast.error("Failed to delete");
//       }
//     } catch (err) {
//       toast.error("Failed to delete");
//       console.error('Delete error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UPDATE STATUS ================= */

//   const updateStatus = async (id: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`/api/requirements/${id}`, { status });
//       if (response.data.success) {
//         toast.success("Status updated successfully");
//         setChange(response.data);
//         setEditOpen(false);
//       } else {
//         toast.error("Failed to update status");
//       }
//     } catch (err) {
//       toast.error("Status update error");
//       console.error('Update error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UTILITY FUNCTIONS ================= */

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active": return "bg-green-100 text-green-800 border-green-200";
//       case "Inactive": return "bg-red-100 text-red-800 border-red-200";
//       default: return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const formatDateForExport = (dateString: string) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toISOString().split('T')[0];
//     } catch {
//       return "";
//     }
//   };

//   const getTotalQuantity = (qualities: Quality[]) => {
//     return qualities.reduce((sum, q) => sum + q.quantity, 0);
//   };

//   const getTotalValue = (qualities: Quality[]) => {
//     return qualities.reduce((sum, q) => sum + (q.quantity * q.pricePerPack), 0);
//   };

//   const getUserRoleColor = (role: string) => {
//     switch (role) {
//       case "trader": return "bg-purple-100 text-purple-800";
//       case "farmer": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getRegistrationStatusColor = (status: string) => {
//     switch (status) {
//       case "approved": return "bg-green-100 text-green-800";
//       case "pending": return "bg-yellow-100 text-yellow-800";
//       case "rejected": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportExcel = () => {
//     if (rows.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     try {
//       const exportData = rows.map((row, index) => {
//         const qualitiesA = row.qualities.find(q => q.grade === "A");
//         const qualitiesB = row.qualities.find(q => q.grade === "B");
//         const qualitiesC = row.qualities.find(q => q.grade === "C");
        
//         return {
//           "Sr. No.": index + 1,
//           "ID": row._id || "",
//           "User Type": row.userType || "",
//           "Requirement Date": formatDateForExport(row.requirementDate),
//           "Category": row.category || "",
//           "Sub-Category": row.subCategory || "",
//           "Farming Type": row.farmingType || "",
//           "Variety": row.variety || "",
//           "Pack Type": row.packType || "",
//           "Weight per Pack": row.weightPerPack || 0,
//           "A Grade Quantity": qualitiesA?.quantity || 0,
//           "A Grade Price": qualitiesA?.pricePerPack || 0,
//           "B Grade Quantity": qualitiesB?.quantity || 0,
//           "B Grade Price": qualitiesB?.pricePerPack || 0,
//           "C Grade Quantity": qualitiesC?.quantity || 0,
//           "C Grade Price": qualitiesC?.pricePerPack || 0,
//           "Total Quantity": getTotalQuantity(row.qualities),
//           "Total Value": getTotalValue(row.qualities),
//           "Location": row.location || "",
//           "Status": row.status || "",
//           "Created Date": formatDateForExport(row.createdAt),
//           "Posted By": row.postedBy || "",
//           // User Details columns
//           "User Name": row.userDetails?.name || "",
//           "User Mobile": row.userDetails?.mobileNo || "",
//           "User Email": row.userDetails?.email || "",
//           "User Role": row.userDetails?.role || "",
//           "User Taluk": row.userDetails?.taluk || "",
//           "User District": row.userDetails?.district || "",
//           "User State": row.userDetails?.state || "",
//           "User Status": row.userDetails?.registrationStatus || "",
//           "User Active": row.userDetails?.isActive ? "Yes" : "No"
//         };
//       });

//       const ws = XLSX.utils.json_to_sheet(exportData);
      
//       const wscols = [
//         { wch: 8 },  // Sr. No.
//         { wch: 25 }, // ID
//         { wch: 12 }, // User Type
//         { wch: 15 }, // Requirement Date
//         { wch: 20 }, // Category
//         { wch: 20 }, // Sub-Category
//         { wch: 15 }, // Farming Type
//         { wch: 15 }, // Variety
//         { wch: 15 }, // Pack Type
//         { wch: 15 }, // Weight per Pack
//         { wch: 15 }, // A Grade Quantity
//         { wch: 15 }, // A Grade Price
//         { wch: 15 }, // B Grade Quantity
//         { wch: 15 }, // B Grade Price
//         { wch: 15 }, // C Grade Quantity
//         { wch: 15 }, // C Grade Price
//         { wch: 15 }, // Total Quantity
//         { wch: 15 }, // Total Value
//         { wch: 20 }, // Location
//         { wch: 10 }, // Status
//         { wch: 15 }, // Created Date
//         { wch: 20 }, // Posted By
//         { wch: 20 }, // User Name
//         { wch: 15 }, // User Mobile
//         { wch: 25 }, // User Email
//         { wch: 12 }, // User Role
//         { wch: 15 }, // User Taluk
//         { wch: 15 }, // User District
//         { wch: 15 }, // User State
//         { wch: 12 }, // User Status
//         { wch: 10 }, // User Active
//       ];
//       ws['!cols'] = wscols;

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Requirements");
      
//       const header = [["Requirements Report"], [`Generated on: ${new Date().toLocaleDateString()}`], []];
//       XLSX.utils.sheet_add_aoa(ws, header, { origin: "A1" });
      
//       XLSX.writeFile(wb, `requirements_${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       console.error('Excel export error:', err);
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const exportCSV = () => {
//     if (rows.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     try {
//       const exportData = rows.map((row, index) => {
//         const qualitiesA = row.qualities.find(q => q.grade === "A");
//         const qualitiesB = row.qualities.find(q => q.grade === "B");
//         const qualitiesC = row.qualities.find(q => q.grade === "C");
        
//         return {
//           "Sr. No.": index + 1,
//           "ID": row._id || "",
//           "User Type": row.userType || "",
//           "Requirement Date": formatDateForExport(row.requirementDate),
//           "Category": row.category || "",
//           "Sub-Category": row.subCategory || "",
//           "Farming Type": row.farmingType || "",
//           "Variety": row.variety || "",
//           "Pack Type": row.packType || "",
//           "Weight per Pack": row.weightPerPack || 0,
//           "A Grade Quantity": qualitiesA?.quantity || 0,
//           "A Grade Price": qualitiesA?.pricePerPack || 0,
//           "B Grade Quantity": qualitiesB?.quantity || 0,
//           "B Grade Price": qualitiesB?.pricePerPack || 0,
//           "C Grade Quantity": qualitiesC?.quantity || 0,
//           "C Grade Price": qualitiesC?.pricePerPack || 0,
//           "Total Quantity": getTotalQuantity(row.qualities),
//           "Total Value": getTotalValue(row.qualities),
//           "Location": row.location || "",
//           "Status": row.status || "",
//           "Created Date": formatDateForExport(row.createdAt),
//           "Posted By": row.postedBy || "",
//           "User Name": row.userDetails?.name || "",
//           "User Mobile": row.userDetails?.mobileNo || "",
//           "User Email": row.userDetails?.email || "",
//           "User Role": row.userDetails?.role || "",
//           "User Taluk": row.userDetails?.taluk || ""
//         };
//       });

//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
      
//       const header = `Requirements Report\nGenerated on: ${new Date().toLocaleDateString()}\n\n`;
//       const csvWithHeader = header + csv;
      
//       const blob = new Blob([csvWithHeader], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `requirements_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       console.error('CSV export error:', err);
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const exportPDF = () => {
//     if (rows.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF('landscape');
      
//       doc.setFontSize(18);
//       doc.setTextColor(40, 40, 40);
//       doc.text("Requirements Report", 14, 15);
      
//       doc.setFontSize(10);
//       doc.setTextColor(100, 100, 100);
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
//       doc.text(`Total Records: ${rows.length}`, 14, 28);
      
//       const tableData = rows.map((row, index) => [
//         (index + 1).toString(),
//         row._id.substring(0, 8) + "...",
//         row.userType || "",
//         formatDate(row.requirementDate),
//         row.category || "",
//         row.subCategory || "",
//         row.farmingType || "",
//         row.variety || "",
//         row.packType || "",
//         `${row.weightPerPack} kg`,
//         getTotalQuantity(row.qualities),
//         `₹${getTotalValue(row.qualities)}`,
//         row.location || "",
//         row.status || "",
//         row.userDetails?.name || "N/A",
//         row.userDetails?.role || "N/A",
//         row.userDetails?.taluk || "N/A"
//       ]);

//       autoTable(doc, {
//         startY: 35,
//         head: [
//           ["Sr.", "ID", "User Type", "Req Date", "Category", "Sub-Category", 
//            "Farming Type", "Variety", "Pack Type", "Weight/Pack", 
//            "Total Qty", "Total Value", "Location", "Status", "User", "Role", "Taluk"]
//         ],
//         body: tableData,
//         theme: 'grid',
//         styles: { 
//           fontSize: 7,
//           cellPadding: 2,
//           overflow: 'linebreak'
//         },
//         headStyles: { 
//           fillColor: [59, 130, 246],
//           textColor: 255,
//           fontStyle: 'bold'
//         },
//         margin: { left: 14, right: 14 },
//         didDrawPage: function (data) {
//           doc.setFontSize(8);
//           doc.setTextColor(100);
//           const pageCount = doc.internal.pages.length - 1;
//           doc.text(
//             `Page ${pageCount}`,
//             doc.internal.pageSize.width / 2,
//             doc.internal.pageSize.height - 10,
//             { align: 'center' }
//           );
//         }
//       });

//       doc.save(`requirements_${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       console.error('PDF export error:', err);
//       toast.error("Failed to export PDF file");
//     }
//   };

//   const copyData = async () => {
//     if (rows.length === 0) {
//       toast.error("No data to copy");
//       return;
//     }

//     try {
//       let tableData = "REQUIREMENTS REPORT\n";
//       tableData += `Generated on: ${new Date().toLocaleDateString()}\n`;
//       tableData += `Total Records: ${rows.length}\n\n`;
      
//       const headers = [
//         "Sr.No".padEnd(6),
//         "User".padEnd(15),
//         "Role".padEnd(10),
//         "Category".padEnd(15),
//         "Sub-Category".padEnd(15),
//         "Req Date".padEnd(12),
//         "Variety".padEnd(12),
//         "Pack Type".padEnd(12),
//         "Weight".padEnd(10),
//         "Total Qty".padEnd(10),
//         "Total Value".padEnd(15),
//         "Location".padEnd(15),
//         "Status".padEnd(10),
//         "User Taluk".padEnd(15)
//       ];
      
//       tableData += headers.join(" | ") + "\n";
//       tableData += "-".repeat(180) + "\n";
      
//       rows.forEach((row, index) => {
//         const rowData = [
//           (index + 1).toString().padEnd(6),
//           (row.userDetails?.name || "").substring(0, 14).padEnd(15),
//           (row.userDetails?.role || "").padEnd(10),
//           (row.category || "").padEnd(15),
//           (row.subCategory || "").padEnd(15),
//           formatDate(row.requirementDate).padEnd(12),
//           (row.variety || "").padEnd(12),
//           (row.packType || "").padEnd(12),
//           `${row.weightPerPack}kg`.padEnd(10),
//           getTotalQuantity(row.qualities).toString().padEnd(10),
//           `₹${getTotalValue(row.qualities)}`.padEnd(15),
//           (row.location || "").padEnd(15),
//           (row.status || "").padEnd(10),
//           (row.userDetails?.taluk || "").padEnd(15)
//         ];
        
//         tableData += rowData.join(" | ") + "\n";
//       });
      
//       tableData += "\n".padEnd(180, "-") + "\n";
//       tableData += `SUMMARY:\n`;
//       tableData += `Total Requirements: ${rows.length}\n`;
//       tableData += `Active: ${rows.filter(r => r.status === "Active").length}\n`;
//       tableData += `Inactive: ${rows.filter(r => r.status === "Inactive").length}\n`;
//       tableData += `Farmers: ${rows.filter(r => r.userDetails?.role === "farmer").length}\n`;
//       tableData += `Traders: ${rows.filter(r => r.userDetails?.role === "trader").length}\n`;
//       tableData += `Total Quantity (All): ${rows.reduce((sum, r) => sum + getTotalQuantity(r.qualities), 0)} packs\n`;
//       tableData += `Total Value (All): ₹${rows.reduce((sum, r) => sum + getTotalValue(r.qualities), 0)}`;
      
//       await navigator.clipboard.writeText(tableData);
//       toast.success('Data copied to clipboard in tabular format!');
//     } catch (err) {
//       console.error('Copy error:', err);
//       toast.error("Failed to copy data to clipboard");
//     }
//   };

//   const printTable = () => {
//     if (rows.length === 0) {
//       toast.error("No data to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=1200,height=800');
//     if (!printWindow) {
//       toast.error("Please allow popups to print");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Requirements Report</title>
//         <style>
//           body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             margin: 20px;
//             color: #333;
//             font-size: 12px;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//             padding-bottom: 15px;
//             border-bottom: 2px solid #4CAF50;
//           }
//           .header h1 {
//             margin: 0 0 10px 0;
//             color: #1f2937;
//             font-size: 24px;
//           }
//           .header-info {
//             color: #6b7280;
//             font-size: 14px;
//             margin: 5px 0;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//             font-size: 10px;
//           }
//           th {
//             background-color: #f3f4f6;
//             color: #374151;
//             font-weight: 600;
//             padding: 10px 6px;
//             text-align: left;
//             border: 1px solid #d1d5db;
//           }
//           td {
//             padding: 8px 6px;
//             border: 1px solid #e5e7eb;
//             vertical-align: top;
//           }
//           tr:nth-child(even) {
//             background-color: #f9fafb;
//           }
//           .status-active {
//             color: #059669;
//             background-color: #d1fae5;
//             padding: 3px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//             font-weight: 600;
//           }
//           .status-inactive {
//             color: #dc2626;
//             background-color: #fee2e2;
//             padding: 3px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//             font-weight: 600;
//           }
//           .user-badge {
//             display: inline-block;
//             padding: 2px 8px;
//             border-radius: 10px;
//             font-size: 9px;
//             font-weight: 600;
//             margin: 1px;
//           }
//           .trader-badge {
//             background-color: #e0e7ff;
//             color: #3730a3;
//           }
//           .farmer-badge {
//             background-color: #d1fae5;
//             color: #065f46;
//           }
//           .user-info {
//             background-color: #f8fafc;
//             border-radius: 6px;
//             padding: 8px;
//             margin: 5px 0;
//             border: 1px solid #e2e8f0;
//           }
//           .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #e5e7eb;
//             font-size: 11px;
//             color: #6b7280;
//             text-align: center;
//           }
//           .summary {
//             margin-top: 30px;
//             padding: 15px;
//             background-color: #f8fafc;
//             border-radius: 8px;
//             border: 1px solid #e2e8f0;
//           }
//           .summary h3 {
//             margin-top: 0;
//             color: #1e293b;
//           }
//           @media print {
//             @page {
//               margin: 0.5in;
//               size: landscape;
//             }
//             body {
//               margin: 0;
//               -webkit-print-color-adjust: exact;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>📋 Requirements Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Requirements: ${rows.length} | Page: ${page} of ${totalPages}</div>
//           <div class="header-info">Showing ${Math.min((page - 1) * rowsPerPage + 1, totalItems)} to ${Math.min(page * rowsPerPage, totalItems)} of ${totalItems} records</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>User Info</th>
//               <th>Category</th>
//               <th>Sub-Category</th>
//               <th>Variety</th>
//               <th>Pack Type</th>
//               <th>Weight/Pack</th>
//               <th>Qualities</th>
//               <th>Total Qty</th>
//               <th>Total Value</th>
//               <th>Location</th>
//               <th>Req Date</th>
//               <th>Status</th>
//               <th>User Taluk</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${rows.map((row, index) => {
//               const totalQty = getTotalQuantity(row.qualities);
//               const totalValue = getTotalValue(row.qualities);
//               const qualitiesHtml = row.qualities.map(q => 
//                 `<span class="user-badge">${q.grade}: ${q.quantity} @ ₹${q.pricePerPack}</span>`
//               ).join(' ');
              
//               const userRoleClass = row.userDetails?.role === 'trader' ? 'trader-badge' : 'farmer-badge';
//               const userInfoHtml = row.userDetails ? `
//                 <div class="user-info">
//                   <div><strong>${row.userDetails.name}</strong></div>
//                   <div>${row.userDetails.mobileNo}</div>
//                   <div><span class="user-badge ${userRoleClass}">${row.userDetails.role}</span></div>
//                 </div>
//               ` : 'N/A';
              
//               return `
//                 <tr>
//                   <td>${index + 1 + (page - 1) * rowsPerPage}</td>
//                   <td>${userInfoHtml}</td>
//                   <td>${row.category || ""}</td>
//                   <td>${row.subCategory || ""}</td>
//                   <td>${row.variety || "N/A"}</td>
//                   <td>${row.packType || ""}</td>
//                   <td>${row.weightPerPack} kg</td>
//                   <td>${qualitiesHtml}</td>
//                   <td><strong>${totalQty}</strong></td>
//                   <td><strong>₹${totalValue}</strong></td>
//                   <td>${row.location || ""}</td>
//                   <td>${formatDate(row.requirementDate)}</td>
//                   <td><span class="status-${row.status.toLowerCase()}">${row.status}</span></td>
//                   <td>${row.userDetails?.taluk || "N/A"}</td>
//                 </tr>
//               `;
//             }).join('')}
//           </tbody>
//         </table>
        
//         <div class="summary">
//           <h3>📊 Report Summary</h3>
//           <p><strong>Total Requirements:</strong> ${rows.length}</p>
//           <p><strong>Active Requirements:</strong> ${rows.filter(r => r.status === "Active").length}</p>
//           <p><strong>Inactive Requirements:</strong> ${rows.filter(r => r.status === "Inactive").length}</p>
//           <p><strong>Farmers:</strong> ${rows.filter(r => r.userDetails?.role === "farmer").length}</p>
//           <p><strong>Traders:</strong> ${rows.filter(r => r.userDetails?.role === "trader").length}</p>
//           <p><strong>Total Quantity (All):</strong> ${rows.reduce((sum, r) => sum + getTotalQuantity(r.qualities), 0)} packs</p>
//           <p><strong>Total Value (All):</strong> ₹${rows.reduce((sum, r) => sum + getTotalValue(r.qualities), 0)}</p>
//         </div>
        
//         <div class="footer">
//           <p>Printed from Requirements Management System | ${window.location.hostname}</p>
//           <p>© ${new Date().getFullYear()} All rights reserved.</p>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(() => {
//               window.close();
//             }, 500);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-auto bg-gray-50 relative text-gray-900 md:p-1">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//           <CircularProgress />
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-3">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Requirements Management</h1>
//             <p className="text-gray-600 mt-2">Manage and track all your requirements in one place</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Card */}
//       <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden">
//         {/* Action Bar */}
//         <div className="p-1 md:p-3 py-2 border-b border-gray-200">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 flex-wrap flex gap-x-3 gap-y-3">
//               <div className="relative">
//                 <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search by category, variety, location, user..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setPage(1);
//                   }}
//                   className="lg:w-[30vw] md:w-80 w-72 px-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
//                 />
//                  { searchTerm.length >0 &&<AiOutlineClose onClick={()=>setSearchTerm("")} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-5 h-5" />}
//               </div>

//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 <FaFilter className="w-4 h-4" />
//                 Filters
//                 <FaChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//               </button>

//               {/* Bulk Actions */}
//               {selectedIds.length > 0 && (
//                 <button
//                   onClick={() => setBulkDeleteOpen(true)}
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//                 >
//                   <FaTrash className="w-4 h-4" />
//                   Delete Selected ({selectedIds.length})
//                 </button>
//               )}
//             </div>

//             {/* Export Buttons */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={copyData}
//                 className="p-2 px-3 bg-zinc-200 rounded hover:bg-gray-50 transition-colors group relative"
//                 title="Copy Data"
//               >
//                 <FaCopy className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
//               </button>
//               <button
//                 onClick={exportExcel}
//                 className="p-2 px-3 rounded hover:bg-gray-50 bg-green-200 transition-colors group relative"
//                 title="Export to Excel"
//               >
//                 <FaFileExcel className="w-4 h-4 text-green-600 group-hover:text-green-700" />
//               </button>
//               <button
//                 onClick={exportCSV}
//                 className="p-2 px-3 rounded bg-blue-200 hover:bg-gray-50 transition-colors group relative"
//                 title="Export to CSV"
//               >
//                 <FaFileCsv className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
//               </button>
//               <button
//                 onClick={exportPDF}
//                 className="p-2 px-3 rounded hover:bg-gray-50 bg-red-200 transition-colors group relative"
//                 title="Export to PDF"
//               >
//                 <FaFilePdf className="w-4 h-4 text-red-600 group-hover:text-red-700" />
//               </button>
//               <button
//                 onClick={printTable}
//                 className="p-2 px-3 rounded hover:bg-gray-50 bg-violet-200 transition-colors group relative"
//                 title="Print"
//               >
//                 <FaPrint className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
//               </button>
//             </div>
//           </div>

//           {/* Filters Panel */}
//           {showFilters && (
//             <div className="mt-5 p-2 bg-gray-50 rounded border border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => {
//                       setFilterStatus(e.target.value);
//                       setPage(1);
//                     }}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                   <select
//                     value={filterCategory}
//                     onChange={(e) => {
//                       setFilterCategory(e.target.value);
//                       setPage(1);
//                     }}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   >
//                     <option value="all">All Categories</option>
//                     {category.map((cat, i) => (
//                       <option key={i} value={cat.categoryName}>{cat.categoryName}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     onClick={() => {
//                       setFilterStatus("all");
//                       setFilterCategory("all");
//                       setPage(1);
//                     }}
//                     className="w-fit px-4 py-2.5 text-xs bg-green-600 text-white border border-green-300 rounded hover:bg-green-700 transition-colors"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Desktop Table */}
//         <div className="hidden xl:block overflow-x-auto">
//           <table ref={tableRef} className="min-w-[110%]">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10">
//                   <input
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                     className="rounded border-gray-300"
//                   />
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Details</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
//                 <th className="px-5 xl:w-40 py-2 text-left text-xs font-semibold text-gray-700 uppercase ">Sub-Category</th>
//                 <th className="px-5 xl:w-40 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Farming Type</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Weight/Pack</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualities</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
//                 <th className="px-5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {rows.map((row) => (
//                 <tr key={row._id} className="hover:bg-gray-50 border-t border-zinc-200">
//                   <td className="px-5 py-2 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(row._id)}
//                       onChange={(e) => handleSelectOne(row._id, e.target.checked)}
//                       className="rounded border-gray-300"
//                     />
//                   </td>
//                   <td className="px-5 py-2">
//                     {row.userDetails ? (
//                       <div className="space-y-1.5">
//                         <div className="flex items-center gap-2">
//                           <FaUser className="text-blue-500 w-3.5 h-3.5" />
//                           <span className="text-sm font-medium text-gray-900">{row.userDetails.name}</span>
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getUserRoleColor(row.userDetails.role)}`}>
//                             {row.userDetails.role}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <FaPhone className="text-gray-400 w-3 h-3" />
//                           <span className="text-xs text-gray-600">{row.userDetails.mobileNo}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <FaMapPin className="text-gray-400 w-3 h-3" />
//                           <span className="text-xs text-gray-600">{row.userDetails.taluk}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getRegistrationStatusColor(row.userDetails.registrationStatus)}`}>
//                             {row.userDetails.registrationStatus}
//                           </span>
//                           <FaCheckCircle className={`w-3 h-3 ${row.userDetails.isActive ? 'text-green-500' : 'text-gray-300'}`} />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-xs text-gray-400 italic">No user details</div>
//                     )}
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap">
//                     <div className="flex items-center gap-2">
//                       <FaCalendarAlt className="text-gray-400 w-4 h-4" />
//                       <span className="text-sm">{formatDate(row.requirementDate)}</span>
//                     </div>
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap">
//                     <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
//                       {row.category}
//                     </span>
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-900">
//                     {row.subCategory}
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-700">
//                     {row.farmingType}
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
//                     {row.weightPerPack} kg
//                   </td>
//                   <td className="px-5 py-2">
//                     <div className="flex flex-wrap gap-1">
//                       {row.qualities.map((quality) => (
//                         <span
//                           key={quality._id}
//                           className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
//                         >
//                           {quality.grade}: {quality.quantity} @ ₹{quality.pricePerPack}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-700">
//                     {row.location}
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap">
//                     <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(row.status)}`}>
//                       {row.status}
//                     </span>
//                   </td>
//                   <td className="px-5 py-2 whitespace-nowrap">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleView(row)}
//                         className="p-2 px-3 text-green-600 hover:bg-green-100 transition-colors"
//                         title="View Details"
//                       >
//                         <FaEye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setID(row._id);
//                           setEditOpen(true);
//                         }}
//                         className="p-2 px-3 text-blue-600 hover:bg-blue-100 transition-colors"
//                         title="Edit"
//                       >
//                         <FaEdit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setID(row._id);
//                           setDeleteOpen(true);
//                         }}
//                         className="p-2 px-3 text-red-600 hover:bg-red-100 transition-colors"
//                         title="Delete"
//                       >
//                         <FaTrash className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Cards */}
//         <div className="xl:hidden p-2">
//           {rows.length === 0 ? (
//             <div className="text-center py-16">
//               <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
//               <p className="text-gray-600 text-lg mb-2">No requirements found</p>
//               <p className="text-gray-500">Try adjusting your search or filters</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {rows.map((row) => (
//                 <div key={row._id} className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.includes(row._id)}
//                         onChange={(e) => handleSelectOne(row._id, e.target.checked)}
//                         className="rounded border-gray-300 mt-1"
//                       />
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
//                         {row.status}
//                       </span>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleView(row)}
//                         className="p-1.5 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
//                         title="View Details"
//                       >
//                         <FaEye className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setID(row._id);
//                           setEditOpen(true);
//                         }}
//                         className="p-1.5 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//                         title="Edit"
//                       >
//                         <FaEdit className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setID(row._id);
//                           setDeleteOpen(true);
//                         }}
//                         className="p-1.5 text-red-600 hover:bg-red-100 transition-colors"
//                         title="Delete"
//                       >
//                         <FaTrash className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* User Details Section */}
//                   {row.userDetails && (
//                     <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <FaUser className="text-blue-600 w-4 h-4" />
//                           <span className="font-medium text-gray-900">{row.userDetails.name}</span>
//                         </div>
//                         <span className={`px-2 py-0.5 text-xs rounded-full ${getUserRoleColor(row.userDetails.role)}`}>
//                           {row.userDetails.role}
//                         </span>
//                       </div>
                      
//                       <div className="grid grid-cols-2 gap-2 text-xs">
//                         <div className="flex items-center gap-1">
//                           <FaPhone className="text-gray-400 w-3 h-3" />
//                           <span className="text-gray-600">{row.userDetails.mobileNo}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <FaEnvelope className="text-gray-400 w-3 h-3" />
//                           <span className="text-gray-600 truncate">{row.userDetails.email}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <FaMapPin className="text-gray-400 w-3 h-3" />
//                           <span className="text-gray-600">{row.userDetails.taluk}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <FaBuilding className="text-gray-400 w-3 h-3" />
//                           <span className="text-gray-600">{row.userDetails.district}</span>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-2 mt-2">
//                         <span className={`px-2 py-0.5 text-xs rounded-full ${getRegistrationStatusColor(row.userDetails.registrationStatus)}`}>
//                           {row.userDetails.registrationStatus}
//                         </span>
//                         <FaCheckCircle className={`w-3 h-3 ${row.userDetails.isActive ? 'text-green-500' : 'text-gray-300'}`} />
//                         <span className="text-xs text-gray-500 ml-auto">ID: {row.userDetails.userId}</span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2 text-sm">
//                       <FaCalendarAlt className="text-gray-400 w-4 h-4 flex-shrink-0" />
//                       <span className="font-medium text-gray-700">{formatDate(row.requirementDate)}</span>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="flex items-center gap-2">
//                         <FaTag className="text-blue-500 w-4 h-4 flex-shrink-0" />
//                         <div>
//                           <p className="text-xs text-gray-500">Category</p>
//                           <p className="text-sm font-medium text-gray-800">{row.category}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <FaSeedling className="text-green-500 w-4 h-4 flex-shrink-0" />
//                         <div>
//                           <p className="text-xs text-gray-500">Sub-Category</p>
//                           <p className="text-sm font-medium text-gray-800">{row.subCategory}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 flex-shrink-0 text-center text-yellow-400">🌱</div>
//                         <div>
//                           <p className="text-xs text-gray-500">Farming Type</p>
//                           <p className="text-sm font-medium text-gray-800">{row.farmingType}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <FaWeight className="text-purple-500 w-4 h-4 flex-shrink-0" />
//                         <div>
//                           <p className="text-xs text-gray-500">Weight/Pack</p>
//                           <p className="text-sm font-medium text-gray-800">{row.weightPerPack} kg</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-2">
//                       <FaMapMarkerAlt className="text-red-500 w-4 h-4 flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-xs text-gray-500">Location</p>
//                         <p className="text-sm font-medium text-gray-800">{row.location}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Qualities</p>
//                       <div className="flex flex-wrap gap-1.5">
//                         {row.qualities.map((quality) => (
//                           <span
//                             key={quality._id}
//                             className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200"
//                           >
//                             <span className="font-semibold">{quality.grade}</span>: {quality.quantity} packs @ ₹{quality.pricePerPack}/pack
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     {row.variety && (
//                       <div className="bg-gray-50 rounded-lg p-2.5">
//                         <p className="text-xs text-gray-500">Variety</p>
//                         <p className="text-sm font-medium text-gray-800">{row.variety}</p>
//                       </div>
//                     )}

//                     <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//                       <span className="text-xs text-gray-500">Total Quantity</span>
//                       <span className="text-sm font-bold text-blue-600">
//                         {getTotalQuantity(row.qualities)} packs
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Empty State */}
//         {!loading && rows.length === 0 && (
//           <div className="text-center py-16">
//             <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
//             <p className="text-gray-600 text-lg mb-2">No requirements found</p>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}

//         {/* Pagination */}
//         {rows.length > 0 && (
//           <div className="px-5 py-2 border-t border-gray-200">
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing{" "}
//                 <span className="font-semibold">
//                   {Math.min((page - 1) * rowsPerPage + 1, totalItems)}
//                 </span>{" "}
//                 to{" "}
//                 <span className="font-semibold">
//                   {Math.min(page * rowsPerPage, totalItems)}
//                 </span>{" "}
//                 of{" "}
//                 <span className="font-semibold">{totalItems}</span>{" "}
//                 results
//                 <select
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setPage(1);
//                   }}
//                   className="w-fit px-2 py-1 ml-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={30}>30</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="text-sm text-gray-600">
//                   Page {page} of {totalPages}
//                 </div>
//                 <Pagination
//                   count={totalPages}
//                   page={page}
//                   onChange={(_, value) => setPage(value)}
//                   color="primary"
//                   shape="rounded"
//                   showFirstButton
//                   showLastButton
//                   siblingCount={1}
//                   boundaryCount={1}
//                   size="small"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= VIEW DIALOG ================= */}
//       <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="lg" fullWidth>
//         <div className="p-6 max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900">Requirement Details</h3>
//               <p className="text-gray-600 text-sm">Complete information about this requirement</p>
//             </div>
//             <span className={`px-3 py-1 text-xs font-medium rounded-full border ${selectedRequirement ? getStatusColor(selectedRequirement.status) : ''}`}>
//               {selectedRequirement?.status}
//             </span>
//           </div>

//           {selectedRequirement && (
//             <div className="space-y-6">
//               {/* User Details Section */}
//               {selectedRequirement.userDetails && (
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FaUser className="text-blue-600" />
//                       User Information
//                     </h4>
//                     <div className="flex items-center gap-2">
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${getUserRoleColor(selectedRequirement.userDetails.role)}`}>
//                         {selectedRequirement.userDetails.role}
//                       </span>
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRegistrationStatusColor(selectedRequirement.userDetails.registrationStatus)}`}>
//                         {selectedRequirement.userDetails.registrationStatus}
//                       </span>
//                       {selectedRequirement.userDetails.isActive ? (
//                         <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
//                           <FaCheckCircle className="w-3 h-3" /> Active
//                         </span>
//                       ) : (
//                         <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
//                           Inactive
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div className="bg-white p-3 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <FaUserTag className="text-blue-500 w-4 h-4" />
//                         <p className="text-sm font-medium text-gray-700">Name</p>
//                       </div>
//                       <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.name}</p>
//                     </div>
                    
//                     <div className="bg-white p-3 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <FaPhone className="text-green-500 w-4 h-4" />
//                         <p className="text-sm font-medium text-gray-700">Mobile Number</p>
//                       </div>
//                       <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.mobileNo}</p>
//                     </div>
                    
//                     <div className="bg-white p-3 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <FaEnvelope className="text-purple-500 w-4 h-4" />
//                         <p className="text-sm font-medium text-gray-700">Email</p>
//                       </div>
//                       <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.email}</p>
//                     </div>
                    
//                     <div className="bg-white p-3 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <FaMapPin className="text-red-500 w-4 h-4" />
//                         <p className="text-sm font-medium text-gray-700">Taluk</p>
//                       </div>
//                       <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.taluk}</p>
//                     </div>
                    
//                     <div className="bg-white p-3 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <FaBuilding className="text-yellow-500 w-4 h-4" />
//                         <p className="text-sm font-medium text-gray-700">District</p>
//                       </div>
//                       <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.district}</p>
//                     </div>
                    
//                     <div className="bg-white p-3 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <FaGlobeAsia className="text-indigo-500 w-4 h-4" />
//                         <p className="text-sm font-medium text-gray-700">State</p>
//                       </div>
//                       <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.state}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FaMapMarkerAlt className="text-gray-500 w-4 h-4" />
//                       <p className="text-sm font-medium text-gray-700">Address</p>
//                     </div>
//                     <p className="text-gray-900">{selectedRequirement.userDetails.address}, {selectedRequirement.userDetails.village}</p>
//                   </div>

//                   <div className="mt-4 flex items-center justify-between">
//                     <div className="text-sm text-gray-600">
//                       User ID: <span className="font-mono font-bold">{selectedRequirement.userDetails.userId}</span>
//                     </div>
//                     {selectedRequirement.userDetails.registrationStatus === 'approved' && (
//                       <div className="flex items-center gap-1 text-green-600">
//                         <FaShieldAlt className="w-4 h-4" />
//                         <span className="text-sm font-medium">Verified User</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Basic Information */}
//               <div className="bg-gray-50 rounded-lg p-5">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FaTag className="text-blue-500" />
//                   Requirement Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">User Type</p>
//                     <div className="flex items-center gap-2">
//                       <FaUser className="text-gray-400 w-4 h-4" />
//                       <p className="font-medium text-gray-800">{selectedRequirement.userType}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Category</p>
//                     <div className="flex items-center gap-2">
//                       <FaTag className="text-blue-500 w-4 h-4" />
//                       <p className="font-medium text-gray-800">{selectedRequirement.category}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Sub Category</p>
//                     <div className="flex items-center gap-2">
//                       <FaSeedling className="text-green-500 w-4 h-4" />
//                       <p className="font-medium text-gray-800">{selectedRequirement.subCategory}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Farming Type</p>
//                     <div className="flex items-center gap-2">
//                       <FaLeaf className="text-green-500 w-4 h-4" />
//                       <p className="font-medium text-gray-800">{selectedRequirement.farmingType}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Variety</p>
//                     <p className="font-medium text-gray-800">{selectedRequirement.variety || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Pack Type</p>
//                     <div className="flex items-center gap-2">
//                       <FaBox className="text-purple-500 w-4 h-4" />
//                       <p className="font-medium text-gray-800">{selectedRequirement.packType}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Packaging Details */}
//               <div className="bg-gray-50 rounded-lg p-5">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FaWeight className="text-orange-500" />
//                   Packaging & Location
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FaWeight className="text-orange-500 w-5 h-5" />
//                       <p className="text-lg font-medium text-gray-900">Weight per Pack</p>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">{selectedRequirement.weightPerPack} kg</p>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FaMapMarkerAlt className="text-red-500 w-5 h-5" />
//                       <p className="text-lg font-medium text-gray-900">Location</p>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">{selectedRequirement.location}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Quality Details */}
//               <div className="bg-gray-50 rounded-lg p-5">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FaHashtag className="text-green-500" />
//                   Quality Details
//                 </h4>
//                 <div className="space-y-4">
//                   {selectedRequirement.qualities.map((quality, index) => (
//                     <div key={quality._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//                       <div className={`px-4 py-3 ${quality.grade === "A" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200" : quality.grade === "B" ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200"}`}>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${quality.grade === "A" ? "bg-green-500 text-white" : quality.grade === "B" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"}`}>
//                               Grade {quality.grade}
//                             </span>
//                             <span className="text-sm text-gray-600">Quality Specification</span>
//                           </div>
//                           <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
//                         </div>
//                       </div>
//                       <div className="p-4">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="text-center">
//                             <p className="text-sm text-gray-500 mb-1">Quantity</p>
//                             <p className="text-2xl font-bold text-blue-600">{quality.quantity}</p>
//                             <p className="text-xs text-gray-500">packs</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-sm text-gray-500 mb-1">Price per Pack</p>
//                             <p className="text-2xl font-bold text-green-600">₹{quality.pricePerPack}</p>
//                             <p className="text-xs text-gray-500">per pack</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-sm text-gray-500 mb-1">Total Value</p>
//                             <p className="text-2xl font-bold text-purple-600">₹{quality.quantity * quality.pricePerPack}</p>
//                             <p className="text-xs text-gray-500">for this grade</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   {/* Totals */}
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-sm font-medium text-gray-700">Total Quantity (All Grades)</p>
//                         <p className="text-3xl font-bold text-blue-600 mt-2">
//                           {getTotalQuantity(selectedRequirement.qualities)} packs
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-medium text-gray-700">Total Value (All Grades)</p>
//                         <p className="text-3xl font-bold text-green-600 mt-2">
//                           ₹{getTotalValue(selectedRequirement.qualities)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Dates Information */}
//               <div className="bg-gray-50 rounded-lg p-5">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FaCalendarAlt className="text-indigo-500" />
//                   Dates & Timeline
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FaCalendarAlt className="text-indigo-500 w-5 h-5" />
//                       <p className="text-sm font-medium text-gray-700">Requirement Date</p>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">{formatDate(selectedRequirement.requirementDate)}</p>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FaClock className="text-gray-500 w-5 h-5" />
//                       <p className="text-sm font-medium text-gray-700">Posted Date</p>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">{formatDateTime(selectedRequirement.createdAt)}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Additional Information */}
//               <div className="bg-gray-50 rounded-lg p-5">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FaIdBadge className="text-gray-500" />
//                   System Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-500 mb-1">Requirement ID</p>
//                     <p className="font-medium text-gray-800 text-sm font-mono break-all">{selectedRequirement._id}</p>
//                   </div>
//                   {selectedRequirement.postedBy && (
//                     <div className="bg-white p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 mb-1">Posted By User ID</p>
//                       <p className="font-medium text-gray-800">{selectedRequirement.postedBy}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end gap-3 mt-8">
//             <button
//               onClick={() => setViewOpen(false)}
//               className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Close Details
//             </button>
//           </div>
//         </div>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
//         <div className="p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Requirement</h3>
//           <p className="text-gray-600 text-sm mb-6">Update the requirement status</p>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-8">
//             <button
//               onClick={() => setEditOpen(false)}
//               className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => updateStatus(ID)}
//               className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </Dialog>

//       {/* Delete Dialog */}
//       <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
//         <div className="p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
          
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//               <FaTrash className="w-6 h-6 text-red-600" />
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">Delete this requirement?</p>
//               <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => setDeleteOpen(false)}
//               className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => handleDelete(ID)}
//               className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </Dialog>

//       {/* Bulk Delete Dialog */}
//       <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="sm" fullWidth>
//         <div className="p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Bulk Deletion</h3>
          
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//               <FaTrash className="w-6 h-6 text-red-600" />
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">Delete {selectedIds.length} selected requirements?</p>
//               <p className="text-sm text-gray-600 mt-1">This action cannot be undone. All selected requirements will be permanently removed.</p>
//             </div>
//           </div>

//           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <p className="text-sm text-gray-700">
//               <span className="font-semibold">Number of Requirements:</span> {selectedIds.length}<br />
//               <span className="text-xs text-gray-500">This will delete all selected requirements from the database.</span>
//             </p>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => setBulkDeleteOpen(false)}
//               className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleBulkDelete}
//               className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Delete {selectedIds.length} Requirements
//             </button>
//           </div>
//         </div>
//       </Dialog>

//       {/* Add Dialog - Keep as is */}
//       <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
//         {/* ... existing add dialog content ... */}
//       </Dialog>
//     </div>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FaTrash, FaEdit, FaFileExcel, FaFileCsv, FaFilePdf, 
  FaPrint, FaCopy, FaSearch, FaFilter, FaPlus, FaEye, 
  FaChevronDown, FaCalendarAlt, FaSeedling, FaWeight, 
  FaMapMarkerAlt, FaTag, FaCheck, FaUser, FaBox, FaLeaf,
  FaDollarSign, FaHashtag, FaClock, FaIdBadge,
  FaPhone, FaEnvelope, FaMapPin, FaBuilding, FaCheckCircle,
  FaUserTag, FaShieldAlt, FaGlobeAsia
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog, Pagination, CircularProgress } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { getAdminSessionAction } from "@/app/actions/auth-actions";
import { AiOutlineClose } from "react-icons/ai";

/* ================= TYPES ================= */

export interface Quality {
  _id: string;
  grade: "A" | "B" | "C";
  pricePerPack: number;
  quantity: number;
}

export interface UserDetails {
  name: string;
  mobileNo: string;
  email: string;
  taluk: string;
  district: string;
  state: string;
  address: string;
  village: string;
  userId: string;
  role: string;
  registrationStatus: string;
  isActive: boolean;
}

export interface Requirement {
  _id: string;
  userType: "Trader" | "Farmer";
  category: string;
  subCategory: string;
  farmingType: string;
  variety: string;
  packType: string;
  weightPerPack: number;
  qualities: Quality[];
  requirementDate: string;
  location: string;
  status: "Active" | "Inactive";
  createdAt: string;
  __v: number;
  postedBy?: string;
  userDetails?: UserDetails | null;
}

type Cat = {
  _id: string,
  categoryName: string,
  categoryId: string,
}

/* ================= PAGE ================= */

export default function RequirementsPage() {
  const [rows, setRows] = useState<Requirement[]>([]);
  const [page, setPage] = useState(1);
  const [ID, setID] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [status, setStatus] = useState("Active");
  const [change, setChange] = useState<any>();
  const [category, setCategory] = useState<Cat[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [userDetailsExpanded, setUserDetailsExpanded] = useState(false);
  
  const tableRef = useRef<HTMLTableElement>(null);
  const [user, setUser] = useState<{
    role: string,
    taluka: string
  }>();

  /* ================= DATA FETCHING ================= */

  const getRequirements = async () => {
    try {
      setLoading(true);
      const params: any = {
          search: searchTerm,
          status: filterStatus !== "all" ? filterStatus : undefined,
          category: filterCategory !== "all" ? filterCategory : undefined,
          page,
          limit: rowsPerPage,
        }
          const session = await getAdminSessionAction();
          setUser(session?.admin);
              if (session?.admin) {
                if (session.admin.role === 'subadmin') {
                  params.taluk = session?.admin?.taluka;
                }
              }
      const response = await axios.get('/api/requirements', {
       params
      });
      
      if (response.data.success) {
        setRows(response.data.data || []);
        setTotalItems(response.data.total || 0);
        setTotalPages(Math.ceil(response.data.total / rowsPerPage) || 1);
        setError(null);
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        setError('Failed to fetch requirements');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error loading requirements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    try {
      const response = await axios.get('/api/category');
      if (response.data.success) {
        setCategory(response.data.category);
        setError(null);
      } else {
        setError('Failed to fetch category');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error loading category. Please try again.');
    }
  };

  useEffect(() => {
    getRequirements();
    getCategory();
  }, [searchTerm, filterStatus, filterCategory, page, rowsPerPage, change]);

  /* ================= VIEW FUNCTION ================= */

  const handleView = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setViewOpen(true);
  };

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = rows.map(row => row._id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
      setSelectAll(false);
    }
  };

  /* ================= BULK DELETE ================= */

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("No requirements selected");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/requirements/bulk-delete', {
        ids: selectedIds
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        setSelectAll(false);
        setBulkDeleteOpen(false);
        getRequirements();
      } else {
        toast.error("Failed to delete requirements");
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      toast.error("Error deleting requirements");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/requirements/${id}`);
      if (response.data.success) {
        toast.success("Requirement deleted successfully");
        setChange(response.data);
        setDeleteOpen(false);
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Failed to delete");
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/requirements/${id}`, { status });
      if (response.data.success) {
        toast.success("Status updated successfully");
        setChange(response.data);
        setEditOpen(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Status update error");
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UTILITY FUNCTIONS ================= */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Inactive": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateForExport = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const getTotalQuantity = (qualities: Quality[]) => {
    return qualities.reduce((sum, q) => sum + q.quantity, 0);
  };

  const getTotalValue = (qualities: Quality[]) => {
    return qualities.reduce((sum, q) => sum + (q.quantity * q.pricePerPack), 0);
  };

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case "trader": return "bg-purple-100 text-purple-800";
      case "farmer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportExcel = () => {
    if (rows.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const exportData = rows.map((row, index) => {
        const qualitiesA = row.qualities.find(q => q.grade === "A");
        const qualitiesB = row.qualities.find(q => q.grade === "B");
        const qualitiesC = row.qualities.find(q => q.grade === "C");
        
        return {
          "Sr. No.": index + 1,
          "ID": row._id || "",
          "User Type": row.userType || "",
          "Requirement Date": formatDateForExport(row.requirementDate),
          "Category": row.category || "",
          "Sub-Category": row.subCategory || "",
          "Farming Type": row.farmingType || "",
          "Variety": row.variety || "",
          "Pack Type": row.packType || "",
          "Weight per Pack": row.weightPerPack || 0,
          "A Grade Quantity": qualitiesA?.quantity || 0,
          "A Grade Price": qualitiesA?.pricePerPack || 0,
          "B Grade Quantity": qualitiesB?.quantity || 0,
          "B Grade Price": qualitiesB?.pricePerPack || 0,
          "C Grade Quantity": qualitiesC?.quantity || 0,
          "C Grade Price": qualitiesC?.pricePerPack || 0,
          "Total Quantity": getTotalQuantity(row.qualities),
          "Total Value": getTotalValue(row.qualities),
          "Location": row.location || "",
          "Status": row.status || "",
          "Created Date": formatDateForExport(row.createdAt),
          "Posted By": row.postedBy || "",
          // User Details columns
          "User Name": row.userDetails?.name || "",
          "User Mobile": row.userDetails?.mobileNo || "",
          "User Email": row.userDetails?.email || "",
          "User Role": row.userDetails?.role || "",
          "User Taluk": row.userDetails?.taluk || "",
          "User District": row.userDetails?.district || "",
          "User State": row.userDetails?.state || "",
          "User Status": row.userDetails?.registrationStatus || "",
          "User Active": row.userDetails?.isActive ? "Yes" : "No"
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      
      const wscols = [
        { wch: 8 },  // Sr. No.
        { wch: 25 }, // ID
        { wch: 12 }, // User Type
        { wch: 15 }, // Requirement Date
        { wch: 20 }, // Category
        { wch: 20 }, // Sub-Category
        { wch: 15 }, // Farming Type
        { wch: 15 }, // Variety
        { wch: 15 }, // Pack Type
        { wch: 15 }, // Weight per Pack
        { wch: 15 }, // A Grade Quantity
        { wch: 15 }, // A Grade Price
        { wch: 15 }, // B Grade Quantity
        { wch: 15 }, // B Grade Price
        { wch: 15 }, // C Grade Quantity
        { wch: 15 }, // C Grade Price
        { wch: 15 }, // Total Quantity
        { wch: 15 }, // Total Value
        { wch: 20 }, // Location
        { wch: 10 }, // Status
        { wch: 15 }, // Created Date
        { wch: 20 }, // Posted By
        { wch: 20 }, // User Name
        { wch: 15 }, // User Mobile
        { wch: 25 }, // User Email
        { wch: 12 }, // User Role
        { wch: 15 }, // User Taluk
        { wch: 15 }, // User District
        { wch: 15 }, // User State
        { wch: 12 }, // User Status
        { wch: 10 }, // User Active
      ];
      ws['!cols'] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Requirements");
      
      const header = [["Requirements Report"], [`Generated on: ${new Date().toLocaleDateString()}`], []];
      XLSX.utils.sheet_add_aoa(ws, header, { origin: "A1" });
      
      XLSX.writeFile(wb, `requirements_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      console.error('Excel export error:', err);
      toast.error("Failed to export Excel file");
    }
  };

  const exportCSV = () => {
    if (rows.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const exportData = rows.map((row, index) => {
        const qualitiesA = row.qualities.find(q => q.grade === "A");
        const qualitiesB = row.qualities.find(q => q.grade === "B");
        const qualitiesC = row.qualities.find(q => q.grade === "C");
        
        return {
          "Sr. No.": index + 1,
          "ID": row._id || "",
          "User Type": row.userType || "",
          "Requirement Date": formatDateForExport(row.requirementDate),
          "Category": row.category || "",
          "Sub-Category": row.subCategory || "",
          "Farming Type": row.farmingType || "",
          "Variety": row.variety || "",
          "Pack Type": row.packType || "",
          "Weight per Pack": row.weightPerPack || 0,
          "A Grade Quantity": qualitiesA?.quantity || 0,
          "A Grade Price": qualitiesA?.pricePerPack || 0,
          "B Grade Quantity": qualitiesB?.quantity || 0,
          "B Grade Price": qualitiesB?.pricePerPack || 0,
          "C Grade Quantity": qualitiesC?.quantity || 0,
          "C Grade Price": qualitiesC?.pricePerPack || 0,
          "Total Quantity": getTotalQuantity(row.qualities),
          "Total Value": getTotalValue(row.qualities),
          "Location": row.location || "",
          "Status": row.status || "",
          "Created Date": formatDateForExport(row.createdAt),
          "Posted By": row.postedBy || "",
          "User Name": row.userDetails?.name || "",
          "User Mobile": row.userDetails?.mobileNo || "",
          "User Email": row.userDetails?.email || "",
          "User Role": row.userDetails?.role || "",
          "User Taluk": row.userDetails?.taluk || ""
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      
      const header = `Requirements Report\nGenerated on: ${new Date().toLocaleDateString()}\n\n`;
      const csvWithHeader = header + csv;
      
      const blob = new Blob([csvWithHeader], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `requirements_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV file exported successfully!");
    } catch (err) {
      console.error('CSV export error:', err);
      toast.error("Failed to export CSV file");
    }
  };

  const exportPDF = () => {
    if (rows.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const doc = new jsPDF('landscape');
      
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Requirements Report", 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      doc.text(`Total Records: ${rows.length}`, 14, 28);
      
      const tableData = rows.map((row, index) => [
        (index + 1).toString(),
        row._id.substring(0, 8) + "...",
        row.userType || "",
        formatDate(row.requirementDate),
        row.category || "",
        row.subCategory || "",
        row.farmingType || "",
        row.variety || "",
        row.packType || "",
        `${row.weightPerPack} kg`,
        getTotalQuantity(row.qualities),
        `₹${getTotalValue(row.qualities)}`,
        row.location || "",
        row.status || "",
        row.userDetails?.name || "N/A",
        row.userDetails?.role || "N/A",
        row.userDetails?.taluk || "N/A"
      ]);

      autoTable(doc, {
        startY: 35,
        head: [
          ["Sr.", "ID", "User Type", "Req Date", "Category", "Sub-Category", 
           "Farming Type", "Variety", "Pack Type", "Weight/Pack", 
           "Total Qty", "Total Value", "Location", "Status", "User", "Role", "Taluk"]
        ],
        body: tableData,
        theme: 'grid',
        styles: { 
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { left: 14, right: 14 },
        didDrawPage: function (data) {
          doc.setFontSize(8);
          doc.setTextColor(100);
          const pageCount = doc.internal.pages.length - 1;
          doc.text(
            `Page ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });

      doc.save(`requirements_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error("Failed to export PDF file");
    }
  };

  const copyData = async () => {
    if (rows.length === 0) {
      toast.error("No data to copy");
      return;
    }

    try {
      let tableData = "REQUIREMENTS REPORT\n";
      tableData += `Generated on: ${new Date().toLocaleDateString()}\n`;
      tableData += `Total Records: ${rows.length}\n\n`;
      
      const headers = [
        "Sr.No".padEnd(6),
        "User".padEnd(15),
        "Role".padEnd(10),
        "Category".padEnd(15),
        "Sub-Category".padEnd(15),
        "Req Date".padEnd(12),
        "Variety".padEnd(12),
        "Pack Type".padEnd(12),
        "Weight".padEnd(10),
        "Total Qty".padEnd(10),
        "Total Value".padEnd(15),
        "Location".padEnd(15),
        "Status".padEnd(10),
        "User Taluk".padEnd(15)
      ];
      
      tableData += headers.join(" | ") + "\n";
      tableData += "-".repeat(180) + "\n";
      
      rows.forEach((row, index) => {
        const rowData = [
          (index + 1).toString().padEnd(6),
          (row.userDetails?.name || "").substring(0, 14).padEnd(15),
          (row.userDetails?.role || "").padEnd(10),
          (row.category || "").padEnd(15),
          (row.subCategory || "").padEnd(15),
          formatDate(row.requirementDate).padEnd(12),
          (row.variety || "").padEnd(12),
          (row.packType || "").padEnd(12),
          `${row.weightPerPack}kg`.padEnd(10),
          getTotalQuantity(row.qualities).toString().padEnd(10),
          `₹${getTotalValue(row.qualities)}`.padEnd(15),
          (row.location || "").padEnd(15),
          (row.status || "").padEnd(10),
          (row.userDetails?.taluk || "").padEnd(15)
        ];
        
        tableData += rowData.join(" | ") + "\n";
      });
      
      tableData += "\n".padEnd(180, "-") + "\n";
      tableData += `SUMMARY:\n`;
      tableData += `Total Requirements: ${rows.length}\n`;
      tableData += `Active: ${rows.filter(r => r.status === "Active").length}\n`;
      tableData += `Inactive: ${rows.filter(r => r.status === "Inactive").length}\n`;
      tableData += `Farmers: ${rows.filter(r => r.userDetails?.role === "farmer").length}\n`;
      tableData += `Traders: ${rows.filter(r => r.userDetails?.role === "trader").length}\n`;
      tableData += `Total Quantity (All): ${rows.reduce((sum, r) => sum + getTotalQuantity(r.qualities), 0)} packs\n`;
      tableData += `Total Value (All): ₹${rows.reduce((sum, r) => sum + getTotalValue(r.qualities), 0)}`;
      
      await navigator.clipboard.writeText(tableData);
      toast.success('Data copied to clipboard in tabular format!');
    } catch (err) {
      console.error('Copy error:', err);
      toast.error("Failed to copy data to clipboard");
    }
  };

  const printTable = () => {
    if (rows.length === 0) {
      toast.error("No data to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Requirements Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            color: #333;
            font-size: 12px;
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
            font-size: 10px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 10px 6px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status-active {
            color: #059669;
            background-color: #d1fae5;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
          }
          .status-inactive {
            color: #dc2626;
            background-color: #fee2e2;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
          }
          .user-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 600;
            margin: 1px;
          }
          .trader-badge {
            background-color: #e0e7ff;
            color: #3730a3;
          }
          .farmer-badge {
            background-color: #d1fae5;
            color: #065f46;
          }
          .user-info {
            background-color: #f8fafc;
            border-radius: 6px;
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #e2e8f0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #6b7280;
            text-align: center;
          }
          .summary {
            margin-top: 30px;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .summary h3 {
            margin-top: 0;
            color: #1e293b;
          }
          @media print {
            @page {
              margin: 0.5in;
              size: landscape;
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
          <h1>📋 Requirements Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Requirements: ${rows.length} | Page: ${page} of ${totalPages}</div>
          <div class="header-info">Showing ${Math.min((page - 1) * rowsPerPage + 1, totalItems)} to ${Math.min(page * rowsPerPage, totalItems)} of ${totalItems} records</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>User Info</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Variety</th>
              <th>Pack Type</th>
              <th>Weight/Pack</th>
              <th>Qualities</th>
              <th>Total Qty</th>
              <th>Total Value</th>
              <th>Location</th>
              <th>Req Date</th>
              <th>Status</th>
              <th>User Taluk</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, index) => {
              const totalQty = getTotalQuantity(row.qualities);
              const totalValue = getTotalValue(row.qualities);
              const qualitiesHtml = row.qualities.map(q => 
                `<span class="user-badge">${q.grade}: ${q.quantity} @ ₹${q.pricePerPack}</span>`
              ).join(' ');
              
              const userRoleClass = row.userDetails?.role === 'trader' ? 'trader-badge' : 'farmer-badge';
              const userInfoHtml = row.userDetails ? `
                <div class="user-info">
                  <div><strong>${row.userDetails.name}</strong></div>
                  <div>${row.userDetails.mobileNo}</div>
                  <div><span class="user-badge ${userRoleClass}">${row.userDetails.role}</span></div>
                </div>
              ` : 'N/A';
              
              return `
                <tr>
                  <td>${index + 1 + (page - 1) * rowsPerPage}</td>
                  <td>${userInfoHtml}</td>
                  <td>${row.category || ""}</td>
                  <td>${row.subCategory || ""}</td>
                  <td>${row.variety || "N/A"}</td>
                  <td>${row.packType || ""}</td>
                  <td>${row.weightPerPack} kg</td>
                  <td>${qualitiesHtml}</td>
                  <td><strong>${totalQty}</strong></td>
                  <td><strong>₹${totalValue}</strong></td>
                  <td>${row.location || ""}</td>
                  <td>${formatDate(row.requirementDate)}</td>
                  <td><span class="status-${row.status.toLowerCase()}">${row.status}</span></td>
                  <td>${row.userDetails?.taluk || "N/A"}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <h3>📊 Report Summary</h3>
          <p><strong>Total Requirements:</strong> ${rows.length}</p>
          <p><strong>Active Requirements:</strong> ${rows.filter(r => r.status === "Active").length}</p>
          <p><strong>Inactive Requirements:</strong> ${rows.filter(r => r.status === "Inactive").length}</p>
          <p><strong>Farmers:</strong> ${rows.filter(r => r.userDetails?.role === "farmer").length}</p>
          <p><strong>Traders:</strong> ${rows.filter(r => r.userDetails?.role === "trader").length}</p>
          <p><strong>Total Quantity (All):</strong> ${rows.reduce((sum, r) => sum + getTotalQuantity(r.qualities), 0)} packs</p>
          <p><strong>Total Value (All):</strong> ₹${rows.reduce((sum, r) => sum + getTotalValue(r.qualities), 0)}</p>
        </div>
        
        <div class="footer">
          <p>Printed from Requirements Management System | ${window.location.hostname}</p>
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
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-auto bg-gray-50 relative text-gray-900 md:p-1">
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
          <CircularProgress />
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Requirements Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all your requirements in one place</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden">
        {/* Action Bar */}
        <div className="p-1 md:p-3 py-2 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex-wrap flex gap-x-3 gap-y-3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by category, variety, location, user..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="lg:w-[30vw] md:w-80 w-72 px-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
                 { searchTerm.length >0 &&<AiOutlineClose onClick={()=>setSearchTerm("")} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-5 h-5" />}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="w-4 h-4" />
                Filters
                <FaChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyData}
                className="p-2 px-3 bg-zinc-200 rounded hover:bg-gray-50 transition-colors group relative"
                title="Copy Data"
              >
                <FaCopy className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
              </button>
              <button
                onClick={exportExcel}
                className="p-2 px-3 rounded hover:bg-gray-50 bg-green-200 transition-colors group relative"
                title="Export to Excel"
              >
                <FaFileExcel className="w-4 h-4 text-green-600 group-hover:text-green-700" />
              </button>
              <button
                onClick={exportCSV}
                className="p-2 px-3 rounded bg-blue-200 hover:bg-gray-50 transition-colors group relative"
                title="Export to CSV"
              >
                <FaFileCsv className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
              </button>
              <button
                onClick={exportPDF}
                className="p-2 px-3 rounded hover:bg-gray-50 bg-red-200 transition-colors group relative"
                title="Export to PDF"
              >
                <FaFilePdf className="w-4 h-4 text-red-600 group-hover:text-red-700" />
              </button>
              <button
                onClick={printTable}
                className="p-2 px-3 rounded hover:bg-gray-50 bg-violet-200 transition-colors group relative"
                title="Print"
              >
                <FaPrint className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-5 p-2 bg-gray-50 rounded border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Categories</option>
                    {category.map((cat, i) => (
                      <option key={i} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterCategory("all");
                      setPage(1);
                    }}
                    className="w-fit px-4 py-2.5 text-xs bg-green-600 text-white border border-green-300 rounded hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden xl:block overflow-x-auto">
          <table ref={tableRef} className="min-w-[100%]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Details</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-3 xl:w-40 py-2 text-left text-xs font-semibold text-gray-700 uppercase ">Sub-Category</th>
                <th className="px-3 xl:w-40 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Farming Type</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Weight/Pack</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualities</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50 border-t border-zinc-200">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row._id)}
                      onChange={(e) => handleSelectOne(row._id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-2">
                    {row.userDetails ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-blue-500 w-3.5 h-3.5" />
                          <span className="text-xs font-medium text-gray-900">{row.userDetails.name}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getUserRoleColor(row.userDetails.role)}`}>
                            {row.userDetails.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400 w-3 h-3" />
                          <span className="text-xs text-gray-600">{row.userDetails.mobileNo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapPin className="text-gray-400 w-3 h-3" />
                          <span className="text-xs text-gray-600">{row.userDetails.taluk}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getRegistrationStatusColor(row.userDetails.registrationStatus)}`}>
                            {row.userDetails.registrationStatus}
                          </span>
                          <FaCheckCircle className={`w-3 h-3 ${row.userDetails.isActive ? 'text-green-500' : 'text-gray-300'}`} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No user details</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                      <span className="text-xs">{formatDate(row.requirementDate)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {row.subCategory}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                    {row.farmingType}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">
                    {row.weightPerPack} kg
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {row.qualities.map((quality) => (
                        <span
                          key={quality._id}
                          className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                        >
                          {quality.grade}: {quality.quantity} @ ₹{quality.pricePerPack}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                    {row.location}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(row)}
                        className="p-2 px-3 text-green-600 hover:bg-green-100 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setID(row._id);
                          setEditOpen(true);
                        }}
                        className="p-2 px-3 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setID(row._id);
                          setDeleteOpen(true);
                        }}
                        className="p-2 px-3 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="xl:hidden p-2">
          {rows.length === 0 ? (
            <div className="text-center py-16">
              <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600 text-lg mb-2">No requirements found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row._id} className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row._id)}
                        onChange={(e) => handleSelectOne(row._id, e.target.checked)}
                        className="rounded border-gray-300 mt-1"
                      />
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(row)}
                        className="p-1.5 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setID(row._id);
                          setEditOpen(true);
                        }}
                        className="p-1.5 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setID(row._id);
                          setDeleteOpen(true);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* User Details Section */}
                  {row.userDetails && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-blue-600 w-4 h-4" />
                          <span className="font-medium text-gray-900">{row.userDetails.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getUserRoleColor(row.userDetails.role)}`}>
                          {row.userDetails.role}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <FaPhone className="text-gray-400 w-3 h-3" />
                          <span className="text-gray-600">{row.userDetails.mobileNo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaEnvelope className="text-gray-400 w-3 h-3" />
                          <span className="text-gray-600 truncate">{row.userDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaMapPin className="text-gray-400 w-3 h-3" />
                          <span className="text-gray-600">{row.userDetails.taluk}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaBuilding className="text-gray-400 w-3 h-3" />
                          <span className="text-gray-600">{row.userDetails.district}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getRegistrationStatusColor(row.userDetails.registrationStatus)}`}>
                          {row.userDetails.registrationStatus}
                        </span>
                        <FaCheckCircle className={`w-3 h-3 ${row.userDetails.isActive ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-500 ml-auto">ID: {row.userDetails.userId}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <FaCalendarAlt className="text-gray-400 w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{formatDate(row.requirementDate)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-blue-500 w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="text-xs font-medium text-gray-800">{row.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaSeedling className="text-green-500 w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Sub-Category</p>
                          <p className="text-xs font-medium text-gray-800">{row.subCategory}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex-shrink-0 text-center text-yellow-400">🌱</div>
                        <div>
                          <p className="text-xs text-gray-500">Farming Type</p>
                          <p className="text-xs font-medium text-gray-800">{row.farmingType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaWeight className="text-purple-500 w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Weight/Pack</p>
                          <p className="text-xs font-medium text-gray-800">{row.weightPerPack} kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-red-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-xs font-medium text-gray-800">{row.location}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Qualities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {row.qualities.map((quality) => (
                          <span
                            key={quality._id}
                            className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200"
                          >
                            <span className="font-semibold">{quality.grade}</span>: {quality.quantity} packs @ ₹{quality.pricePerPack}/pack
                          </span>
                        ))}
                      </div>
                    </div>

                    {row.variety && (
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500">Variety</p>
                        <p className="text-xs font-medium text-gray-800">{row.variety}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Total Quantity</span>
                      <span className="text-xs font-bold text-blue-600">
                        {getTotalQuantity(row.qualities)} packs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && rows.length === 0 && (
          <div className="text-center py-16">
            <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 text-lg mb-2">No requirements found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {rows.length > 0 && (
          <div className="px-3 py-2 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {Math.min((page - 1) * rowsPerPage + 1, totalItems)}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(page * rowsPerPage, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{totalItems}</span>{" "}
                results
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-fit px-2 py-1 ml-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  size="small"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= VIEW DIALOG ================= */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="lg" fullWidth>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Requirement Details</h3>
              <p className="text-gray-600 text-xs">Complete information about this requirement</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${selectedRequirement ? getStatusColor(selectedRequirement.status) : ''}`}>
              {selectedRequirement?.status}
            </span>
          </div>

          {selectedRequirement && (
            <div className="space-y-6">
              {/* User Details Section */}
              {selectedRequirement.userDetails && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      User Information
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getUserRoleColor(selectedRequirement.userDetails.role)}`}>
                        {selectedRequirement.userDetails.role}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRegistrationStatusColor(selectedRequirement.userDetails.registrationStatus)}`}>
                        {selectedRequirement.userDetails.registrationStatus}
                      </span>
                      {selectedRequirement.userDetails.isActive ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                          <FaCheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUserTag className="text-blue-500 w-4 h-4" />
                        <p className="text-xs font-medium text-gray-700">Name</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.name}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaPhone className="text-green-500 w-4 h-4" />
                        <p className="text-xs font-medium text-gray-700">Mobile Number</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.mobileNo}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaEnvelope className="text-purple-500 w-4 h-4" />
                        <p className="text-xs font-medium text-gray-700">Email</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.email}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaMapPin className="text-red-500 w-4 h-4" />
                        <p className="text-xs font-medium text-gray-700">Taluk</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.taluk}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaBuilding className="text-yellow-500 w-4 h-4" />
                        <p className="text-xs font-medium text-gray-700">District</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.district}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaGlobeAsia className="text-indigo-500 w-4 h-4" />
                        <p className="text-xs font-medium text-gray-700">State</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedRequirement.userDetails.state}</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-gray-500 w-4 h-4" />
                      <p className="text-xs font-medium text-gray-700">Address</p>
                    </div>
                    <p className="text-gray-900">{selectedRequirement.userDetails.address}, {selectedRequirement.userDetails.village}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      User ID: <span className="font-mono font-bold">{selectedRequirement.userDetails.userId}</span>
                    </div>
                    {selectedRequirement.userDetails.registrationStatus === 'approved' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <FaShieldAlt className="w-4 h-4" />
                        <span className="text-xs font-medium">Verified User</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-500" />
                  Requirement Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">User Type</p>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400 w-4 h-4" />
                      <p className="font-medium text-gray-800">{selectedRequirement.userType}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <div className="flex items-center gap-2">
                      <FaTag className="text-blue-500 w-4 h-4" />
                      <p className="font-medium text-gray-800">{selectedRequirement.category}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sub Category</p>
                    <div className="flex items-center gap-2">
                      <FaSeedling className="text-green-500 w-4 h-4" />
                      <p className="font-medium text-gray-800">{selectedRequirement.subCategory}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Farming Type</p>
                    <div className="flex items-center gap-2">
                      <FaLeaf className="text-green-500 w-4 h-4" />
                      <p className="font-medium text-gray-800">{selectedRequirement.farmingType}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Variety</p>
                    <p className="font-medium text-gray-800">{selectedRequirement.variety || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pack Type</p>
                    <div className="flex items-center gap-2">
                      <FaBox className="text-purple-500 w-4 h-4" />
                      <p className="font-medium text-gray-800">{selectedRequirement.packType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Packaging Details */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaWeight className="text-orange-500" />
                  Packaging & Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaWeight className="text-orange-500 w-5 h-5" />
                      <p className="text-lg font-medium text-gray-900">Weight per Pack</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedRequirement.weightPerPack} kg</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-red-500 w-5 h-5" />
                      <p className="text-lg font-medium text-gray-900">Location</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{selectedRequirement.location}</p>
                  </div>
                </div>
              </div>

              {/* Quality Details */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaHashtag className="text-green-500" />
                  Quality Details
                </h4>
                <div className="space-y-4">
                  {selectedRequirement.qualities.map((quality, index) => (
                    <div key={quality._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className={`px-4 py-3 ${quality.grade === "A" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200" : quality.grade === "B" ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${quality.grade === "A" ? "bg-green-500 text-white" : quality.grade === "B" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"}`}>
                              Grade {quality.grade}
                            </span>
                            <span className="text-xs text-gray-600">Quality Specification</span>
                          </div>
                          <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                            <p className="text-2xl font-bold text-blue-600">{quality.quantity}</p>
                            <p className="text-xs text-gray-500">packs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Price per Pack</p>
                            <p className="text-2xl font-bold text-green-600">₹{quality.pricePerPack}</p>
                            <p className="text-xs text-gray-500">per pack</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Total Value</p>
                            <p className="text-2xl font-bold text-purple-600">₹{quality.quantity * quality.pricePerPack}</p>
                            <p className="text-xs text-gray-500">for this grade</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Total Quantity (All Grades)</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                          {getTotalQuantity(selectedRequirement.qualities)} packs
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-700">Total Value (All Grades)</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                          ₹{getTotalValue(selectedRequirement.qualities)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Information */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-500" />
                  Dates & Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="text-indigo-500 w-5 h-5" />
                      <p className="text-xs font-medium text-gray-700">Requirement Date</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{formatDate(selectedRequirement.requirementDate)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-gray-500 w-5 h-5" />
                      <p className="text-xs font-medium text-gray-700">Posted Date</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{formatDateTime(selectedRequirement.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaIdBadge className="text-gray-500" />
                  System Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Requirement ID</p>
                    <p className="font-medium text-gray-800 text-xs font-mono break-all">{selectedRequirement._id}</p>
                  </div>
                  {selectedRequirement.postedBy && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Posted By User ID</p>
                      <p className="font-medium text-gray-800">{selectedRequirement.postedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setViewOpen(false)}
              className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Requirement</h3>
          <p className="text-gray-600 text-xs mb-6">Update the requirement status</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setEditOpen(false)}
              className="px-3 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => updateStatus(ID)}
              className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <FaTrash className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Delete this requirement?</p>
              <p className="text-xs text-gray-600 mt-1">This action cannot be undone.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-3 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(ID)}
              className="px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} maxWidth="sm" fullWidth>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Bulk Deletion</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <FaTrash className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Delete {selectedIds.length} selected requirements?</p>
              <p className="text-xs text-gray-600 mt-1">This action cannot be undone. All selected requirements will be permanently removed.</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Number of Requirements:</span> {selectedIds.length}<br />
              <span className="text-xs text-gray-500">This will delete all selected requirements from the database.</span>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBulkDeleteOpen(false)}
              className="px-3 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete {selectedIds.length} Requirements
            </button>
          </div>
        </div>
      </Dialog>

      {/* Add Dialog - Keep as is */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
        {/* ... existing add dialog content ... */}
      </Dialog>
    </div>
  );
}




