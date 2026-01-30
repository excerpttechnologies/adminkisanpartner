

















// "use client"

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   FaEye,
//   FaSearch,
//   FaFilter,
//   FaBox,
//   FaUser,
//   FaStore,
//   FaCalendarAlt,
//   FaTags,
//   FaRupeeSign,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSync,
//   FaPrint,
//   FaFilePdf,
//   FaFileExcel,
//   FaCopy,
//   FaTimes,
//   FaFileAlt,
//   FaBoxes,
//   FaFileCsv,
//   FaChevronDown,
//   FaChevronUp,
//   FaPercentage,
//   FaLeaf,
//   FaShippingFast,
//   FaChartLine,
//   FaSeedling,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaMapMarkerAlt,
//   FaIdCard,
//   FaInfoCircle,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarker,
//   FaBuilding,
//   FaWarehouse,
//   FaShoppingCart,
//   FaUsers,
//   FaUserTie,
//   FaHome,
//   FaLocationArrow,
//   FaCity,
//   FaGlobeAsia,
//   FaAddressCard,
//   FaCertificate,
//   FaMoneyBillWave,
//   FaWeightHanging,
//   FaTruck,
//   FaClock,
//   FaCalendar,
//   FaGlobe,
//   FaIdBadge,
//   FaFileInvoiceDollar,
//   FaChartBar,
//   FaCog,
//   FaDatabase,
//   FaCreditCard,
//   FaUniversity,
//   FaPiggyBank,
//   FaRupeeSign as RupeeIcon,
//   FaDollarSign,
//   FaChartPie,
//   FaWarehouse as WarehouseIcon,
//   FaClipboardList
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// // Interfaces based on your API response
// interface MarketDetails {
//   _id: string;
//   marketId: string;
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district: string;
//   state: string;
//   exactAddress?: string;
//   landmark?: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface PersonalInfo {
//   name: string;
//   mobileNo: string;
//   email: string;
//   address: string;
//   villageGramaPanchayat: string;
//   pincode: string;
//   state: string;
//   district: string;
//   taluk: string;
//   post: string;
// }

// interface FarmerDetails {
//   farmerId: string;
//   personalInfo: PersonalInfo;
//   role: string;
//   farmLocation: {
//     latitude: string;
//     longitude: string;
//   };
//   farmLand: {
//     total: number | null;
//     cultivated: number | null;
//     uncultivated: number | null;
//   };
//   bankDetails: {
//     accountHolderName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//   };
//   registrationStatus: string;
//   isActive: boolean;
//   commodities: string[];
//   nearestMarkets: string[];
//   subcategories: string[];
//   registeredAt: string;
//   updatedAt?: string;
// }

// interface TraderDetails {
//   traderId: string;
//   personalInfo: PersonalInfo;
//   role: string;
//   farmLocation: {
//     latitude: string;
//     longitude: string;
//   };
//   farmLand: {
//     total: number | null;
//     cultivated: number | null;
//     uncultivated: number | null;
//   };
//   bankDetails: {
//     accountHolderName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//   };
//   registrationStatus: string;
//   isActive: boolean;
//   commodities: string[];
//   nearestMarkets: string[];
//   subcategories: string[];
//   registeredAt: string;
//   updatedAt?: string;
// }

// interface CropSaleItem {
//   farmerId: string;
//   categoryId: string;
//   subCategoryId: string;
//   cropBriefDetails: string;
//   farmingType: string;
//   packagingType: string;
//   deliveryDate: string;
//   deliveryTime: string;
//   nearestMarket: string;
//   createdAt: string;
//   productId: string;
//   categoryName: string;
//   subCategoryName: string;
//   grade: string;
//   pricePerUnit: number;
//   totalQty: number;
//   quantityType: string;
//   priceType: string;
//   gradeStatus: string;
  
//   // Detailed information from API
//   marketDetails?: MarketDetails;
//   farmerDetails?: FarmerDetails;
//   traderDetails?: TraderDetails[];
//   purchaseHistory?: any[];
// }

// interface Category {
//   _id: string;
//   categoryName: string;
//   categoryId: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryName: string;
//   subCategoryId: string;
//   categoryId: string | { buffer: { data: number[] } };
// }

// interface ApiResponse {
//   success: boolean;
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   data: CropSaleItem[];
// }

// const CropSalesReport: React.FC = () => {
//   const [salesData, setSalesData] = useState<CropSaleItem[]>([]);
//   const [allSalesData, setAllSalesData] = useState<CropSaleItem[]>([]);
//   const [displayedData, setDisplayedData] = useState<CropSaleItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [exportLoading, setExportLoading] = useState<boolean>(false);
//   const [searchInput, setSearchInput] = useState<string>('');
  
//   // Filter states
//   const [categoryFilter, setCategoryFilter] = useState<string>('');
//   const [subCategoryFilter, setSubCategoryFilter] = useState<string>('');
//   const [gradeFilter, setGradeFilter] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('');
  
//   // Sorting states
//   const [sortField, setSortField] = useState<string>('createdAt');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
//   // Categories and SubCategories
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  
//   // Current item for details dialog
//   const [currentItem, setCurrentItem] = useState<CropSaleItem | null>(null);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItems, setTotalItems] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  
//   // Mobile view state
//   const [expandedItem, setExpandedItem] = useState<string | null>(null);

//   const API_BASE = '/api';
//   const tableRef = useRef<HTMLDivElement>(null);

//   // Fetch categories
//   const fetchCategories = useCallback(async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/category`);
//       if (response.data.success) {
//         const categoriesData = response.data.categories || [];
        
//         const uniqueCategories: Category[] = Array.from(
//           new Map(categoriesData.map((cat: Category) => [cat.categoryId, cat])).values()
//         ) as Category[];
        
//         setCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   }, [API_BASE]);

//   // Fetch subcategories
//   const fetchSubCategories = useCallback(async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/subcategory`);
//       if (response.data.success) {
//         setSubCategories(response.data.subcategories || []);
//       }
//     } catch (error) {
//       console.error('Error fetching subcategories:', error);
//     }
//   }, [API_BASE]);

//   // Filter subcategories based on selected category
//   useEffect(() => {
//     if (!categoryFilter) {
//       setFilteredSubCategories(subCategories);
//     } else {
//       const filtered = subCategories.filter(subCat => {
//         if (typeof subCat.categoryId === 'string') {
//           return subCat.categoryId === categoryFilter;
//         } else if (subCat.categoryId && typeof subCat.categoryId === 'object') {
//           const bufferArray = subCat.categoryId.buffer?.data || [];
//           const bufferString = Buffer.from(bufferArray).toString('hex');
//           const categoryHex = Buffer.from(categoryFilter, 'utf8').toString('hex');
//           return bufferString.includes(categoryHex);
//         }
//         return false;
//       });
//       setFilteredSubCategories(filtered);
//     }
//   }, [categoryFilter, subCategories]);

//   // Extract categories from sales data as fallback
//   const extractCategoriesFromData = useCallback((data: CropSaleItem[]) => {
//     if (data.length === 0) return [];
    
//     const categoryMap = new Map<string, Category>();
//     data.forEach(item => {
//       if (item.categoryName && item.categoryId) {
//         if (!categoryMap.has(item.categoryId)) {
//           categoryMap.set(item.categoryId, {
//             _id: item.categoryId,
//             categoryName: item.categoryName,
//             categoryId: item.categoryId
//           });
//         }
//       }
//     });
    
//     return Array.from(categoryMap.values());
//   }, []);

//   // Fetch sales data with server-side pagination and sorting
//   const fetchSalesData = useCallback(async () => {
//     setLoading(true);
    
//     const params = new URLSearchParams();
//     if (searchInput) params.append('search', searchInput);
//     if (categoryFilter) params.append('categoryId', categoryFilter);
//     if (subCategoryFilter) params.append('subCategoryId', subCategoryFilter);
//     if (gradeFilter) params.append('grade', gradeFilter);
//     if (statusFilter) params.append('gradeStatus', statusFilter);
//     params.append('page', currentPage.toString());
//     params.append('limit', itemsPerPage.toString());
//     params.append('sortBy', sortField);
//     params.append('order', sortOrder);

//     try {
//       const response = await axios.get<ApiResponse>(`${API_BASE}/crop-sales-report?${params.toString()}`);
      
//       if (response.data.success) {
//         const data = response.data.data || [];
//         setSalesData(data);
//         setDisplayedData(data);
//         setTotalItems(response.data.total || 0);
//         setTotalPages(response.data.totalPages || 1);
        
//         // Store current page data for allSalesData initially
//         setAllSalesData(data);
        
//         // Extract categories from data if categories API didn't load properly
//         if (categories.length === 0 && data.length > 0) {
//           const extractedCategories = extractCategoriesFromData(data);
//           if (extractedCategories.length > 0) {
//             setCategories(extractedCategories);
//           }
//         }
//       } else {
//         toast.error('Failed to fetch crop sales data');
//       }
//     } catch (error: any) {
//       console.error('Error fetching crop sales:', error);
//       if (error.response?.status === 500) {
//         toast.error('Server error. Please try again later.');
//       } else {
//         toast.error('Error fetching crop sales data');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE, searchInput, categoryFilter, subCategoryFilter, gradeFilter, statusFilter, currentPage, itemsPerPage, sortField, sortOrder, categories.length, extractCategoriesFromData]);

//   // Initial data fetch - load categories and subcategories
//   useEffect(() => {
//     fetchCategories();
//     fetchSubCategories();
//   }, [fetchCategories, fetchSubCategories]);

//   // Fetch data when filters, pagination or sorting changes
//   useEffect(() => {
//     fetchSalesData();
//   }, [currentPage, itemsPerPage, sortField, sortOrder, fetchSalesData]);

//   // Handle sort
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('desc');
//     }
//     setCurrentPage(1);
//   };

//   // Get sort icon for a field
//   const getSortIcon = (field: string) => {
//     if (sortField !== field) {
//       return <FaSort className="inline ml-1 text-gray-400" />;
//     }
//     return sortOrder === 'asc' 
//       ? <FaSortUp className="inline ml-1 text-blue-600" /> 
//       : <FaSortDown className="inline ml-1 text-blue-600" />;
//   };

//   // Handle page change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//     if (tableRef.current) {
//       tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
//     const newLimit = Number(event.target.value);
//     setItemsPerPage(newLimit);
//     setCurrentPage(1);
//   };

//   // Calculate pagination range
//   const getPaginationRange = () => {
//     const startItem = (currentPage - 1) * itemsPerPage + 1;
//     const endItem = Math.min(currentPage * itemsPerPage, totalItems);
//     return { startItem, endItem };
//   };

//   // ====================== ENHANCED EXPORT FUNCTIONALITY ======================

//   // Calculate summary statistics
//   const calculateSummaryStats = (data: CropSaleItem[]) => {
//     const stats = data.reduce((acc, item) => {
//       const totalValue = item.pricePerUnit * item.totalQty;
      
//       acc.totalProducts++;
//       acc.totalQuantity += item.totalQty;
//       acc.totalValue += totalValue;
      
//       if (item.gradeStatus === 'available') acc.availableCount++;
//       if (item.gradeStatus === 'sold') acc.soldCount++;
//       if (item.gradeStatus === 'partially_sold') acc.partiallySoldCount++;
      
//       if (item.grade.includes('A')) acc.gradeA++;
//       if (item.grade.includes('B')) acc.gradeB++;
//       if (item.grade.includes('C')) acc.gradeC++;
      
//       if (item.farmerId && !acc.farmerIds.has(item.farmerId)) {
//         acc.farmerIds.add(item.farmerId);
//       }
      
//       return acc;
//     }, {
//       totalProducts: 0,
//       totalQuantity: 0,
//       totalValue: 0,
//       availableCount: 0,
//       soldCount: 0,
//       partiallySoldCount: 0,
//       gradeA: 0,
//       gradeB: 0,
//       gradeC: 0,
//       farmerIds: new Set<string>()
//     });
    
//     return {
//       totalProducts: stats.totalProducts,
//       totalQuantity: stats.totalQuantity,
//       totalValue: stats.totalValue,
//       avgPricePerUnit: stats.totalQuantity > 0 ? Math.round(stats.totalValue / stats.totalQuantity) : 0,
//       avgQuantity: stats.totalProducts > 0 ? Math.round(stats.totalQuantity / stats.totalProducts) : 0,
//       availableCount: stats.availableCount,
//       soldCount: stats.soldCount,
//       partiallySoldCount: stats.partiallySoldCount,
//       gradeA: stats.gradeA,
//       gradeB: stats.gradeB,
//       gradeC: stats.gradeC,
//       uniqueFarmers: stats.farmerIds.size
//     };
//   };

//   // Enhanced Copy to Clipboard function with formatted table
//   const handleCopyToClipboard = async (): Promise<void> => {
//     if (!allSalesData || allSalesData.length === 0) {
//       toast.error("No crop sales data to copy");
//       return;
//     }

//     // Define headers with optimized widths
//     const headers = [
//       { name: "Product ID", width: 18 },
//       { name: "Crop", width: 22 },
//       { name: "Category", width: 16 },
//       { name: "Grade", width: 10 },
//       { name: "Qty", width: 12 },
//       { name: "Price", width: 14 },
//       { name: "Total", width: 16 },
//       { name: "Status", width: 18 },
//       { name: "Farmer", width: 20 }
//     ];
    
//     // Create header row
//     const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
//     const separator = "─".repeat(headerRow.length);
    
//     // Format currency with ₹ symbol
//     const formatCurrency = (amount: number): string => 
//       `₹${(amount || 0).toLocaleString('en-IN')}`;
    
//     // Format each crop sale row
//     const cropRows = allSalesData.map((item: CropSaleItem) => {
//       // Calculate total value
//       const totalValue = (item.pricePerUnit || 0) * (item.totalQty || 0);
      
//       // Format crop name
//       const cropName = item.cropBriefDetails || "N/A";
//       const formattedCrop = cropName.length > 20 
//         ? cropName.substring(0, 17) + "..." 
//         : cropName;
      
//       // Format grade with indicator
//       const grade = item.grade || "N/A";
//       const gradeIndicator = grade.includes("A") || grade.includes("1") ? "⭐" : 
//                             grade.includes("B") || grade.includes("2") ? "🔹" : 
//                             grade.includes("C") || grade.includes("3") ? "🔸" : "📊";
      
