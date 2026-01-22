








// "use client"

// import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
//   FaShoppingCart,
//   FaCalendarAlt,
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
//   FaCreditCard,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaReceipt,
//   FaClipboardList,
//   FaGlobe,
//   FaCity,
//   FaMapPin,
//   FaTruck,
//   FaUserTie,
//   FaUserFriends,
//   FaShippingFast,
//   FaGavel,
//   FaHandshake,
//   FaMoneyBillWave,
//   FaChartLine,
//   FaUserTag,
//   FaMobileAlt,
//   FaHome
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// interface FarmerInfo {
//   farmerId?: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   farmerAddress?: string;
//   farmerVillage?: string;
//   farmerPincode?: string;
//   farmerDistrict?: string;
// }

// interface Offer {
//   // REQUIRED FIELDS:
//   productId: string;
//   farmerId: string;
//   offerId: string;
//   traderId: string;
//   traderName: string;
//   offeredPrice: number;
//   quantity: number;
//   status: 'pending' | 'accepted' | 'rejected' | 'countered' | string;
//   counterPrice?: number;
//   counterQuantity?: number;
//   counterDate?: string;
//   isCounterPrivate: boolean;
//   createdAt: string;
  
//   // Additional helpful fields:
//   cropBriefDetails?: string;
//   grade?: string;
//   nearestMarket?: string;
//   totalValue?: number;
//   _id?: string;
  
//   // Farmer info
//   farmerInfo?: FarmerInfo;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Offer[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   summary?: {
//     totalOffers: number;
//     totalValue: number;
//     statusCounts: {
//       pending: number;
//       accepted: number;
//       rejected: number;
//       countered: number;
//     };
//   };
//   error?: string;
//   message?: string;
//   debug?: any;
// }

// // Generate unique keys
// const generateUniqueKey = (offer: Offer, index: number): string => {
//   const baseId = offer._id || offer.offerId || `offer-${Date.now()}`;
//   return `${baseId}-${index}`;
// };

