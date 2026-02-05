'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { getAdminSessionAction } from '@/app/actions/auth-actions';

interface AdminSession {
  _id: string;
  email: string;
  role: string;
  taluka?: string; // Optional for admin, required for subadmin
  district?: string;
  name?: string;
}

interface Notification {
  _id: string;
  type: 'offer' | 'order_created' | 'trader_payment' | 'farmer_payment' | 'transporter_update';
  // Offer fields
  offerId?: string;
  productId?: string;
  productName?: string;
  productCode?: string;
  gradeId?: string;
  gradeName?: string;
  offeredPrice?: number;
  quantity?: number;
  counterPrice?: number;
  counterQuantity?: number;
  counterDate?: string;
  status?: string;
  unitMeasurement?: string;
  categoryName?: string;
  subCategoryName?: string;
  nearestMarket?: string;
  deliveryDate?: string;
  totalAmount?: number;
  // Order fields
  orderId?: string;
  orderObjectId?: string;
  orderStatus?: string;
  transporterStatus?: string;
  traderAcceptedStatus?: boolean;
  farmerAcceptedStatus?: boolean;
  // Payment fields
  paymentId?: string;
  amount?: number;
  paidDate?: string;
  paymentStatus?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  // Common fields
  traderId?: string;
  traderName?: string;
  farmerId?: string;
  farmerName?: string;
  message?: string;
  createdAt: string;
  transporterDetails?: any;
  
  // Added fields for taluk information
  farmerTaluk?: string;
  traderTaluk?: string;
}

// Interface for farmer/trader details
interface UserDetails {
  _id: string;
  farmerId?: string;
  traderId?: string;
  personalInfo?: {
    taluk: string;
    name: string;
    mobileNo: string;
    email: string;
  };
  taluk?: string; // For trader compatibility
  name?: string; // For trader compatibility
  mobile?: string; // For trader compatibility
  email?: string; // For trader compatibility
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'offers' | 'orders' | 'payments' | 'transporter'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [session, setSession] = useState<AdminSession | null>(null);
  const router = useRouter();

  // Fetch session on component mount
  useEffect(() => {
    fetchSession();
  }, []);