//       // Format status with emoji
//       const status = item.gradeStatus || "N/A";
//       const statusEmoji = status.toLowerCase().includes("available") ? "📋" : 
//                          status.toLowerCase().includes("sold") ? "✅" : 
//                          status.toLowerCase().includes("partially") ? "⏳" : "📊";
      
//       // Get farmer name
//       const farmerName = item.farmerDetails?.personalInfo?.name || "N/A";
//       const formattedFarmer = farmerName.length > 18 
//         ? farmerName.substring(0, 15) + "..." 
//         : farmerName;
      
//       // Create row values with padding
//       const rowValues = [
//         (item.productId || "N/A").padEnd(headers[0].width),
//         formattedCrop.padEnd(headers[1].width),
//         (item.categoryName || "N/A").padEnd(headers[2].width),
//         `${gradeIndicator} ${grade}`.padEnd(headers[3].width),
//         `${(item.totalQty || 0).toLocaleString('en-IN')} ${item.quantityType || ""}`.padEnd(headers[4].width),
//         formatCurrency(item.pricePerUnit || 0).padEnd(headers[5].width),
//         formatCurrency(totalValue).padEnd(headers[6].width),
//         `${statusEmoji} ${status}`.padEnd(headers[7].width),
//         formattedFarmer.padEnd(headers[8].width)
//       ];
      
//       return rowValues.join(" │ ");
//     });
    
//     // Calculate sales analytics
//     const analytics = allSalesData.reduce((acc: any, item: CropSaleItem) => {
//       const itemValue = (item.pricePerUnit || 0) * (item.totalQty || 0);
      
//       acc.totalQuantity += item.totalQty || 0;
//       acc.totalValue += itemValue;
//       acc.byStatus[item.gradeStatus] = (acc.byStatus[item.gradeStatus] || 0) + 1;
//       acc.byGrade[item.grade] = (acc.byGrade[item.grade] || 0) + 1;
//       acc.byCategory[item.categoryName] = (acc.byCategory[item.categoryName] || 0) + 1;
      
//       // Calculate farmer stats
//       if (item.farmerDetails) {
//         acc.farmerCount.add(item.farmerId);
//       }
      
//       return acc;
//     }, {
//       totalQuantity: 0,
//       totalValue: 0,
//       byStatus: {},
//       byGrade: {},
//       byCategory: {},
//       farmerCount: new Set()
//     });
    
//     const uniqueFarmers = analytics.farmerCount.size;
//     const avgValuePerSale = allSalesData.length > 0 ? Math.round(analytics.totalValue / allSalesData.length) : 0;
//     const avgQtyPerSale = allSalesData.length > 0 ? Math.round(analytics.totalQuantity / allSalesData.length) : 0;
    
//     // Build complete table with analytics
//     const tableContent = [
//       "🌾 CROP SALES REPORT",
//       "=".repeat(headerRow.length),
//       headerRow,
//       separator,
//       ...cropRows,
//       separator,
//       "",
//       "📊 SALES ANALYTICS",
//       `• Total Products: ${allSalesData.length}`,
//       `• Unique Farmers: ${uniqueFarmers}`,
//       `• Total Quantity: ${analytics.totalQuantity.toLocaleString('en-IN')}`,
//       `• Total Value: ${formatCurrency(analytics.totalValue)}`,
//       `• Avg Value/Sale: ${formatCurrency(avgValuePerSale)}`,
//       `• Avg Qty/Sale: ${avgQtyPerSale.toLocaleString('en-IN')}`,
//       "",
//       "📈 STATUS DISTRIBUTION",
//       ...Object.entries(analytics.byStatus).map(([status, count]: [string, any]) => {
//         const percentage = Math.round((count / allSalesData.length) * 100);
//         return `• ${status}: ${count} products (${percentage}%)`;
//       }),
//       "",
//       "⭐ GRADE DISTRIBUTION",
//       ...Object.entries(analytics.byGrade).map(([grade, count]: [string, any]) => {
//         const percentage = Math.round((count / allSalesData.length) * 100);
//         return `• ${grade}: ${count} products (${percentage}%)`;
//       }),
//       "",
//       "📦 CATEGORY ANALYSIS",
//       ...Object.entries(analytics.byCategory).map(([category, count]: [string, any]) => {
//         const percentage = Math.round((count / allSalesData.length) * 100);
//         return `• ${category}: ${count} products (${percentage}%)`;
//       }),
//       "",
//       "👥 FARMER INSIGHTS",
//       `• Products per Farmer: ${Math.round(allSalesData.length / Math.max(uniqueFarmers, 1))}`,
//       `• Active Farmers: ${uniqueFarmers}`,
//       "",
//       "💰 FINANCIAL OVERVIEW",
//       `• Highest Value Product: ${formatCurrency(Math.max(...allSalesData.map(i => (i.pricePerUnit || 0) * (i.totalQty || 0))))}`,
//       `• Lowest Value Product: ${formatCurrency(Math.min(...allSalesData.map(i => (i.pricePerUnit || 0) * (i.totalQty || 0))))}`,
//       `• Avg Price/Unit: ${formatCurrency(analytics.totalQuantity > 0 ? Math.round(analytics.totalValue / analytics.totalQuantity) : 0)}`,
//       "",
//       "📅 TIMELINE ANALYSIS",
//       `• Newest Product: ${allSalesData.length > 0 ? new Date(allSalesData[0].createdAt).toLocaleDateString() : 'N/A'}`,
//       `• Oldest Product: ${allSalesData.length > 0 ? new Date(allSalesData[allSalesData.length - 1].createdAt).toLocaleDateString() : 'N/A'}`,
//       `• Delivery Date Range: ${allSalesData.length > 0 ? new Date(allSalesData[0].deliveryDate).toLocaleDateString() : 'N/A'} - ${allSalesData.length > 0 ? new Date(allSalesData[allSalesData.length - 1].deliveryDate).toLocaleDateString() : 'N/A'}`,
//       "",
//       `🔍 Report Generated: ${new Date().toLocaleString()}`
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(tableContent);
//       toast.success(`📋 Copied ${allSalesData.length} crop sales with analytics!`);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   // Enhanced Excel Export with multiple sheets
//   const handleExportExcel = () => {
//     if (!allSalesData || allSalesData.length === 0) {
//       toast.error("No crop sales data to export");
//       return;
//     }

//     const wb = utils.book_new();

//     // Sheet 1: Main Data
//     const mainData = allSalesData.map((item) => {
//       const totalValue = item.pricePerUnit * item.totalQty;
//       const marketDetails = item.marketDetails;
//       const farmerName = item.farmerDetails?.personalInfo?.name || 'N/A';
//       const farmerPhone = item.farmerDetails?.personalInfo?.mobileNo || 'N/A';
//       const farmerDistrict = item.farmerDetails?.personalInfo?.district || 'N/A';
//       const traderCount = item.traderDetails?.length || 0;
//       const traderNames = item.traderDetails?.map(t => t.personalInfo?.name).filter(Boolean).join(', ') || 'N/A';
      
//       return {
//         "Product ID": item.productId,
//         "Crop Name": item.cropBriefDetails,
//         "Category": item.categoryName || "N/A",
//         "Sub Category": item.subCategoryName || "N/A",
//         "Grade": item.grade,
//         "Quantity": item.totalQty,
//         "Unit": item.quantityType || 'units',
//         "Price Per Unit": item.pricePerUnit,
//         "Total Value": totalValue,
//         "Status": formatStatus(item.gradeStatus),
//         "Farming Type": item.farmingType,
//         "Packaging": item.packagingType,
//         "Delivery Date": item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A',
//         "Delivery Time": item.deliveryTime || 'N/A',
//         "Farmer ID": item.farmerId,
//         "Farmer Name": farmerName,
//         "Farmer Phone": farmerPhone,
//         "Farmer District": farmerDistrict,
//         "Price Type": item.priceType,
//         "Created At": new Date(item.createdAt).toLocaleString(),
//         "Market ID": marketDetails?.marketId || item.nearestMarket || 'N/A',
//         "Market Name": marketDetails?.marketName || 'N/A',
//         "Market District": marketDetails?.district || 'N/A',
//         "Market State": marketDetails?.state || 'N/A',
//         "Number of Traders": traderCount,
//         "Trader Names": traderNames,
//       };
//     });

//     const wsMain = utils.json_to_sheet(mainData);
//     utils.book_append_sheet(wb, wsMain, "Crop Sales");

//     // Sheet 2: Summary Statistics
//     const summaryStats = calculateSummaryStats(allSalesData);
//     const summaryData = [
//       { "Metric": "Total Products", "Value": summaryStats.totalProducts },
//       { "Metric": "Total Quantity", "Value": summaryStats.totalQuantity },
//       { "Metric": "Total Value (₹)", "Value": summaryStats.totalValue },
//       { "Metric": "Average Price/Unit (₹)", "Value": summaryStats.avgPricePerUnit },
//       { "Metric": "Average Quantity per Product", "Value": summaryStats.avgQuantity },
//       { "Metric": "Unique Farmers", "Value": summaryStats.uniqueFarmers },
//       { "Metric": "Available Products", "Value": summaryStats.availableCount },
//       { "Metric": "Sold Products", "Value": summaryStats.soldCount },
//       { "Metric": "Partially Sold", "Value": summaryStats.partiallySoldCount },
//       { "Metric": "A Grade Products", "Value": summaryStats.gradeA },
//       { "Metric": "B Grade Products", "Value": summaryStats.gradeB },
//       { "Metric": "C Grade Products", "Value": summaryStats.gradeC },
//     ];

//     const wsSummary = utils.json_to_sheet(summaryData);
//     utils.book_append_sheet(wb, wsSummary, "Summary");

//     // Sheet 3: Farmer List
//     const farmersMap = new Map();
//     allSalesData.forEach(item => {
//       if (item.farmerDetails) {
//         const farmerId = item.farmerId;
//         if (!farmersMap.has(farmerId)) {
//           farmersMap.set(farmerId, {
//             "Farmer ID": farmerId,
//             "Name": item.farmerDetails.personalInfo.name,
//             "Phone": item.farmerDetails.personalInfo.mobileNo,
//             "District": item.farmerDetails.personalInfo.district,
//             "State": item.farmerDetails.personalInfo.state,
//             "Products Listed": 1,
//             "Total Value (₹)": (item.pricePerUnit * item.totalQty),
//           });
//         } else {
//           const farmer = farmersMap.get(farmerId);
//           farmer["Products Listed"] += 1;
//           farmer["Total Value (₹)"] += (item.pricePerUnit * item.totalQty);
//         }
//       }
//     });

//     const farmerData = Array.from(farmersMap.values());
//     if (farmerData.length > 0) {
//       const wsFarmers = utils.json_to_sheet(farmerData);
//       utils.book_append_sheet(wb, wsFarmers, "Farmers");
//     }

//     // Write file
//     writeFile(wb, `crop-sales-report-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("📊 Excel file exported with multiple sheets!");
//   };

//   // Enhanced CSV Export
//   const handleExportCSV = () => {
//     if (!allSalesData || allSalesData.length === 0) {
//       toast.error("No crop sales data to export");
//       return;
//     }

//     const headers = [
//       "Product ID", "Crop Name", "Category", "Sub Category", "Grade", 
//       "Quantity", "Unit", "Price Per Unit", "Total Value", "Status",
//       "Farming Type", "Packaging", "Delivery Date", "Delivery Time",
//       "Farmer ID", "Farmer Name", "Farmer Phone", "Farmer District",
//       "Farmer State", "Market Name", "Market District", "Market State",
//       "Traders Count", "Created Date"
//     ];
    
//     const csvContent = [
//       headers.join(","),
//       ...allSalesData.map((item) => {
//         const totalValue = item.pricePerUnit * item.totalQty;
//         const farmerName = item.farmerDetails?.personalInfo?.name || "N/A";
//         const farmerPhone = item.farmerDetails?.personalInfo?.mobileNo || "N/A";
//         const farmerDistrict = item.farmerDetails?.personalInfo?.district || "N/A";
//         const farmerState = item.farmerDetails?.personalInfo?.state || "N/A";
//         const traderCount = item.traderDetails?.length || 0;
//         const marketName = item.marketDetails?.marketName || item.nearestMarket || "N/A";
//         const marketDistrict = item.marketDetails?.district || "N/A";
//         const marketState = item.marketDetails?.state || "N/A";
        
//         return [
//           `"${item.productId}"`,
//           `"${item.cropBriefDetails}"`,
//           `"${item.categoryName || "N/A"}"`,
//           `"${item.subCategoryName || "N/A"}"`,
//           `"${item.grade}"`,
//           item.totalQty,
//           `"${item.quantityType || "units"}"`,
//           item.pricePerUnit,
//           totalValue,
//           `"${formatStatus(item.gradeStatus)}"`,
//           `"${item.farmingType}"`,
//           `"${item.packagingType}"`,
//           `"${new Date(item.deliveryDate).toLocaleDateString()}"`,
//           `"${item.deliveryTime}"`,
//           `"${item.farmerId}"`,
//           `"${farmerName}"`,
//           `"${farmerPhone}"`,
//           `"${farmerDistrict}"`,
//           `"${farmerState}"`,
//           `"${marketName}"`,
//           `"${marketDistrict}"`,
//           `"${marketState}"`,
//           traderCount,
//           `"${new Date(item.createdAt).toLocaleString()}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `crop-sales-report-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("📄 CSV file exported!");
//   };

//   // Enhanced PDF Export with statistics
//   const handleExportPDF = () => {
//     if (!allSalesData || allSalesData.length === 0) {
//       toast.error("No crop sales data to export");
//       return;
//     }

//     const doc = new jsPDF('landscape');
//     const pageWidth = doc.internal.pageSize.width;
    
//     // Title
//     doc.setFontSize(20);
//     doc.setTextColor(76, 175, 80); // Green color
//     doc.text("🌾 CROP SALES REPORT", pageWidth / 2, 15, { align: 'center' });
    
//     // Date
//     doc.setFontSize(10);
//     doc.setTextColor(128, 128, 128);
//     doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 22, { align: 'center' });
    
//     // Statistics
//     const stats = calculateSummaryStats(allSalesData);
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text("📊 Quick Statistics:", 14, 30);
    