// const TraderBidsReport: React.FC = () => {
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [allOffers, setAllOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>('');
  
//   // Filter states
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [traderIdFilter, setTraderIdFilter] = useState<string>('');
//   const [farmerIdFilter, setFarmerIdFilter] = useState<string>('');
//   const [productIdFilter, setProductIdFilter] = useState<string>('');
  
//   // Sorting states
//   const [sortField, setSortField] = useState<string>('createdAt');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItemsState, setTotalItemsState] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
//   const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  
//   // Mobile view state
//   const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

//   // Farmer details cache
//   const [farmerDetailsCache, setFarmerDetailsCache] = useState<Record<string, FarmerInfo>>({});

//   const API_BASE = '/api';
//   const tableRef = useRef<HTMLDivElement>(null);
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Fetch farmer details
//   const fetchFarmerDetails = useCallback(async (farmerId: string): Promise<FarmerInfo> => {
//     if (farmerDetailsCache[farmerId]) {
//       return farmerDetailsCache[farmerId];
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/farmers?search=${farmerId}`);
      
//       if (response.data.success && response.data.data && response.data.data.length > 0) {
//         const farmerData = response.data.data[0];
        
//         // Build address from personalInfo
//         let address = '';
//         if (farmerData.personalInfo?.address) {
//           address = farmerData.personalInfo.address;
//         }
        
//         // Add village if available
//         if (farmerData.personalInfo?.villageGramaPanchayat) {
//           if (address) address += ', ';
//           address += farmerData.personalInfo.villageGramaPanchayat;
//         }
        
//         // Add district if available
//         if (farmerData.personalInfo?.district) {
//           if (address) address += ', ';
//           address += farmerData.personalInfo.district;
//         }
        
//         // Add pincode if available
//         if (farmerData.personalInfo?.pincode) {
//           if (address) address += ' - ';
//           address += farmerData.personalInfo.pincode;
//         }

//         const farmerInfo: FarmerInfo = {
//           farmerId: farmerData.farmerId,
//           farmerName: farmerData.personalInfo?.name || 'N/A',
//           farmerMobile: farmerData.personalInfo?.mobileNo || 'N/A',
//           farmerAddress: address || 'N/A',
//           farmerVillage: farmerData.personalInfo?.villageGramaPanchayat || 'N/A',
//           farmerPincode: farmerData.personalInfo?.pincode || 'N/A',
//           farmerDistrict: farmerData.personalInfo?.district || 'N/A'
//         };
        
//         // Update cache
//         setFarmerDetailsCache(prev => ({
//           ...prev,
//           [farmerId]: farmerInfo
//         }));
        
//         return farmerInfo;
//       }
//     } catch (error) {
//       console.error(`Error fetching farmer details for ${farmerId}:`, error);
//     }
    
//     // Return default if fetch fails
//     return {
//       farmerId,
//       farmerName: 'Not Found',
//       farmerMobile: 'N/A',
//       farmerAddress: 'N/A'
//     };
//   }, [API_BASE, farmerDetailsCache]);

//   // Fetch offers with server-side pagination and sorting - FIXED: Only one API call
//   const fetchOffers = useCallback(async (isForExport = false) => {
//     // Don't set loading for export calls
//     if (!isForExport) {
//       setLoading(true);
//     }
    
//     const params = new URLSearchParams();
//     if (searchInput) params.append('search', searchInput);
//     if (statusFilter) params.append('status', statusFilter);
//     if (traderIdFilter) params.append('traderId', traderIdFilter);
//     if (farmerIdFilter) params.append('farmerId', farmerIdFilter);
//     if (productIdFilter) params.append('productId', productIdFilter);
    
//     // For export, get all data, for normal fetch, use pagination
//     if (!isForExport) {
//       params.append('page', currentPage.toString());
//       params.append('limit', itemsPerPage.toString());
//     } else {
//       params.append('limit', '10000');
//     }
    
//     params.append('sortBy', sortField);
//     params.append('order', sortOrder);

//     try {
//       const response = await axios.get(`${API_BASE}/trader-bids-reports?${params.toString()}`);
      
//       if (response.data.success) {
//         const data = response.data.data || [];
        
//         // Process offers and fetch farmer details
//         const processedOffers = await Promise.all(
//           data.map(async (offer: Offer) => {
//             if (offer.farmerId) {
//               const farmerInfo = await fetchFarmerDetails(offer.farmerId);
//               return {
//                 ...offer,
//                 farmerInfo
//               };
//             }
//             return offer;
//           })
//         );
        
//         if (isForExport) {
//           setAllOffers(processedOffers);
//           return processedOffers;
//         } else {
//           setOffers(processedOffers);
//           setTotalItemsState(response.data.pagination?.total || data.length);
//           setTotalPages(response.data.pagination?.totalPages || 1);
//         }
//       } else {
//         if (!isForExport) {
//           toast.error(response.data.error || 'Failed to fetch trader bids');
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching trader bids:', error);
//       if (!isForExport) {
//         toast.error('Error fetching trader bids');
//       }
//     } finally {
//       if (!isForExport) {
//         setLoading(false);
//       }
//     }
    
//     return [];
//   }, [API_BASE, searchInput, statusFilter, traderIdFilter, farmerIdFilter, productIdFilter, currentPage, itemsPerPage, sortField, sortOrder, fetchFarmerDetails]);

//   // Separate function to fetch export data
//   const fetchExportData = useCallback(async () => {
//     try {
//       const exportData = await fetchOffers(true);
//       setAllOffers(exportData);
//       return exportData;
//     } catch (error) {
//       console.error('Error fetching export data:', error);
//       return [];
//     }
//   }, [fetchOffers]);

//   // Initial data fetch and when pagination/sorting changes
//   useEffect(() => {
//     fetchOffers();
//   }, [currentPage, itemsPerPage, sortField, sortOrder]);

//   // Debounced search for filters - FIXED: Added all filter dependencies
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setCurrentPage(1);
//       fetchOffers();
//     }, 500);

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchInput, statusFilter, traderIdFilter, farmerIdFilter, productIdFilter, fetchOffers]);

//   // Get unique traders for filter dropdown - use allOffers to get all traders
//   const getUniqueTraders = useMemo(() => {
//     // Temporarily use a mock or empty array if allOffers is empty
//     const offersForFilter = allOffers.length > 0 ? allOffers : offers;
//     const traders = offersForFilter
//       .map(offer => ({ id: offer.traderId, name: offer.traderName }))
//       .filter((trader, index, self) => 
//         trader.id && 
//         trader.id.trim() !== '' && 
//         index === self.findIndex(t => t.id === trader.id)
//       );
//     return traders.sort((a, b) => a.name.localeCompare(b.name));
//   }, [allOffers, offers]);

//   // Get unique products for filter dropdown
//   const getUniqueProducts = useMemo(() => {
//     const offersForFilter = allOffers.length > 0 ? allOffers : offers;
//     const products = offersForFilter
//       .map(offer => offer.productId)
//       .filter(productId => productId && productId.trim() !== '');
//     return [...new Set(products)].sort();
//   }, [allOffers, offers]);

//   // Filter offers client-side as a fallback (in case API doesn't filter)
//   const filteredOffers = useMemo(() => {
//     let result = offers;
    
//     // Apply client-side filtering if needed (as backup)
//     if (statusFilter && statusFilter !== '') {
//       result = result.filter(offer => 
//         offer.status.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }
    
//     if (searchInput && searchInput !== '') {
//       const searchLower = searchInput.toLowerCase();
//       result = result.filter(offer =>
//         offer.traderName?.toLowerCase().includes(searchLower) ||
//         offer.productId?.toLowerCase().includes(searchLower) ||
//         offer.offerId?.toLowerCase().includes(searchLower) ||
//         offer.farmerId?.toLowerCase().includes(searchLower) ||
//         offer.traderId?.toLowerCase().includes(searchLower) ||
//         offer.farmerInfo?.farmerName?.toLowerCase().includes(searchLower)
//       );
//     }
    
//     if (traderIdFilter && traderIdFilter !== '') {
//       result = result.filter(offer => 
//         offer.traderId === traderIdFilter
//       );
//     }
    
//     if (productIdFilter && productIdFilter !== '') {
//       result = result.filter(offer => 
//         offer.productId === productIdFilter
//       );
//     }
    
//     if (farmerIdFilter && farmerIdFilter !== '') {
//       result = result.filter(offer => 
//         offer.farmerId === farmerIdFilter
//       );
//     }
    
//     return result;
//   }, [offers, statusFilter, searchInput, traderIdFilter, productIdFilter, farmerIdFilter]);

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
//       return <FaSearch className="inline ml-1 text-gray-400" />;
//     }
//     return sortOrder === 'asc' 
//       ? <FaChevronUp className="inline ml-1 text-blue-600" /> 
//       : <FaChevronDown className="inline ml-1 text-blue-600" />;
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

//   // Calculate pagination range - use filteredOffers for display
//   const getPaginationRange = () => {
//     const startItem = (currentPage - 1) * itemsPerPage + 1;
//     const endItem = Math.min(currentPage * itemsPerPage, totalItemsState);
//     return { startItem, endItem };
//   };

//   // Calculate stats - use allOffers for global stats
//   const calculateStats = () => {
//     const offersForStats = allOffers.length > 0 ? allOffers : offers;
//     const totalOffers = offersForStats.length;
//     const totalValue = offersForStats.reduce((sum, offer) => sum + ((offer.offeredPrice || 0) * (offer.quantity || 0)), 0);
    
//     const statusCounts = {
//       pending: offersForStats.filter(o => o.status?.toLowerCase() === 'pending').length,
//       accepted: offersForStats.filter(o => o.status?.toLowerCase() === 'accepted').length,
//       rejected: offersForStats.filter(o => o.status?.toLowerCase() === 'rejected').length,
//       countered: offersForStats.filter(o => o.status?.toLowerCase() === 'countered').length
//     };
    
//     const counterOffers = offersForStats.filter(o => o.counterPrice || o.counterQuantity).length;
//     const privateCounters = offersForStats.filter(o => o.isCounterPrivate).length;
    
//     return { totalOffers, totalValue, statusCounts, counterOffers, privateCounters };
//   };

//   const { totalOffers, totalValue, statusCounts, counterOffers, privateCounters } = calculateStats();
//   const { startItem, endItem } = getPaginationRange();

//   const handleCopyToClipboard = async (): Promise<void> => {
//     let offersToExport = allOffers;
    
//     // If allOffers is empty, fetch export data
//     if (offersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       offersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (offersToExport.length === 0) {
//       toast.error("No offers to copy");
//       return;
//     }

//     // Define headers with widths for optimal display
//     const headers = [
//       { name: "Offer ID", width: 12 },
//       { name: "Product", width: 10 },
//       { name: "Trader", width: 18 },
//       { name: "Price", width: 12 },
//       { name: "Qty", width: 8 },
//       { name: "Status", width: 14 },
//       { name: "Counter", width: 15 },
//       { name: "Date", width: 12 }
//     ];
    
//     // Create header row
//     const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
//     const separator = "─".repeat(headerRow.length);
    
//     // Format each offer row
//     const offerRows = offersToExport.map((offer: any) => {
//       // Format trader info
//       const traderInfo = `${offer.traderName || "N/A"} (${offer.traderId?.substring(0, 6) || "N/A"}...)`;
//       const formattedTrader = traderInfo.length > 16 
//         ? traderInfo.substring(0, 13) + "..." 
//         : traderInfo;
      
//       // Format price with ₹ symbol
//       const formatPrice = (price: number) => 
//         price ? `₹${price.toLocaleString('en-IN')}` : "N/A";
      
//       const offeredPrice = formatPrice(offer.offeredPrice || 0);
      
//       // Format status with emoji
//       const status = offer.status || "N/A";
//       const statusEmoji = status === "accepted" ? "✅" : 
//                          status === "rejected" ? "❌" : 
//                          status === "pending" ? "⏳" : 
//                          status === "countered" ? "💰" : "";
      
//       // Format counter offer info
//       let counterInfo = "No Counter";
//       if (offer.counterPrice || offer.counterQuantity) {
//         const counterPrice = offer.counterPrice ? `₹${offer.counterPrice}` : "";
//         const counterQty = offer.counterQuantity ? `${offer.counterQuantity}` : "";
//         counterInfo = `${counterPrice} / ${counterQty}`.replace(/ \/ $/, "").replace(/^ \//, "");
//       }
      
//       // Create row values with padding
//       const rowValues = [
//         (offer.offerId?.substring(0, 10) || "N/A").padEnd(headers[0].width),
//         (offer.productId?.substring(0, 8) || "N/A").padEnd(headers[1].width),
//         formattedTrader.padEnd(headers[2].width),
//         offeredPrice.padEnd(headers[3].width),
//         (offer.quantity || 0).toString().padEnd(headers[4].width),
//         `${statusEmoji} ${status}`.padEnd(headers[5].width),
//         counterInfo.padEnd(headers[6].width),
//         (offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : "N/A").padEnd(headers[7].width)
//       ];
      
//       return rowValues.join(" │ ");
//     });
    
//     // Calculate statistics
//     const stats = offersToExport.reduce((acc: any, offer: any) => {
//       acc.totalValue += (offer.offeredPrice || 0) * (offer.quantity || 0);
//       acc.totalQuantity += offer.quantity || 0;
//       acc.statusCounts[offer.status] = (acc.statusCounts[offer.status] || 0) + 1;
//       acc.hasCounter += (offer.counterPrice || offer.counterQuantity) ? 1 : 0;
//       return acc;
//     }, {
//       totalValue: 0,
//       totalQuantity: 0,
//       statusCounts: {},
//       hasCounter: 0
//     });
    
//     // Build complete table with analytics
//     const tableContent = [
//       "💰 OFFERS & COUNTER-OFFERS",
//       "=".repeat(headerRow.length),
//       headerRow,
//       separator,
//       ...offerRows,
//       separator,
//       "",
//       "📊 OFFER ANALYTICS",
//       `• Total Offers: ${offersToExport.length}`,
//       `• Total Quantity Offered: ${stats.totalQuantity.toLocaleString('en-IN')}`,
//       `• Total Offer Value: ₹${stats.totalValue.toLocaleString('en-IN')}`,
//       `• Average Price per Unit: ₹${stats.totalQuantity > 0 ? (stats.totalValue / stats.totalQuantity).toFixed(2) : 0}`,
//       "",
//       "📈 STATUS DISTRIBUTION",
//       ...Object.entries(stats.statusCounts).map(([status, count]: [string, any]) => 
//         `• ${status}: ${count} (${Math.round((count / offersToExport.length) * 100)}%)`
//       ),
//       "",
//       "💱 COUNTER OFFER STATS",
//       `• Offers with Counter: ${stats.hasCounter}`,
//       `• Counter Rate: ${Math.round((stats.hasCounter / offersToExport.length) * 100)}%`,
//       `• Without Counter: ${offersToExport.length - stats.hasCounter}`,
//       "",
//       "🔍 DATA SOURCE",
//       `• Source: ${filteredOffers.length > 0 ? 'Filtered Results' : 'All Offers'}`,
//       `• Farmers: ${new Set(offersToExport.map((o: any) => o.farmerId)).size}`,
//       `• Products: ${new Set(offersToExport.map((o: any) => o.productId)).size}`,
//       `• Traders: ${new Set(offersToExport.map((o: any) => o.traderId)).size}`,
//       "",
//       `📅 Report Generated: ${new Date().toLocaleString()}`
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(tableContent);
//       toast.success(`Copied ${offersToExport.length} offers to clipboard!`);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = async () => {
//     let offersToExport = allOffers;
    
//     // If allOffers is empty, fetch export data
//     if (offersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       offersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (offersToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const data = offersToExport.map((offer) => {
//       const totalValue = (offer.offeredPrice || 0) * (offer.quantity || 0);
//       return {
//         "Product ID": offer.productId,
//         "Farmer ID": offer.farmerId,
//         "Farmer Name": offer.farmerInfo?.farmerName || 'N/A',
//         "Farmer Mobile": offer.farmerInfo?.farmerMobile || 'N/A',
//         "Farmer Address": offer.farmerInfo?.farmerAddress || 'N/A',
//         "Offer ID": offer.offerId,
//         "Trader ID": offer.traderId,
//         "Trader Name": offer.traderName,
//         "Offered Price": offer.offeredPrice,
//         "Quantity": offer.quantity,
//         "Total Value": totalValue,
//         "Status": offer.status,
//         "Counter Price": offer.counterPrice || '',
//         "Counter Quantity": offer.counterQuantity || '',
//         "Counter Date": offer.counterDate || '',
//         "Is Counter Private": offer.isCounterPrivate ? 'Yes' : 'No',
//         "Crop Details": offer.cropBriefDetails || '',
//         "Grade": offer.grade || '',
//         "Nearest Market": offer.nearestMarket || '',
//         "Created At": new Date(offer.createdAt).toLocaleString(),
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Trader Bids Report");
//     writeFile(wb, `trader-bids-report-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = async () => {
//     let offersToExport = allOffers;
    
//     // If allOffers is empty, fetch export data
//     if (offersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       offersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (offersToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }
    
//     const headers = ["Product ID", "Trader Name", "Farmer Name", "Offered Price", "Quantity", "Status", "Counter Price", "Date"];
    
//     const csvContent = [
//       headers.join(","),
//       ...offersToExport.map((offer) => {
//         return [
//           `"${offer.productId}"`,
//           `"${offer.traderName}"`,
//           `"${offer.farmerInfo?.farmerName || 'N/A'}"`,
//           offer.offeredPrice,
//           offer.quantity,
//           `"${offer.status}"`,
//           offer.counterPrice || '',
//           `"${new Date(offer.createdAt).toLocaleDateString()}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `trader-bids-report-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = async () => {
//     let offersToExport = allOffers;
    
//     // If allOffers is empty, fetch export data
//     if (offersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       offersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (offersToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }
    
//     const doc = new jsPDF('landscape');
//     doc.text("Trader Bids Report", 14, 16);
    
//     const tableColumn = ["Product ID", "Trader", "Farmer", "Price", "Quantity", "Total", "Status", "Counter", "Date"];
//     const tableRows: any = offersToExport.map((offer) => {
//       const total = (offer.offeredPrice || 0) * (offer.quantity || 0);
//       return [
//         offer.productId,
//         offer.traderName,
//         offer.farmerInfo?.farmerName || 'N/A',
//         `₹${offer.offeredPrice.toLocaleString()}`,
//         offer.quantity.toLocaleString(),
//         `₹${total.toLocaleString()}`,
//         offer.status,
//         offer.counterPrice ? `₹${offer.counterPrice.toLocaleString()}` : 'None',
//         new Date(offer.createdAt).toLocaleDateString()
//       ];
//     });
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [59, 130, 246] },
//     });
    
//     doc.save(`trader-bids-report-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("PDF file exported!");
//   };

//   const handlePrint = async () => {
//     let offersToExport = allOffers;
    
//     // If allOffers is empty, fetch export data
//     if (offersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       offersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (offersToExport.length === 0) {
//       toast.error("No data to print");
//       return;
//     }
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Trader Bids Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           .status-pending { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-accepted { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-rejected { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-countered { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .farmer-info { background-color: #f0fdf4; padding: 8px; border-radius: 6px; margin: 5px 0; }
//           .farmer-label { font-weight: bold; color: #166534; }
//           @media print { 
//             @page { size: landscape; } 
//             body { margin: 0; padding: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Trader Bids Report</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
//         <p>Total Bids: ${offersToExport.length}</p>
//         <p>Status Filter: ${statusFilter || 'All'}</p>
//         <table>
//           <thead>
//             <tr>
//               <th>Product ID</th>
//               <th>Trader</th>
//               <th>Farmer</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Total Value</th>
//               <th>Status</th>
//               <th>Counter Offer</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${offersToExport.map((offer) => {
//               const total = (offer.offeredPrice || 0) * (offer.quantity || 0);
//               const statusClass = `status-${offer.status}`;
//               const counterInfo = offer.counterPrice 
//                 ? `₹${offer.counterPrice.toLocaleString()} (${offer.counterQuantity || 0} units)`
//                 : 'None';
//               return `
//                 <tr>
//                   <td>${offer.productId}</td>
//                   <td>${offer.traderName}<br><small>ID: ${offer.traderId}</small></td>
//                   <td>
//                     ${offer.farmerInfo ? `
//                       <div class="farmer-info">
//                         <div><span class="farmer-label">Name:</span> ${offer.farmerInfo.farmerName}</div>
//                         <div><span class="farmer-label">ID:</span> ${offer.farmerInfo.farmerId}</div>
//                         <div><span class="farmer-label">Mobile:</span> ${offer.farmerInfo.farmerMobile}</div>
//                         <div><span class="farmer-label">Address:</span> ${offer.farmerInfo.farmerAddress}</div>
//                       </div>
//                     ` : offer.farmerId}
//                   </td>
//                   <td>₹${offer.offeredPrice.toLocaleString()}</td>
//                   <td>${offer.quantity.toLocaleString()}</td>
//                   <td>₹${total.toLocaleString()}</td>
//                   <td><span class="${statusClass}">${offer.status.toUpperCase()}</span></td>
//                   <td>${counterInfo}</td>
//                   <td>${new Date(offer.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               `;
//             }).join('')}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank');
//     printWindow?.document.write(printContent);
//     printWindow?.document.close();
//     printWindow?.print();
//     toast.success("Printing trader bids report...");
//   };

//   // Status badge colors
//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'accepted':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'rejected':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'countered':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Format status text
//   const formatStatus = (status: string) => {
//     return status.replace(/\b\w/g, l => l.toUpperCase());
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

//   // Open details dialog
//   const openDetailsDialog = (offer: Offer) => {
//     setCurrentOffer(offer);
//     setDetailsDialogOpen(true);
//   };

//   // Reset filters and sorting
//   const resetFilters = () => {
//     setSearchInput('');
//     setStatusFilter('');
//     setTraderIdFilter('');
//     setFarmerIdFilter('');
//     setProductIdFilter('');
//     setSortField('createdAt');
//     setSortOrder('desc');
//     setCurrentPage(1);
//   };

//   // Apply search and filters
//   const applyFilters = () => {
//     setCurrentPage(1);
//     fetchOffers();
//   };

//   if (loading && offers.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading trader bids...</p>
//         </div>
//       </div>
//     );
//   }

//   // Use filteredOffers for display in the table
//   const displayOffers = filteredOffers;

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
//       {/* Header */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaGavel className="text-blue-600" />
//           Traders Bids Report
//         </h1>
//         <p className="text-gray-600 mt-1">Track all trader bids placed on crops with counter offers and status</p>
//       </div>

//       {/* Export Buttons - Desktop */}
//       <div className="hidden lg:flex justify-end flex-wrap gap-2 mb-4">
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
//             className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium text-sm`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//             <span className="hidden sm:inline">{btn.label}</span>
//           </button>
//         ))}
//       </div>

//       {/* Export Buttons - Mobile */}
//       <div className="lg:hidden flex flex-wrap gap-2 mb-4">
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
//             className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//           </button>
//         ))}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Bids</p>
//               <p className="text-xl font-bold text-gray-900">{totalOffers}</p>
//             </div>
//             <FaGavel className="text-blue-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Value</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
//             </div>
//             <FaMoneyBillWave className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Pending</p>
//               <p className="text-xl font-bold text-gray-900">{statusCounts.pending}</p>
//             </div>
//             <FaClipboardList className="text-yellow-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Accepted</p>
//               <p className="text-xl font-bold text-gray-900">{statusCounts.accepted}</p>
//             </div>
//             <FaCheckCircle className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Counter Offers</p>
//               <p className="text-xl font-bold text-gray-900">{counterOffers}</p>
//             </div>
//             <FaHandshake className="text-blue-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Private Counters</p>
//               <p className="text-xl font-bold text-gray-900">{privateCounters}</p>
//             </div>
//             <FaUser className="text-purple-500 text-xl" />
//           </div>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded-lg shadow mb-4 p-3">
//         <div className="flex items-center gap-2 mb-3">
//           <FaFilter className="text-gray-500" />
//           <h3 className="text-sm font-medium text-gray-700">Filters</h3>
//         </div>
        
//         {/* Main Filters Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
//           {/* Search */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//               placeholder="Search by trader name, product ID, farmer name..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaClipboardList className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1); // Reset to first page when status changes
//               }}
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="rejected">Rejected</option>
//               <option value="countered">Countered</option>
//             </select>
//           </div>

//           {/* Trader ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUserTie className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={traderIdFilter}
//               onChange={(e) => setTraderIdFilter(e.target.value)}
//             >
//               <option value="">All Traders</option>
//               {getUniqueTraders.map((trader) => (
//                 <option key={trader.id} value={trader.id}>
//                   {trader.name} ({trader.id})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Product ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaBox className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={productIdFilter}
//               onChange={(e) => setProductIdFilter(e.target.value)}
//             >
//               <option value="">All Products</option>
//               {getUniqueProducts.map((productId) => (
//                 <option key={productId} value={productId}>
//                   {productId}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Farmer ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUserFriends className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//               placeholder="Farmer ID"
//               value={farmerIdFilter}
//               onChange={(e) => setFarmerIdFilter(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3">
//           <button
//             onClick={applyFilters}
//             className="w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
//           >
//             <FaSearch />
//             Apply Filters
//           </button>
//           <button
//             onClick={resetFilters}
//             className="w-fit flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
//           >
//             <FaSync />
//             Reset All
//           </button>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden" ref={tableRef}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('offerId')}
//                 >
//                   Offer ID {getSortIcon('offerId')}
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('productId')}
//                 >
//                   Product Details {getSortIcon('productId')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Trader Details
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Farmer Details
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('offeredPrice')}
//                 >
//                   Bid Details {getSortIcon('offeredPrice')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Counter Offer
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Status
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('createdAt')}
//                 >
//                   Date {getSortIcon('createdAt')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayOffers.map((offer, index) => {
//                 const totalValue = (offer.offeredPrice || 0) * (offer.quantity || 0);
                
//                 return (
//                   <tr key={generateUniqueKey(offer, index)} className="hover:bg-gray-50 transition-colors">
//                     {/* Offer ID */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-blue-600">{offer.offerId}</div>
//                       <div className="text-xs text-gray-500">Farmer ID: {offer.farmerId}</div>
//                     </td>

//                     {/* Product Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaBox className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <div className="text-sm font-medium text-gray-900 truncate">Product ID: {offer.productId}</div>
//                           {offer.cropBriefDetails && (
//                             <div className="text-xs text-gray-500 truncate">{offer.cropBriefDetails}</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Trader Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaUserTie className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <div className="text-sm font-medium text-gray-900 truncate">{offer.traderName}</div>
//                           <div className="text-xs text-gray-500 truncate">{offer.traderId}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Farmer Details */}
//                     <td className="px-4 py-3">
//                       {offer.farmerInfo ? (
//                         <div className="space-y-1 min-w-0">
//                           {/* Farmer ID and Name */}
//                           <div className="flex items-center">
//                             <FaUserTag className="text-green-500 mr-2 flex-shrink-0 text-xs" />
//                             <div className="min-w-0">
//                               <div className="text-sm font-medium text-gray-900 truncate">
//                                 {offer.farmerInfo.farmerName}
//                               </div>
//                               <div className="text-xs text-gray-500 truncate">
//                                 ID: {offer.farmerInfo.farmerId}
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Mobile Number */}
//                           {offer.farmerInfo.farmerMobile !== 'N/A' && (
//                             <div className="flex items-center text-xs text-gray-600 ml-6">
//                               <FaMobileAlt className="mr-1 flex-shrink-0" />
//                               <span className="truncate">{offer.farmerInfo.farmerMobile}</span>
//                             </div>
//                           )}
                          
//                           {/* Address */}
//                           {offer.farmerInfo.farmerAddress !== 'N/A' && offer.farmerInfo.farmerAddress !== '' && (
//                             <div className="flex items-start text-xs text-gray-600 ml-6">
//                               <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
//                               <span className="truncate">{offer.farmerInfo.farmerAddress}</span>
//                             </div>
//                           )}
                          
//                           {/* Show when no address is available */}
//                           {(offer.farmerInfo.farmerAddress === 'N/A' || offer.farmerInfo.farmerAddress === '') && (
//                             <div className="flex items-center text-xs text-gray-400 italic ml-6">
//                               <FaHome className="mr-1 flex-shrink-0" />
//                               <span>No address available</span>
//                             </div>
//                           )}
//                         </div>
//                       ) : offer.farmerId ? (
//                         <div className="text-xs text-gray-500 italic">
//                           Loading farmer details...
//                         </div>
//                       ) : (
//                         <div className="text-xs text-gray-400 italic">
//                           No farmer assigned
//                         </div>
//                       )}
//                     </td>

//                     {/* Bid Details */}
//                     <td className="px-4 py-3">
//                       <div className="space-y-1">
//                         <div className="flex justify-between">
//                           <span className="text-xs text-gray-500">Price:</span>
//                           <span className="text-sm font-bold">{formatCurrency(offer.offeredPrice)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-xs text-gray-500">Quantity:</span>
//                           <span className="text-sm font-bold">{offer.quantity.toLocaleString()}</span>
//                         </div>
//                         <div className="pt-1 border-t">
//                           <div className="flex justify-between">
//                             <span className="text-xs text-gray-500">Total:</span>
//                             <span className="text-sm font-bold text-green-600">{formatCurrency(totalValue)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Counter Offer */}
//                     <td className="px-4 py-3">
//                       {offer.counterPrice || offer.counterQuantity ? (
//                         <div className="space-y-1">
//                           <div className="flex justify-between">
//                             <span className="text-xs text-gray-500">Price:</span>
//                             <span className="text-sm font-bold text-blue-600">{formatCurrency(offer.counterPrice || 0)}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-xs text-gray-500">Qty:</span>
//                             <span className="text-sm font-bold text-blue-600">{offer.counterQuantity?.toLocaleString() || 0}</span>
//                           </div>
//                           {offer.isCounterPrivate && (
//                             <div className="text-xs text-purple-600">Private</div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="text-xs text-gray-400">None</div>
//                       )}
//                     </td>

//                     {/* Status */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(offer.status)}`}>
//                         {formatStatus(offer.status)}
//                       </span>
//                     </td>

//                     {/* Date */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{formatDate(offer.createdAt)}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Actions - View Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <button
//                         onClick={() => openDetailsDialog(offer)}
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
//                         title="View Bid Details"
//                       >
//                         <FaEye />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* No Data State */}
//         {displayOffers.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-4xl mb-4">
//               <FaGavel className="mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No trader bids found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-3">
//         {displayOffers.map((offer, index) => {
//           const totalValue = (offer.offeredPrice || 0) * (offer.quantity || 0);
          
//           return (
//             <div key={generateUniqueKey(offer, index)} className="bg-white rounded-lg shadow p-3">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="min-w-0 flex-1">
//                   <div className="font-bold text-blue-600 text-sm truncate">{offer.offerId}</div>
//                   <div className="text-xs text-gray-500 truncate">{offer.productId}</div>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <button
//                     onClick={() => openDetailsDialog(offer)}
//                     className="text-blue-600 p-1"
//                     title="View Details"
//                   >
//                     <FaEye />
//                   </button>
//                   <button
//                     onClick={() => setExpandedOffer(
//                       expandedOffer === offer.offerId 
//                         ? null 
//                         : offer.offerId
//                     )}
//                     className="text-gray-500 p-1"
//                     title={expandedOffer === offer.offerId ? "Collapse" : "Expand"}
//                   >
//                     {expandedOffer === offer.offerId ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                 </div>
//               </div>

//               {/* Farmer Info in Mobile View */}
//               {offer.farmerInfo && (
//                 <div className="mb-2 p-2 bg-gray-50 rounded border-l-2 border-green-500">
//                   <div className="text-xs text-gray-500 mb-1">Farmer Details</div>
//                   <div className="space-y-1">
//                     <div className="flex items-center">
//                       <FaUserTag className="text-green-500 mr-2 text-xs flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium truncate">{offer.farmerInfo.farmerName}</div>
//                         <div className="text-xs text-gray-500 truncate">ID: {offer.farmerInfo.farmerId}</div>
//                       </div>
//                     </div>
//                     {offer.farmerInfo.farmerMobile !== 'N/A' && (
//                       <div className="flex items-center text-xs text-gray-600 ml-6">
//                         <FaMobileAlt className="mr-1 flex-shrink-0" />
//                         <span className="truncate">{offer.farmerInfo.farmerMobile}</span>
//                       </div>
//                     )}
//                     {offer.farmerInfo.farmerAddress !== 'N/A' && offer.farmerInfo.farmerAddress !== '' && (
//                       <div className="flex items-start text-xs text-gray-600 ml-6">
//                         <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
//                         <span className="truncate">{offer.farmerInfo.farmerAddress}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-2 mb-2">
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Trader</div>
//                   <div className="font-medium text-xs truncate">{offer.traderName}</div>
//                   <div className="text-xs text-gray-500 truncate">ID: {offer.traderId}</div>
//                 </div>
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Total Value</div>
//                   <div className="font-bold text-sm truncate">{formatCurrency(totalValue)}</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-2 mb-2">
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Price × Qty</div>
//                   <div className="font-medium text-xs truncate">
//                     {formatCurrency(offer.offeredPrice)} × {offer.quantity}
//                   </div>
//                 </div>
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Status</div>
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(offer.status)} truncate`}>
//                     {formatStatus(offer.status)}
//                   </span>
//                 </div>
//               </div>

//               {/* Expanded Content */}
//               {expandedOffer === offer.offerId && (
//                 <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
//                   {/* Farmer Details in Expanded View */}
//                   {offer.farmerInfo && (
//                     <div className="bg-green-50 p-2 rounded">
//                       <div className="text-xs text-gray-500 mb-2">Farmer Information</div>
//                       <div className="space-y-2">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <div className="text-xs text-gray-600">Name</div>
//                             <div className="text-sm font-medium">{offer.farmerInfo.farmerName}</div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-600">ID</div>
//                             <div className="text-sm font-medium">{offer.farmerInfo.farmerId}</div>
//                           </div>
//                         </div>
//                         {offer.farmerInfo.farmerMobile !== 'N/A' && (
//                           <div>
//                             <div className="text-xs text-gray-600">Mobile</div>
//                             <div className="text-sm font-medium">{offer.farmerInfo.farmerMobile}</div>
//                           </div>
//                         )}
//                         {offer.farmerInfo.farmerAddress !== 'N/A' && offer.farmerInfo.farmerAddress !== '' && (
//                           <div>
//                             <div className="text-xs text-gray-600">Address</div>
//                             <div className="text-sm font-medium">{offer.farmerInfo.farmerAddress}</div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Counter Offer Details */}
//                   {(offer.counterPrice || offer.counterQuantity) && (
//                     <div>
//                       <div className="text-xs text-gray-500 mb-2">Counter Offer</div>
//                       <div className="space-y-2 bg-blue-50 p-2 rounded">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <div className="text-xs text-gray-600">Counter Price</div>
//                             <div className="text-sm font-bold text-blue-600">{formatCurrency(offer.counterPrice || 0)}</div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-600">Counter Qty</div>
//                             <div className="text-sm font-bold text-blue-600">{offer.counterQuantity || 0}</div>
//                           </div>
//                         </div>
//                         {offer.counterDate && (
//                           <div>
//                             <div className="text-xs text-gray-600">Counter Date</div>
//                             <div className="text-xs">{formatDate(offer.counterDate)}</div>
//                           </div>
//                         )}
//                         {offer.isCounterPrivate && (
//                           <div className="text-xs text-purple-600 font-medium">
//                             Private Counter Offer
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Additional Details */}
//                   {(offer.cropBriefDetails || offer.grade) && (
//                     <div>
//                       <div className="text-xs text-gray-500 mb-2">Additional Details</div>
//                       <div className="text-xs space-y-1">
//                         {offer.cropBriefDetails && (
//                           <div className="truncate">{offer.cropBriefDetails}</div>
//                         )}
//                         {offer.grade && (
//                           <div>Grade: {offer.grade}</div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Timeline */}
//                   <div className="bg-gray-50 p-2 rounded">
//                     <div className="text-xs text-gray-500 mb-1">Created</div>
//                     <div className="text-xs">{formatDateTime(offer.createdAt)}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {displayOffers.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded-lg shadow mt-4">
//           {/* Items per page selector */}
//           <div className="flex items-center gap-3">
//             <div className="text-xs text-gray-600">
//               Showing {startItem} to {endItem} of {totalItemsState} records
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
//             <div className="text-xs text-gray-600">
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

//       {/* Counter Offer Statistics */}
//       {displayOffers.length > 0 && (
//         <div className="mt-6 bg-white rounded-lg shadow border p-4">
//           <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//             <FaChartLine className="text-blue-600" />
//             Counter Offer Statistics
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//               <div className="text-xs text-blue-600 font-medium mb-1">Total Counter Offers</div>
//               <div className="text-xl font-bold">
//                 {displayOffers.filter(o => o.counterPrice || o.counterQuantity).length}
//               </div>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
//               <div className="text-xs text-purple-600 font-medium mb-1">Private Counter Offers</div>
//               <div className="text-xl font-bold">
//                 {displayOffers.filter(o => o.isCounterPrivate).length}
//               </div>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg border border-green-200">
//               <div className="text-xs text-green-600 font-medium mb-1">Counter Success Rate</div>
//               <div className="text-xl font-bold">
//                 {counterOffers > 0 
//                   ? `${Math.round((statusCounts.accepted / counterOffers) * 100)}%` 
//                   : '0%'}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bid Details Dialog */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4 pb-3 border-b">
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
//                 <FaGavel className="text-blue-600 flex-shrink-0" />
//                 <span className="truncate">Bid Details: {currentOffer?.offerId}</span>
//               </h2>
//               <p className="text-gray-600 text-sm truncate">Complete bid and counter offer information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
//               title="Close"
//             >
//               <FaTimes size={20} />
//             </button>
//           </div>

//           {currentOffer && (
//             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
//               {/* Bid Header */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaReceipt className="text-blue-600" />
//                     Offer Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Offer ID:</span>
//                       <span className="font-medium text-sm">{currentOffer.offerId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Product ID:</span>
//                       <span className="font-medium text-sm">{currentOffer.productId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Farmer ID:</span>
//                       <span className="font-medium text-sm">{currentOffer.farmerId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Status:</span>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(currentOffer.status)}`}>
//                         {formatStatus(currentOffer.status)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-green-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaUserTie className="text-green-600" />
//                     Trader Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader ID:</span>
//                       <span className="font-medium text-sm">{currentOffer.traderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader Name:</span>
//                       <span className="font-medium text-sm">{currentOffer.traderName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Created:</span>
//                       <span className="font-medium text-sm">{formatDateTime(currentOffer.createdAt)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Farmer Information Section */}
//               {currentOffer.farmerInfo && (
//                 <div className="bg-yellow-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaUserTag className="text-yellow-600" />
//                     Farmer Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Farmer ID:</span>
//                       <span className="font-medium text-sm">{currentOffer.farmerInfo.farmerId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Name:</span>
//                       <span className="font-medium text-sm">{currentOffer.farmerInfo.farmerName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Mobile:</span>
//                       <span className="font-medium text-sm">{currentOffer.farmerInfo.farmerMobile}</span>
//                     </div>
//                     {currentOffer.farmerInfo.farmerAddress && currentOffer.farmerInfo.farmerAddress !== 'N/A' && (
//                       <div>
//                         <div className="text-gray-600 text-sm mb-1">Address:</div>
//                         <div className="font-medium text-sm text-gray-900">
//                           {currentOffer.farmerInfo.farmerAddress}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Bid Amount Details */}
//               <div className="bg-gray-50 p-3 rounded">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FaMoneyBillWave className="text-purple-600" />
//                   Bid Amount Details
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <div className="text-center p-3 bg-white rounded border">
//                     <div className="text-xs text-gray-500 mb-1">Offered Price</div>
//                     <div className="text-lg font-bold text-gray-900">{formatCurrency(currentOffer.offeredPrice)}</div>
//                   </div>
//                   <div className="text-center p-3 bg-white rounded border">
//                     <div className="text-xs text-gray-500 mb-1">Quantity</div>
//                     <div className="text-lg font-bold text-gray-900">{currentOffer.quantity.toLocaleString()}</div>
//                   </div>
//                   <div className="text-center p-3 bg-white rounded border border-green-200">
//                     <div className="text-xs text-gray-500 mb-1">Total Value</div>
//                     <div className="text-lg font-bold text-green-600">
//                       {formatCurrency(currentOffer.offeredPrice * currentOffer.quantity)}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Counter Offer Details */}
//               {(currentOffer.counterPrice || currentOffer.counterQuantity) && (
//                 <div className="bg-indigo-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaHandshake className="text-indigo-600" />
//                     Counter Offer Details
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       <div className="bg-white p-3 rounded border border-blue-200">
//                         <div className="text-xs text-gray-500 mb-1">Counter Price</div>
//                         <div className="text-lg font-bold text-blue-600">{formatCurrency(currentOffer.counterPrice || 0)}</div>
//                       </div>
//                       <div className="bg-white p-3 rounded border border-blue-200">
//                         <div className="text-xs text-gray-500 mb-1">Counter Quantity</div>
//                         <div className="text-lg font-bold text-blue-600">{currentOffer.counterQuantity?.toLocaleString() || 0}</div>
//                       </div>
//                     </div>
                    