  // Fetch notifications when session is available
  useEffect(() => {
    if (session) {
      fetchNotifications();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchSession = async () => {
    try {
      const sessionData = await getAdminSessionAction();
      if (!sessionData) {
        router.push('/admin/login');
        return;
      }
      setSession(sessionData?.admin as AdminSession);
    } catch (err: any) {
      setError('Failed to fetch session');
      router.push('/admin/login');
    }
  };

  // Fetch farmer details by ID
  const fetchFarmerDetails = async (farmerId: string): Promise<UserDetails | null> => {
    if (!farmerId || farmerId === 'undefined') return null;
    
    try {
      const response = await fetch(`/api/farmers?search=${farmerId}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const farmerData = data.data[0];
        return {
          _id: farmerData._id || farmerId,
          farmerId: farmerData.farmerId || farmerId,
          personalInfo: farmerData.personalInfo ? {
            taluk: farmerData.personalInfo.taluk || '',
            name: farmerData.personalInfo.name || '',
            mobileNo: farmerData.personalInfo.mobileNo || '',
            email: farmerData.personalInfo.email || ''
          } : undefined
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching farmer details:', error);
      return null;
    }
  };

  // Fetch trader details by ID
  const fetchTraderDetails = async (traderId: string): Promise<UserDetails | null> => {
    if (!traderId || traderId === 'undefined') return null;
    
    try {
      const response = await fetch(`/api/farmers?search=${traderId}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const traderData = data.data[0];
        return {
          _id: traderData._id || traderId,
          traderId: traderData.traderId || traderId,
          personalInfo: traderData.personalInfo ? {
            taluk: traderData.personalInfo.taluk || '',
            name: traderData.personalInfo.name || '',
            mobileNo: traderData.personalInfo.mobileNo || '',
            email: traderData.personalInfo.email || ''
          } : undefined,
          taluk: traderData.personalInfo?.taluk || traderData.taluk || '',
          name: traderData.personalInfo?.name || traderData.name || '',
          mobile: traderData.personalInfo?.mobileNo || traderData.mobile || '',
          email: traderData.personalInfo?.email || traderData.email || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching trader details:', error);
      return null;
    }
  };

  // Fetch all farmer and trader details for notifications
  const fetchAllDetailsForNotifications = async (allNotifications: Notification[]) => {
    const farmerIds = [...new Set(allNotifications.map(notification => notification.farmerId).filter(Boolean))] as string[];
    const traderIds = [...new Set(allNotifications.map(notification => notification.traderId).filter(Boolean))] as string[];
    
    const farmerDetailsMap: {[key: string]: string} = {};
    const traderDetailsMap: {[key: string]: string} = {};
    
    // Fetch farmer details in parallel
    const farmerPromises = farmerIds.map(async (farmerId) => {
      const details = await fetchFarmerDetails(farmerId);
      if (details) {
        farmerDetailsMap[farmerId] = details.personalInfo?.taluk || '';
      }
    });
    
    // Fetch trader details in parallel
    const traderPromises = traderIds.map(async (traderId) => {
      const details = await fetchTraderDetails(traderId);
      if (details) {
        traderDetailsMap[traderId] = details.personalInfo?.taluk || details.taluk || '';
      }
    });
    
    await Promise.all([...farmerPromises, ...traderPromises]);
    
    return { farmerDetailsMap, traderDetailsMap };
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://kisan.etpl.ai/product/admin-notifications');
      const data = await response.json();

      if (data.success) {
        let allNotifications = data.data;
        
        // If admin, show all notifications
        if (session?.role === 'admin') {
          setNotifications(allNotifications);
          setFilteredNotifications(allNotifications);
        } 
        // If subadmin, filter by taluk
        else if (session?.role === 'subadmin' && session?.taluka) {
          // Fetch taluk information for farmers and traders
          const { farmerDetailsMap, traderDetailsMap } = await fetchAllDetailsForNotifications(allNotifications);
          
          // Filter notifications based on subadmin's taluk
          const filtered = allNotifications.filter((notification: Notification) => {
            // Check if notification belongs to subadmin's taluk
            const farmerTaluk = notification.farmerId ? farmerDetailsMap[notification.farmerId] : null;
            const traderTaluk = notification.traderId ? traderDetailsMap[notification.traderId] : null;
            
            return farmerTaluk === session.taluka || traderTaluk === session.taluka;
          });

          // Add taluk information to notifications for display
          const notificationsWithTaluk = filtered.map((notification:any) => ({
            ...notification,
            farmerTaluk: notification.farmerId ? farmerDetailsMap[notification.farmerId] : undefined,
            traderTaluk: notification.traderId ? traderDetailsMap[notification.traderId] : undefined,
          }));

          setNotifications(notificationsWithTaluk);
          setFilteredNotifications(notificationsWithTaluk);
        } else {
          setNotifications(allNotifications);
          setFilteredNotifications(allNotifications);
        }
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if notification should be visible based on filters
  const applyFilters = (notification: Notification) => {
    // Filter by type
    if (filter === 'offers' && notification.type !== 'offer') return false;
    if (filter === 'orders' && notification.type !== 'order_created') return false;
    if (filter === 'payments' && !['trader_payment', 'farmer_payment'].includes(notification.type)) return false;
    if (filter === 'transporter' && notification.type !== 'transporter_update') return false;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        notification.orderId?.toLowerCase().includes(search) ||
        notification.productCode?.toLowerCase().includes(search) ||
        notification.traderName?.toLowerCase().includes(search) ||
        notification.farmerName?.toLowerCase().includes(search) ||
        notification.productName?.toLowerCase().includes(search)
      );
    }

    return true;
  };

  // Update filtered notifications when filters change
  useEffect(() => {
    const filtered = notifications.filter(applyFilters);
    setFilteredNotifications(filtered);
  }, [filter, searchTerm, notifications]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      pending: <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">⏳ Pending</span>,
      accepted: <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Accepted</span>,
      rejected: <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">✗ Rejected</span>,
      countered: <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">💬 Countered</span>,
      paid: <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Paid</span>,
      partial: <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">⚠ Partial</span>,
      processing: <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">🔄 Processing</span>,
      in_transit: <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">🚚 In Transit</span>,
      completed: <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Completed</span>,
      cancelled: <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">✗ Cancelled</span>,
    };
    return badges[status] || <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{status}</span>;
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      offer: <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
          <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
        </svg>
      </div>,
      order_created: <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
      </div>,
      trader_payment: <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
        </svg>
      </div>,
      farmer_payment: <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M11.5 8.5a.5.5 0 0 0 0-1H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5z"/>
        </svg>
      </div>,
      transporter_update: <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
      </div>,
    };
    return icons[type] || <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
      </svg>
    </div>;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const offerCount = notifications.filter(n => n.type === 'offer').length;
  const orderCount = notifications.filter(n => n.type === 'order_created').length;
  const paymentCount = notifications.filter(n => ['trader_payment', 'farmer_payment'].includes(n.type)).length;
  const transporterCount = notifications.filter(n => n.type === 'transporter_update').length;

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="text-green-600">
                  {session?.role === 'admin' ? 'Admin' : 'Subadmin'}
                </span> Notifications
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {filteredNotifications.length} Total
                  {session?.role === 'subadmin' && session?.taluka && (
                    <span className="ml-1">• {session.taluka} Taluk</span>
                  )}
                </span>
                <span className="text-gray-600 text-sm">
                  {session?.role === 'admin' ? 'All system activities and updates' : 'Taluk-specific activities'}
                </span>
              </div>
              {session?.role === 'subadmin' && session?.taluka && (
                <div className="mt-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    Showing notifications for {session.taluka} taluk only
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        <div className="bg-white rounded-xl border border-yellow-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-3xl font-bold">{offerCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold">{orderCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-green-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Activities</p>
              <p className="text-3xl font-bold">{paymentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transporter Updates</p>
              <p className="text-3xl font-bold">{transporterCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white mx-6 rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All ({filteredNotifications.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'offers' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilter('offers')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
              </svg>
              Offers ({offerCount})
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilter('orders')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Orders ({orderCount})
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'payments' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilter('payments')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
              </svg>
              Payments ({paymentCount})
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'transporter' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilter('transporter')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
              </svg>
              Transporter ({transporterCount})
            </button>
          </div>
          <div className="lg:ml-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search by Order ID, Product, Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 pb-6">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-gray-300 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {session?.role === 'subadmin' && session?.taluka 
                ? `No notifications found for ${session.taluka} taluk`
                : 'No notifications found'
              }
            </h3>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {/* Icon */}
                  {getNotificationIcon(notification.type)}

                  {/* Content */}
                  <div className="flex-grow-1">
                    {/* Taluk Badge for Subadmin */}
                    {session?.role === 'subadmin' && (
                      <div className="mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          Taluk: {notification.farmerTaluk || notification.traderTaluk || 'Unknown Taluk'}
                        </span>
                      </div>
                    )}

                    {/* Offer Notification */}
                    {notification.type === 'offer' && (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-800">
                            New Offer from {notification.traderName || 'Unknown Trader'}
                          </h3>
                          <span className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getStatusBadge(notification.status || 'pending')}
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                            <span className="font-medium">Product:</span> {notification.productCode || 'N/A'}
                          </span>
                          {notification.gradeName && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                              {notification.gradeName}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4">
                          <span className="font-medium">{notification.productName || 'Unknown Product'}</span>
                          {notification.categoryName && ` - ${notification.categoryName}`}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Offered Price</p>
                            <p className="text-lg font-bold">₹{notification.offeredPrice || 0} × {notification.quantity || 0} {notification.unitMeasurement || 'units'}</p>
                            <p className="text-green-600 font-medium">Total: ₹{((notification.offeredPrice || 0) * (notification.quantity || 0)).toFixed(2)}</p>
                          </div>
                          {notification.counterPrice && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Counter Offer</p>
                              <p className="text-lg font-bold">₹{notification.counterPrice} × {notification.counterQuantity} {notification.unitMeasurement}</p>
                              <p className="text-blue-600 font-medium">Total: ₹{((notification.counterPrice || 0) * (notification.counterQuantity || 0)).toFixed(2)}</p>
                            </div>
                          )}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Trader Details</p>
                            <p className="font-bold">{notification.traderName || 'Unknown Trader'}</p>
                            <p className="text-sm text-gray-600">Trader ID: {notification.traderId || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Farmer ID: {notification.farmerId || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Created Notification */}
                    {notification.type === 'order_created' && (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-800">
                            {notification.message || `New order ${notification.orderId} created`}
                          </h3>
                          <span className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Order: {notification.orderId || 'N/A'}
                          </span>
                          {getStatusBadge(notification.orderStatus || 'pending')}
                          {getStatusBadge(notification.transporterStatus || 'pending')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Trader</p>
                            <p className="font-bold">{notification.traderName || 'Unknown Trader'}</p>
                            <p className="text-xs text-gray-500">{notification.traderId || 'N/A'}</p>
                            {session?.role === 'subadmin' && notification.traderTaluk && (
                              <p className="text-xs text-gray-500">Taluk: {notification.traderTaluk}</p>
                            )}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Farmer</p>
                            <p className="font-bold">{notification.farmerName || 'Unknown Farmer'}</p>
                            <p className="text-xs text-gray-500">{notification.farmerId || 'N/A'}</p>
                            {session?.role === 'subadmin' && notification.farmerTaluk && (
                              <p className="text-xs text-gray-500">Taluk: {notification.farmerTaluk}</p>
                            )}
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                            <p className="text-lg font-bold text-green-700">₹{notification.totalAmount?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                            <div className="mt-1">{getStatusBadge(notification.paymentStatus || 'pending')}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Notifications (Trader & Farmer) */}
                    {(notification.type === 'trader_payment' || notification.type === 'farmer_payment') && (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className={`font-bold text-lg ${notification.type === 'trader_payment' ? 'text-green-700' : 'text-indigo-700'}`}>
                            {notification.type === 'trader_payment' ? 'Payment Received from Trader' : 'Payment Sent to Farmer'}
                          </h3>
                          <span className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Order: {notification.orderId || 'N/A'}
                          </span>
                          <span className={`px-3 py-1 text-sm rounded-full ${notification.type === 'trader_payment' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            Payment ID: {notification.razorpayPaymentId || 'N/A'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{notification.message || 'Payment notification'}</p>
                        <div className={`p-4 rounded-lg ${notification.type === 'trader_payment' ? 'bg-green-50 border border-green-200' : 'bg-indigo-50 border border-indigo-200'}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Amount</p>
                              <p className="text-xl font-bold">{notification.type === 'trader_payment' ? '₹' : '₹'}{notification.amount?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                              <p className="font-medium">
                                {notification.paidDate ? new Date(notification.paidDate).toLocaleString('en-IN') : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Transporter Update Notification */}
                    {notification.type === 'transporter_update' && (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-800">
                            {notification.message || 'Transporter update'}
                          </h3>
                          <span className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Order: {notification.orderId || 'N/A'}
                          </span>
                          {getStatusBadge(notification.transporterStatus || 'pending')}
                        </div>
                        {notification.transporterDetails && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Transporter</p>
                                <p className="font-bold">{notification.transporterDetails.transporterName || 'Unknown'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                                <p className="font-bold">
                                  {notification.transporterDetails.vehicleType || 'N/A'} - {notification.transporterDetails.vehicleNumber || 'N/A'}
                                </p>
                              </div>
                              {notification.transporterDetails.driverName && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Driver</p>
                                  <p className="font-bold">{notification.transporterDetails.driverName}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;