//     doc.setFontSize(10);
//     doc.text(`• Total Products: ${stats.totalProducts}`, 20, 38);
//     doc.text(`• Total Quantity: ${stats.totalQuantity.toLocaleString()} units`, 20, 43);
//     doc.text(`• Total Value: ₹${stats.totalValue.toLocaleString('en-IN')}`, 20, 48);
//     doc.text(`• Unique Farmers: ${stats.uniqueFarmers}`, 100, 38);
//     doc.text(`• Available: ${stats.availableCount}`, 100, 43);
//     doc.text(`• Sold: ${stats.soldCount}`, 100, 48);
    
//     // Main Table
//     const tableColumn = ["Product ID", "Crop", "Grade", "Qty", "Price", "Total", "Status", "Farmer"];
//     const tableRows: any = allSalesData.map((item) => {
//       const totalValue = item.pricePerUnit * item.totalQty;
//       const farmerName = item.farmerDetails?.personalInfo?.name || 'N/A';
      
//       return [
//         item.productId,
//         item.cropBriefDetails.substring(0, 15) + (item.cropBriefDetails.length > 15 ? '...' : ''),
//         item.grade,
//         item.totalQty,
//         `₹${item.pricePerUnit}`,
//         `₹${totalValue}`,
//         formatStatus(item.gradeStatus),
//         farmerName.substring(0, 12) + (farmerName.length > 12 ? '...' : '')
//       ];
//     });
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 55,
//       styles: { 
//         fontSize: 8,
//         cellPadding: 2
//       },
//       headStyles: { 
//         fillColor: [76, 175, 80], // Green
//         textColor: [255, 255, 255],
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: {
//         fillColor: [245, 245, 245]
//       },
//       margin: { top: 55 },
//       tableWidth: 'auto'
//     });
    
//     // Add footer with page numbers
//     const pageCount = doc.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(128, 128, 128);
//       doc.text(
//         `Page ${i} of ${pageCount}`,
//         pageWidth / 2,
//         doc.internal.pageSize.height - 10,
//         { align: 'center' }
//       );
//     }
    
//     doc.save(`crop-sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("📘 PDF file exported with statistics!");
//   };

//   // Enhanced Print Functionality
//   const handlePrint = () => {
//     if (!allSalesData || allSalesData.length === 0) {
//       toast.error("No crop sales data to print");
//       return;
//     }

//     const stats = calculateSummaryStats(allSalesData);
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Crop Sales Report</title>
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//             font-family: 'Inter', sans-serif;
//           }
          
//           body {
//             margin: 20px;
//             padding: 20px;
//             background: #f8fafc;
//             color: #1f2937;
//           }
          
//           .report-header {
//             text-align: center;
//             margin-bottom: 30px;
//             padding-bottom: 20px;
//             border-bottom: 2px solid #10b981;
//           }
          
//           .report-title {
//             font-size: 28px;
//             font-weight: 700;
//             color: #065f46;
//             margin-bottom: 8px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 10px;
//           }
          
//           .report-subtitle {
//             color: #6b7280;
//             font-size: 14px;
//             margin-bottom: 10px;
//           }
          
//           .report-date {
//             color: #9ca3af;
//             font-size: 12px;
//           }
          
//           .stats-grid {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//             gap: 16px;
//             margin-bottom: 30px;
//           }
          
//           .stat-card {
//             background: white;
//             border-radius: 12px;
//             padding: 20px;
//             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//             border-left: 4px solid #10b981;
//           }
          
//           .stat-card .label {
//             font-size: 12px;
//             color: #6b7280;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             margin-bottom: 8px;
//           }
          
//           .stat-card .value {
//             font-size: 24px;
//             font-weight: 700;
//             color: #1f2937;
//           }
          
//           .table-container {
//             background: white;
//             border-radius: 12px;
//             overflow: hidden;
//             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//             margin-bottom: 30px;
//           }
          
//           table {
//             width: 100%;
//             border-collapse: collapse;
//           }
          
//           thead {
//             background: #10b981;
//             color: white;
//           }
          
//           th {
//             padding: 16px;
//             text-align: left;
//             font-weight: 600;
//             font-size: 12px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }
          
//           tbody tr {
//             border-bottom: 1px solid #e5e7eb;
//             transition: background-color 0.2s;
//           }
          
//           tbody tr:hover {
//             background-color: #f9fafb;
//           }
          
//           td {
//             padding: 14px 16px;
//             font-size: 13px;
//             color: #4b5563;
//           }
          
//           .status-available {
//             background: #d1fae5;
//             color: #065f46;
//             padding: 4px 12px;
//             border-radius: 20px;
//             font-size: 11px;
//             font-weight: 500;
//             display: inline-block;
//           }
          
//           .status-sold {
//             background: #dbeafe;
//             color: #1e40af;
//             padding: 4px 12px;
//             border-radius: 20px;
//             font-size: 11px;
//             font-weight: 500;
//             display: inline-block;
//           }
          
//           .status-partially_sold {
//             background: #fef3c7;
//             color: #92400e;
//             padding: 4px 12px;
//             border-radius: 20px;
//             font-size: 11px;
//             font-weight: 500;
//             display: inline-block;
//           }
          
//           .grade-a {
//             color: #059669;
//             font-weight: 600;
//           }
          
//           .grade-b {
//             color: #d97706;
//             font-weight: 600;
//           }
          
//           .grade-c {
//             color: #dc2626;
//             font-weight: 600;
//           }
          
//           .currency {
//             font-family: 'Courier New', monospace;
//             font-weight: 600;
//           }
          
//           .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #e5e7eb;
//             text-align: center;
//             color: #6b7280;
//             font-size: 12px;
//           }
          
//           @media print {
//             @page {
//               size: landscape;
//               margin: 0.5cm;
//             }
            
//             body {
//               margin: 0;
//               padding: 15px;
//               background: white;
//             }
            
//             .report-header {
//               margin-bottom: 20px;
//             }
            
//             .stats-grid {
//               grid-template-columns: repeat(4, 1fr);
//               gap: 12px;
//               margin-bottom: 20px;
//             }
            
//             .stat-card {
//               padding: 15px;
//             }
            
//             .table-container {
//               box-shadow: none;
//               border: 1px solid #e5e7eb;
//             }
            
//             .footer {
//               margin-top: 30px;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="report-header">
//           <div class="report-title">
//             🌾 Crop Sales Report
//           </div>
//           <div class="report-subtitle">
//             Complete sales data with farmer and trader information
//           </div>
//           <div class="report-date">
//             Generated on: ${new Date().toLocaleString()}
//           </div>
//         </div>
        
//         <div class="stats-grid">
//           <div class="stat-card">
//             <div class="label">Total Products</div>
//             <div class="value">${stats.totalProducts}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">Total Quantity</div>
//             <div class="value">${stats.totalQuantity.toLocaleString()}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">Total Value</div>
//             <div class="value currency">₹${stats.totalValue.toLocaleString('en-IN')}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">Unique Farmers</div>
//             <div class="value">${stats.uniqueFarmers}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">Available</div>
//             <div class="value">${stats.availableCount}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">Sold</div>
//             <div class="value">${stats.soldCount}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">A Grade</div>
//             <div class="value">${stats.gradeA}</div>
//           </div>
//           <div class="stat-card">
//             <div class="label">Avg Qty/Product</div>
//             <div class="value">${Math.round(stats.avgQuantity)}</div>
//           </div>
//         </div>
        
//         <div class="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Product ID</th>
//                 <th>Crop Name</th>
//                 <th>Category</th>
//                 <th>Grade</th>
//                 <th>Quantity</th>
//                 <th>Price/Unit</th>
//                 <th>Total Value</th>
//                 <th>Status</th>
//                 <th>Farmer</th>
//                 <th>Delivery Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${allSalesData.map((item) => {
//                 const totalValue = item.pricePerUnit * item.totalQty;
//                 const farmerName = item.farmerDetails?.personalInfo?.name || 'N/A';
//                 const statusClass = item.gradeStatus === 'available' ? 'status-available' : 
//                                  item.gradeStatus === 'sold' ? 'status-sold' : 
//                                  'status-partially_sold';
//                 const gradeClass = item.grade.includes('A') ? 'grade-a' : 
//                                  item.grade.includes('B') ? 'grade-b' : 'grade-c';
                
//                 return `
//                   <tr>
//                     <td>${item.productId}</td>
//                     <td>${item.cropBriefDetails}</td>
//                     <td>${item.categoryName || 'N/A'}</td>
//                     <td class="${gradeClass}">${item.grade}</td>
//                     <td>${item.totalQty} ${item.quantityType}</td>
//                     <td class="currency">₹${item.pricePerUnit.toLocaleString()}</td>
//                     <td class="currency">₹${totalValue.toLocaleString()}</td>
//                     <td><span class="${statusClass}">${formatStatus(item.gradeStatus)}</span></td>
//                     <td>${farmerName}</td>
//                     <td>${new Date(item.deliveryDate).toLocaleDateString()}</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>
//         </div>
        
//         <div class="footer">
//           <p>Crop Sales Report • Generated on ${new Date().toLocaleString()} • Total Records: ${allSalesData.length}</p>
//           <p>For more details, visit the Crop Sales Report dashboard</p>
//         </div>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank');
//     printWindow?.document.write(printContent);
//     printWindow?.document.close();
//     printWindow?.print();
//     toast.success("🖨️ Printing crop sales report...");
//   };

//   // Status badge colors
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'available':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'sold':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'partially_sold':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'reserved':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Format status text
//   const formatStatus = (status: string) => {
//     return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format date time
//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Calculate total value
//   const calculateTotalValue = (item: CropSaleItem) => {
//     return item.pricePerUnit * item.totalQty;
//   };

//   // Open details dialog
//   const openDetailsDialog = (item: CropSaleItem) => {
//     setCurrentItem(item);
//     setDetailsDialogOpen(true);
//   };

//   // Reset filters and sorting
//   const resetFilters = () => {
//     setSearchInput('');
//     setCategoryFilter('');
//     setSubCategoryFilter('');
//     setGradeFilter('');
//     setStatusFilter('');
//     setSortField('createdAt');
//     setSortOrder('desc');
//     setCurrentPage(1);
//   };

//   // Apply search and filters
//   const applyFilters = () => {
//     setCurrentPage(1);
//     fetchSalesData();
//   };

//   // Calculate stats for display
//   const calculateDisplayStats = () => {
//     const totalValue = allSalesData.reduce((sum, item) => sum + calculateTotalValue(item), 0);
//     const totalQuantity = allSalesData.reduce((sum, item) => sum + item.totalQty, 0);
//     const availableItems = allSalesData.filter(item => item.gradeStatus === 'available').length;
//     const soldItems = allSalesData.filter(item => item.gradeStatus === 'sold').length;
    
//     return { totalValue, totalQuantity, availableItems, soldItems };
//   };

//   const { totalValue, totalQuantity, availableItems, soldItems } = calculateDisplayStats();
//   const { startItem, endItem } = getPaginationRange();

//   if (loading && allSalesData.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading crop sales data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-auto bg-gray-50 p-4">
//       {/* Header */}
//       <div className="lg:mb-0 mb-3">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaLeaf className="text-green-600" />
//           Crop Sales Report
//         </h1>
//         <p className="text-gray-600 mt-2">Monitor and manage crop sales data with detailed farmer & trader information</p>
//       </div>

//       {/* Export Buttons - Desktop */}
//       <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
//         {exportLoading && (
//           <div className="flex items-center gap-2 text-gray-600">
//             <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
//             Loading data...
//           </div>
//         )}
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy to clipboard", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Export to Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "Export to CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "Export to PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print report", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             disabled={exportLoading}
//             className={`flex items-center gap-2 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//           </button>
//         ))}
//       </div>

//       {/* Export Buttons - Mobile */}
//       <div className="lg:hidden flex flex-wrap gap-2 mb-3">
//         {exportLoading && (
//           <div className="w-full text-center py-2">
//             <div className="inline-flex items-center gap-2 text-gray-600">
//               <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
//               Loading data...
//             </div>
//           </div>
//         )}
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             disabled={exportLoading}
//             className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[50px] disabled:opacity-50 disabled:cursor-not-allowed`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//           </button>
//         ))}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
//         <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Value</p>
//               <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
//             </div>
//             <FaRupeeSign className="text-green-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Quantity</p>
//               <p className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()} units</p>
//             </div>
//             <FaBoxes className="text-blue-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Available</p>
//               <p className="text-2xl font-bold text-gray-900">{availableItems}</p>
//             </div>
//             <FaCheckCircle className="text-yellow-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Sold Items</p>
//               <p className="text-2xl font-bold text-gray-900">{soldItems}</p>
//             </div>
//             <FaChartLine className="text-purple-500 text-2xl" />
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded shadow mb-6 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//           {/* Search */}
//           <div className="col-span-2 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//               placeholder="Search crop, grade, product ID..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
//             />
//           </div>

//           {/* Category Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaLeaf className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
//               value={categoryFilter}
//               onChange={(e) => {
//                 setCategoryFilter(e.target.value);
//                 setSubCategoryFilter('');
//               }}
//             >
//               <option value="">All Categories</option>
//               {categories.length > 0 ? (
//                 categories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.categoryName}
//                   </option>
//                 ))
//               ) : (
//                 allSalesData.length > 0 ? (
//                   Array.from(new Set(allSalesData.map(item => item.categoryId)))
//                     .filter(catId => catId)
//                     .map(catId => {
//                       const item = allSalesData.find(i => i.categoryId === catId);
//                       return (
//                         <option key={catId} value={catId}>
//                           {item?.categoryName || `Category ${catId}`}
//                         </option>
//                       );
//                     })
//                 ) : (
//                   <option value="" disabled>Loading categories...</option>
//                 )
//               )}
//             </select>
//           </div>

//           {/* Grade Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaTags className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
//               value={gradeFilter}
//               onChange={(e) => setGradeFilter(e.target.value)}
//             >
//               <option value="">All Grades</option>
//               <option value="A Grade">A Grade</option>
//               <option value="B Grade">B Grade</option>
//               <option value="C Grade">C Grade</option>
//               <option value="All Mixed Grades">Mixed Grades</option>
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaFilter className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="available">Available</option>
//               <option value="sold">Sold</option>
//               <option value="partially_sold">Partially Sold</option>
//               <option value="reserved">Reserved</option>
//             </select>
//           </div>

//           {/* Sorting Selector */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSort className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
//               value={sortField}
//               onChange={(e) => {
//                 setSortField(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="createdAt">Sort by Created Date</option>
//               <option value="deliveryDate">Sort by Delivery Date</option>
//               <option value="pricePerUnit">Sort by Price</option>
//               <option value="cropBriefDetails">Sort by Crop Name</option>
//               <option value="grade">Sort by Grade</option>
//             </select>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2 col-span-2 md:col-span-1">
//             <button
//               onClick={applyFilters}
//               className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
//             >
//               <FaSearch />
//               Search
//             </button>
//             <button
//               onClick={resetFilters}
//               className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//             >
//               <FaSync />
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden lg:block bg-white rounded shadow overflow-hidden" ref={tableRef}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr className="*:min-w-32">
//                 <th 
//                   className="px-3  py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                
//                 >
//                   Product ID 
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
//                 >
//                   Crop 
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                 
//                 >
//                   Category 
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
//                 >
//                   Grade 
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
//                 >
//                   Qty 
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
//                 >
//                   Price 
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
//                 >
//                   Status 
//                 </th>
//                 <th 
//                   className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
//                 >
//                   Delivery 
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Farmer Info
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Traders
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedData.map((item) => (
//                 <tr key={`${item.productId}-${item.grade}`} className="hover:bg-gray-50 transition-colors">
//                   {/* Product ID */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="text-sm font-medium text-blue-600">{item.productId}</div>
//                     <div className="text-xs text-gray-500">FID: {item.farmerId.substring(0, 8)}...</div>
//                   </td>

//                   {/* Crop Details */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaSeedling className="text-green-400 mr-2 flex-shrink-0" />
//                       <div className="truncate max-w-[150px]">
//                         <div className="text-sm font-medium text-gray-900 truncate">{item.cropBriefDetails}</div>
//                         <div className="text-xs text-gray-500 capitalize truncate">{item.farmingType}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Category */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="truncate max-w-[120px]">
//                       <div className="text-sm font-medium text-gray-900 truncate">{item.categoryName || 'N/A'}</div>
//                       <div className="text-xs text-gray-500 truncate">{item.subCategoryName || 'N/A'}</div>
//                     </div>
//                   </td>

//                   {/* Grade */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded ${
//                       item.grade.includes('A') ? 'bg-green-100 text-green-800' :
//                       item.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
//                       item.grade.includes('C') ? 'bg-red-100 text-red-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {item.grade}
//                     </span>
//                   </td>

//                   {/* Quantity */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{item.totalQty.toLocaleString()}</div>
//                     <div className="text-xs text-gray-500 capitalize truncate max-w-[80px]">{item.quantityType}</div>
//                   </td>

//                   {/* Price/Unit */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="text-sm font-bold text-green-700">
//                       <FaRupeeSign className="inline mr-1" />
//                       {item.pricePerUnit.toLocaleString()}
//                     </div>
//                     <div className="text-xs text-gray-500 capitalize truncate max-w-[80px]">{item.priceType}</div>
//                   </td>

//                   {/* Total Value */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="text-sm font-bold text-purple-700">
//                       <FaRupeeSign className="inline mr-1" />
//                       {calculateTotalValue(item).toLocaleString()}
//                     </div>
//                   </td>

//                   {/* Status */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.gradeStatus)}`}>
//                       {item.gradeStatus === 'available' && <FaCheckCircle className="mr-1" />}
//                       {item.gradeStatus === 'sold' && <FaShoppingCart className="mr-1" />}
//                       {item.gradeStatus === 'partially_sold' && <FaPercentage className="mr-1" />}
//                       {formatStatus(item.gradeStatus)}
//                     </span>
//                   </td>

//                   {/* Delivery Date */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{formatDate(item.deliveryDate)}</div>
//                         <div className="text-xs text-gray-500">{item.deliveryTime}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Farmer Information */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     {item.farmerDetails ? (
//                       <div className="max-w-[180px]">
//                         <div className="flex items-center gap-2 mb-1">
//                           <FaUser className="text-teal-500 flex-shrink-0" />
//                           <div className="truncate">
//                             <div className="text-sm font-medium text-gray-900 truncate">{item.farmerDetails.personalInfo.name}</div>
//                             <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
//                               <FaPhone className="flex-shrink-0" />
//                               {item.farmerDetails.personalInfo.mobileNo}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-xs text-gray-500 truncate flex items-center gap-1">
//                           <FaMapMarker className="flex-shrink-0" />
//                           <span className="truncate">{item.farmerDetails.personalInfo.district}, {item.farmerDetails.personalInfo.state}</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-sm text-gray-400">No farmer info</div>
//                     )}
//                   </td>

//                   {/* Traders Information */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     {item.traderDetails && item.traderDetails.length > 0 ? (
//                       <div className="max-w-[180px]">
//                         <div className="flex items-center gap-2 mb-1">
//                           <FaUserTie className="text-indigo-500 flex-shrink-0" />
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{item.traderDetails.length} trader(s)</div>
//                             <div className="text-xs text-gray-500 truncate">
//                               {item.traderDetails[0].personalInfo.name}
//                               {item.traderDetails.length > 1 && ` +${item.traderDetails.length - 1} more`}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-xs text-gray-500 truncate">
//                           {item.traderDetails[0].personalInfo.mobileNo}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-sm text-gray-400">No traders</div>
//                     )}
//                   </td>

//                   {/* Actions - View Details */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <button
//                       onClick={() => openDetailsDialog(item)}
//                       className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
//                       title="View Full Details"
//                     >
//                       <FaEye />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* No Data State */}
//         {displayedData.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
//               <FaLeaf />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No crop sales data found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-4">
//         {displayedData.map((item) => (
//           <div key={`${item.productId}-${item.grade}`} className="bg-white rounded shadow p-4">
//             <div className="flex justify-between items-start mb-3">
//               <div className="flex-1">
//                 <div className="font-bold text-blue-600 text-sm">{item.productId}</div>
//                 <div className="text-lg font-bold text-gray-800 mt-1">{item.cropBriefDetails}</div>
//                 <div className="text-sm text-gray-500 capitalize">{item.farmingType} • {item.categoryName}</div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => openDetailsDialog(item)}
//                   className="text-blue-600 p-2 bg-blue-50 rounded-full"
//                   title="View Full Details"
//                 >
//                   <FaEye />
//                 </button>
//                 <button
//                   onClick={() => setExpandedItem(
//                     expandedItem === `${item.productId}-${item.grade}` 
//                       ? null 
//                       : `${item.productId}-${item.grade}`
//                   )}
//                   className="text-gray-500 p-2 bg-gray-100 rounded-full"
//                   title={expandedItem === `${item.productId}-${item.grade}` ? "Collapse" : "Expand"}
//                 >
//                   {expandedItem === `${item.productId}-${item.grade}` ? <FaChevronUp /> : <FaChevronDown />}
//                 </button>
//               </div>
//             </div>

//             {/* Main Info Row */}
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div className="bg-gray-50 p-3 rounded">
//                 <div className="text-xs text-gray-500 mb-1">Grade</div>
//                 <span className={`px-2 py-1 text-xs font-medium rounded ${
//                   item.grade.includes('A') ? 'bg-green-100 text-green-800' :
//                   item.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
//                   item.grade.includes('C') ? 'bg-red-100 text-red-800' :
//                   'bg-blue-100 text-blue-800'
//                 }`}>
//                   {item.grade}
//                 </span>
//               </div>
//               <div className="bg-gray-50 p-3 rounded">
//                 <div className="text-xs text-gray-500 mb-1">Quantity</div>
//                 <div className="font-bold text-blue-700">{item.totalQty.toLocaleString()} {item.quantityType}</div>
//               </div>
//               <div className="bg-gray-50 p-3 rounded">
//                 <div className="text-xs text-gray-500 mb-1">Price/Unit</div>
//                 <div className="font-bold text-green-700 flex items-center">
//                   <FaRupeeSign className="mr-1" />
//                   {item.pricePerUnit.toLocaleString()}
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-3 rounded">
//                 <div className="text-xs text-gray-500 mb-1">Total Value</div>
//                 <div className="font-bold text-purple-700 flex items-center">
//                   <FaRupeeSign className="mr-1" />
//                   {calculateTotalValue(item).toLocaleString()}
//                 </div>
//               </div>
//             </div>

//             {/* Farmer and Trader Info */}
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div className="bg-blue-50 p-3 rounded border border-blue-100">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaUser className="text-teal-500" />
//                   <div className="text-xs text-gray-500">Farmer</div>
//                 </div>
//                 {item.farmerDetails ? (
//                   <>
//                     <div className="font-bold text-gray-900 text-sm truncate">{item.farmerDetails.personalInfo.name}</div>
//                     <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
//                       <FaPhone className="flex-shrink-0" />
//                       {item.farmerDetails.personalInfo.mobileNo}
//                     </div>
//                     <div className="text-xs text-gray-500 truncate mt-1">
//                       {item.farmerDetails.personalInfo.district}, {item.farmerDetails.personalInfo.state}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-sm text-gray-400">No info</div>
//                 )}
//               </div>
              
//               <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaUserTie className="text-indigo-500" />
//                   <div className="text-xs text-gray-500">Traders</div>
//                 </div>
//                 {item.traderDetails && item.traderDetails.length > 0 ? (
//                   <>
//                     <div className="font-bold text-gray-900 text-sm">
//                       {item.traderDetails.length} trader{item.traderDetails.length > 1 ? 's' : ''}
//                     </div>
//                     <div className="text-xs text-gray-600 truncate mt-1">
//                       {item.traderDetails[0].personalInfo.name}
//                     </div>
//                     <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                       <FaPhone className="flex-shrink-0" />
//                       {item.traderDetails[0].personalInfo.mobileNo}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-sm text-gray-400">No traders</div>
//                 )}
//               </div>
//             </div>

//             {/* Status and Delivery */}
//             <div className="flex justify-between items-center mb-3">
//               <div>
//                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.gradeStatus)}`}>
//                   {item.gradeStatus === 'available' && <FaCheckCircle className="mr-1" />}
//                   {item.gradeStatus === 'sold' && <FaShoppingCart className="mr-1" />}
//                   {item.gradeStatus === 'partially_sold' && <FaPercentage className="mr-1" />}
//                   {formatStatus(item.gradeStatus)}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-600 flex items-center gap-1">
//                 <FaCalendarAlt className="text-gray-400" />
//                 {formatDate(item.deliveryDate)} {item.deliveryTime}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {displayedData.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow mt-4">
//           {/* Items per page selector */}
//           <div className="flex items-center gap-3">
//             <div className="text-sm text-gray-600">
//               Showing {startItem} to {endItem} of {totalItems} records
//             </div>
//             <FormControl size="small" className="min-w-[120px]">
//               <InputLabel id="items-per-page-label">Show</InputLabel>
//               <Select
//                 labelId="items-per-page-label"
//                 value={itemsPerPage}
//                 label="Show"
//                 onChange={handleItemsPerPageChange}
//               >
//                 <MenuItem value={5}>5</MenuItem>
//                 <MenuItem value={10}>10</MenuItem>
//                 <MenuItem value={20}>20</MenuItem>
//                 <MenuItem value={50}>50</MenuItem>
//                 <MenuItem value={100}>100</MenuItem>
//               </Select>
//             </FormControl>
//           </div>

//           {/* Pagination component */}
//           <div className="flex flex-col sm:flex-row items-center gap-3">
//             <div className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </div>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               shape="rounded"
//               size="small"
//               showFirstButton
//               showLastButton
//               siblingCount={1}
//               boundaryCount={1}
//             />
//           </div>
//         </div>
//       )}

//       {/* Details Dialog - Complete with all information */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//         scroll="paper"
//       >
//         {currentItem && (
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6 pb-4 border-b">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                   <FaEye className="text-blue-600" />
//                   Crop Sale Details
//                 </h2>
//                 <p className="text-gray-600">Complete information for Product ID: {currentItem.productId}</p>
//               </div>
//               <button
//                 onClick={() => setDetailsDialogOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//                 title="Close"
//               >
//                 <FaTimes size={24} />
//               </button>
//             </div>

//             <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
//               {/* Product Overview Card */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-2">
//                       <FaBox className="text-blue-600" />
//                       {currentItem.cropBriefDetails}
//                       <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentItem.gradeStatus)}`}>
//                         {formatStatus(currentItem.gradeStatus)}
//                       </span>
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                       <div>
//                         <div className="text-xs text-gray-500">Product ID</div>
//                         <div className="font-bold text-blue-700">{currentItem.productId}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Grade</div>
//                         <span className={`px-3 py-1 text-sm font-medium rounded ${
//                           currentItem.grade.includes('A') ? 'bg-green-100 text-green-800' :
//                           currentItem.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
//                           currentItem.grade.includes('C') ? 'bg-red-100 text-red-800' :
//                           'bg-blue-100 text-blue-800'
//                         }`}>
//                           {currentItem.grade}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Total Quantity</div>
//                         <div className="font-bold text-gray-900 text-lg">{currentItem.totalQty.toLocaleString()} {currentItem.quantityType}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Total Value</div>
//                         <div className="font-bold text-green-700 text-lg flex items-center">
//                           <FaRupeeSign className="mr-1" />
//                           {calculateTotalValue(currentItem).toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="text-sm text-gray-500 mb-1">Price per Unit</div>
//                     <div className="text-2xl font-bold text-green-700 flex items-center">
//                       <FaRupeeSign className="mr-1" />
//                       {currentItem.pricePerUnit.toLocaleString()}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1 capitalize">{currentItem.priceType} Price</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Product Information Card */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaFileInvoiceDollar className="text-green-600" />
//                     Product Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Crop Name</div>
//                         <div className="font-medium">{currentItem.cropBriefDetails}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Farming Type</div>
//                         <div className="font-medium capitalize">{currentItem.farmingType}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Packaging Type</div>
//                         <div className="font-medium">{currentItem.packagingType}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Quantity Type</div>
//                         <div className="font-medium capitalize">{currentItem.quantityType}</div>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Category</div>
//                         <div className="font-medium">{currentItem.categoryName || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Sub Category</div>
//                         <div className="font-medium">{currentItem.subCategoryName || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Category ID</div>
//                         <div className="font-medium text-sm font-mono">{currentItem.categoryId}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Sub Category ID</div>
//                         <div className="font-medium text-sm font-mono">{currentItem.subCategoryId}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Information Card */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaTruck className="text-orange-600" />
//                     Delivery Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Delivery Date</div>
//                         <div className="font-medium flex items-center gap-2">
//                           <FaCalendar className="text-gray-400" />
//                           {formatDate(currentItem.deliveryDate)}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Delivery Time</div>
//                         <div className="font-medium flex items-center gap-2">
//                           <FaClock className="text-gray-400" />
//                           {currentItem.deliveryTime}
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500 mb-1">Created At</div>
//                       <div className="font-medium">{formatDateTime(currentItem.createdAt)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Farmer Details Card */}
//               {currentItem.farmerDetails && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaUser className="text-teal-600" />
//                     Farmer Details
//                   </h3>
//                   <div className="space-y-4">
//                     {/* Personal Info */}
//                     <div className="bg-teal-50 p-4 rounded-lg">
//                       <h4 className="font-medium text-teal-800 mb-3 flex items-center gap-2">
//                         <FaIdCard className="text-teal-600" />
//                         Personal Information
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Farmer ID</div>
//                           <div className="font-medium">{currentItem.farmerId}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Name</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.name}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Phone</div>
//                           <div className="font-medium flex items-center gap-2">
//                             <FaPhone className="text-gray-400" />
//                             {currentItem.farmerDetails.personalInfo.mobileNo}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Email</div>
//                           <div className="font-medium flex items-center gap-2">
//                             <FaEnvelope className="text-gray-400" />
//                             {currentItem.farmerDetails.personalInfo.email || 'N/A'}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Registration Status</div>
//                           <span className={`px-2 py-1 text-xs font-medium rounded ${
//                             currentItem.farmerDetails.registrationStatus === 'approved' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {currentItem.farmerDetails.registrationStatus}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Registered Date</div>
//                           <div className="font-medium">{formatDate(currentItem.farmerDetails.registeredAt)}</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Address Information */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
//                         <FaMapMarkerAlt className="text-gray-500" />
//                         Address Information
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Address</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.address || currentItem.farmerDetails.personalInfo.villageGramaPanchayat}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">District</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.district}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">State</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.state}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Taluk</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.taluk}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Post</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.post}</div>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Pincode</div>
//                           <div className="font-medium">{currentItem.farmerDetails.personalInfo.pincode}</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Bank Details */}
//                     {currentItem.farmerDetails.bankDetails && (
//                       <div className="bg-green-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
//                           <FaPiggyBank className="text-green-600" />
//                           Bank Details
//                         </h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <div className="text-sm text-gray-500 mb-1">Account Holder</div>
//                             <div className="font-medium">{currentItem.farmerDetails.bankDetails.accountHolderName}</div>
//                           </div>
//                           <div>
//                             <div className="text-sm text-gray-500 mb-1">Account Number</div>
//                             <div className="font-medium font-mono">{currentItem.farmerDetails.bankDetails.accountNumber}</div>
//                           </div>
//                           <div>
//                             <div className="text-sm text-gray-500 mb-1">IFSC Code</div>
//                             <div className="font-medium font-mono">{currentItem.farmerDetails.bankDetails.ifscCode}</div>
//                           </div>
//                           <div>
//                             <div className="text-sm text-gray-500 mb-1">Branch</div>
//                             <div className="font-medium">{currentItem.farmerDetails.bankDetails.branch}</div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Farm Information */}
//                     <div className="bg-blue-50 p-4 rounded-lg">
//                       <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//                         <FaSeedling className="text-blue-600" />
//                         Farm Information
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <div className="text-sm text-gray-500 mb-1">Farm Location</div>
//                           <div className="font-medium">
//                             Lat: {currentItem.farmerDetails.farmLocation.latitude}, 
//                             Long: {currentItem.farmerDetails.farmLocation.longitude}
//                           </div>
//                         </div>
//                         {currentItem.farmerDetails.farmLand && (
//                           <div className="grid grid-cols-3 gap-2">
//                             <div>
//                               <div className="text-sm text-gray-500 mb-1">Total Land</div>
//                               <div className="font-medium">{currentItem.farmerDetails.farmLand.total || 0} acres</div>
//                             </div>
//                             <div>
//                               <div className="text-sm text-gray-500 mb-1">Cultivated</div>
//                               <div className="font-medium">{currentItem.farmerDetails.farmLand.cultivated || 0} acres</div>
//                             </div>
//                             <div>
//                               <div className="text-sm text-gray-500 mb-1">Uncultivated</div>
//                               <div className="font-medium">{currentItem.farmerDetails.farmLand.uncultivated || 0} acres</div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Market Details Card */}
//               {currentItem.marketDetails && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaStore className="text-purple-600" />
//                     Market Details
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Market ID</div>
//                         <div className="font-medium">{currentItem.marketDetails.marketId}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Market Name</div>
//                         <div className="font-medium">{currentItem.marketDetails.marketName}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">District</div>
//                         <div className="font-medium">{currentItem.marketDetails.district}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">State</div>
//                         <div className="font-medium">{currentItem.marketDetails.state}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Pincode</div>
//                         <div className="font-medium">{currentItem.marketDetails.pincode}</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Post Office</div>
//                         <div className="font-medium">{currentItem.marketDetails.postOffice || 'N/A'}</div>
//                       </div>
//                     </div>
//                     {currentItem.marketDetails.exactAddress && (
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Address</div>
//                         <div className="font-medium">{currentItem.marketDetails.exactAddress}</div>
//                       </div>
//                     )}
//                     {currentItem.marketDetails.landmark && (
//                       <div>
//                         <div className="text-sm text-gray-500 mb-1">Landmark</div>
//                         <div className="font-medium">{currentItem.marketDetails.landmark}</div>
//                       </div>
//                     )}
//                     <div className="text-sm text-gray-500">
//                       Market created on: {formatDate(currentItem.marketDetails.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Traders Details Card */}
//               {currentItem.traderDetails && currentItem.traderDetails.length > 0 && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaUserTie className="text-indigo-600" />
//                     Trader Details ({currentItem.traderDetails.length} {currentItem.traderDetails.length === 1 ? 'Trader' : 'Traders'})
//                   </h3>
//                   <div className="space-y-4">
//                     {currentItem.traderDetails.map((trader, index) => (
//                       <div key={trader.traderId} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h4 className="font-bold text-gray-900 flex items-center gap-2">
//                               <FaUserTie className="text-indigo-500" />
//                               {trader.personalInfo.name}
//                               <span className="text-sm font-normal text-gray-500 ml-2">(Trader {index + 1})</span>
//                             </h4>
//                             <div className="text-sm text-gray-600 mt-1">Trader ID: {trader.traderId}</div>
//                           </div>
//                           <span className={`px-3 py-1 text-sm font-medium rounded-full ${
//                             trader.registrationStatus === 'approved' 
//                               ? 'bg-green-100 text-green-800 border border-green-200' 
//                               : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
//                           }`}>
//                             {trader.registrationStatus}
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {/* Personal Info */}
//                           <div className="bg-indigo-50 p-3 rounded-lg">
//                             <h5 className="font-medium text-indigo-700 mb-2 flex items-center gap-2">
//                               <FaIdBadge className="text-indigo-500" />
//                               Personal Information
//                             </h5>
//                             <div className="space-y-2">
//                               <div>
//                                 <div className="text-xs text-gray-500">Phone</div>
//                                 <div className="font-medium flex items-center gap-2">
//                                   <FaPhone className="text-gray-400" />
//                                   {trader.personalInfo.mobileNo}
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="text-xs text-gray-500">Email</div>
//                                 <div className="font-medium flex items-center gap-2">
//                                   <FaEnvelope className="text-gray-400" />
//                                   {trader.personalInfo.email || 'N/A'}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Address Info */}
//                           <div className="bg-gray-50 p-3 rounded-lg">
//                             <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
//                               <FaMapMarker className="text-gray-500" />
//                               Address Information
//                             </h5>
//                             <div className="space-y-2">
//                               <div>
//                                 <div className="text-xs text-gray-500">District</div>
//                                 <div className="font-medium">{trader.personalInfo.district}</div>
//                               </div>
//                               <div>
//                                 <div className="text-xs text-gray-500">State</div>
//                                 <div className="font-medium">{trader.personalInfo.state}</div>
//                               </div>
//                               <div>
//                                 <div className="text-xs text-gray-500">Pincode</div>
//                                 <div className="font-medium">{trader.personalInfo.pincode}</div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Additional Information */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//                           <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
//                             <div className="text-xs text-gray-500">Commodities</div>
//                             <div className="font-medium text-sm mt-1">{trader.commodities?.length || 0}</div>
//                           </div>
//                           <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
//                             <div className="text-xs text-gray-500">Markets</div>
//                             <div className="font-medium text-sm mt-1">{trader.nearestMarkets?.length || 0}</div>
//                           </div>
//                           <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
//                             <div className="text-xs text-gray-500">Registered</div>
//                             <div className="font-medium text-sm mt-1">{formatDate(trader.registeredAt)}</div>
//                           </div>
//                         </div>