//                     {currentOffer.counterDate && (
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Counter Date</div>
//                         <div className="text-sm font-medium">{formatDateTime(currentOffer.counterDate)}</div>
//                       </div>
//                     )}
                    
//                     <div className={`text-sm font-medium ${currentOffer.isCounterPrivate ? 'text-purple-600' : 'text-gray-600'}`}>
//                       {currentOffer.isCounterPrivate ? 'Private Counter Offer' : 'Public Counter Offer'}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Additional Information */}
//               {(currentOffer.cropBriefDetails || currentOffer.grade || currentOffer.nearestMarket) && (
//                 <div className="bg-yellow-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaBox className="text-yellow-600" />
//                     Additional Information
//                   </h3>
//                   <div className="text-sm space-y-2">
//                     {currentOffer.cropBriefDetails && (
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Crop Details</div>
//                         <div>{currentOffer.cropBriefDetails}</div>
//                       </div>
//                     )}
//                     {currentOffer.grade && (
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Grade</div>
//                         <div>{currentOffer.grade}</div>
//                       </div>
//                     )}
//                     {currentOffer.nearestMarket && (
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Nearest Market</div>
//                         <div>{currentOffer.nearestMarket}</div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Dialog Footer */}
//           <div className="mt-4 pt-3 border-t flex justify-end">
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default TraderBidsReport;









