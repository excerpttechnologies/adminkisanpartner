"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaEye,
  FaSearch,
  FaFilter,
  FaBox,
  FaUser,
  FaStore,
  FaCalendarAlt,
  FaTags,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaCopy,
  FaTimes,
  FaFileAlt,
  FaBoxes,
  FaFileCsv,
  FaChevronDown,
  FaChevronUp,
  FaPercentage,
  FaLeaf,
  FaShippingFast,
  FaChartLine,
  FaSeedling,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Interfaces
interface CropSaleItem {
  productId: string;
  farmerId: string;
  categoryId: string;
  subCategoryId: string;
  cropBriefDetails: string;
  farmingType: string;
  packagingType: string;
  deliveryDate: string;
  deliveryTime: string;
  nearestMarket: string;
  createdAt: string;
  
  // From lookups
  categoryName?: string;
  subCategoryName?: string;
  
  // Grade details
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  quantityType: string;
  priceType: string;
  gradeStatus: string;
}

interface Category {
  _id: string;
  categoryName: string;
  categoryId: string;
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
  subCategoryId: string;
  categoryId: string | { buffer: { data: number[] } };
}

const CropSalesReport: React.FC = () => {
  const [salesData, setSalesData] = useState<CropSaleItem[]>([]);
  const [allSalesData, setAllSalesData] = useState<CropSaleItem[]>([]);
  const [displayedData, setDisplayedData] = useState<CropSaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Sorting states
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Categories and SubCategories
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  
  // Current item for details dialog
  const [currentItem, setCurrentItem] = useState<CropSaleItem | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  
  // Mobile view state
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const API_BASE = '/api';
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/category`);
      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [API_BASE]);

  // Fetch subcategories
  const fetchSubCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/subcategory`);
      if (response.data.success) {
        setSubCategories(response.data.subcategories || []);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  }, [API_BASE]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (!categoryFilter) {
      setFilteredSubCategories(subCategories);
    } else {
      const filtered = subCategories.filter(subCat => {
        // Handle both string categoryId and object with buffer
        if (typeof subCat.categoryId === 'string') {
          return subCat.categoryId === categoryFilter;
        } else if (subCat.categoryId && typeof subCat.categoryId === 'object') {
          // Convert buffer to string for comparison
          const bufferArray = subCat.categoryId.buffer?.data || [];
          const bufferString = Buffer.from(bufferArray).toString('hex');
          const categoryHex = Buffer.from(categoryFilter, 'utf8').toString('hex');
          return bufferString.includes(categoryHex);
        }
        return false;
      });
      setFilteredSubCategories(filtered);
    }
  }, [categoryFilter, subCategories]);

  // Fetch sales data with server-side pagination and sorting
  const fetchSalesData = useCallback(async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (categoryFilter) params.append('categoryId', categoryFilter);
    if (subCategoryFilter) params.append('subCategoryId', subCategoryFilter);
    if (gradeFilter) params.append('grade', gradeFilter);
    if (statusFilter) params.append('gradeStatus', statusFilter);
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    params.append('sortBy', sortField);
    params.append('order', sortOrder);

    try {
      const response = await axios.get(`${API_BASE}/crop-sales-report?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setSalesData(data);
        setDisplayedData(data);
        setTotalItems(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
        
        // For export functionality, fetch all data without pagination but with sorting
        const exportParams = new URLSearchParams();
        if (searchInput) exportParams.append('search', searchInput);
        if (categoryFilter) exportParams.append('categoryId', categoryFilter);
        if (subCategoryFilter) exportParams.append('subCategoryId', subCategoryFilter);
        if (gradeFilter) exportParams.append('grade', gradeFilter);
        if (statusFilter) exportParams.append('gradeStatus', statusFilter);
        exportParams.append('limit', '10000'); // Large limit for all data
        exportParams.append('sortBy', sortField);
        exportParams.append('order', sortOrder);
        
        const exportResponse = await axios.get(`${API_BASE}/crop-sales-report?${exportParams.toString()}`);
        if (exportResponse.data.success) {
          setAllSalesData(exportResponse.data.data || []);
        }
      } else {
        toast.error('Failed to fetch crop sales data');
      }
    } catch (error) {
      console.error('Error fetching crop sales:', error);
      toast.error('Error fetching crop sales data');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, searchInput, categoryFilter, subCategoryFilter, gradeFilter, statusFilter, currentPage, itemsPerPage, sortField, sortOrder]);

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [fetchCategories, fetchSubCategories]);

  // Fetch data when filters, pagination or sorting changes
  useEffect(() => {
    fetchSalesData();
  }, [currentPage, itemsPerPage, sortField, sortOrder, fetchSalesData]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Get sort icon for a field
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <FaSortUp className="inline ml-1 text-blue-600" /> 
      : <FaSortDown className="inline ml-1 text-blue-600" />;
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Calculate pagination range
  const getPaginationRange = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return { startItem, endItem };
  };

  // Export functions
  const handleCopyToClipboard = async () => {
    const headers = ["Product ID", "Crop", "Category", "Grade", "Quantity", "Price/Unit", "Total Value", "Status", "Delivery Date"];
    
    const csvContent = [
      headers.join("\t"),
      ...allSalesData.map((item) => {
        const totalValue = item.pricePerUnit * item.totalQty;
        return [
          item.productId,
          item.cropBriefDetails,
          item.categoryName || "N/A",
          item.grade,
          item.totalQty,
          item.pricePerUnit,
          totalValue,
          item.gradeStatus,
          new Date(item.deliveryDate).toLocaleDateString()
        ].join("\t");
      })
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(csvContent);
      toast.success("Data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = allSalesData.map((item) => {
      const totalValue = item.pricePerUnit * item.totalQty;
      return {
        "Product ID": item.productId,
        "Crop Name": item.cropBriefDetails,
        "Category": item.categoryName || "N/A",
        "Sub Category": item.subCategoryName || "N/A",
        "Grade": item.grade,
        "Quantity": item.totalQty,
        "Unit Price": item.pricePerUnit,
        "Total Value": totalValue,
        "Status": item.gradeStatus,
        "Farming Type": item.farmingType,
        "Packaging": item.packagingType,
        "Delivery Date": new Date(item.deliveryDate).toLocaleDateString(),
        "Farmer ID": item.farmerId,
        "Price Type": item.priceType,
        "Quantity Type": item.quantityType,
        "Created At": new Date(item.createdAt).toLocaleString(),
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Crop Sales");
    writeFile(wb, `crop-sales-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = ["Product ID", "Crop", "Category", "Grade", "Quantity", "Price/Unit", "Total Value", "Status", "Delivery Date"];
    
    const csvContent = [
      headers.join(","),
      ...allSalesData.map((item) => {
        const totalValue = item.pricePerUnit * item.totalQty;
        return [
          `"${item.productId}"`,
          `"${item.cropBriefDetails}"`,
          `"${item.categoryName || "N/A"}"`,
          `"${item.grade}"`,
          item.totalQty,
          item.pricePerUnit,
          totalValue,
          `"${item.gradeStatus}"`,
          `"${new Date(item.deliveryDate).toLocaleDateString()}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `crop-sales-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Crop Sales Report", 14, 16);
    
    const tableColumn = ["Product ID", "Crop", "Category", "Grade", "Qty", "Price", "Total", "Status"];
    const tableRows: any = allSalesData.map((item) => {
      const totalValue = item.pricePerUnit * item.totalQty;
      return [
        item.productId,
        item.cropBriefDetails,
        item.categoryName || "N/A",
        item.grade,
        item.totalQty,
        `₹${item.pricePerUnit}`,
        `₹${totalValue}`,
        item.gradeStatus
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`crop-sales-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Crop Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #10b981; color: white; padding: 12px; text-align: left; cursor: pointer; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .total-row { background-color: #f3f4f6; font-weight: bold; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Crop Sales Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Sorted by: ${sortField} (${sortOrder})</p>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Crop</th>
              <th>Category</th>
              <th>Grade</th>
              <th>Quantity</th>
              <th>Price/Unit</th>
              <th>Total Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${allSalesData.map((item) => {
              const totalValue = item.pricePerUnit * item.totalQty;
              return `
                <tr>
                  <td>${item.productId}</td>
                  <td>${item.cropBriefDetails}</td>
                  <td>${item.categoryName || "N/A"}</td>
                  <td>${item.grade}</td>
                  <td>${item.totalQty}</td>
                  <td>₹${item.pricePerUnit}</td>
                  <td>₹${totalValue}</td>
                  <td>${item.gradeStatus}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
    toast.success("Printing crop sales report...");
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partially_sold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reserved':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total value
  const calculateTotalValue = (item: CropSaleItem) => {
    return item.pricePerUnit * item.totalQty;
  };

  // Open details dialog
  const openDetailsDialog = (item: CropSaleItem) => {
    setCurrentItem(item);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setCategoryFilter('');
    setSubCategoryFilter('');
    setGradeFilter('');
    setStatusFilter('');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchSalesData();
  };

  // Calculate stats
  const calculateStats = () => {
    const totalValue = allSalesData.reduce((sum, item) => sum + calculateTotalValue(item), 0);
    const totalQuantity = allSalesData.reduce((sum, item) => sum + item.totalQty, 0);
    const availableItems = allSalesData.filter(item => item.gradeStatus === 'available').length;
    const soldItems = allSalesData.filter(item => item.gradeStatus === 'sold').length;
    
    return { totalValue, totalQuantity, availableItems, soldItems };
  };

  const { totalValue, totalQuantity, availableItems, soldItems } = calculateStats();
  const { startItem, endItem } = getPaginationRange();

  if (loading && allSalesData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crop sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
      {/* Header */}
      <div className="lg:mb-0 mb-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaLeaf className="text-green-600" />
          Crop Sales Report
        </h1>
        <p className="text-gray-600 mt-2">Monitor and manage crop sales data</p>
      </div>

      {/* Export Buttons - Desktop */}
      <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy to clipboard", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Export to Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "Export to CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "Export to PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print report", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Export Buttons - Mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-3">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[50px]`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
        <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <FaRupeeSign className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuantity} units</p>
            </div>
            <FaBoxes className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-2xl font-bold text-gray-900">{availableItems}</p>
            </div>
            <FaCheckCircle className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sold Items</p>
              <p className="text-2xl font-bold text-gray-900">{soldItems}</p>
            </div>
            <FaChartLine className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Search */}
          <div className="col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Search crop, grade, product ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLeaf className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubCategoryFilter(''); // Reset subcategory when category changes
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* SubCategory Filter */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSeedling className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              disabled={!categoryFilter}
            >
              <option value="">All SubCategories</option>
              {filteredSubCategories.map((subCat) => (
                <option key={subCat._id} value={subCat._id}>
                  {subCat.subCategoryName}
                </option>
              ))}
            </select>
          </div> */}

          {/* Grade Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTags className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="">All Grades</option>
              <option value="A Grade">A Grade</option>
              <option value="B Grade">B Grade</option>
              <option value="C Grade">C Grade</option>
              <option value="All Mixed Grades">Mixed Grades</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="partially_sold">Partially Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {/* Sorting Selector */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSort className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="createdAt">Sort by Created Date</option>
              <option value="deliveryDate">Sort by Delivery Date</option>
              <option value="pricePerUnit">Sort by Price</option>
              <option value="totalQty">Sort by Quantity</option>
              <option value="cropBriefDetails">Sort by Crop Name</option>
              <option value="grade">Sort by Grade</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors ${
                sortOrder === 'asc' 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
              title={sortOrder === 'asc' ? 'Ascending order' : 'Descending order'}
            >
              {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 col-span-2 md:col-span-1">
            <button
              onClick={applyFilters}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <FaSearch />
              Search
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              <FaSync />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('productId')}
                >
                  Product ID {getSortIcon('productId')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('cropBriefDetails')}
                >
                  Crop Details {getSortIcon('cropBriefDetails')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('categoryName')}
                >
                  Category {getSortIcon('categoryName')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('grade')}
                >
                  Grade {getSortIcon('grade')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalQty')}
                >
                  Quantity {getSortIcon('totalQty')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('pricePerUnit')}
                >
                  Price/Unit {getSortIcon('pricePerUnit')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gradeStatus')}
                >
                  Status {getSortIcon('gradeStatus')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('deliveryDate')}
                >
                  Delivery Date {getSortIcon('deliveryDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedData.map((item) => (
                <tr key={`${item.productId}-${item.grade}`} className="hover:bg-gray-50 transition-colors">
                  {/* Product ID */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{item.productId}</div>
                    <div className="text-xs text-gray-500">{item.farmerId}</div>
                  </td>

                  {/* Crop Details */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaSeedling className="text-green-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.cropBriefDetails}</div>
                        <div className="text-xs text-gray-500">{item.farmingType}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.categoryName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{item.subCategoryName || 'N/A'}</div>
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {item.grade}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.totalQty}</div>
                    <div className="text-xs text-gray-500">{item.quantityType}</div>
                  </td>

                  {/* Price/Unit */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      <FaRupeeSign className="inline mr-1" />
                      {item.pricePerUnit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{item.priceType}</div>
                  </td>

                  {/* Total Value */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-purple-700">
                      <FaRupeeSign className="inline mr-1" />
                      {calculateTotalValue(item).toLocaleString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.gradeStatus)}`}>
                      {formatStatus(item.gradeStatus)}
                    </span>
                  </td>

                  {/* Delivery Date */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(item.deliveryDate)}</div>
                        <div className="text-xs text-gray-500">{item.deliveryTime}</div>
                      </div>
                    </div>
                  </td>

                  {/* Actions - Only View */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openDetailsDialog(item)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Data State */}
        {displayedData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
              <FaLeaf />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crop sales data found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-4">
        {displayedData.map((item) => (
          <div key={`${item.productId}-${item.grade}`} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-blue-600">{item.productId}</div>
                <div className="text-sm text-gray-500">{item.cropBriefDetails}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openDetailsDialog(item)}
                  className="text-blue-600 p-1"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => setExpandedItem(
                    expandedItem === `${item.productId}-${item.grade}` 
                      ? null 
                      : `${item.productId}-${item.grade}`
                  )}
                  className="text-gray-500 p-1"
                  title={expandedItem === `${item.productId}-${item.grade}` ? "Collapse" : "Expand"}
                >
                  {expandedItem === `${item.productId}-${item.grade}` ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Category</div>
                <div className="font-medium text-sm">{item.categoryName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Grade</div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {item.grade}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Quantity</div>
                <div className="font-medium text-sm">{item.totalQty} {item.quantityType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Price/Unit</div>
                <div className="font-bold text-green-700 text-sm">
                  <FaRupeeSign className="inline mr-1" />
                  {item.pricePerUnit.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Total Value</div>
                <div className="font-bold text-purple-700 text-sm">
                  <FaRupeeSign className="inline mr-1" />
                  {calculateTotalValue(item).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.gradeStatus)}`}>
                  {formatStatus(item.gradeStatus)}
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItem === `${item.productId}-${item.grade}` && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Sub Category</div>
                    <div className="text-sm">{item.subCategoryName || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Farming Type</div>
                    <div className="text-sm">{item.farmingType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Packaging</div>
                    <div className="text-sm">{item.packagingType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Price Type</div>
                    <div className="text-sm">{item.priceType}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Delivery Date</div>
                  <div className="text-sm font-medium">
                    {formatDate(item.deliveryDate)} at {item.deliveryTime}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Farmer ID</div>
                  <div className="text-sm font-medium">{item.farmerId}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Created At</div>
                  <div className="text-sm">{formatDateTime(item.createdAt)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination and Limit Controls */}
      {displayedData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow mt-4">
          {/* Items per page selector */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Showing {startItem} to {endItem} of {totalItems} records
            </div>
            <FormControl size="small" className="min-w-[120px]">
              <InputLabel id="items-per-page-label">Show</InputLabel>
              <Select
                labelId="items-per-page-label"
                value={itemsPerPage}
                label="Show"
                onChange={handleItemsPerPageChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Pagination component */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="small"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                Crop Sale Details: {currentItem?.productId}
              </h2>
              <p className="text-gray-600">Complete crop sale information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {currentItem && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Product Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaBox className="text-blue-600" />
                    Product Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product ID:</span>
                      <span className="font-medium">{currentItem.productId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crop Name:</span>
                      <span className="font-medium">{currentItem.cropBriefDetails}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Farmer ID:</span>
                      <span className="font-medium">{currentItem.farmerId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaLeaf className="text-green-600" />
                    Category Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{currentItem.categoryName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Category:</span>
                      <span className="font-medium">{currentItem.subCategoryName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Farming Type:</span>
                      <span className="font-medium">{currentItem.farmingType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade and Pricing */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaTags className="text-purple-600" />
                  Grade & Pricing Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Grade</div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                      {currentItem.grade}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Price Per Unit</div>
                    <div className="font-bold text-lg text-green-700">
                      <FaRupeeSign className="inline mr-1" />
                      {currentItem.pricePerUnit.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Total Value</div>
                    <div className="font-bold text-lg text-purple-700">
                      <FaRupeeSign className="inline mr-1" />
                      {calculateTotalValue(currentItem).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Price Type</div>
                    <div className="font-medium">{currentItem.priceType}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Quantity Type</div>
                    <div className="font-medium">{currentItem.quantityType}</div>
                  </div>
                </div>
              </div>

              {/* Quantity and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaBoxes className="text-orange-600" />
                    Quantity Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="font-bold text-2xl">{currentItem.totalQty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity Type:</span>
                      <span className="font-medium">{currentItem.quantityType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Packaging Type:</span>
                      <span className="font-medium">{currentItem.packagingType}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaPercentage className="text-red-600" />
                    Status Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentItem.gradeStatus)}`}>
                        {formatStatus(currentItem.gradeStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created At:</span>
                      <span className="font-medium">{formatDateTime(currentItem.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nearest Market:</span>
                      <span className="font-medium">{currentItem.nearestMarket}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="border border-green-200 rounded p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaShippingFast className="text-green-600" />
                  Delivery Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Delivery Date</div>
                    <div className="font-bold text-lg">
                      {formatDate(currentItem.deliveryDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Delivery Time</div>
                    <div className="font-bold text-lg">
                      {currentItem.deliveryTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dialog Footer */}
          <div className="mt-6 pt-6 border-t flex justify-end gap-3">
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CropSalesReport;