//                         {/* Bank Details if available */}
//                         {trader.bankDetails && (
//                           <div className="mt-4 pt-4 border-t border-gray-200">
//                             <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
//                               <FaPiggyBank className="text-green-500" />
//                               Bank Details
//                             </h5>
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <div className="text-xs text-gray-500">Account Holder</div>
//                                 <div className="font-medium text-sm">{trader.bankDetails.accountHolderName}</div>
//                               </div>
//                               <div>
//                                 <div className="text-xs text-gray-500">Account Number</div>
//                                 <div className="font-medium text-sm font-mono">{trader.bankDetails.accountNumber}</div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Additional Information Card */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <FaInfoCircle className="text-gray-600" />
//                   Additional Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <div className="text-sm text-gray-500 mb-1">Nearest Market ID</div>
//                     <div className="font-medium">{currentItem.nearestMarket}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500 mb-1">Status</div>
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentItem.gradeStatus)}`}>
//                       {currentItem.gradeStatus === 'available' && <FaCheckCircle className="mr-1" />}
//                       {currentItem.gradeStatus === 'sold' && <FaShoppingCart className="mr-1" />}
//                       {currentItem.gradeStatus === 'partially_sold' && <FaPercentage className="mr-1" />}
//                       {formatStatus(currentItem.gradeStatus)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Dialog Footer */}
//             <div className="mt-6 pt-6 border-t flex justify-between items-center">
//               <div className="text-sm text-gray-500">
//                 Last updated: {formatDateTime(currentItem.createdAt)}
//               </div>
//               <div className="flex gap-3">
//                 {/* <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(JSON.stringify(currentItem, null, 2));
//                     toast.success('Details copied to clipboard!');
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
//                 >
//                   <FaCopy />
//                   Copy Details
//                 </button> */}
//                 <button
//                   onClick={() => setDetailsDialogOpen(false)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Dialog>
//     </div>
//   );
// };

// export default CropSalesReport;










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
  FaSortDown,
  FaMapMarkerAlt,
  FaIdCard,
  FaInfoCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarker,
  FaBuilding,
  FaWarehouse,
  FaShoppingCart,
  FaUsers,
  FaUserTie,
  FaHome,
  FaLocationArrow,
  FaCity,
  FaGlobeAsia,
  FaAddressCard,
  FaCertificate,
  FaMoneyBillWave,
  FaWeightHanging,
  FaTruck,
  FaClock,
  FaCalendar,
  FaGlobe,
  FaIdBadge,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCog,
  FaDatabase,
  FaCreditCard,
  FaUniversity,
  FaPiggyBank,
  FaRupeeSign as RupeeIcon,
  FaDollarSign,
  FaChartPie,
  FaWarehouse as WarehouseIcon,
  FaClipboardList
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAdminSessionAction } from '@/app/actions/auth-actions';
import { AiOutlineClose } from 'react-icons/ai';

// Interfaces based on your API response
interface MarketDetails {
  _id: string;
  marketId: string;
  marketName: string;
  pincode: string;
  postOffice?: string;
  district: string;
  state: string;
  exactAddress?: string;
  landmark?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PersonalInfo {
  name: string;
  mobileNo: string;
  email: string;
  address: string;
  villageGramaPanchayat: string;
  pincode: string;
  state: string;
  district: string;
  taluk: string;
  post: string;
}

interface FarmerDetails {
  farmerId: string;
  personalInfo: PersonalInfo;
  role: string;
  farmLocation: {
    latitude: string;
    longitude: string;
  };
  farmLand: {
    total: number | null;
    cultivated: number | null;
    uncultivated: number | null;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  registrationStatus: string;
  isActive: boolean;
  commodities: string[];
  nearestMarkets: string[];
  subcategories: string[];
  registeredAt: string;
  updatedAt?: string;
}

interface TraderDetails {
  traderId: string;
  personalInfo: PersonalInfo;
  role: string;
  farmLocation: {
    latitude: string;
    longitude: string;
  };
  farmLand: {
    total: number | null;
    cultivated: number | null;
    uncultivated: number | null;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  registrationStatus: string;
  isActive: boolean;
  commodities: string[];
  nearestMarkets: string[];
  subcategories: string[];
  registeredAt: string;
  updatedAt?: string;
}

interface CropSaleItem {
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
  productId: string;
  categoryName: string;
  subCategoryName: string;
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  quantityType: string;
  priceType: string;
  gradeStatus: string;
  
  // Detailed information from API
  marketDetails?: MarketDetails;
  farmerDetails?: FarmerDetails;
  traderDetails?: TraderDetails[];
  purchaseHistory?: any[];
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

interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: CropSaleItem[];
}

const CropSalesReport: React.FC = () => {
  const [salesData, setSalesData] = useState<CropSaleItem[]>([]);
  const [allSalesData, setAllSalesData] = useState<CropSaleItem[]>([]);
  const [displayedData, setDisplayedData] = useState<CropSaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
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

   const[user,setUser]=useState<{
      taluka:string,
      role:string
    }>()
  
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
        const categoriesData = response.data.categories || [];
        
        const uniqueCategories: Category[] = Array.from(
          new Map(categoriesData.map((cat: Category) => [cat.categoryId, cat])).values()
        ) as Category[];
         
        console.log(categoriesData)
        setCategories(uniqueCategories);
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
        if (typeof subCat.categoryId === 'string') {
          return subCat.categoryId === categoryFilter;
        } else if (subCat.categoryId && typeof subCat.categoryId === 'object') {
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

  // Extract categories from sales data as fallback
  const extractCategoriesFromData = useCallback((data: CropSaleItem[]) => {
    if (data.length === 0) return [];
    
    const categoryMap = new Map<string, Category>();
    data.forEach(item => {
      if (item.categoryName && item.categoryId) {
        if (!categoryMap.has(item.categoryId)) {
          categoryMap.set(item.categoryId, {
            _id: item.categoryId,
            categoryName: item.categoryName,
            categoryId: item.categoryId
          });
        }
      }
    });
    
    return Array.from(categoryMap.values());
  }, []);

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

      const session = await getAdminSessionAction();
                            setUser(session?.admin)
                            if(session?.admin?.role == "subadmin"){
                             params.append('taluk',session?.admin?.taluka)
                           }
    

    try {
      const response = await axios.get<ApiResponse>(`${API_BASE}/crop-sales-report?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setSalesData(data);
        setDisplayedData(data);
        setTotalItems(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
        
        // Store current page data for allSalesData initially
        setAllSalesData(data);
        
        // Extract categories from data if categories API didn't load properly
        if (categories.length === 0 && data.length > 0) {
          const extractedCategories = extractCategoriesFromData(data);
          if (extractedCategories.length > 0) {
            setCategories(extractedCategories);
          }
        }
      } else {
        toast.error('Failed to fetch crop sales data');
      }
    } catch (error: any) {
      console.error('Error fetching crop sales:', error);
      if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Error fetching crop sales data');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE, searchInput, categoryFilter, subCategoryFilter, gradeFilter, statusFilter, currentPage, itemsPerPage, sortField, sortOrder, categories.length, extractCategoriesFromData]);

  // Initial data fetch - load categories and subcategories
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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
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

  // ====================== ENHANCED EXPORT FUNCTIONALITY ======================

  // Calculate summary statistics
  const calculateSummaryStats = (data: CropSaleItem[]) => {
    const stats = data.reduce((acc, item) => {
      const totalValue = item.pricePerUnit * item.totalQty;
      
      acc.totalProducts++;
      acc.totalQuantity += item.totalQty;
      acc.totalValue += totalValue;
      
      if (item.gradeStatus === 'available') acc.availableCount++;
      if (item.gradeStatus === 'sold') acc.soldCount++;
      if (item.gradeStatus === 'partially_sold') acc.partiallySoldCount++;
      
      if (item.grade.includes('A')) acc.gradeA++;
      if (item.grade.includes('B')) acc.gradeB++;
      if (item.grade.includes('C')) acc.gradeC++;
      
      if (item.farmerId && !acc.farmerIds.has(item.farmerId)) {
        acc.farmerIds.add(item.farmerId);
      }
      
      return acc;
    }, {
      totalProducts: 0,
      totalQuantity: 0,
      totalValue: 0,
      availableCount: 0,
      soldCount: 0,
      partiallySoldCount: 0,
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      farmerIds: new Set<string>()
    });
    
    return {
      totalProducts: stats.totalProducts,
      totalQuantity: stats.totalQuantity,
      totalValue: stats.totalValue,
      avgPricePerUnit: stats.totalQuantity > 0 ? Math.round(stats.totalValue / stats.totalQuantity) : 0,
      avgQuantity: stats.totalProducts > 0 ? Math.round(stats.totalQuantity / stats.totalProducts) : 0,
      availableCount: stats.availableCount,
      soldCount: stats.soldCount,
      partiallySoldCount: stats.partiallySoldCount,
      gradeA: stats.gradeA,
      gradeB: stats.gradeB,
      gradeC: stats.gradeC,
      uniqueFarmers: stats.farmerIds.size
    };
  };

  // Enhanced Copy to Clipboard function with formatted table
  const handleCopyToClipboard = async (): Promise<void> => {
    if (!allSalesData || allSalesData.length === 0) {
      toast.error("No crop sales data to copy");
      return;
    }

    // Define headers with optimized widths
    const headers = [
      { name: "Product ID", width: 18 },
      { name: "Crop", width: 22 },
      { name: "Category", width: 16 },
      { name: "Grade", width: 10 },
      { name: "Qty", width: 12 },
      { name: "Price", width: 14 },
      { name: "Total", width: 16 },
      { name: "Status", width: 18 },
      { name: "Farmer", width: 20 }
    ];
    
    // Create header row
    const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
    const separator = "─".repeat(headerRow.length);
    
    // Format currency with ₹ symbol
    const formatCurrency = (amount: number): string => 
      `₹${(amount || 0).toLocaleString('en-IN')}`;
    
    // Format each crop sale row
    const cropRows = allSalesData.map((item: CropSaleItem) => {
      // Calculate total value
      const totalValue = (item.pricePerUnit || 0) * (item.totalQty || 0);
      
      // Format crop name
      const cropName = item.cropBriefDetails || "N/A";
      const formattedCrop = cropName.length > 20 
        ? cropName.substring(0, 17) + "..." 
        : cropName;
      
      // Format grade with indicator
      const grade = item.grade || "N/A";
      const gradeIndicator = grade.includes("A") || grade.includes("1") ? "⭐" : 
                            grade.includes("B") || grade.includes("2") ? "🔹" : 
                            grade.includes("C") || grade.includes("3") ? "🔸" : "📊";
      
      // Format status with emoji
      const status = item.gradeStatus || "N/A";
      const statusEmoji = status.toLowerCase().includes("available") ? "📋" : 
                         status.toLowerCase().includes("sold") ? "✅" : 
                         status.toLowerCase().includes("partially") ? "⏳" : "📊";
      
      // Get farmer name
      const farmerName = item.farmerDetails?.personalInfo?.name || "N/A";
      const formattedFarmer = farmerName.length > 18 
        ? farmerName.substring(0, 15) + "..." 
        : farmerName;
      
      // Create row values with padding
      const rowValues = [
        (item.productId || "N/A").padEnd(headers[0].width),
        formattedCrop.padEnd(headers[1].width),
        (item.categoryName || "N/A").padEnd(headers[2].width),
        `${gradeIndicator} ${grade}`.padEnd(headers[3].width),
        `${(item.totalQty || 0).toLocaleString('en-IN')} ${item.quantityType || ""}`.padEnd(headers[4].width),
        formatCurrency(item.pricePerUnit || 0).padEnd(headers[5].width),
        formatCurrency(totalValue).padEnd(headers[6].width),
        `${statusEmoji} ${status}`.padEnd(headers[7].width),
        formattedFarmer.padEnd(headers[8].width)
      ];
      
      return rowValues.join(" │ ");
    });
    
    // Calculate sales analytics
    const analytics = allSalesData.reduce((acc: any, item: CropSaleItem) => {
      const itemValue = (item.pricePerUnit || 0) * (item.totalQty || 0);
      
      acc.totalQuantity += item.totalQty || 0;
      acc.totalValue += itemValue;
      acc.byStatus[item.gradeStatus] = (acc.byStatus[item.gradeStatus] || 0) + 1;
      acc.byGrade[item.grade] = (acc.byGrade[item.grade] || 0) + 1;
      acc.byCategory[item.categoryName] = (acc.byCategory[item.categoryName] || 0) + 1;
      
      // Calculate farmer stats
      if (item.farmerDetails) {
        acc.farmerCount.add(item.farmerId);
      }
      
      return acc;
    }, {
      totalQuantity: 0,
      totalValue: 0,
      byStatus: {},
      byGrade: {},
      byCategory: {},
      farmerCount: new Set()
    });
    
    const uniqueFarmers = analytics.farmerCount.size;
    const avgValuePerSale = allSalesData.length > 0 ? Math.round(analytics.totalValue / allSalesData.length) : 0;
    const avgQtyPerSale = allSalesData.length > 0 ? Math.round(analytics.totalQuantity / allSalesData.length) : 0;
    
    // Build complete table with analytics
    const tableContent = [
      "🌾 CROP SALES REPORT",
      "=".repeat(headerRow.length),
      headerRow,
      separator,
      ...cropRows,
      separator,
      "",
      "📊 SALES ANALYTICS",
      `• Total Products: ${allSalesData.length}`,
      `• Unique Farmers: ${uniqueFarmers}`,
      `• Total Quantity: ${analytics.totalQuantity.toLocaleString('en-IN')}`,
      `• Total Value: ${formatCurrency(analytics.totalValue)}`,
      `• Avg Value/Sale: ${formatCurrency(avgValuePerSale)}`,
      `• Avg Qty/Sale: ${avgQtyPerSale.toLocaleString('en-IN')}`,
      "",
      "📈 STATUS DISTRIBUTION",
      ...Object.entries(analytics.byStatus).map(([status, count]: [string, any]) => {
        const percentage = Math.round((count / allSalesData.length) * 100);
        return `• ${status}: ${count} products (${percentage}%)`;
      }),
      "",
      "⭐ GRADE DISTRIBUTION",
      ...Object.entries(analytics.byGrade).map(([grade, count]: [string, any]) => {
        const percentage = Math.round((count / allSalesData.length) * 100);
        return `• ${grade}: ${count} products (${percentage}%)`;
      }),
      "",
      "📦 CATEGORY ANALYSIS",
      ...Object.entries(analytics.byCategory).map(([category, count]: [string, any]) => {
        const percentage = Math.round((count / allSalesData.length) * 100);
        return `• ${category}: ${count} products (${percentage}%)`;
      }),
      "",
      "👥 FARMER INSIGHTS",
      `• Products per Farmer: ${Math.round(allSalesData.length / Math.max(uniqueFarmers, 1))}`,
      `• Active Farmers: ${uniqueFarmers}`,
      "",
      "💰 FINANCIAL OVERVIEW",
      `• Highest Value Product: ${formatCurrency(Math.max(...allSalesData.map(i => (i.pricePerUnit || 0) * (i.totalQty || 0))))}`,
      `• Lowest Value Product: ${formatCurrency(Math.min(...allSalesData.map(i => (i.pricePerUnit || 0) * (i.totalQty || 0))))}`,
      `• Avg Price/Unit: ${formatCurrency(analytics.totalQuantity > 0 ? Math.round(analytics.totalValue / analytics.totalQuantity) : 0)}`,
      "",
      "📅 TIMELINE ANALYSIS",
      `• Newest Product: ${allSalesData.length > 0 ? new Date(allSalesData[0].createdAt).toLocaleDateString() : 'N/A'}`,
      `• Oldest Product: ${allSalesData.length > 0 ? new Date(allSalesData[allSalesData.length - 1].createdAt).toLocaleDateString() : 'N/A'}`,
      `• Delivery Date Range: ${allSalesData.length > 0 ? new Date(allSalesData[0].deliveryDate).toLocaleDateString() : 'N/A'} - ${allSalesData.length > 0 ? new Date(allSalesData[allSalesData.length - 1].deliveryDate).toLocaleDateString() : 'N/A'}`,
      "",
      `🔍 Report Generated: ${new Date().toLocaleString()}`
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success(`📋 Copied ${allSalesData.length} crop sales with analytics!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  // Enhanced Excel Export with multiple sheets
  const handleExportExcel = () => {
    if (!allSalesData || allSalesData.length === 0) {
      toast.error("No crop sales data to export");
      return;
    }

    const wb = utils.book_new();

    // Sheet 1: Main Data
    const mainData = allSalesData.map((item) => {
      const totalValue = item.pricePerUnit * item.totalQty;
      const marketDetails = item.marketDetails;
      const farmerName = item.farmerDetails?.personalInfo?.name || 'N/A';
      const farmerPhone = item.farmerDetails?.personalInfo?.mobileNo || 'N/A';
      const farmerDistrict = item.farmerDetails?.personalInfo?.district || 'N/A';
      const traderCount = item.traderDetails?.length || 0;
      const traderNames = item.traderDetails?.map(t => t.personalInfo?.name).filter(Boolean).join(', ') || 'N/A';
      
      return {
        "Product ID": item.productId,
        "Crop Name": item.cropBriefDetails,
        "Category": item.categoryName || "N/A",
        "Sub Category": item.subCategoryName || "N/A",
        "Grade": item.grade,
        "Quantity": item.totalQty,
        "Unit": item.quantityType || 'units',
        "Price Per Unit": item.pricePerUnit,
        "Total Value": totalValue,
        "Status": formatStatus(item.gradeStatus),
        "Farming Type": item.farmingType,
        "Packaging": item.packagingType,
        "Delivery Date": item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A',
        "Delivery Time": item.deliveryTime || 'N/A',
        "Farmer ID": item.farmerId,
        "Farmer Name": farmerName,
        "Farmer Phone": farmerPhone,
        "Farmer District": farmerDistrict,
        "Price Type": item.priceType,
        "Created At": new Date(item.createdAt).toLocaleString(),
        "Market ID": marketDetails?.marketId || item.nearestMarket || 'N/A',
        "Market Name": marketDetails?.marketName || 'N/A',
        "Market District": marketDetails?.district || 'N/A',
        "Market State": marketDetails?.state || 'N/A',
        "Number of Traders": traderCount,
        "Trader Names": traderNames,
      };
    });

    const wsMain = utils.json_to_sheet(mainData);
    utils.book_append_sheet(wb, wsMain, "Crop Sales");

    // Sheet 2: Summary Statistics
    const summaryStats = calculateSummaryStats(allSalesData);
    const summaryData = [
      { "Metric": "Total Products", "Value": summaryStats.totalProducts },
      { "Metric": "Total Quantity", "Value": summaryStats.totalQuantity },
      { "Metric": "Total Value (₹)", "Value": summaryStats.totalValue },
      { "Metric": "Average Price/Unit (₹)", "Value": summaryStats.avgPricePerUnit },
      { "Metric": "Average Quantity per Product", "Value": summaryStats.avgQuantity },
      { "Metric": "Unique Farmers", "Value": summaryStats.uniqueFarmers },
      { "Metric": "Available Products", "Value": summaryStats.availableCount },
      { "Metric": "Sold Products", "Value": summaryStats.soldCount },
      { "Metric": "Partially Sold", "Value": summaryStats.partiallySoldCount },
      { "Metric": "A Grade Products", "Value": summaryStats.gradeA },
      { "Metric": "B Grade Products", "Value": summaryStats.gradeB },
      { "Metric": "C Grade Products", "Value": summaryStats.gradeC },
    ];

    const wsSummary = utils.json_to_sheet(summaryData);
    utils.book_append_sheet(wb, wsSummary, "Summary");

    // Sheet 3: Farmer List
    const farmersMap = new Map();
    allSalesData.forEach(item => {
      if (item.farmerDetails) {
        const farmerId = item.farmerId;
        if (!farmersMap.has(farmerId)) {
          farmersMap.set(farmerId, {
            "Farmer ID": farmerId,
            "Name": item.farmerDetails.personalInfo.name,
            "Phone": item.farmerDetails.personalInfo.mobileNo,
            "District": item.farmerDetails.personalInfo.district,
            "State": item.farmerDetails.personalInfo.state,
            "Products Listed": 1,
            "Total Value (₹)": (item.pricePerUnit * item.totalQty),
          });
        } else {
          const farmer = farmersMap.get(farmerId);
          farmer["Products Listed"] += 1;
          farmer["Total Value (₹)"] += (item.pricePerUnit * item.totalQty);
        }
      }
    });

    const farmerData = Array.from(farmersMap.values());
    if (farmerData.length > 0) {
      const wsFarmers = utils.json_to_sheet(farmerData);
      utils.book_append_sheet(wb, wsFarmers, "Farmers");
    }

    // Write file
    writeFile(wb, `crop-sales-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("📊 Excel file exported with multiple sheets!");
  };

  // Enhanced CSV Export
  const handleExportCSV = () => {
    if (!allSalesData || allSalesData.length === 0) {
      toast.error("No crop sales data to export");
      return;
    }

    const headers = [
      "Product ID", "Crop Name", "Category", "Sub Category", "Grade", 
      "Quantity", "Unit", "Price Per Unit", "Total Value", "Status",
      "Farming Type", "Packaging", "Delivery Date", "Delivery Time",
      "Farmer ID", "Farmer Name", "Farmer Phone", "Farmer District",
      "Farmer State", "Market Name", "Market District", "Market State",
      "Traders Count", "Created Date"
    ];
    
    const csvContent = [
      headers.join(","),
      ...allSalesData.map((item) => {
        const totalValue = item.pricePerUnit * item.totalQty;
        const farmerName = item.farmerDetails?.personalInfo?.name || "N/A";
        const farmerPhone = item.farmerDetails?.personalInfo?.mobileNo || "N/A";
        const farmerDistrict = item.farmerDetails?.personalInfo?.district || "N/A";
        const farmerState = item.farmerDetails?.personalInfo?.state || "N/A";
        const traderCount = item.traderDetails?.length || 0;
        const marketName = item.marketDetails?.marketName || item.nearestMarket || "N/A";
        const marketDistrict = item.marketDetails?.district || "N/A";
        const marketState = item.marketDetails?.state || "N/A";
        
        return [
          `"${item.productId}"`,
          `"${item.cropBriefDetails}"`,
          `"${item.categoryName || "N/A"}"`,
          `"${item.subCategoryName || "N/A"}"`,
          `"${item.grade}"`,
          item.totalQty,
          `"${item.quantityType || "units"}"`,
          item.pricePerUnit,
          totalValue,
          `"${formatStatus(item.gradeStatus)}"`,
          `"${item.farmingType}"`,
          `"${item.packagingType}"`,
          `"${new Date(item.deliveryDate).toLocaleDateString()}"`,
          `"${item.deliveryTime}"`,
          `"${item.farmerId}"`,
          `"${farmerName}"`,
          `"${farmerPhone}"`,
          `"${farmerDistrict}"`,
          `"${farmerState}"`,
          `"${marketName}"`,
          `"${marketDistrict}"`,
          `"${marketState}"`,
          traderCount,
          `"${new Date(item.createdAt).toLocaleString()}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `crop-sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("📄 CSV file exported!");
  };

  // Enhanced PDF Export with statistics
  const handleExportPDF = () => {
    if (!allSalesData || allSalesData.length === 0) {
      toast.error("No crop sales data to export");
      return;
    }

    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(76, 175, 80); // Green color
    doc.text("🌾 CROP SALES REPORT", pageWidth / 2, 15, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 22, { align: 'center' });
    
    // Statistics
    const stats = calculateSummaryStats(allSalesData);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("📊 Quick Statistics:", 14, 30);
    
    doc.setFontSize(10);
    doc.text(`• Total Products: ${stats.totalProducts}`, 20, 38);
    doc.text(`• Total Quantity: ${stats.totalQuantity.toLocaleString()} units`, 20, 43);
    doc.text(`• Total Value: ₹${stats.totalValue.toLocaleString('en-IN')}`, 20, 48);
    doc.text(`• Unique Farmers: ${stats.uniqueFarmers}`, 100, 38);
    doc.text(`• Available: ${stats.availableCount}`, 100, 43);
    doc.text(`• Sold: ${stats.soldCount}`, 100, 48);
    
    // Main Table
    const tableColumn = ["Product ID", "Crop", "Grade", "Qty", "Price", "Total", "Status", "Farmer"];
    const tableRows: any = allSalesData.map((item) => {
      const totalValue = item.pricePerUnit * item.totalQty;
      const farmerName = item.farmerDetails?.personalInfo?.name || 'N/A';
      
      return [
        item.productId,
        item.cropBriefDetails.substring(0, 15) + (item.cropBriefDetails.length > 15 ? '...' : ''),
        item.grade,
        item.totalQty,
        `₹${item.pricePerUnit}`,
        `₹${totalValue}`,
        formatStatus(item.gradeStatus),
        farmerName.substring(0, 12) + (farmerName.length > 12 ? '...' : '')
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: { 
        fillColor: [76, 175, 80], // Green
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 55 },
      tableWidth: 'auto'
    });
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    doc.save(`crop-sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("📘 PDF file exported with statistics!");
  };

  // Enhanced Print Functionality
  const handlePrint = () => {
    if (!allSalesData || allSalesData.length === 0) {
      toast.error("No crop sales data to print");
      return;
    }

    const stats = calculateSummaryStats(allSalesData);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Crop Sales Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
          }
          
          body {
            margin: 20px;
            padding: 20px;
            background: #f8fafc;
            color: #1f2937;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #10b981;
          }
          
          .report-title {
            font-size: 28px;
            font-weight: 700;
            color: #065f46;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .report-subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          .report-date {
            color: #9ca3af;
            font-size: 12px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 30px;
          }
          
          .stat-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #10b981;
          }
          
          .stat-card .label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          
          .stat-card .value {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
          }
          
          .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead {
            background: #10b981;
            color: white;
          }
          
          th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          tbody tr {
            border-bottom: 1px solid #e5e7eb;
            transition: background-color 0.2s;
          }
          
          tbody tr:hover {
            background-color: #f9fafb;
          }
          
          td {
            padding: 14px 16px;
            font-size: 13px;
            color: #4b5563;
          }
          
          .status-available {
            background: #d1fae5;
            color: #065f46;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            display: inline-block;
          }
          
          .status-sold {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            display: inline-block;
          }
          
          .status-partially_sold {
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            display: inline-block;
          }
          
          .grade-a {
            color: #059669;
            font-weight: 600;
          }
          
          .grade-b {
            color: #d97706;
            font-weight: 600;
          }
          
          .grade-c {
            color: #dc2626;
            font-weight: 600;
          }
          
          .currency {
            font-family: 'Courier New', monospace;
            font-weight: 600;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          
          @media print {
            @page {
              size: landscape;
              margin: 0.5cm;
            }
            
            body {
              margin: 0;
              padding: 15px;
              background: white;
            }
            
            .report-header {
              margin-bottom: 20px;
            }
            
            .stats-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin-bottom: 20px;
            }
            
            .stat-card {
              padding: 15px;
            }
            
            .table-container {
              box-shadow: none;
              border: 1px solid #e5e7eb;
            }
            
            .footer {
              margin-top: 30px;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="report-title">
            🌾 Crop Sales Report
          </div>
          <div class="report-subtitle">
            Complete sales data with farmer and trader information
          </div>
          <div class="report-date">
            Generated on: ${new Date().toLocaleString()}
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Total Products</div>
            <div class="value">${stats.totalProducts}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Quantity</div>
            <div class="value">${stats.totalQuantity.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Value</div>
            <div class="value currency">₹${stats.totalValue.toLocaleString('en-IN')}</div>
          </div>
          <div class="stat-card">
            <div class="label">Unique Farmers</div>
            <div class="value">${stats.uniqueFarmers}</div>
          </div>
          <div class="stat-card">
            <div class="label">Available</div>
            <div class="value">${stats.availableCount}</div>
          </div>
          <div class="stat-card">
            <div class="label">Sold</div>
            <div class="value">${stats.soldCount}</div>
          </div>
          <div class="stat-card">
            <div class="label">A Grade</div>
            <div class="value">${stats.gradeA}</div>
          </div>
          <div class="stat-card">
            <div class="label">Avg Qty/Product</div>
            <div class="value">${Math.round(stats.avgQuantity)}</div>
          </div>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Crop Name</th>
                <th>Category</th>
                <th>Grade</th>
                <th>Quantity</th>
                <th>Price/Unit</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Farmer</th>
                <th>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              ${allSalesData.map((item) => {
                const totalValue = item.pricePerUnit * item.totalQty;
                const farmerName = item.farmerDetails?.personalInfo?.name || 'N/A';
                const statusClass = item.gradeStatus === 'available' ? 'status-available' : 
                                 item.gradeStatus === 'sold' ? 'status-sold' : 
                                 'status-partially_sold';
                const gradeClass = item.grade.includes('A') ? 'grade-a' : 
                                 item.grade.includes('B') ? 'grade-b' : 'grade-c';
                
                return `
                  <tr>
                    <td>${item.productId}</td>
                    <td>${item.cropBriefDetails}</td>
                    <td>${item.categoryName || 'N/A'}</td>
                    <td class="${gradeClass}">${item.grade}</td>
                    <td>${item.totalQty} ${item.quantityType}</td>
                    <td class="currency">₹${item.pricePerUnit.toLocaleString()}</td>
                    <td class="currency">₹${totalValue.toLocaleString()}</td>
                    <td><span class="${statusClass}">${formatStatus(item.gradeStatus)}</span></td>
                    <td>${farmerName}</td>
                    <td>${new Date(item.deliveryDate).toLocaleDateString()}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Crop Sales Report • Generated on ${new Date().toLocaleString()} • Total Records: ${allSalesData.length}</p>
          <p>For more details, visit the Crop Sales Report dashboard</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
    toast.success("🖨️ Printing crop sales report...");
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

  // Calculate stats for display
  const calculateDisplayStats = () => {
    const totalValue = allSalesData.reduce((sum, item) => sum + calculateTotalValue(item), 0);
    const totalQuantity = allSalesData.reduce((sum, item) => sum + item.totalQty, 0);
    const availableItems = allSalesData.filter(item => item.gradeStatus === 'available').length;
    const soldItems = allSalesData.filter(item => item.gradeStatus === 'sold').length;
    
    return { totalValue, totalQuantity, availableItems, soldItems };
  };

  const { totalValue, totalQuantity, availableItems, soldItems } = calculateDisplayStats();
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
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-auto bg-gray-50 p-4">
      {/* Header */}
      <div className="lg:mb-0 mb-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaLeaf className="text-green-600" />
          Crop Sales Report
        </h1>
        <p className="text-gray-600 mt-2">Monitor and manage crop sales data with detailed farmer & trader information</p>
      </div>

      {/* Export Buttons - Desktop */}
      <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
        {exportLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
            Loading data...
          </div>
        )}
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
            disabled={exportLoading}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Export Buttons - Mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-3">
        {exportLoading && (
          <div className="w-full text-center py-2">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
              Loading data...
            </div>
          </div>
        )}
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
            disabled={exportLoading}
            className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[50px] disabled:opacity-50 disabled:cursor-not-allowed`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Stats Cards */}


         {
  user?.role == "admin" &&<>
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
              <p className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()} units</p>
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
</>}
      {/* Filters */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full px-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Search crop, grade, product ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
             { searchInput.length >0 &&<AiOutlineClose onClick={()=>setSearchInput("")} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-5 h-5" />}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLeaf className="text-gray-400" />
            </div>
            {/* <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubCategoryFilter('');
              }}
            >
              <option value="">All Categories</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))
              ) : (
                allSalesData.length > 0 ? (
                  Array.from(new Set(allSalesData.map(item => item.categoryId)))
                    .filter(catId => catId)
                    .map(catId => {
                      const item = allSalesData.find(i => i.categoryId === catId);
                      return (
                        <option key={catId} value={catId}>
                          {item?.categoryName || `Category ${catId}`}
                        </option>
                      );
                    })
                ) : (
                  <option value="" disabled>Loading categories...</option>
                )
              )}
            </select> */}

             <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubCategoryFilter('');
              }}
            >
              <option value="">All Categories</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))
              ) : (
                allSalesData.length > 0 ? (
                  Array.from(new Set(allSalesData.map(item => item.categoryId)))
                    .filter(catId => catId)
                    .map(catId => {
                      const item = allSalesData.find(i => i.categoryId === catId);
                      return (
                        <option key={catId} value={catId}>
                          {item?.categoryName || `Category ${catId}`}
                        </option>
                      );
                    })
                ) : (
                  <option value="" disabled>Loading categories...</option>
                )
              )}
            </select>
          </div>

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
              <option value="cropBriefDetails">Sort by Crop Name</option>
              <option value="grade">Sort by Grade</option>
            </select>
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
              <tr className="*:min-w-32">
                <th 
                  className="px-3  py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                
                >
                  Product ID 
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
                >
                  Crop 
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                 
                >
                  Category 
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
                >
                  Grade 
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
                >
                  Qty 
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
                >
                  Price 
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
                >
                  Status 
                </th>
                <th 
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  
                >
                  Delivery 
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer Info
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traders
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedData.map((item) => (
                <tr key={`${item.productId}-${item.grade}`} className="hover:bg-gray-50 transition-colors">
                  {/* Product ID */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{item.productId}</div>
                    <div className="text-xs text-gray-500">FID: {item.farmerId.substring(0, 8)}...</div>
                  </td>

                  {/* Crop Details */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaSeedling className="text-green-400 mr-2 flex-shrink-0" />
                      <div className="truncate max-w-[150px]">
                        <div className="text-sm font-medium text-gray-900 truncate">{item.cropBriefDetails}</div>
                        <div className="text-xs text-gray-500 capitalize truncate">{item.farmingType}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="truncate max-w-[120px]">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.categoryName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate">{item.subCategoryName || 'N/A'}</div>
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.grade.includes('A') ? 'bg-green-100 text-green-800' :
                      item.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
                      item.grade.includes('C') ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.grade}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.totalQty.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 capitalize truncate max-w-[80px]">{item.quantityType}</div>
                  </td>

                  {/* Price/Unit */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      <FaRupeeSign className="inline mr-1" />
                      {item.pricePerUnit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 capitalize truncate max-w-[80px]">{item.priceType}</div>
                  </td>

                  {/* Total Value */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-purple-700">
                      <FaRupeeSign className="inline mr-1" />
                      {calculateTotalValue(item).toLocaleString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.gradeStatus)}`}>
                      {item.gradeStatus === 'available' && <FaCheckCircle className="mr-1" />}
                      {item.gradeStatus === 'sold' && <FaShoppingCart className="mr-1" />}
                      {item.gradeStatus === 'partially_sold' && <FaPercentage className="mr-1" />}
                      {formatStatus(item.gradeStatus)}
                    </span>
                  </td>

                  {/* Delivery Date */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(item.deliveryDate)}</div>
                        <div className="text-xs text-gray-500">{item.deliveryTime}</div>
                      </div>
                    </div>
                  </td>

                  {/* Farmer Information */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.farmerDetails ? (
                      <div className="max-w-[180px]">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUser className="text-teal-500 flex-shrink-0" />
                          <div className="truncate">
                            <div className="text-sm font-medium text-gray-900 truncate">{item.farmerDetails.personalInfo.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                              <FaPhone className="flex-shrink-0" />
                              {item.farmerDetails.personalInfo.mobileNo}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                          <FaMapMarker className="flex-shrink-0" />
                          <span className="truncate">{item.farmerDetails.personalInfo.district}, {item.farmerDetails.personalInfo.state}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No farmer info</div>
                    )}
                  </td>

                  {/* Traders Information */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.traderDetails && item.traderDetails.length > 0 ? (
                      <div className="max-w-[180px]">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUserTie className="text-indigo-500 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.traderDetails.length} trader(s)</div>
                            <div className="text-xs text-gray-500 truncate">
                              {item.traderDetails[0].personalInfo.name}
                              {item.traderDetails.length > 1 && ` +${item.traderDetails.length - 1} more`}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.traderDetails[0].personalInfo.mobileNo}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No traders</div>
                    )}
                  </td>

                  {/* Actions - View Details */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openDetailsDialog(item)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                      title="View Full Details"
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
              <div className="flex-1">
                <div className="font-bold text-blue-600 text-sm">{item.productId}</div>
                <div className="text-lg font-bold text-gray-800 mt-1">{item.cropBriefDetails}</div>
                <div className="text-sm text-gray-500 capitalize">{item.farmingType} • {item.categoryName}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openDetailsDialog(item)}
                  className="text-blue-600 p-2 bg-blue-50 rounded-full"
                  title="View Full Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => setExpandedItem(
                    expandedItem === `${item.productId}-${item.grade}` 
                      ? null 
                      : `${item.productId}-${item.grade}`
                  )}
                  className="text-gray-500 p-2 bg-gray-100 rounded-full"
                  title={expandedItem === `${item.productId}-${item.grade}` ? "Collapse" : "Expand"}
                >
                  {expandedItem === `${item.productId}-${item.grade}` ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>

            {/* Main Info Row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Grade</div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  item.grade.includes('A') ? 'bg-green-100 text-green-800' :
                  item.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
                  item.grade.includes('C') ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {item.grade}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Quantity</div>
                <div className="font-bold text-blue-700">{item.totalQty.toLocaleString()} {item.quantityType}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Price/Unit</div>
                <div className="font-bold text-green-700 flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {item.pricePerUnit.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Total Value</div>
                <div className="font-bold text-purple-700 flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {calculateTotalValue(item).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Farmer and Trader Info */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-teal-500" />
                  <div className="text-xs text-gray-500">Farmer</div>
                </div>
                {item.farmerDetails ? (
                  <>
                    <div className="font-bold text-gray-900 text-sm truncate">{item.farmerDetails.personalInfo.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <FaPhone className="flex-shrink-0" />
                      {item.farmerDetails.personalInfo.mobileNo}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {item.farmerDetails.personalInfo.district}, {item.farmerDetails.personalInfo.state}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No info</div>
                )}
              </div>
              
              <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <FaUserTie className="text-indigo-500" />
                  <div className="text-xs text-gray-500">Traders</div>
                </div>
                {item.traderDetails && item.traderDetails.length > 0 ? (
                  <>
                    <div className="font-bold text-gray-900 text-sm">
                      {item.traderDetails.length} trader{item.traderDetails.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-600 truncate mt-1">
                      {item.traderDetails[0].personalInfo.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaPhone className="flex-shrink-0" />
                      {item.traderDetails[0].personalInfo.mobileNo}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No traders</div>
                )}
              </div>
            </div>

            {/* Status and Delivery */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.gradeStatus)}`}>
                  {item.gradeStatus === 'available' && <FaCheckCircle className="mr-1" />}
                  {item.gradeStatus === 'sold' && <FaShoppingCart className="mr-1" />}
                  {item.gradeStatus === 'partially_sold' && <FaPercentage className="mr-1" />}
                  {formatStatus(item.gradeStatus)}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <FaCalendarAlt className="text-gray-400" />
                {formatDate(item.deliveryDate)} {item.deliveryTime}
              </div>
            </div>
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

      {/* Details Dialog - Complete with all information */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        {currentItem && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaEye className="text-blue-600" />
                  Crop Sale Details
                </h2>
                <p className="text-gray-600">Complete information for Product ID: {currentItem.productId}</p>
              </div>
              <button
                onClick={() => setDetailsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Product Overview Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                      <FaBox className="text-blue-600" />
                      {currentItem.cropBriefDetails}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentItem.gradeStatus)}`}>
                        {formatStatus(currentItem.gradeStatus)}
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-gray-500">Product ID</div>
                        <div className="font-bold text-blue-700">{currentItem.productId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Grade</div>
                        <span className={`px-3 py-1 text-sm font-medium rounded ${
                          currentItem.grade.includes('A') ? 'bg-green-100 text-green-800' :
                          currentItem.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
                          currentItem.grade.includes('C') ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {currentItem.grade}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Quantity</div>
                        <div className="font-bold text-gray-900 text-lg">{currentItem.totalQty.toLocaleString()} {currentItem.quantityType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Value</div>
                        <div className="font-bold text-green-700 text-lg flex items-center">
                          <FaRupeeSign className="mr-1" />
                          {calculateTotalValue(currentItem).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Price per Unit</div>
                    <div className="text-2xl font-bold text-green-700 flex items-center">
                      <FaRupeeSign className="mr-1" />
                      {currentItem.pricePerUnit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">{currentItem.priceType} Price</div>
                  </div>
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaFileInvoiceDollar className="text-green-600" />
                    Product Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Crop Name</div>
                        <div className="font-medium">{currentItem.cropBriefDetails}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Farming Type</div>
                        <div className="font-medium capitalize">{currentItem.farmingType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Packaging Type</div>
                        <div className="font-medium">{currentItem.packagingType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Quantity Type</div>
                        <div className="font-medium capitalize">{currentItem.quantityType}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Category</div>
                        <div className="font-medium">{currentItem.categoryName || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Sub Category</div>
                        <div className="font-medium">{currentItem.subCategoryName || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Category ID</div>
                        <div className="font-medium text-sm font-mono">{currentItem.categoryId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Sub Category ID</div>
                        <div className="font-medium text-sm font-mono">{currentItem.subCategoryId}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaTruck className="text-orange-600" />
                    Delivery Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Delivery Date</div>
                        <div className="font-medium flex items-center gap-2">
                          <FaCalendar className="text-gray-400" />
                          {formatDate(currentItem.deliveryDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Delivery Time</div>
                        <div className="font-medium flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          {currentItem.deliveryTime}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Created At</div>
                      <div className="font-medium">{formatDateTime(currentItem.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Details Card */}
              {currentItem.farmerDetails && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-teal-600" />
                    Farmer Details
                  </h3>
                  <div className="space-y-4">
                    {/* Personal Info */}
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-3 flex items-center gap-2">
                        <FaIdCard className="text-teal-600" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Farmer ID</div>
                          <div className="font-medium">{currentItem.farmerId}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Name</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Phone</div>
                          <div className="font-medium flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            {currentItem.farmerDetails.personalInfo.mobileNo}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Email</div>
                          <div className="font-medium flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            {currentItem.farmerDetails.personalInfo.email || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Registration Status</div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            currentItem.farmerDetails.registrationStatus === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {currentItem.farmerDetails.registrationStatus}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Registered Date</div>
                          <div className="font-medium">{formatDate(currentItem.farmerDetails.registeredAt)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        Address Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Address</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.address || currentItem.farmerDetails.personalInfo.villageGramaPanchayat}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">District</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.district}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">State</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.state}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Taluk</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.taluk}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Post</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.post}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Pincode</div>
                          <div className="font-medium">{currentItem.farmerDetails.personalInfo.pincode}</div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    {currentItem.farmerDetails.bankDetails && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                          <FaPiggyBank className="text-green-600" />
                          Bank Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Account Holder</div>
                            <div className="font-medium">{currentItem.farmerDetails.bankDetails.accountHolderName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Account Number</div>
                            <div className="font-medium font-mono">{currentItem.farmerDetails.bankDetails.accountNumber}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">IFSC Code</div>
                            <div className="font-medium font-mono">{currentItem.farmerDetails.bankDetails.ifscCode}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Branch</div>
                            <div className="font-medium">{currentItem.farmerDetails.bankDetails.branch}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Farm Information */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                        <FaSeedling className="text-blue-600" />
                        Farm Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Farm Location</div>
                          <div className="font-medium">
                            Lat: {currentItem.farmerDetails.farmLocation.latitude}, 
                            Long: {currentItem.farmerDetails.farmLocation.longitude}
                          </div>
                        </div>
                        {currentItem.farmerDetails.farmLand && (
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Total Land</div>
                              <div className="font-medium">{currentItem.farmerDetails.farmLand.total || 0} acres</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Cultivated</div>
                              <div className="font-medium">{currentItem.farmerDetails.farmLand.cultivated || 0} acres</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Uncultivated</div>
                              <div className="font-medium">{currentItem.farmerDetails.farmLand.uncultivated || 0} acres</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Details Card */}
              {currentItem.marketDetails && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaStore className="text-purple-600" />
                    Market Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Market ID</div>
                        <div className="font-medium">{currentItem.marketDetails.marketId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Market Name</div>
                        <div className="font-medium">{currentItem.marketDetails.marketName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">District</div>
                        <div className="font-medium">{currentItem.marketDetails.district}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">State</div>
                        <div className="font-medium">{currentItem.marketDetails.state}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Pincode</div>
                        <div className="font-medium">{currentItem.marketDetails.pincode}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Post Office</div>
                        <div className="font-medium">{currentItem.marketDetails.postOffice || 'N/A'}</div>
                      </div>
                    </div>
                    {currentItem.marketDetails.exactAddress && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Address</div>
                        <div className="font-medium">{currentItem.marketDetails.exactAddress}</div>
                      </div>
                    )}
                    {currentItem.marketDetails.landmark && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Landmark</div>
                        <div className="font-medium">{currentItem.marketDetails.landmark}</div>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Market created on: {formatDate(currentItem.marketDetails.createdAt)}
                    </div>
                  </div>
                </div>
              )}

              {/* Traders Details Card */}
              {currentItem.traderDetails && currentItem.traderDetails.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUserTie className="text-indigo-600" />
                    Trader Details ({currentItem.traderDetails.length} {currentItem.traderDetails.length === 1 ? 'Trader' : 'Traders'})
                  </h3>
                  <div className="space-y-4">
                    {currentItem.traderDetails.map((trader, index) => (
                      <div key={trader.traderId} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                              <FaUserTie className="text-indigo-500" />
                              {trader.personalInfo.name}
                              <span className="text-sm font-normal text-gray-500 ml-2">(Trader {index + 1})</span>
                            </h4>
                            <div className="text-sm text-gray-600 mt-1">Trader ID: {trader.traderId}</div>
                          </div>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            trader.registrationStatus === 'approved' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {trader.registrationStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Personal Info */}
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <h5 className="font-medium text-indigo-700 mb-2 flex items-center gap-2">
                              <FaIdBadge className="text-indigo-500" />
                              Personal Information
                            </h5>
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-gray-500">Phone</div>
                                <div className="font-medium flex items-center gap-2">
                                  <FaPhone className="text-gray-400" />
                                  {trader.personalInfo.mobileNo}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Email</div>
                                <div className="font-medium flex items-center gap-2">
                                  <FaEnvelope className="text-gray-400" />
                                  {trader.personalInfo.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Address Info */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <FaMapMarker className="text-gray-500" />
                              Address Information
                            </h5>
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-gray-500">District</div>
                                <div className="font-medium">{trader.personalInfo.district}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">State</div>
                                <div className="font-medium">{trader.personalInfo.state}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Pincode</div>
                                <div className="font-medium">{trader.personalInfo.pincode}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="text-xs text-gray-500">Commodities</div>
                            <div className="font-medium text-sm mt-1">{trader.commodities?.length || 0}</div>
                          </div>
                          <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="text-xs text-gray-500">Markets</div>
                            <div className="font-medium text-sm mt-1">{trader.nearestMarkets?.length || 0}</div>
                          </div>
                          <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="text-xs text-gray-500">Registered</div>
                            <div className="font-medium text-sm mt-1">{formatDate(trader.registeredAt)}</div>
                          </div>
                        </div>

                        {/* Bank Details if available */}
                        {trader.bankDetails && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                              <FaPiggyBank className="text-green-500" />
                              Bank Details
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-500">Account Holder</div>
                                <div className="font-medium text-sm">{trader.bankDetails.accountHolderName}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Account Number</div>
                                <div className="font-medium text-sm font-mono">{trader.bankDetails.accountNumber}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-gray-600" />
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Nearest Market ID</div>
                    <div className="font-medium">{currentItem.nearestMarket}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentItem.gradeStatus)}`}>
                      {currentItem.gradeStatus === 'available' && <FaCheckCircle className="mr-1" />}
                      {currentItem.gradeStatus === 'sold' && <FaShoppingCart className="mr-1" />}
                      {currentItem.gradeStatus === 'partially_sold' && <FaPercentage className="mr-1" />}
                      {formatStatus(currentItem.gradeStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last updated: {formatDateTime(currentItem.createdAt)}
              </div>
              <div className="flex gap-3">
                {/* <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(currentItem, null, 2));
                    toast.success('Details copied to clipboard!');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FaCopy />
                  Copy Details
                </button> */}
                <button
                  onClick={() => setDetailsDialogOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default CropSalesReport;