"use client";

import { useEffect, useState, ReactNode, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountUp,
  FaSortAmountDown,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaImage,
  FaList,
  FaSortNumericUp,
  FaSortNumericDown,
  FaEye,
  FaFolderPlus,
  FaTags,
} from "react-icons/fa";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Tooltip,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface Category {
  _id: string;
  icon?: string;
  categoryName: string;
  subCategories: string[];
  sortOrder: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  categoryName: string;
  icon: string;
  subCategories: string[];
  sortOrder: number;
  description: string;
  isActive: boolean;
}

/* ================= MODAL STYLE ================= */

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 600 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
  maxHeight: "90vh",
  overflowY: "auto",
};

/* ================= COMPONENT ================= */

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      _id: "1",
      icon: "🌾",
      categoryName: "Grains",
      subCategories: ["Wheat", "Rice", "Corn", "Barley"],
      sortOrder: 1,
      isActive: true,
      description: "Various types of grains and cereals",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "2",
      icon: "🥬",
      categoryName: "Vegetables",
      subCategories: ["Tomato", "Potato", "Onion", "Spinach"],
      sortOrder: 2,
      isActive: true,
      description: "Fresh vegetables and leafy greens",
      createdAt: "2024-01-16T11:45:00Z",
      updatedAt: "2024-01-16T11:45:00Z",
    },
    {
      _id: "3",
      icon: "🍎",
      categoryName: "Fruits",
      subCategories: ["Apple", "Banana", "Orange", "Mango"],
      sortOrder: 3,
      isActive: true,
      description: "Seasonal and tropical fruits",
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z",
    },
    {
      _id: "4",
      icon: "🥛",
      categoryName: "Dairy Products",
      subCategories: ["Milk", "Cheese", "Yogurt"],
      sortOrder: 4,
      isActive: true,
      description: "Dairy and milk products",
      createdAt: "2024-01-18T14:20:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
    },
    {
      _id: "5",
      icon: "🥩",
      categoryName: "Meat",
      subCategories: ["Chicken", "Beef", "Lamb"],
      sortOrder: 5,
      isActive: true,
      description: "Meat and poultry products",
      createdAt: "2024-01-19T16:30:00Z",
      updatedAt: "2024-01-19T16:30:00Z",
    },
  ]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    icon: "",
    subCategories: [],
    sortOrder: 1,
    description: "",
    isActive: true,
  });

  const [newSubCategory, setNewSubCategory] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");

  /* ================= ICONS LIST ================= */

  const CATEGORY_ICONS = [
    "🌾", "🥬", "🍎", "🥛", "🥩", "🌽", "🥦", "🍓", "🍇", "🥕",
    "🧄", "🧅", "🥔", "🍠", "🥜", "🌰", "🍯", "🥚", "🍗", "🐟",
    "🦐", "🍞", "🍚", "🍜", "🧂", "🌶️", "🍋", "🥥", "🥑", "🍆"
  ];

  /* ================= FILTER & SORT ================= */

  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Search filter
    if (search) {
      filtered = filtered.filter(cat =>
        cat.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        cat.description?.toLowerCase().includes(search.toLowerCase()) ||
        cat.subCategories.some(sub => sub.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Status filter
    if (status !== "All") {
      filtered = filtered.filter(cat =>
        status === "Active" ? cat.isActive : !cat.isActive
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "sortOrder") {
        return sortOrder === "asc" ? a.sortOrder - b.sortOrder : b.sortOrder - a.sortOrder;
      } else if (sortBy === "categoryName") {
        return sortOrder === "asc"
          ? a.categoryName.localeCompare(b.categoryName)
          : b.categoryName.localeCompare(a.categoryName);
      } else if (sortBy === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return filtered;
  }, [categories, search, status, sortBy, sortOrder]);

  /* ================= PAGINATION ================= */

  const totalItems = filteredCategories.length;
  const totalFilteredPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, page, rowsPerPage]);

  useEffect(() => {
    setTotalPages(totalFilteredPages);
    if (page > totalFilteredPages) {
      setPage(Math.max(1, totalFilteredPages));
    }
  }, [totalFilteredPages, page]);

  /* ================= FORM HANDLING ================= */

  const handleFormChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSubCategory = () => {
    if (subCategoryInput.trim() && !formData.subCategories.includes(subCategoryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        subCategories: [...prev.subCategories, subCategoryInput.trim()]
      }));
      setSubCategoryInput("");
    }
  };

  const handleRemoveSubCategory = (subCategory: string) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter(sub => sub !== subCategory)
    }));
  };

  const handleAddSubCategoryToCategory = () => {
    if (!selectedCategoryForSub || !newSubCategory.trim()) {
      toast.error("Please select a category and enter a sub-category name");
      return;
    }

    if (selectedCategoryForSub.subCategories.includes(newSubCategory.trim())) {
      toast.error("This sub-category already exists");
      return;
    }

    setCategories(prev => prev.map(cat =>
      cat._id === selectedCategoryForSub._id
        ? {
            ...cat,
            subCategories: [...cat.subCategories, newSubCategory.trim()],
            updatedAt: new Date().toISOString()
          }
        : cat
    ));

    toast.success(`Sub-category "${newSubCategory}" added to "${selectedCategoryForSub.categoryName}"`);
    setNewSubCategory("");
    setSubCategoryModalOpen(false);
    setSelectedCategoryForSub(null);
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (isEditing && currentCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat =>
        cat._id === currentCategory._id
          ? { ...cat, ...formData, updatedAt: new Date().toISOString() }
          : cat
      ));
      toast.success("Category updated successfully!");
    } else {
      // Add new category
      const newCategory: Category = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category added successfully!");
    }

    resetForm();
    setCategoryModalOpen(false);
  };

  const handleDelete = () => {
    if (currentCategory) {
      setCategories(prev => prev.filter(cat => cat._id !== currentCategory._id));
      toast.success("Category deleted successfully!");
      setDeleteOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: "",
      icon: "",
      subCategories: [],
      sortOrder: categories.length + 1,
      description: "",
      isActive: true,
    });
    setSubCategoryInput("");
    setCurrentCategory(null);
    setIsEditing(false);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      categoryName: category.categoryName,
      icon: category.icon || "",
      subCategories: [...category.subCategories],
      sortOrder: category.sortOrder,
      description: category.description || "",
      isActive: category.isActive,
    });
    setIsEditing(true);
    setCategoryModalOpen(true);
  };

  const handleView = (category: Category) => {
    setCurrentCategory(category);
    setViewOpen(true);
  };

  const handleAddSubCategoryClick = (category: Category) => {
    setSelectedCategoryForSub(category);
    setSubCategoryModalOpen(true);
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const handleCopyToClipboard = async () => {
    const headers = ["Icon", "Category Name", "Sub-categories", "Sort Order", "Status", "Description"];
    
    const csvContent = [
      headers.join("\t"),
      ...filteredCategories.map((cat, index) => [
        cat.icon || "",
        cat.categoryName,
        cat.subCategories.join(", "),
        cat.sortOrder,
        cat.isActive ? "Active" : "Inactive",
        cat.description || "",
      ].join("\t"))
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(csvContent);
      toast.success("Categories copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = filteredCategories.map((cat, index) => ({
      "Sr.": index + 1,
      "Icon": cat.icon || "",
      "Category Name": cat.categoryName,
      "Sub-categories": cat.subCategories.join(", "),
      "Sort Order": cat.sortOrder,
      "Status": cat.isActive ? "Active" : "Inactive",
      "Description": cat.description || "",
      "Created": new Date(cat.createdAt).toLocaleDateString(),
      "Last Updated": new Date(cat.updatedAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, `categories-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported successfully!");
  };

  const handleExportCSV = () => {
    const headers = ["Icon", "Category Name", "Sub-categories", "Sort Order", "Status", "Description"];
    
    const csvContent = [
      headers.join(","),
      ...filteredCategories.map(cat => [
        `"${cat.icon || ""}"`,
        `"${cat.categoryName}"`,
        `"${cat.subCategories.join(", ")}"`,
        cat.sortOrder,
        `"${cat.isActive ? "Active" : "Inactive"}"`,
        `"${cat.description || ""}"`,
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `categories-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported successfully!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Product Categories Report", 14, 16);
    
    const tableColumn = ["Sr.", "Icon", "Category", "Sub-categories", "Sort", "Status"];
    const tableRows: any = filteredCategories.map((cat, index) => [
      index + 1,
      cat.icon || "",
      cat.categoryName,
      cat.subCategories.join(", "),
      cat.sortOrder,
      cat.isActive ? "Active" : "Inactive",
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`categories-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported successfully!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Product Categories Report</title>
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
          .status-active {
            background-color: #d1fae5;
            color: #065f46;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
          }
          .status-inactive {
            background-color: #fee2e2;
            color: #991b1b;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
          }
          .icon-cell {
            font-size: 20px;
            text-align: center;
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
          <h1>📊 Product Categories Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Categories: ${filteredCategories.length}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Icon</th>
              <th>Category Name</th>
              <th>Sub-categories</th>
              <th>Sort Order</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${filteredCategories.map((cat, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="icon-cell">${cat.icon || ""}</td>
                <td><strong>${cat.categoryName}</strong></td>
                <td>${cat.subCategories.join(", ")}</td>
                <td>${cat.sortOrder}</td>
                <td><span class="${cat.isActive ? 'status-active' : 'status-inactive'}">${cat.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${cat.description || ""}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      toast.error("Please allow popups to print");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-2">
        manage product categories. {filteredCategories.length} categories found.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setCategoryModalOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 text-xs py-2 rounded transition-colors flex items-center gap-2"
          >
            <FaFolderPlus /> Add Category
          </button>
          <button
            onClick={() => {
              if (categories.length > 0) {
                setSelectedCategoryForSub(categories[0]);
                setSubCategoryModalOpen(true);
              } else {
                toast.error("Please add a category first");
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded transition-colors flex items-center gap-2"
          >
            <FaTags /> Add Subcategory
          </button>
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow ">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
          >
            <btn.icon className="text-sm" />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2 lg:mb-0">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by category name or sub-category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <div className="relative">
              {sortOrder === "asc" ? <FaSortAmountUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> : <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="sortOrder">Sort by Order</option>
                <option value="categoryName">Sort by Name</option>
                <option value="createdAt">Sort by Date</option>
              </select>
            </div>
          </div>

          {/* Sort Order Toggle */}
          <div className="md:col-span-1">
            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? <FaSortNumericUp /> : <FaSortNumericDown />}
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
            <button
              onClick={() => {
                setSearch("");
                setStatus("All");
                setSortBy("sortOrder");
                setSortOrder("asc");
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon className="text-sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="border-b border-zinc-200">
            <tr className="*:text-zinc-800">
              <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Category Icon</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Category Name</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Sub-categories List</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Sort Order</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedCategories.map((category, index) => (
              <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-[.6rem] text-sm text-center">
                  {index + 1 + (page - 1) * rowsPerPage}
                </td>
                <td className="p-[.6rem] text-sm text-center text-2xl">
                  {category.icon || "📦"}
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="font-semibold">{category.categoryName}</div>
                  {category.description && (
                    <div className="text-gray-500 text-xs mt-1">{category.description}</div>
                  )}
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {category.subCategories.slice(0, 3).map((sub, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subCategories.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{category.subCategories.length - 3} more
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddSubCategoryClick(category)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add sub-category
                  </button>
                </td>
                <td className="p-[.6rem] text-sm text-center">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {category.sortOrder}
                  </span>
                </td>
                <td className="p-[.6rem] text-sm">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                    ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="flex gap-[.6rem] text-sm">
                    <Tooltip title="View Details">
                      <button
                        onClick={() => handleView(category)}
                        className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEye />
                      </button>
                    </Tooltip>
                    <Tooltip title="Edit Category">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                    </Tooltip>
                    <Tooltip title="Add Sub-category">
                      <button
                        onClick={() => handleAddSubCategoryClick(category)}
                        className="p-[.6rem] text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <FaTags />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete Category">
                      <button
                        onClick={() => {
                          setCurrentCategory(category);
                          setDeleteOpen(true);
                        }}
                        className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (visible only on small devices) */}
      <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
        {paginatedCategories.map((category) => (
          <div key={category._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon || "📦"}</span>
                <div>
                  <div className="font-bold text-gray-800">{category.categoryName}</div>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                    ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex gap-[.6rem] text-sm">
                <button onClick={() => handleView(category)} className="p-1.5 text-blue-600">
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(category)} className="p-1.5 text-green-600">
                  <FaEdit />
                </button>
                <button onClick={() => handleAddSubCategoryClick(category)} className="p-1.5 text-purple-600">
                  <FaTags />
                </button>
                <button onClick={() => { setCurrentCategory(category); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {category.description && (
                <div className="text-sm text-gray-600">{category.description}</div>
              )}
              <div>
                <div className="text-sm text-gray-500 mb-1">Sub-categories:</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {category.subCategories.slice(0, 3).map((sub, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {sub}
                    </span>
                  ))}
                  {category.subCategories.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{category.subCategories.length - 3} more
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddSubCategoryClick(category)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
                >
                  <FaPlus className="text-xs" /> Add sub-category
                </button>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Sort Order</div>
                  <div className="font-medium">{category.sortOrder}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-xs">{new Date(category.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold mb-2">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearch("");
              setStatus("All");
              setSortBy("sortOrder");
              setSortOrder("asc");
            }}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredCategories.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (page - 1) * rowsPerPage}-{Math.min(page * rowsPerPage, totalItems)}</span> of{" "}
            <span className="font-semibold">{totalItems}</span> categories
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-1 ml-3 border border-zinc-300 rounded"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* ADD/EDIT CATEGORY MODAL */}
      <Modal open={categoryModalOpen} onClose={() => { setCategoryModalOpen(false); resetForm(); }}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            {isEditing ? "Edit Category" : "Add New Category"}
          </Typography>

          <div className="space-y-4">
            {/* Category Name */}
            <TextField
              fullWidth
              label="Category Name *"
              value={formData.categoryName}
              onChange={(e) => handleFormChange("categoryName", e.target.value)}
              variant="outlined"
              size="small"
            />

            {/* Icon Selection */}
            <div>
              <Typography variant="body2" className="mb-2 text-gray-700">
                Category image Icon
              </Typography>
              {/* <div className="grid grid-cols-8 gap-2 mb-2">
                {CATEGORY_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleFormChange("icon", icon)}
                    className={`p-2 text-xl rounded border ${formData.icon === icon ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div> */}
              <TextField
                fullWidth
                
                value={formData.icon}
                onChange={(e) => handleFormChange("icon", e.target.value)}
                variant="outlined"
                size="small"
                type="file"
                placeholder="Enter icon as file"
              />
            </div>

            {/* Sub-categories */}
            <div>
              {/* <Typography variant="body2" className="mb-2 text-gray-700">
                Sub-categories
              </Typography> */}
              <div className="flex gap-2 mb-2">
                {/* <TextField
                  fullWidth
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubCategory())}
                  placeholder="Enter sub-category"
                  variant="outlined"
                  size="small"
                />
                <Button
                  onClick={handleAddSubCategory}
                  variant="contained"
                  size="small"
                >
                  Add
                </Button> */}
              </div>
              {/* <div className="flex flex-wrap gap-2 mt-2">
                {formData.subCategories.map((sub, index) => (
                  <Chip
                    key={index}
                    label={sub}
                    onDelete={() => handleRemoveSubCategory(sub)}
                    color="primary"
                    size="small"
                  />
                ))}
              </div> */}
            </div>

            {/* Sort Order */}
            <div >
              <TextField
              fullWidth
              type="number"
              label="Sort Order *"
              value={formData.sortOrder}
              onChange={(e) => handleFormChange("sortOrder", parseInt(e.target.value) || 1)}
              variant="outlined"
              size="small"
              inputProps={{ min: 1 }}
            />
            </div>

            {/* Description */}
            {/* <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              variant="outlined"
              size="small"
              multiline
              rows={2}
            /> */}

            {/* Status */}
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.isActive}
                label="Status"
                onChange={(e) => handleFormChange("isActive", e.target.value === "true")}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => { setCategoryModalOpen(false); resetForm(); }} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {isEditing ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </Box>
      </Modal>

      {/* ADD SUB-CATEGORY MODAL */}
      <Dialog open={subCategoryModalOpen} onClose={() => { setSubCategoryModalOpen(false); setSelectedCategoryForSub(null); }}>
        <DialogTitle>
          <div className="flex items-center gap-2">
            <FaTags className="text-blue-500" />
            Add New Sub-category
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            {/* Category Selection */}
            <FormControl fullWidth size="small">
              <InputLabel>Select Category *</InputLabel>
              <Select
                value={selectedCategoryForSub?._id || ""}
                label="Select Category *"
                onChange={(e) => {
                  const selectedCat = categories.find(cat => cat._id === e.target.value);
                  setSelectedCategoryForSub(selectedCat || null);
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon || "📦"}</span>
                      <span>{cat.categoryName}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({cat.subCategories.length} sub-categories)
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCategoryForSub && (
              <>
                {/* Existing Sub-categories */}
                <div>
                  <Typography variant="body2" className="mb-2 text-gray-700">
                    Existing Sub-categories
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryForSub.subCategories.length > 0 ? (
                      selectedCategoryForSub.subCategories.map((sub, idx) => (
                        <Chip
                          key={idx}
                          label={sub}
                          size="small"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" className="text-gray-500">
                        No sub-categories yet
                      </Typography>
                    )}
                  </div>
                </div>

                {/* New Sub-category Input */}
                <TextField
                  fullWidth
                  label="New Sub-category Name *"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Enter sub-category name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubCategoryToCategory()}
                />
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSubCategoryModalOpen(false); setSelectedCategoryForSub(null); }} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleAddSubCategoryToCategory} 
            variant="contained" 
            color="primary"
            disabled={!selectedCategoryForSub || !newSubCategory.trim()}
          >
            Add Sub-category
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <Typography variant="h6" className="mb-2">
              Delete "{currentCategory?.categoryName}"?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete this category and all its sub-categories? 
              This action cannot be undone.
            </Typography>
            <div className="flex justify-center gap-[.6rem] text-sm">
              <Button onClick={() => setDeleteOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete Category
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={modalStyle}>
          {currentCategory && (
            <>
              <Typography variant="h6" className="mb-6 flex items-center gap-2">
                <span className="text-2xl">{currentCategory.icon || "📦"}</span>
                {currentCategory.categoryName}
              </Typography>
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${currentCategory.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {currentCategory.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Sort Order</div>
                    <div className="font-medium text-lg">{currentCategory.sortOrder}</div>
                  </div>
                </div>

                {/* Description */}
                {currentCategory.description && (
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Description</div>
                    <div>{currentCategory.description}</div>
                  </div>
                )}

                {/* Sub-categories */}
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Sub-categories ({currentCategory.subCategories.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {currentCategory.subCategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Created</div>
                    <div>{new Date(currentCategory.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(currentCategory.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div>{new Date(currentCategory.updatedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(currentCategory.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setViewOpen(false)} variant="contained">
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}