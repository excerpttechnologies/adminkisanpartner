




'use client';

import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  DocumentTextIcon, 
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon as DownloadIcon,
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ReportData {
  _id: string;
  productId: string;
  farmerId: string;
  traderId: string;
  traderName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  purchaseType: 'direct' | 'offer_accepted';
  paymentStatus: 'pending' | 'paid';
  purchaseDate: string;
  orderCreated: boolean;
  orderId: string | null;
  grade: string;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Filters {
  search: string;
  paymentStatus: string;
  purchaseType: string;
  dateFrom: string;
  dateTo: string;
}

export default function FarmerAcceptReport() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [limit, setLimit] = useState(10);
  const [stats, setStats] = useState({
    totalAcceptedOffers: 0,
    totalQuantity: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    paymentStatus: 'all',
    purchaseType: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for view modal
  const [selectedItem, setSelectedItem] = useState<ReportData | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchReportData(pagination.currentPage, limit);
  }, [pagination.currentPage, limit]);

  const fetchReportData = async (page: number, limit: number) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
      if (filters.purchaseType !== 'all') params.append('purchaseType', filters.purchaseType);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/farmer-accept-report?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReportData(data.data);
        setPagination(data.pagination);
        calculateStats(data.data);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch report data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  // View functionality
  const handleViewDetails = (item: ReportData) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedItem(null);
  };

  const calculateStats = (data: ReportData[]) => {
    const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
    const paidAmount = data
      .filter(item => item.paymentStatus === 'paid')
      .reduce((sum, item) => sum + item.totalAmount, 0);
    const pendingAmount = data
      .filter(item => item.paymentStatus === 'pending')
      .reduce((sum, item) => sum + item.totalAmount, 0);

    setStats({
      totalAcceptedOffers: data.length,
      totalQuantity,
      totalAmount,
      paidAmount,
      pendingAmount
    });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchReportData(1, limit);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      paymentStatus: 'all',
      purchaseType: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setTimeout(() => fetchReportData(1, limit), 100);
  };

  const exportToCSV = () => {
    const headers = [
      'Product ID',
      'Farmer ID',
      'Trader ID',
      'Trader Name',
      'Quantity',
      'Price Per Unit',
      'Total Amount',
      'Purchase Type',
      'Payment Status',
      'Purchase Date',
      'Order Created',
      'Order ID',
      'Grade'
    ];

    const csvData = reportData.map(item => [
      item.productId,
      item.farmerId,
      item.traderId,
      `"${item.traderName}"`,
      item.quantity,
      item.pricePerUnit,
      item.totalAmount,
      item.purchaseType,
      item.paymentStatus,
      new Date(item.purchaseDate).toLocaleDateString('en-CA'),
      item.orderCreated ? 'Yes' : 'No',
      item.orderId || 'N/A',
      item.grade
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmer-accept-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offer_accepted': return 'text-purple-700 bg-purple-100';
      case 'direct': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading && reportData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Products</span>
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">Farmer Accept Offer Report</h1>
              </div>
              <p className="text-gray-600 mt-2">
                Report of all offers accepted by farmers and converted to purchases
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="h-5 w-5" />
                <span className="font-medium">Filters</span>
                {Object.values(filters).some(f => f !== '' && f !== 'all') && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Active
                  </span>
                )}
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="h-5 w-5" />
                <span className="font-medium">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by ID, name..."
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Type
                </label>
                <select
                  name="purchaseType"
                  value={filters.purchaseType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="offer_accepted">Offer Accepted</option>
                  <option value="direct">Direct Purchase</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading report</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => fetchReportData(pagination.currentPage, limit)}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Offers</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalAcceptedOffers}</p>
            <p className="text-xs text-gray-500 mt-1">Accepted offers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Quantity</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalQuantity.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Units sold</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Gross sales</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Received payments</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr 
                    key={item._id || index} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                            <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.productId}</p>
                            <p className="text-sm text-gray-500">Farmer: {item.farmerId}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            {item.grade}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.traderName}</p>
                        <p className="text-sm text-gray-500">ID: {item.traderId}</p>
                        <div className="mt-2">
                          <p className="text-sm">
                            <span className="font-medium">Quantity:</span> {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ₹{item.pricePerUnit.toLocaleString()}/unit
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(item.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.quantity} × ₹{item.pricePerUnit.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.paymentStatus)}`}>
                          {item.paymentStatus === 'paid' ? (
                            <>
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Paid
                            </>
                          ) : 'Pending'}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.purchaseType)}`}>
                          {item.purchaseType === 'offer_accepted' ? 'Offer Accepted' : 'Direct'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.orderCreated 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.orderCreated ? 'Order Created' : 'No Order'}
                        </div>
                        {item.orderId && (
                          <p className="mt-2 text-xs text-gray-600 break-all max-w-xs">
                            Order ID: <span className="font-mono">{item.orderId}</span>
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(item.purchaseDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {reportData.length === 0 && !loading && (
            <div className="py-12 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No accepted offers found</h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                {Object.values(filters).some(f => f !== '' && f !== 'all')
                  ? 'No results match your current filters. Try adjusting your search criteria.'
                  : 'There are no offers accepted by farmers at the moment.'}
              </p>
              {Object.values(filters).some(f => f !== '' && f !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {reportData.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>

                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.currentPage - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * limit, pagination.totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalCount}</span> entries
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`p-2 rounded-md transition-colors ${
                      pagination.hasPrevPage
                        ? 'hover:bg-gray-200 text-gray-700'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          pagination.currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`p-2 rounded-md transition-colors ${
                      pagination.hasNextPage
                        ? 'hover:bg-gray-200 text-gray-700'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Details Modal */}
        {showViewModal && selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={closeViewModal}
              ></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <EyeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Transaction Details
                      </h3>
                      
                      <div className="mt-6 space-y-4">
                        {/* Product Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Product ID</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem.productId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Farmer ID</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem.farmerId}</p>
                          </div>
                        </div>

                        {/* Trader Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Trader Name</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem.traderName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Trader ID</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem.traderId}</p>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Transaction Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Quantity</p>
                              <p className="mt-1 text-sm text-gray-900">{selectedItem.quantity} units</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Price per Unit</p>
                              <p className="mt-1 text-sm text-gray-900">₹{selectedItem.pricePerUnit}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Total Amount</p>
                              <p className="mt-1 text-lg font-bold text-green-600">
                                {formatCurrency(selectedItem.totalAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Grade</p>
                              <span className="mt-1 inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                {selectedItem.grade}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Status Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Payment Status</p>
                              <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.paymentStatus)}`}>
                                {selectedItem.paymentStatus === 'paid' ? (
                                  <>
                                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                                    Paid
                                  </>
                                ) : 'Pending'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Purchase Type</p>
                              <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedItem.purchaseType)}`}>
                                {selectedItem.purchaseType === 'offer_accepted' ? 'Offer Accepted' : 'Direct'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Order Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Order Created</p>
                              <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                selectedItem.orderCreated 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {selectedItem.orderCreated ? 'Yes' : 'No'}
                              </div>
                            </div>
                            {selectedItem.orderId && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">Order ID</p>
                                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedItem.orderId}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Timestamps</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                              <p className="mt-1 text-sm text-gray-900">{formatDate(selectedItem.purchaseDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Record Created</p>
                              <p className="mt-1 text-sm text-gray-900">{formatDate(selectedItem.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={closeViewModal}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={closeViewModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && reportData.length > 0 && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}