"use client"

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
  FaShoppingCart,
  FaCalendarAlt,
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
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaReceipt,
  FaClipboardList,
  FaGlobe,
  FaCity,
  FaMapPin,
  FaTruck,
  FaUserTie,
  FaUserFriends,
  FaShippingFast,
  FaGavel,
  FaHandshake,
  FaMoneyBillWave,
  FaChartLine,
  FaUserTag,
  FaMobileAlt,
  FaHome
} from 'react-icons/fa';
import toast from 'react-hot-toast';

interface FarmerInfo {
  farmerId?: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerAddress?: string;
  farmerVillage?: string;
  farmerPincode?: string;
  farmerDistrict?: string;
}

interface Offer {
  // REQUIRED FIELDS:
  productId: string;
  farmerId: string;
  offerId: string;
  traderId: string;
  traderName: string;
  offeredPrice: number;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | string;
  counterPrice?: number;
  counterQuantity?: number;
  counterDate?: string;
  isCounterPrivate: boolean;
  createdAt: string;
  
  // Additional helpful fields:
  cropBriefDetails?: string;
  grade?: string;
  nearestMarket?: string;
  totalValue?: number;
  _id?: string;
  
  // Farmer info
  farmerInfo?: FarmerInfo;
}

interface ApiResponse {
  success: boolean;
  data: Offer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    totalOffers: number;
    totalValue: number;
    statusCounts: {
      pending: number;
      accepted: number;
      rejected: number;
      countered: number;
    };
  };
  error?: string;
  message?: string;
  debug?: any;
}

// Generate unique keys
const generateUniqueKey = (offer: Offer, index: number): string => {
  const baseId = offer._id || offer.offerId || `offer-${Date.now()}`;
  return `${baseId}-${index}`;
};

const TraderBidsReport: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [traderIdFilter, setTraderIdFilter] = useState<string>('');
  const [farmerIdFilter, setFarmerIdFilter] = useState<string>('');
  const [productIdFilter, setProductIdFilter] = useState<string>('');
  
  // Sorting states
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItemsState, setTotalItemsState] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  
  // Mobile view state
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  // Farmer details cache
  const [farmerDetailsCache, setFarmerDetailsCache] = useState<Record<string, FarmerInfo>>({});

  // FIX: Add separate state for total stats from API
  const [totalStats, setTotalStats] = useState({
    totalOffers: 0,
    totalValue: 0,
    statusCounts: {
      pending: 0,
      accepted: 0,
      rejected: 0,
      countered: 0
    },
    counterOffers: 0,
    privateCounters: 0
  });

  const API_BASE = '/api';
  const tableRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch farmer details
  const fetchFarmerDetails = useCallback(async (farmerId: string): Promise<FarmerInfo> => {
    if (farmerDetailsCache[farmerId]) {
      return farmerDetailsCache[farmerId];
    }

    try {
      const response = await axios.get(`${API_BASE}/farmers?search=${farmerId}`);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const farmerData = response.data.data[0];
        
        // Build address from personalInfo
        let address = '';
        if (farmerData.personalInfo?.address) {
          address = farmerData.personalInfo.address;
        }
        
        // Add village if available
        if (farmerData.personalInfo?.villageGramaPanchayat) {
          if (address) address += ', ';
          address += farmerData.personalInfo.villageGramaPanchayat;
        }
        
        // Add district if available
        if (farmerData.personalInfo?.district) {
          if (address) address += ', ';
          address += farmerData.personalInfo.district;
        }
        
        // Add pincode if available
        if (farmerData.personalInfo?.pincode) {
          if (address) address += ' - ';
          address += farmerData.personalInfo.pincode;
        }

        const farmerInfo: FarmerInfo = {
          farmerId: farmerData.farmerId,
          farmerName: farmerData.personalInfo?.name || 'N/A',
          farmerMobile: farmerData.personalInfo?.mobileNo || 'N/A',
          farmerAddress: address || 'N/A',
          farmerVillage: farmerData.personalInfo?.villageGramaPanchayat || 'N/A',
          farmerPincode: farmerData.personalInfo?.pincode || 'N/A',
          farmerDistrict: farmerData.personalInfo?.district || 'N/A'
        };
        
        // Update cache
        setFarmerDetailsCache(prev => ({
          ...prev,
          [farmerId]: farmerInfo
        }));
        
        return farmerInfo;
      }
    } catch (error) {
      console.error(`Error fetching farmer details for ${farmerId}:`, error);
    }
    
    // Return default if fetch fails
    return {
      farmerId,
      farmerName: 'Not Found',
      farmerMobile: 'N/A',
      farmerAddress: 'N/A'
    };
  }, [API_BASE, farmerDetailsCache]);

  // Fetch offers with server-side pagination and sorting - FIXED: Fetch total stats separately
  const fetchOffers = useCallback(async (isForExport = false) => {
    // Don't set loading for export calls
    if (!isForExport) {
      setLoading(true);
    }
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (statusFilter) params.append('status', statusFilter);
    if (traderIdFilter) params.append('traderId', traderIdFilter);
    if (farmerIdFilter) params.append('farmerId', farmerIdFilter);
    if (productIdFilter) params.append('productId', productIdFilter);
    
    // For export, get all data, for normal fetch, use pagination
    if (!isForExport) {
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
    } else {
      params.append('limit', '10000');
    }
    
    params.append('sortBy', sortField);
    params.append('order', sortOrder);

    try {
      const response = await axios.get(`${API_BASE}/trader-bids-reports?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        
        // Process offers and fetch farmer details
        const processedOffers = await Promise.all(
          data.map(async (offer: Offer) => {
            if (offer.farmerId) {
              const farmerInfo = await fetchFarmerDetails(offer.farmerId);
              return {
                ...offer,
                farmerInfo
              };
            }
            return offer;
          })
        );
        
        if (isForExport) {
          setAllOffers(processedOffers);
          return processedOffers;
        } else {
          setOffers(processedOffers);
          setTotalItemsState(response.data.pagination?.total || data.length);
          setTotalPages(response.data.pagination?.totalPages || 1);
          
          // FIX: Update total stats from API response if available
          if (response.data.summary) {
            setTotalStats({
              totalOffers: response.data.summary.totalOffers || 0,
              totalValue: response.data.summary.totalValue || 0,
              statusCounts: response.data.summary.statusCounts || {
                pending: 0,
                accepted: 0,
                rejected: 0,
                countered: 0
              },
              counterOffers: processedOffers.filter(o => o.counterPrice || o.counterQuantity).length,
              privateCounters: processedOffers.filter(o => o.isCounterPrivate).length
            });
          }
        }
      } else {
        if (!isForExport) {
          toast.error(response.data.error || 'Failed to fetch trader bids');
        }
      }
    } catch (error) {
      console.error('Error fetching trader bids:', error);
      if (!isForExport) {
        toast.error('Error fetching trader bids');
      }
    } finally {
      if (!isForExport) {
        setLoading(false);
      }
    }
    
    return [];
  }, [API_BASE, searchInput, statusFilter, traderIdFilter, farmerIdFilter, productIdFilter, currentPage, itemsPerPage, sortField, sortOrder, fetchFarmerDetails]);

  // Separate function to fetch total stats
  const fetchTotalStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchInput) params.append('search', searchInput);
      if (statusFilter) params.append('status', statusFilter);
      if (traderIdFilter) params.append('traderId', traderIdFilter);
      if (farmerIdFilter) params.append('farmerId', farmerIdFilter);
      if (productIdFilter) params.append('productId', productIdFilter);
      
      // Fetch with limit=1 just to get the summary/total counts
      params.append('limit', '1');
      params.append('page', '1');
      
      const response = await axios.get(`${API_BASE}/trader-bids-reports?${params.toString()}`);
      
      if (response.data.success && response.data.summary) {
        setTotalStats({
          totalOffers: response.data.summary.totalOffers || 0,
          totalValue: response.data.summary.totalValue || 0,
          statusCounts: response.data.summary.statusCounts || {
            pending: 0,
            accepted: 0,
            rejected: 0,
            countered: 0
          },
          counterOffers: 0, // Will be calculated from allOffers
          privateCounters: 0 // Will be calculated from allOffers
        });
      }
    } catch (error) {
      console.error('Error fetching total stats:', error);
    }
  }, [API_BASE, searchInput, statusFilter, traderIdFilter, farmerIdFilter, productIdFilter]);

  // Separate function to fetch export data
  const fetchExportData = useCallback(async () => {
    try {
      const exportData = await fetchOffers(true);
      setAllOffers(exportData);
      return exportData;
    } catch (error) {
      console.error('Error fetching export data:', error);
      return [];
    }
  }, [fetchOffers]);

  // Initial data fetch and when pagination/sorting changes
  useEffect(() => {
    fetchOffers();
  }, [currentPage, itemsPerPage, sortField, sortOrder]);

  // Fetch total stats when filters change (but not on pagination)
  useEffect(() => {
    fetchTotalStats();
  }, [searchInput, statusFilter, traderIdFilter, farmerIdFilter, productIdFilter, fetchTotalStats]);

  // Debounced search for filters - FIXED: Reset to page 1 when filters change
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      // FIX: Reset to page 1 when filters change
      setCurrentPage(1);
      fetchOffers();
      fetchTotalStats(); // Also refresh stats
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, statusFilter, traderIdFilter, farmerIdFilter, productIdFilter]);

  // Get unique traders for filter dropdown - use allOffers to get all traders
  const getUniqueTraders = useMemo(() => {
    // Temporarily use a mock or empty array if allOffers is empty
    const offersForFilter = allOffers.length > 0 ? allOffers : offers;
    const traders = offersForFilter
      .map(offer => ({ id: offer.traderId, name: offer.traderName }))
      .filter((trader, index, self) => 
        trader.id && 
        trader.id.trim() !== '' && 
        index === self.findIndex(t => t.id === trader.id)
      );
    return traders.sort((a, b) => a.name.localeCompare(b.name));
  }, [allOffers, offers]);

  // Get unique products for filter dropdown
  const getUniqueProducts = useMemo(() => {
    const offersForFilter = allOffers.length > 0 ? allOffers : offers;
    const products = offersForFilter
      .map(offer => offer.productId)
      .filter(productId => productId && productId.trim() !== '');
    return [...new Set(products)].sort();
  }, [allOffers, offers]);

  // Filter offers client-side as a fallback (in case API doesn't filter)
  const filteredOffers = useMemo(() => {
    let result = offers;
    
    // Apply client-side filtering if needed (as backup)
    if (statusFilter && statusFilter !== '') {
      result = result.filter(offer => 
        offer.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    if (searchInput && searchInput !== '') {
      const searchLower = searchInput.toLowerCase();
      result = result.filter(offer =>
        offer.traderName?.toLowerCase().includes(searchLower) ||
        offer.productId?.toLowerCase().includes(searchLower) ||
        offer.offerId?.toLowerCase().includes(searchLower) ||
        offer.farmerId?.toLowerCase().includes(searchLower) ||
        offer.traderId?.toLowerCase().includes(searchLower) ||
        offer.farmerInfo?.farmerName?.toLowerCase().includes(searchLower)
      );
    }
    
    if (traderIdFilter && traderIdFilter !== '') {
      result = result.filter(offer => 
        offer.traderId === traderIdFilter
      );
    }
    
    if (productIdFilter && productIdFilter !== '') {
      result = result.filter(offer => 
        offer.productId === productIdFilter
      );
    }
    
    if (farmerIdFilter && farmerIdFilter !== '') {
      result = result.filter(offer => 
        offer.farmerId === farmerIdFilter
      );
    }
    
    return result;
  }, [offers, statusFilter, searchInput, traderIdFilter, productIdFilter, farmerIdFilter]);

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
      return <FaSearch className="inline ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <FaChevronUp className="inline ml-1 text-blue-600" /> 
      : <FaChevronDown className="inline ml-1 text-blue-600" />;
  };

  // Handle page change - FIXED: Use the correct page value
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
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  // Calculate pagination range - use filteredOffers for display
  const getPaginationRange = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItemsState);
    return { startItem, endItem };
  };

  // Calculate stats - use totalStats from API instead of calculating from current page
  const calculateStats = () => {
    // Use totalStats from API for global counts
    const offersForCounterStats = allOffers.length > 0 ? allOffers : offers;
    const counterOffers = offersForCounterStats.filter(o => o.counterPrice || o.counterQuantity).length;
    const privateCounters = offersForCounterStats.filter(o => o.isCounterPrivate).length;
    
    return { 
      ...totalStats, 
      counterOffers, 
      privateCounters 
    };
  };

  const { totalOffers, totalValue, statusCounts, counterOffers, privateCounters } = calculateStats();
  const { startItem, endItem } = getPaginationRange();

  const handleCopyToClipboard = async (): Promise<void> => {
    let offersToExport = allOffers;
    
    // If allOffers is empty, fetch export data
    if (offersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      offersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (offersToExport.length === 0) {
      toast.error("No offers to copy");
      return;
    }

    // Define headers with widths for optimal display
    const headers = [
      { name: "Offer ID", width: 12 },
      { name: "Product", width: 10 },
      { name: "Trader", width: 18 },
      { name: "Price", width: 12 },
      { name: "Qty", width: 8 },
      { name: "Status", width: 14 },
      { name: "Counter", width: 15 },
      { name: "Date", width: 12 }
    ];
    
    // Create header row
    const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
    const separator = "─".repeat(headerRow.length);
    
    // Format each offer row
    const offerRows = offersToExport.map((offer: any) => {
      // Format trader info
      const traderInfo = `${offer.traderName || "N/A"} (${offer.traderId?.substring(0, 6) || "N/A"}...)`;
      const formattedTrader = traderInfo.length > 16 
        ? traderInfo.substring(0, 13) + "..." 
        : traderInfo;
      
      // Format price with ₹ symbol
      const formatPrice = (price: number) => 
        price ? `₹${price.toLocaleString('en-IN')}` : "N/A";
      
      const offeredPrice = formatPrice(offer.offeredPrice || 0);
      
      // Format status with emoji
      const status = offer.status || "N/A";
      const statusEmoji = status === "accepted" ? "✅" : 
                         status === "rejected" ? "❌" : 
                         status === "pending" ? "⏳" : 
                         status === "countered" ? "💰" : "";
      
      // Format counter offer info
      let counterInfo = "No Counter";
      if (offer.counterPrice || offer.counterQuantity) {
        const counterPrice = offer.counterPrice ? `₹${offer.counterPrice}` : "";
        const counterQty = offer.counterQuantity ? `${offer.counterQuantity}` : "";
        counterInfo = `${counterPrice} / ${counterQty}`.replace(/ \/ $/, "").replace(/^ \//, "");
      }
      
      // Create row values with padding
      const rowValues = [
        (offer.offerId?.substring(0, 10) || "N/A").padEnd(headers[0].width),
        (offer.productId?.substring(0, 8) || "N/A").padEnd(headers[1].width),
        formattedTrader.padEnd(headers[2].width),
        offeredPrice.padEnd(headers[3].width),
        (offer.quantity || 0).toString().padEnd(headers[4].width),
        `${statusEmoji} ${status}`.padEnd(headers[5].width),
        counterInfo.padEnd(headers[6].width),
        (offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : "N/A").padEnd(headers[7].width)
      ];
      
      return rowValues.join(" │ ");
    });
    
    // Calculate statistics
    const stats = offersToExport.reduce((acc: any, offer: any) => {
      acc.totalValue += (offer.offeredPrice || 0) * (offer.quantity || 0);
      acc.totalQuantity += offer.quantity || 0;
      acc.statusCounts[offer.status] = (acc.statusCounts[offer.status] || 0) + 1;
      acc.hasCounter += (offer.counterPrice || offer.counterQuantity) ? 1 : 0;
      return acc;
    }, {
      totalValue: 0,
      totalQuantity: 0,
      statusCounts: {},
      hasCounter: 0
    });
    
    // Build complete table with analytics
    const tableContent = [
      "💰 OFFERS & COUNTER-OFFERS",
      "=".repeat(headerRow.length),
      headerRow,
      separator,
      ...offerRows,
      separator,
      "",
      "📊 OFFER ANALYTICS",
      `• Total Offers: ${offersToExport.length}`,
      `• Total Quantity Offered: ${stats.totalQuantity.toLocaleString('en-IN')}`,
      `• Total Offer Value: ₹${stats.totalValue.toLocaleString('en-IN')}`,
      `• Average Price per Unit: ₹${stats.totalQuantity > 0 ? (stats.totalValue / stats.totalQuantity).toFixed(2) : 0}`,
      "",
      "📈 STATUS DISTRIBUTION",
      ...Object.entries(stats.statusCounts).map(([status, count]: [string, any]) => 
        `• ${status}: ${count} (${Math.round((count / offersToExport.length) * 100)}%)`
      ),
      "",
      "💱 COUNTER OFFER STATS",
      `• Offers with Counter: ${stats.hasCounter}`,
      `• Counter Rate: ${Math.round((stats.hasCounter / offersToExport.length) * 100)}%`,
      `• Without Counter: ${offersToExport.length - stats.hasCounter}`,
      "",
      "🔍 DATA SOURCE",
      `• Source: ${filteredOffers.length > 0 ? 'Filtered Results' : 'All Offers'}`,
      `• Farmers: ${new Set(offersToExport.map((o: any) => o.farmerId)).size}`,
      `• Products: ${new Set(offersToExport.map((o: any) => o.productId)).size}`,
      `• Traders: ${new Set(offersToExport.map((o: any) => o.traderId)).size}`,
      "",
      `📅 Report Generated: ${new Date().toLocaleString()}`
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success(`Copied ${offersToExport.length} offers to clipboard!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = async () => {
    let offersToExport = allOffers;
    
    // If allOffers is empty, fetch export data
    if (offersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      offersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (offersToExport.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = offersToExport.map((offer) => {
      const totalValue = (offer.offeredPrice || 0) * (offer.quantity || 0);
      return {
        "Product ID": offer.productId,
        "Farmer ID": offer.farmerId,
        "Farmer Name": offer.farmerInfo?.farmerName || 'N/A',
        "Farmer Mobile": offer.farmerInfo?.farmerMobile || 'N/A',
        "Farmer Address": offer.farmerInfo?.farmerAddress || 'N/A',
        "Offer ID": offer.offerId,
        "Trader ID": offer.traderId,
        "Trader Name": offer.traderName,
        "Offered Price": offer.offeredPrice,
        "Quantity": offer.quantity,
        "Total Value": totalValue,
        "Status": offer.status,
        "Counter Price": offer.counterPrice || '',
        "Counter Quantity": offer.counterQuantity || '',
        "Counter Date": offer.counterDate || '',
        "Is Counter Private": offer.isCounterPrivate ? 'Yes' : 'No',
        "Crop Details": offer.cropBriefDetails || '',
        "Grade": offer.grade || '',
        "Nearest Market": offer.nearestMarket || '',
        "Created At": new Date(offer.createdAt).toLocaleString(),
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Trader Bids Report");
    writeFile(wb, `trader-bids-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = async () => {
    let offersToExport = allOffers;
    
    // If allOffers is empty, fetch export data
    if (offersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      offersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (offersToExport.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const headers = ["Product ID", "Trader Name", "Farmer Name", "Offered Price", "Quantity", "Status", "Counter Price", "Date"];
    
    const csvContent = [
      headers.join(","),
      ...offersToExport.map((offer) => {
        return [
          `"${offer.productId}"`,
          `"${offer.traderName}"`,
          `"${offer.farmerInfo?.farmerName || 'N/A'}"`,
          offer.offeredPrice,
          offer.quantity,
          `"${offer.status}"`,
          offer.counterPrice || '',
          `"${new Date(offer.createdAt).toLocaleDateString()}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `trader-bids-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = async () => {
    let offersToExport = allOffers;
    
    // If allOffers is empty, fetch export data
    if (offersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      offersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (offersToExport.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const doc = new jsPDF('landscape');
    doc.text("Trader Bids Report", 14, 16);
    
    const tableColumn = ["Product ID", "Trader", "Farmer", "Price", "Quantity", "Total", "Status", "Counter", "Date"];
    const tableRows: any = offersToExport.map((offer) => {
      const total = (offer.offeredPrice || 0) * (offer.quantity || 0);
      return [
        offer.productId,
        offer.traderName,
        offer.farmerInfo?.farmerName || 'N/A',
        `₹${offer.offeredPrice.toLocaleString()}`,
        offer.quantity.toLocaleString(),
        `₹${total.toLocaleString()}`,
        offer.status,
        offer.counterPrice ? `₹${offer.counterPrice.toLocaleString()}` : 'None',
        new Date(offer.createdAt).toLocaleDateString()
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`trader-bids-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = async () => {
    let offersToExport = allOffers;
    
    // If allOffers is empty, fetch export data
    if (offersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      offersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (offersToExport.length === 0) {
      toast.error("No data to print");
      return;
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Trader Bids Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .status-pending { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-accepted { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-rejected { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-countered { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .farmer-info { background-color: #f0fdf4; padding: 8px; border-radius: 6px; margin: 5px 0; }
          .farmer-label { font-weight: bold; color: #166534; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Trader Bids Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Bids: ${offersToExport.length}</p>
        <p>Status Filter: ${statusFilter || 'All'}</p>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Trader</th>
              <th>Farmer</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Counter Offer</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${offersToExport.map((offer) => {
              const total = (offer.offeredPrice || 0) * (offer.quantity || 0);
              const statusClass = `status-${offer.status}`;
              const counterInfo = offer.counterPrice 
                ? `₹${offer.counterPrice.toLocaleString()} (${offer.counterQuantity || 0} units)`
                : 'None';
              return `
                <tr>
                  <td>${offer.productId}</td>
                  <td>${offer.traderName}<br><small>ID: ${offer.traderId}</small></td>
                  <td>
                    ${offer.farmerInfo ? `
                      <div class="farmer-info">
                        <div><span class="farmer-label">Name:</span> ${offer.farmerInfo.farmerName}</div>
                        <div><span class="farmer-label">ID:</span> ${offer.farmerInfo.farmerId}</div>
                        <div><span class="farmer-label">Mobile:</span> ${offer.farmerInfo.farmerMobile}</div>
                        <div><span class="farmer-label">Address:</span> ${offer.farmerInfo.farmerAddress}</div>
                      </div>
                    ` : offer.farmerId}
                  </td>
                  <td>₹${offer.offeredPrice.toLocaleString()}</td>
                  <td>${offer.quantity.toLocaleString()}</td>
                  <td>₹${total.toLocaleString()}</td>
                  <td><span class="${statusClass}">${offer.status.toUpperCase()}</span></td>
                  <td>${counterInfo}</td>
                  <td>${new Date(offer.createdAt).toLocaleDateString()}</td>
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
    toast.success("Printing trader bids report...");
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'countered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.replace(/\b\w/g, l => l.toUpperCase());
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

  // Open details dialog
  const openDetailsDialog = (offer: Offer) => {
    setCurrentOffer(offer);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setTraderIdFilter('');
    setFarmerIdFilter('');
    setProductIdFilter('');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    fetchOffers();
    fetchTotalStats();
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchOffers();
    fetchTotalStats();
  };

  if (loading && offers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trader bids...</p>
        </div>
      </div>
    );
  }

  // Use filteredOffers for display in the table
  const displayOffers = filteredOffers;

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaGavel className="text-blue-600" />
          Traders Bids Report
        </h1>
        <p className="text-gray-600 mt-1">Track all trader bids placed on crops with counter offers and status</p>
      </div>

      {/* Export Buttons - Desktop */}
      <div className="hidden lg:flex justify-end flex-wrap gap-2 mb-4">
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
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium text-sm`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Export Buttons - Mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-4">
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
            className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Stats Cards - FIXED: Now showing total from database, not just current page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Bids</p>
              <p className="text-xl font-bold text-gray-900">{totalOffers}</p>
              <p className="text-xs text-gray-400 mt-1">Showing {displayOffers.length} on this page</p>
            </div>
            <FaGavel className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <FaMoneyBillWave className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Pending</p>
              <p className="text-xl font-bold text-gray-900">{statusCounts.pending}</p>
            </div>
            <FaClipboardList className="text-yellow-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Accepted</p>
              <p className="text-xl font-bold text-gray-900">{statusCounts.accepted}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Counter Offers</p>
              <p className="text-xl font-bold text-gray-900">{counterOffers}</p>
            </div>
            <FaHandshake className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Private Counters</p>
              <p className="text-xl font-bold text-gray-900">{privateCounters}</p>
            </div>
            <FaUser className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow mb-4 p-3">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        </div>
        
        {/* Main Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Search by trader name, product ID, farmer name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaClipboardList className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when status changes
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="countered">Countered</option>
            </select>
          </div>

          {/* Trader ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserTie className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={traderIdFilter}
              onChange={(e) => setTraderIdFilter(e.target.value)}
            >
              <option value="">All Traders</option>
              {getUniqueTraders.map((trader) => (
                <option key={trader.id} value={trader.id}>
                  {trader.name} ({trader.id})
                </option>
              ))}
            </select>
          </div>

          {/* Product ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBox className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={productIdFilter}
              onChange={(e) => setProductIdFilter(e.target.value)}
            >
              <option value="">All Products</option>
              {getUniqueProducts.map((productId) => (
                <option key={productId} value={productId}>
                  {productId}
                </option>
              ))}
            </select>
          </div>

          {/* Farmer ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserFriends className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Farmer ID"
              value={farmerIdFilter}
              onChange={(e) => setFarmerIdFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className="w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            <FaSearch />
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="w-fit flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
          >
            <FaSync />
            Reset All
          </button>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('offerId')}
                >
                  Offer ID {getSortIcon('offerId')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('productId')}
                >
                  Product Details {getSortIcon('productId')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Trader Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Farmer Details
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('offeredPrice')}
                >
                  Bid Details {getSortIcon('offeredPrice')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Counter Offer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('createdAt')}
                >
                  Date {getSortIcon('createdAt')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayOffers.map((offer, index) => {
                const totalValue = (offer.offeredPrice || 0) * (offer.quantity || 0);
                
                return (
                  <tr key={generateUniqueKey(offer, index)} className="hover:bg-gray-50 transition-colors">
                    {/* Offer ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{offer.offerId}</div>
                      <div className="text-xs text-gray-500">Farmer ID: {offer.farmerId}</div>
                    </td>

                    {/* Product Details */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBox className="text-gray-400 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">Product ID: {offer.productId}</div>
                          {offer.cropBriefDetails && (
                            <div className="text-xs text-gray-500 truncate">{offer.cropBriefDetails}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Trader Details */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{offer.traderName}</div>
                          <div className="text-xs text-gray-500 truncate">{offer.traderId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Farmer Details */}
                    <td className="px-4 py-3">
                      {offer.farmerInfo ? (
                        <div className="space-y-1 min-w-0">
                          {/* Farmer ID and Name */}
                          <div className="flex items-center">
                            <FaUserTag className="text-green-500 mr-2 flex-shrink-0 text-xs" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {offer.farmerInfo.farmerName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                ID: {offer.farmerInfo.farmerId}
                              </div>
                            </div>
                          </div>
                          
                          {/* Mobile Number */}
                          {offer.farmerInfo.farmerMobile !== 'N/A' && (
                            <div className="flex items-center text-xs text-gray-600 ml-6">
                              <FaMobileAlt className="mr-1 flex-shrink-0" />
                              <span className="truncate">{offer.farmerInfo.farmerMobile}</span>
                            </div>
                          )}
                          
                          {/* Address */}
                          {offer.farmerInfo.farmerAddress !== 'N/A' && offer.farmerInfo.farmerAddress !== '' && (
                            <div className="flex items-start text-xs text-gray-600 ml-6">
                              <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
                              <span className="truncate">{offer.farmerInfo.farmerAddress}</span>
                            </div>
                          )}
                          
                          {/* Show when no address is available */}
                          {(offer.farmerInfo.farmerAddress === 'N/A' || offer.farmerInfo.farmerAddress === '') && (
                            <div className="flex items-center text-xs text-gray-400 italic ml-6">
                              <FaHome className="mr-1 flex-shrink-0" />
                              <span>No address available</span>
                            </div>
                          )}
                        </div>
                      ) : offer.farmerId ? (
                        <div className="text-xs text-gray-500 italic">
                          Loading farmer details...
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">
                          No farmer assigned
                        </div>
                      )}
                    </td>

                    {/* Bid Details */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Price:</span>
                          <span className="text-sm font-bold">{formatCurrency(offer.offeredPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Quantity:</span>
                          <span className="text-sm font-bold">{offer.quantity.toLocaleString()}</span>
                        </div>
                        <div className="pt-1 border-t">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Total:</span>
                            <span className="text-sm font-bold text-green-600">{formatCurrency(totalValue)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Counter Offer */}
                    <td className="px-4 py-3">
                      {offer.counterPrice || offer.counterQuantity ? (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Price:</span>
                            <span className="text-sm font-bold text-blue-600">{formatCurrency(offer.counterPrice || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Qty:</span>
                            <span className="text-sm font-bold text-blue-600">{offer.counterQuantity?.toLocaleString() || 0}</span>
                          </div>
                          {offer.isCounterPrivate && (
                            <div className="text-xs text-purple-600">Private</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">None</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(offer.status)}`}>
                        {formatStatus(offer.status)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(offer.createdAt)}</div>
                        </div>
                      </div>
                    </td>

                    {/* Actions - View Details */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => openDetailsDialog(offer)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Bid Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No Data State */}
        {displayOffers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <FaGavel className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trader bids found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-3">
        {displayOffers.map((offer, index) => {
          const totalValue = (offer.offeredPrice || 0) * (offer.quantity || 0);
          
          return (
            <div key={generateUniqueKey(offer, index)} className="bg-white rounded-lg shadow p-3">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-blue-600 text-sm truncate">{offer.offerId}</div>
                  <div className="text-xs text-gray-500 truncate">{offer.productId}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openDetailsDialog(offer)}
                    className="text-blue-600 p-1"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => setExpandedOffer(
                      expandedOffer === offer.offerId 
                        ? null 
                        : offer.offerId
                    )}
                    className="text-gray-500 p-1"
                    title={expandedOffer === offer.offerId ? "Collapse" : "Expand"}
                  >
                    {expandedOffer === offer.offerId ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Farmer Info in Mobile View */}
              {offer.farmerInfo && (
                <div className="mb-2 p-2 bg-gray-50 rounded border-l-2 border-green-500">
                  <div className="text-xs text-gray-500 mb-1">Farmer Details</div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <FaUserTag className="text-green-500 mr-2 text-xs flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{offer.farmerInfo.farmerName}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {offer.farmerInfo.farmerId}</div>
                      </div>
                    </div>
                    {offer.farmerInfo.farmerMobile !== 'N/A' && (
                      <div className="flex items-center text-xs text-gray-600 ml-6">
                        <FaMobileAlt className="mr-1 flex-shrink-0" />
                        <span className="truncate">{offer.farmerInfo.farmerMobile}</span>
                      </div>
                    )}
                    {offer.farmerInfo.farmerAddress !== 'N/A' && offer.farmerInfo.farmerAddress !== '' && (
                      <div className="flex items-start text-xs text-gray-600 ml-6">
                        <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{offer.farmerInfo.farmerAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="truncate">
                  <div className="text-xs text-gray-500">Trader</div>
                  <div className="font-medium text-xs truncate">{offer.traderName}</div>
                  <div className="text-xs text-gray-500 truncate">ID: {offer.traderId}</div>
                </div>
                <div className="truncate">
                  <div className="text-xs text-gray-500">Total Value</div>
                  <div className="font-bold text-sm truncate">{formatCurrency(totalValue)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="truncate">
                  <div className="text-xs text-gray-500">Price × Qty</div>
                  <div className="font-medium text-xs truncate">
                    {formatCurrency(offer.offeredPrice)} × {offer.quantity}
                  </div>
                </div>
                <div className="truncate">
                  <div className="text-xs text-gray-500">Status</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(offer.status)} truncate`}>
                    {formatStatus(offer.status)}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOffer === offer.offerId && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {/* Farmer Details in Expanded View */}
                  {offer.farmerInfo && (
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-xs text-gray-500 mb-2">Farmer Information</div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-600">Name</div>
                            <div className="text-sm font-medium">{offer.farmerInfo.farmerName}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">ID</div>
                            <div className="text-sm font-medium">{offer.farmerInfo.farmerId}</div>
                          </div>
                        </div>
                        {offer.farmerInfo.farmerMobile !== 'N/A' && (
                          <div>
                            <div className="text-xs text-gray-600">Mobile</div>
                            <div className="text-sm font-medium">{offer.farmerInfo.farmerMobile}</div>
                          </div>
                        )}
                        {offer.farmerInfo.farmerAddress !== 'N/A' && offer.farmerInfo.farmerAddress !== '' && (
                          <div>
                            <div className="text-xs text-gray-600">Address</div>
                            <div className="text-sm font-medium">{offer.farmerInfo.farmerAddress}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Counter Offer Details */}
                  {(offer.counterPrice || offer.counterQuantity) && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Counter Offer</div>
                      <div className="space-y-2 bg-blue-50 p-2 rounded">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-600">Counter Price</div>
                            <div className="text-sm font-bold text-blue-600">{formatCurrency(offer.counterPrice || 0)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Counter Qty</div>
                            <div className="text-sm font-bold text-blue-600">{offer.counterQuantity || 0}</div>
                          </div>
                        </div>
                        {offer.counterDate && (
                          <div>
                            <div className="text-xs text-gray-600">Counter Date</div>
                            <div className="text-xs">{formatDate(offer.counterDate)}</div>
                          </div>
                        )}
                        {offer.isCounterPrivate && (
                          <div className="text-xs text-purple-600 font-medium">
                            Private Counter Offer
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  {(offer.cropBriefDetails || offer.grade) && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Additional Details</div>
                      <div className="text-xs space-y-1">
                        {offer.cropBriefDetails && (
                          <div className="truncate">{offer.cropBriefDetails}</div>
                        )}
                        {offer.grade && (
                          <div>Grade: {offer.grade}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500 mb-1">Created</div>
                    <div className="text-xs">{formatDateTime(offer.createdAt)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination and Limit Controls */}
      {displayOffers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded-lg shadow mt-4">
          {/* Items per page selector */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">
              Showing {startItem} to {endItem} of {totalItemsState} records
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

          {/* Pagination component - FIXED: Using correct page value */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs text-gray-600">
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

      {/* Counter Offer Statistics */}
      {displayOffers.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow border p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FaChartLine className="text-blue-600" />
            Counter Offer Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Total Counter Offers</div>
              <div className="text-xl font-bold">
                {displayOffers.filter(o => o.counterPrice || o.counterQuantity).length}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-medium mb-1">Private Counter Offers</div>
              <div className="text-xl font-bold">
                {displayOffers.filter(o => o.isCounterPrivate).length}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium mb-1">Counter Success Rate</div>
              <div className="text-xl font-bold">
                {counterOffers > 0 
                  ? `${Math.round((statusCounts.accepted / counterOffers) * 100)}%` 
                  : '0%'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
                <FaGavel className="text-blue-600 flex-shrink-0" />
                <span className="truncate">Bid Details: {currentOffer?.offerId}</span>
              </h2>
              <p className="text-gray-600 text-sm truncate">Complete bid and counter offer information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {currentOffer && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Bid Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaReceipt className="text-blue-600" />
                    Offer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Offer ID:</span>
                      <span className="font-medium text-sm">{currentOffer.offerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Product ID:</span>
                      <span className="font-medium text-sm">{currentOffer.productId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Farmer ID:</span>
                      <span className="font-medium text-sm">{currentOffer.farmerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(currentOffer.status)}`}>
                        {formatStatus(currentOffer.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaUserTie className="text-green-600" />
                    Trader Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader ID:</span>
                      <span className="font-medium text-sm">{currentOffer.traderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader Name:</span>
                      <span className="font-medium text-sm">{currentOffer.traderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Created:</span>
                      <span className="font-medium text-sm">{formatDateTime(currentOffer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Information Section */}
              {currentOffer.farmerInfo && (
                <div className="bg-yellow-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaUserTag className="text-yellow-600" />
                    Farmer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Farmer ID:</span>
                      <span className="font-medium text-sm">{currentOffer.farmerInfo.farmerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Name:</span>
                      <span className="font-medium text-sm">{currentOffer.farmerInfo.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Mobile:</span>
                      <span className="font-medium text-sm">{currentOffer.farmerInfo.farmerMobile}</span>
                    </div>
                    {currentOffer.farmerInfo.farmerAddress && currentOffer.farmerInfo.farmerAddress !== 'N/A' && (
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Address:</div>
                        <div className="font-medium text-sm text-gray-900">
                          {currentOffer.farmerInfo.farmerAddress}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bid Amount Details */}
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-purple-600" />
                  Bid Amount Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-1">Offered Price</div>
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(currentOffer.offeredPrice)}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-1">Quantity</div>
                    <div className="text-lg font-bold text-gray-900">{currentOffer.quantity.toLocaleString()}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border border-green-200">
                    <div className="text-xs text-gray-500 mb-1">Total Value</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(currentOffer.offeredPrice * currentOffer.quantity)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Counter Offer Details */}
              {(currentOffer.counterPrice || currentOffer.counterQuantity) && (
                <div className="bg-indigo-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaHandshake className="text-indigo-600" />
                    Counter Offer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="text-xs text-gray-500 mb-1">Counter Price</div>
                        <div className="text-lg font-bold text-blue-600">{formatCurrency(currentOffer.counterPrice || 0)}</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="text-xs text-gray-500 mb-1">Counter Quantity</div>
                        <div className="text-lg font-bold text-blue-600">{currentOffer.counterQuantity?.toLocaleString() || 0}</div>
                      </div>
                    </div>
                    
                    {currentOffer.counterDate && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Counter Date</div>
                        <div className="text-sm font-medium">{formatDateTime(currentOffer.counterDate)}</div>
                      </div>
                    )}
                    
                    <div className={`text-sm font-medium ${currentOffer.isCounterPrivate ? 'text-purple-600' : 'text-gray-600'}`}>
                      {currentOffer.isCounterPrivate ? 'Private Counter Offer' : 'Public Counter Offer'}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(currentOffer.cropBriefDetails || currentOffer.grade || currentOffer.nearestMarket) && (
                <div className="bg-yellow-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaBox className="text-yellow-600" />
                    Additional Information
                  </h3>
                  <div className="text-sm space-y-2">
                    {currentOffer.cropBriefDetails && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Crop Details</div>
                        <div>{currentOffer.cropBriefDetails}</div>
                      </div>
                    )}
                    {currentOffer.grade && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Grade</div>
                        <div>{currentOffer.grade}</div>
                      </div>
                    )}
                    {currentOffer.nearestMarket && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Nearest Market</div>
                        <div>{currentOffer.nearestMarket}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dialog Footer */}
          <div className="mt-4 pt-3 border-t flex justify-end">
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TraderBidsReport;