



"use client"

import React, { useEffect, useState } from "react";

interface MarketDetails {
  marketName: string;
  pincode: string;
  postOffice?: string;
  district?: string;
  state?: string;
  exactAddress: string;
  landmark?: string;
}

interface ProductItem {
  productId: string;
  productName: string;
  grade: string;
  quantity: number;
  deliveryDate: string;
  nearestMarket: string;
  marketDetails: MarketDetails | null;
  pricePerUnit: number;
  totalAmount: number;
}

interface PaymentRecord {
  amount: number;
  paidDate: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

interface PaymentDetails {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentHistory: PaymentRecord[];
}

interface TransporterDetails {
  transporterId: string;
  transporterName: string;
  transporterMobile?: string;
  transporterEmail?: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity?: string;
  driverName?: string;
  driverMobile?: string;
  acceptedAt: string;
  transporterReached?: boolean;
  goodsConditionCorrect?: boolean;
  quantityCorrect?: boolean;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
}

// Dynamic Invoice Interfaces
interface InvoiceSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  termsConditions: string[];
  gstNumber?: string;
  panNumber?: string;
}

interface ProductGradeInfo {
  grade: string;
  basePrice: number;
  appreciationRate?: number;
  depreciationRate?: number;
}

interface FeeStructure {
  processingFarmerPercent: number;
  processingTraderPercent: number;
  laborFarmer: number;
  laborTrader: number;
  transportFarmer: number;
  transportTrader: number;
  advancePercentage: number;
}

interface InvoiceProduct {
  grade: string;
  quantity: number;
  price: number;
  total: number;
  depreciation?: number;
  appreciation?: number;
}

interface InvoiceData {
  farmer: {
    products: InvoiceProduct[];
    totalQuantity: number;
    processingFees: { farmer: number; trader: number };
    labor: { farmer: number; trader: number };
    transport: { farmer: number; trader: number };
    advance: number;
    finalAmount: number;
    gstAmount: number;
    netAmount: number;
  };
  trader: {
    products: InvoiceProduct[];
    totalQuantity: number;
    processingFees: { farmer: number; trader: number };
    labor: { farmer: number; trader: number };
    transport: { farmer: number; trader: number };
    advance: number;
    finalAmount: number;
    gstAmount: number;
    netAmount: number;
  };
}

interface Order {
  _id: string;
  orderId: string;
  traderName: string;
  traderMobile?: string;
  traderEmail?: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerEmail?: string;
  productItems: ProductItem[];
  orderStatus: string;
  transporterStatus?: string;
  transporterDetails?: TransporterDetails;
  traderToAdminPayment?: PaymentDetails;
  adminToFarmerPayment?: PaymentDetails;
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [verificationData, setVerificationData] = useState({
    transporterReached: false,
    goodsConditionCorrect: false,
    quantityCorrect: false,
    adminNotes: '',
  });

  // Dynamic data states
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    termsConditions: []
  });
  const [productGrades, setProductGrades] = useState<ProductGradeInfo[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
    processingFarmerPercent: 0,
    processingTraderPercent: 0,
    laborFarmer: 0,
    laborTrader: 0,
    transportFarmer: 0,
    transportTrader: 0,
    advancePercentage: 0
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceType, setInvoiceType] = useState<'farmer' | 'trader'>('farmer');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    farmer: {
      products: [],
      totalQuantity: 0,
      processingFees: { farmer: 0, trader: 0 },
      labor: { farmer: 0, trader: 0 },
      transport: { farmer: 0, trader: 0 },
      advance: 0,
      finalAmount: 0,
      gstAmount: 0,
      netAmount: 0
    },
    trader: {
      products: [],
      totalQuantity: 0,
      processingFees: { farmer: 0, trader: 0 },
      labor: { farmer: 0, trader: 0 },
      transport: { farmer: 0, trader: 0 },
      advance: 0,
      finalAmount: 0,
      gstAmount: 0,
      netAmount: 0
    }
  });
  const [editingInvoice, setEditingInvoice] = useState<boolean>(false);

  const API_BASE = 'https://kisan.etpl.ai/api/admin';

  useEffect(() => {
    fetchOrders();
    fetchDynamicData();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    let url = `${API_BASE}/orders?`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (transporterStatusFilter) url += `transporterStatus=${transporterStatusFilter}&`;
    if (searchInput) url += `search=${searchInput}&`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        alert('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDynamicData = async () => {
    try {
      // Fetch invoice settings
      const settingsRes = await fetch(`${API_BASE}/settings/invoice`);
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setInvoiceSettings(settingsData.data);
      }

      // Fetch product grades with prices
      const gradesRes = await fetch(`${API_BASE}/products/grades`);
      const gradesData = await gradesRes.json();
      if (gradesData.success) {
        setProductGrades(gradesData.data);
      }

      // Fetch fee structure
      const feesRes = await fetch(`${API_BASE}/settings/fees`);
      const feesData = await feesRes.json();
      if (feesData.success) {
        setFeeStructure(feesData.data);
      }
    } catch (error) {
      console.error('Error fetching dynamic data:', error);
      // Set fallback data if API fails
      setInvoiceSettings({
        companyName: 'AGRI TRADING COMPANY',
        companyAddress: '123 Market Street, Agricultural District, Pin: 560001',
        companyPhone: '+91 9876543210',
        companyEmail: 'info@agritrading.com',
        termsConditions: [
          'Payment due within 30 days',
          'Late payment interest @ 1.5% per month',
          'All disputes subject to jurisdiction'
        ],
        gstNumber: 'GSTIN123456789',
        panNumber: 'ABCDE1234F'
      });

      setProductGrades([
        { grade: 'A Grade', basePrice: 100, appreciationRate: 5 },
        { grade: 'B Grade', basePrice: 80, appreciationRate: 3 },
        { grade: 'C Grade', basePrice: 60, depreciationRate: 2 },
        { grade: 'D Grade', basePrice: 40, depreciationRate: 5 },
        { grade: 'All Mix', basePrice: 70 }
      ]);
    }
  };

  const openDetailsModal = (order: Order) => {
    setCurrentOrder(order);
    setVerificationData({
      transporterReached: order.transporterDetails?.transporterReached || false,
      goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
      quantityCorrect: order.transporterDetails?.quantityCorrect || false,
      adminNotes: order.transporterDetails?.adminNotes || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(false);
  };

  const calculateDepreciationAppreciation = (grade: string, baseAmount: number) => {
    const gradeInfo = productGrades.find(g => g.grade === grade);
    if (!gradeInfo) return { depreciation: 0, appreciation: 0 };

    const depreciation = gradeInfo.depreciationRate
      ? (baseAmount * gradeInfo.depreciationRate) / 100
      : 0;
    const appreciation = gradeInfo.appreciationRate
      ? (baseAmount * gradeInfo.appreciationRate) / 100
      : 0;

    return { depreciation, appreciation };
  };

  const initializeInvoiceData = (order: Order) => {
    const products: InvoiceProduct[] = [];
    let totalQuantity = 0;

    // Group products by grade from actual order data
    const gradeGroups = order.productItems.reduce((acc, item) => {
      if (!acc[item.grade]) {
        acc[item.grade] = {
          quantity: 0,
          total: 0,
          pricePerUnit: item.pricePerUnit,
          grade: item.grade
        };
      }
      acc[item.grade].quantity += item.quantity;
      acc[item.grade].total += item.totalAmount;
      totalQuantity += item.quantity;
      return acc;
    }, {} as Record<string, { quantity: number; total: number; pricePerUnit: number; grade: string }>);

    // Create invoice products with dynamic calculations
    Object.entries(gradeGroups).forEach(([grade, data]) => {
      const { depreciation, appreciation } = calculateDepreciationAppreciation(grade, data.total);

      products.push({
        grade,
        quantity: data.quantity,
        price: data.pricePerUnit,
        total: data.total,
        depreciation,
        appreciation
      });
    });

    // Sort by grade
    const gradeOrder = ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'All Mix'];
    products.sort((a, b) => gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade));

    // Calculate base amount from products
    const productsTotal = products.reduce((sum, p) => {
      return sum + p.total + (p.appreciation || 0) - (p.depreciation || 0);
    }, 0);

    // Calculate advance based on percentage from feeStructure
    const advanceAmount = productsTotal * (feeStructure.advancePercentage / 100);

    // Calculate processing fees
    const processingFarmerAmount = productsTotal * (feeStructure.processingFarmerPercent / 100);
    const processingTraderAmount = productsTotal * (feeStructure.processingTraderPercent / 100);

    // Calculate GST (assuming 18%)
    const gstRate = 0.18;
    const taxableAmount = productsTotal + processingFarmerAmount + processingTraderAmount +
      feeStructure.laborFarmer + feeStructure.laborTrader +
      feeStructure.transportFarmer + feeStructure.transportTrader;
    const gstAmount = taxableAmount * gstRate;

    // Calculate net amount
    const netAmount = taxableAmount + gstAmount;

    const newInvoiceData: InvoiceData = {
      farmer: {
        products: [...products],
        totalQuantity,
        processingFees: {
          farmer: processingFarmerAmount,
          trader: processingTraderAmount
        },
        labor: {
          farmer: feeStructure.laborFarmer,
          trader: feeStructure.laborTrader
        },
        transport: {
          farmer: feeStructure.transportFarmer,
          trader: feeStructure.transportTrader
        },
        advance: advanceAmount,
        finalAmount: netAmount - advanceAmount,
        gstAmount,
        netAmount
      },
      trader: {
        products: [...products],
        totalQuantity,
        processingFees: {
          farmer: processingFarmerAmount,
          trader: processingTraderAmount
        },
        labor: {
          farmer: feeStructure.laborFarmer,
          trader: feeStructure.laborTrader
        },
        transport: {
          farmer: feeStructure.transportFarmer,
          trader: feeStructure.transportTrader
        },
        advance: advanceAmount,
        finalAmount: netAmount + advanceAmount,
        gstAmount,
        netAmount
      }
    };

    setInvoiceData(newInvoiceData);
  };

  const openInvoiceModal = (order: Order, type: 'farmer' | 'trader') => {
    setCurrentOrder(order);
    setInvoiceType(type);
    initializeInvoiceData(order);
    setShowInvoiceModal(true);
  };

  const handleInvoiceChange = (field: string, value: any, subField?: string) => {
    setInvoiceData(prev => {
      const newData = { ...prev };

      if (field.includes('.')) {
        const [main, sub] = field.split('.');
        if (main === 'farmer' || main === 'trader') {
          if (subField) {
            (newData[main] as any)[sub][subField] = value;
          } else {
            (newData[main] as any)[sub] = value;
          }
        }
      } else {
        if (subField) {
          (newData[invoiceType] as any)[field][subField] = value;
        } else {
          (newData[invoiceType] as any)[field] = value;
        }
      }

      // Recalculate final amount
      const productsTotal = newData[invoiceType].products.reduce((sum: number, p: InvoiceProduct) => {
        return sum + p.total + (p.appreciation || 0) - (p.depreciation || 0);
      }, 0);

      const feesTotal =
        (newData[invoiceType].processingFees.farmer || 0) +
        (newData[invoiceType].processingFees.trader || 0) +
        (newData[invoiceType].labor.farmer || 0) +
        (newData[invoiceType].labor.trader || 0) +
        (newData[invoiceType].transport.farmer || 0) +
        (newData[invoiceType].transport.trader || 0);

      // Recalculate GST and net amount
      const gstRate = 0.18;
      const taxableAmount = productsTotal + feesTotal;
      const gstAmount = taxableAmount * gstRate;
      const netAmount = taxableAmount + gstAmount;

      newData[invoiceType].gstAmount = gstAmount;
      newData[invoiceType].netAmount = netAmount;

      if (invoiceType === 'farmer') {
        newData[invoiceType].finalAmount = netAmount - newData[invoiceType].advance;
      } else {
        newData[invoiceType].finalAmount = netAmount + newData[invoiceType].advance;
      }

      return newData;
    });
  };

  const handleProductChange = (index: number, field: keyof InvoiceProduct, value: number) => {
    setInvoiceData(prev => {
      const newData = { ...prev };
      const product = newData[invoiceType].products[index];

      if (field === 'price' || field === 'quantity') {
        (product as any)[field] = value;
        product.total = product.price * product.quantity;

        // Recalculate depreciation/appreciation based on new total
        const { depreciation, appreciation } = calculateDepreciationAppreciation(product.grade, product.total);
        product.depreciation = depreciation;
        product.appreciation = appreciation;
      } else if (field === 'depreciation' || field === 'appreciation') {
        (product as any)[field] = value;
      }

      // Recalculate all amounts
      const productsTotal = newData[invoiceType].products.reduce((sum, p) => {
        return sum + p.total + (p.appreciation || 0) - (p.depreciation || 0);
      }, 0);

      const feesTotal =
        (newData[invoiceType].processingFees.farmer || 0) +
        (newData[invoiceType].processingFees.trader || 0) +
        (newData[invoiceType].labor.farmer || 0) +
        (newData[invoiceType].labor.trader || 0) +
        (newData[invoiceType].transport.farmer || 0) +
        (newData[invoiceType].transport.trader || 0);

      const gstRate = 0.18;
      const taxableAmount = productsTotal + feesTotal;
      const gstAmount = taxableAmount * gstRate;
      const netAmount = taxableAmount + gstAmount;

      newData[invoiceType].gstAmount = gstAmount;
      newData[invoiceType].netAmount = netAmount;

      if (invoiceType === 'farmer') {
        newData[invoiceType].finalAmount = netAmount - newData[invoiceType].advance;
      } else {
        newData[invoiceType].finalAmount = netAmount + newData[invoiceType].advance;
      }

      return newData;
    });
  };

  const saveInvoice = async () => {
    if (!currentOrder) return;

    try {
      const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceType,
          invoiceData: invoiceData[invoiceType],
          updatedBy: localStorage.getItem('adminId') || 'admin-001',
          timestamp: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Invoice saved successfully!');
        closeInvoiceModal();
      } else {
        alert('Failed to save invoice: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving invoice');
    }
  };

  const generateInvoicePDF = () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (invoiceContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice - ${currentOrder?.orderId}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .company-name { font-size: 24px; font-weight: bold; }
                .invoice-title { background: #f0f0f0; padding: 10px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-section { margin-top: 30px; text-align: right; }
                .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${invoiceContent.innerHTML}
              <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()">Print Invoice</button>
                <button onclick="window.close()">Close</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const saveVerification = async () => {
    if (!currentOrder || !currentOrder.transporterDetails) {
      alert('No transporter details available');
      return;
    }

    const adminId = localStorage.getItem('adminId') || 'admin-001';
    const adminName = localStorage.getItem('userName') || 'Admin';

    const data = {
      ...verificationData,
      adminId,
      adminName,
    };

    try {
      const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert('Verification updated successfully!');
        closeModal();
        fetchOrders();
      } else {
        alert('Failed to update verification: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating verification');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const statusColors: { [key: string]: React.CSSProperties } = {
      pending: { backgroundColor: '#ffc107', color: '#000' },
      processing: { backgroundColor: '#0dcaf0', color: '#000' },
      in_transit: { backgroundColor: '#0d6efd', color: '#fff' },
      completed: { backgroundColor: '#198754', color: '#fff' },
      cancelled: { backgroundColor: '#dc3545', color: '#fff' },
      accepted: { backgroundColor: '#198754', color: '#fff' },
      rejected: { backgroundColor: '#dc3545', color: '#fff' },
      partial: { backgroundColor: '#ffc107', color: '#000' },
      paid: { backgroundColor: '#198754', color: '#fff' },
    };
    return statusColors[status] || { backgroundColor: '#6c757d', color: '#fff' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid #0d6efd',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}
          />
          <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading orders...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#212529' }}>
          📋 Order Management
        </h1>
        <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>Manage and verify transportation orders with payment details</p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.375rem',
          padding: '1rem',
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontWeight: '500' }}>
                Order Status
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da',
                  backgroundColor: '#fff',
                  color: '#212529'
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontWeight: '500' }}>
                Transporter Status
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da',
                  backgroundColor: '#fff',
                  color: '#212529'
                }}
                value={transporterStatusFilter}
                onChange={(e) => setTransporterStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontWeight: '500' }}>
                Search
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da',
                  backgroundColor: '#fff',
                  color: '#212529'
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Order ID, Trader, Farmer..."
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={fetchOrders}
              >
                🔍 Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.375rem',
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}>📦</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>No orders found</h4>
                <p style={{ color: '#6c757d', margin: 0 }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Order ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Trader</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Farmer</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Products</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Order Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Transporter Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Trader Payment</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Farmer Payment</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Verification</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        style={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <strong style={{ color: '#0d6efd' }}>{order.orderId}</strong>
                          <br />
                          <small style={{ color: '#6c757d' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <div>{order.traderName}</div>
                          {order.traderMobile && (
                            <small style={{ color: '#6c757d' }}>{order.traderMobile}</small>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <div>{order.farmerName || 'N/A'}</div>
                          {order.farmerMobile && (
                            <small style={{ color: '#6c757d' }}>{order.farmerMobile}</small>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25em 0.5em',
                            borderRadius: '0.25rem',
                            backgroundColor: '#0dcaf0',
                            color: '#000',
                            fontSize: '0.875em',
                            fontWeight: '500'
                          }}>
                            {order.productItems.length} item(s)
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25em 0.5em',
                            borderRadius: '0.25rem',
                            fontSize: '0.875em',
                            fontWeight: '500',
                            ...getStatusBadgeStyle(order.orderStatus)
                          }}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25em 0.5em',
                            borderRadius: '0.25rem',
                            fontSize: '0.875em',
                            fontWeight: '500',
                            ...getStatusBadgeStyle(order.transporterStatus || 'pending')
                          }}>
                            {order.transporterStatus || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          {order.traderToAdminPayment ? (
                            <div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Total:</small>{' '}
                                <strong>
                                  {formatCurrency(order.traderToAdminPayment.totalAmount)}
                                </strong>
                              </div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Paid:</small>{' '}
                                {formatCurrency(order.traderToAdminPayment.paidAmount)}
                              </div>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.75em',
                                fontWeight: '500',
                                marginTop: '0.25rem',
                                ...getStatusBadgeStyle(order.traderToAdminPayment.paymentStatus)
                              }}>
                                {order.traderToAdminPayment.paymentStatus}
                              </span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          {order.adminToFarmerPayment ? (
                            <div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Total:</small>{' '}
                                <strong>
                                  {formatCurrency(order.adminToFarmerPayment.totalAmount)}
                                </strong>
                              </div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Paid:</small>{' '}
                                {formatCurrency(order.adminToFarmerPayment.paidAmount)}
                              </div>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.75em',
                                fontWeight: '500',
                                marginTop: '0.25rem',
                                ...getStatusBadgeStyle(order.adminToFarmerPayment.paymentStatus)
                              }}>
                                {order.adminToFarmerPayment.paymentStatus}
                              </span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          {order.transporterDetails ? (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  borderRadius: '0.25rem',
                                  backgroundColor: order.transporterDetails.transporterReached ? '#198754' : '#6c757d',
                                  color: '#fff',
                                  cursor: 'help'
                                }}
                                title="Reached"
                              >
                                {order.transporterDetails.transporterReached ? '✓' : '✗'}
                              </span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  borderRadius: '0.25rem',
                                  backgroundColor: order.transporterDetails.goodsConditionCorrect ? '#198754' : '#6c757d',
                                  color: '#fff',
                                  cursor: 'help'
                                }}
                                title="Condition"
                              >
                                {order.transporterDetails.goodsConditionCorrect ? '✓' : '✗'}
                              </span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  borderRadius: '0.25rem',
                                  backgroundColor: order.transporterDetails.quantityCorrect ? '#198754' : '#6c757d',
                                  color: '#fff',
                                  cursor: 'help'
                                }}
                                title="Quantity"
                              >
                                {order.transporterDetails.quantityCorrect ? '✓' : '✗'}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#6c757d' }}>No transporter</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6', display: 'flex', gap: '0.5rem' }}>
                          <button
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.875rem',
                              backgroundColor: '#0d6efd',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer'
                            }}
                            onClick={() => openDetailsModal(order)}
                          >
                            👁️ View
                          </button>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.875rem',
                                backgroundColor: '#198754',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                if (dropdown.style.display === 'block') {
                                  dropdown.style.display = 'none';
                                } else {
                                  dropdown.style.display = 'block';
                                }
                              }}
                            >
                              📝 Edit
                            </button>
                            <div style={{
                              display: 'none',
                              position: 'absolute',
                              backgroundColor: 'white',
                              minWidth: '160px',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                              zIndex: 1,
                              borderRadius: '0.25rem',
                              right: 0
                            }}>
                              <button
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInvoiceModal(order, 'farmer');
                                  const dropdown = (e.currentTarget.parentElement as HTMLElement);
                                  dropdown.style.display = 'none';
                                }}
                              >
                                👨‍🌾 Farmer Invoice
                              </button>
                              <button
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInvoiceModal(order, 'trader');
                                  const dropdown = (e.currentTarget.parentElement as HTMLElement);
                                  dropdown.style.display = 'none';
                                }}
                              >
                                💼 Trader Invoice
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && currentOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '1rem',
          overflow: 'auto'
        }}>
          <div id="invoice-content" style={{
            backgroundColor: '#fff',
            borderRadius: '0.375rem',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: invoiceType === 'farmer' ? '#198754' : '#0d6efd',
              color: '#fff',
              padding: '1rem',
              borderTopLeftRadius: '0.375rem',
              borderTopRightRadius: '0.375rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {invoiceType === 'farmer' ? '👨‍🌾 Farmer Invoice' : '💼 Trader Invoice'} - {currentOrder.orderId}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => setEditingInvoice(!editingInvoice)}
                >
                  {editingInvoice ? '👁️ Preview' : '✏️ Edit'}
                </button>
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={generateInvoicePDF}
                >
                  📄 Generate PDF
                </button>
                <button
                  onClick={closeInvoiceModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body - Invoice Content */}
            <div style={{ padding: '2rem' }}>
              {/* Company Header - Dynamic from DB */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{invoiceSettings.companyName || 'AGRI TRADING COMPANY'}</h1>
                <p style={{ margin: 0, color: '#666' }}>{invoiceSettings.companyAddress || '123 Market Street, Agricultural District'}</p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  Phone: {invoiceSettings.companyPhone || '+91 9876543210'} | Email: {invoiceSettings.companyEmail || 'info@agritrading.com'}
                </p>
                {invoiceSettings.gstNumber && (
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    GST: {invoiceSettings.gstNumber} | PAN: {invoiceSettings.panNumber}
                  </p>
                )}
                <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '0.25rem' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>
                    INVOICE {invoiceType === 'farmer' ? 'FOR FARMER' : 'FOR TRADER'}
                  </h3>
                </div>
              </div>

              {/* Customer Info - Dynamic from Order */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
                    {invoiceType === 'farmer' ? 'Farmer Details:' : 'Trader Details:'}
                  </h4>
                  <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>
                    {invoiceType === 'farmer' ? currentOrder.farmerName || 'N/A' : currentOrder.traderName}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    {invoiceType === 'farmer' ? currentOrder.farmerMobile || '' : currentOrder.traderMobile || ''}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    {invoiceType === 'farmer' ? currentOrder.farmerEmail || '' : currentOrder.traderEmail || ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Invoice Info:</h4>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Order ID:</strong> {currentOrder.orderId}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Invoice Type:</strong> {invoiceType === 'farmer' ? 'Farmer Payment' : 'Trader Billing'}
                  </p>
                </div>
              </div>

              {/* Products Table - Dynamic from Order Products */}
              <div style={{ marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Grade</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'center' }}>Quantity</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Price/Unit</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Depreciation (-)</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Appreciation (+)</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData[invoiceType].products.map((product, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                          {editingInvoice ? (
                            <input
                              type="text"
                              value={product.grade}
                              onChange={(e) => handleProductChange(index, 'grade', e.target.value as any)}
                              style={{ width: '100%', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            />
                          ) : (
                            <strong>{product.grade}</strong>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value))}
                              style={{ width: '80px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'center' }}
                            />
                          ) : (
                            product.quantity
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                              style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                            />
                          ) : (
                            formatCurrency(product.price)
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', color: '#dc3545' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.depreciation || 0}
                              onChange={(e) => handleProductChange(index, 'depreciation', parseFloat(e.target.value))}
                              style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                            />
                          ) : (
                            formatCurrency(product.depreciation || 0)
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', color: '#198754' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.appreciation || 0}
                              onChange={(e) => handleProductChange(index, 'appreciation', parseFloat(e.target.value))}
                              style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                            />
                          ) : (
                            formatCurrency(product.appreciation || 0)
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '600' }}>
                          {formatCurrency(product.total + (product.appreciation || 0) - (product.depreciation || 0))}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <td colSpan={5} style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '600' }}>
                        Products Total:
                      </td>
                      <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '600' }}>
                        {formatCurrency(invoiceData[invoiceType].products.reduce((sum, p) => sum + p.total + (p.appreciation || 0) - (p.depreciation || 0), 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Processing Fees, Labor, Transport - Dynamic from Fee Structure */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Processing Fees</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Farmer (%):</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].processingFees.farmer}
                        onChange={(e) => handleInvoiceChange('processingFees', parseFloat(e.target.value), 'farmer')}
                        style={{ width: '80px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].processingFees.farmer)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trader (%):</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].processingFees.trader}
                        onChange={(e) => handleInvoiceChange('processingFees', parseFloat(e.target.value), 'trader')}
                        style={{ width: '80px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].processingFees.trader)}</span>
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Labour Charges</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Farmer:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].labor.farmer}
                        onChange={(e) => handleInvoiceChange('labor', parseFloat(e.target.value), 'farmer')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].labor.farmer)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trader:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].labor.trader}
                        onChange={(e) => handleInvoiceChange('labor', parseFloat(e.target.value), 'trader')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].labor.trader)}</span>
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Transport Charges</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Farmer:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].transport.farmer}
                        onChange={(e) => handleInvoiceChange('transport', parseFloat(e.target.value), 'farmer')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].transport.farmer)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trader:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].transport.trader}
                        onChange={(e) => handleInvoiceChange('transport', parseFloat(e.target.value), 'trader')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].transport.trader)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* GST Calculation */}
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST (18%):</span>
                  <strong>{formatCurrency(invoiceData[invoiceType].gstAmount)}</strong>
                </div>
              </div>

              {/* Advance Payment */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.25rem' }}>
                  <h4 style={{ margin: 0, color: '#495057' }}>Advance Payment</h4>
                  {editingInvoice ? (
                    <input
                      type="number"
                      value={invoiceData[invoiceType].advance}
                      onChange={(e) => handleInvoiceChange('advance', parseFloat(e.target.value))}
                      style={{ width: '150px', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                      {formatCurrency(invoiceData[invoiceType].advance)}
                    </span>
                  )}
                </div>
              </div>

              {/* Final Total */}
              <div style={{ borderTop: '2px solid #495057', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#495057' }}>
                      {invoiceType === 'farmer' ? 'Amount Payable to Farmer' : 'Amount Receivable from Trader'}
                    </h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
                      Net Amount: {formatCurrency(invoiceData[invoiceType].netAmount)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: '#198754' }}>
                      {formatCurrency(invoiceData[invoiceType].finalAmount)}
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
                      Inclusive of all charges and taxes
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer - Dynamic Terms & Conditions */}
              <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666' }}>
                <div>
                  <p style={{ margin: '0.25rem 0' }}><strong>Terms & Conditions:</strong></p>
                  {invoiceSettings.termsConditions.map((term, index) => (
                    <p key={index} style={{ margin: '0.25rem 0' }}>{term}</p>
                  ))}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0.25rem 0' }}>For {invoiceSettings.companyName || 'AGRI TRADING COMPANY'}</p>
                  <div style={{ marginTop: '2rem' }}>
                    <p style={{ margin: '0.25rem 0' }}>Authorized Signature</p>
                    <p style={{ margin: '0.25rem 0' }}>Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem'
            }}>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={closeInvoiceModal}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#198754',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={saveInvoice}
              >
                💾 Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && currentOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.375rem',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#0d6efd',
              color: '#fff',
              padding: '1rem',
              borderTopLeftRadius: '0.375rem',
              borderTopRightRadius: '0.375rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                📄 Order Details
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1rem' }}>
              {/* Order Information */}
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#495057' }}>
                    ℹ️ Order Information
                  </h3>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Order ID:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{currentOrder.orderId}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Trader:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              {currentOrder.traderName}
                              {currentOrder.traderMobile && (
                                <>
                                  <br />
                                  <small style={{ color: '#6c757d' }}>{currentOrder.traderMobile}</small>
                                </>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Farmer:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              {currentOrder.farmerName || 'N/A'}
                              {currentOrder.farmerMobile && (
                                <>
                                  <br />
                                  <small style={{ color: '#6c757d' }}>{currentOrder.farmerMobile}</small>
                                </>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Order Status:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.875em',
                                fontWeight: '500',
                                ...getStatusBadgeStyle(currentOrder.orderStatus)
                              }}>
                                {currentOrder.orderStatus}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Transporter Status:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.875em',
                                fontWeight: '500',
                                ...getStatusBadgeStyle(currentOrder.transporterStatus || 'pending')
                              }}>
                                {currentOrder.transporterStatus || 'pending'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Created At:</td>
                            <td style={{ padding: '0.5rem 0' }}>{new Date(currentOrder.createdAt).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Trader to Admin Payment */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  borderLeft: '3px solid #0d6efd',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#0d6efd',
                    color: '#fff',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                      ➡️ Trader to Admin Payment
                    </h4>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    {currentOrder.traderToAdminPayment ? (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Total Amount:</span>
                            <strong style={{ fontSize: '1.125rem' }}>
                              {formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Paid Amount:</span>
                            <strong style={{ color: '#198754' }}>
                              {formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Remaining:</span>
                            <strong style={{ color: '#dc3545' }}>
                              {formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6c757d' }}>Status:</span>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25em 0.5em',
                              borderRadius: '0.25rem',
                              fontSize: '0.875em',
                              fontWeight: '500',
                              ...getStatusBadgeStyle(currentOrder.traderToAdminPayment.paymentStatus)
                            }}>
                              {currentOrder.traderToAdminPayment.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {currentOrder.traderToAdminPayment.paymentHistory &&
                          currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
                            <div>
                              <h5 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#495057' }}>
                                Payment History:
                              </h5>
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Date</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Amount</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Payment ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentOrder.traderToAdminPayment.paymentHistory.map(
                                      (payment, idx) => (
                                        <tr key={idx}>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small>{new Date(payment.paidDate).toLocaleDateString()}</small>
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            {formatCurrency(payment.amount)}
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small style={{ color: '#6c757d' }}>
                                              {payment.razorpayPaymentId || 'N/A'}
                                            </small>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                      </>
                    ) : (
                      <p style={{ color: '#6c757d', margin: 0 }}>No payment details available</p>
                    )}
                  </div>
                </div>

                {/* Admin to Farmer Payment */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  borderLeft: '3px solid #198754',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#198754',
                    color: '#fff',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                      ➡️ Admin to Farmer Payment
                    </h4>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    {currentOrder.adminToFarmerPayment ? (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Total Amount:</span>
                            <strong style={{ fontSize: '1.125rem' }}>
                              {formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Paid Amount:</span>
                            <strong style={{ color: '#198754' }}>
                              {formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Remaining:</span>
                            <strong style={{ color: '#dc3545' }}>
                              {formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6c757d' }}>Status:</span>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25em 0.5em',
                              borderRadius: '0.25rem',
                              fontSize: '0.875em',
                              fontWeight: '500',
                              ...getStatusBadgeStyle(currentOrder.adminToFarmerPayment.paymentStatus)
                            }}>
                              {currentOrder.adminToFarmerPayment.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {currentOrder.adminToFarmerPayment.paymentHistory &&
                          currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
                            <div>
                              <h5 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#495057' }}>
                                Payment History:
                              </h5>
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Date</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Amount</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Payment ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentOrder.adminToFarmerPayment.paymentHistory.map(
                                      (payment, idx) => (
                                        <tr key={idx}>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small>{new Date(payment.paidDate).toLocaleDateString()}</small>
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            {formatCurrency(payment.amount)}
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small style={{ color: '#6c757d' }}>
                                              {payment.razorpayPaymentId || 'N/A'}
                                            </small>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                      </>
                    ) : (
                      <p style={{ color: '#6c757d', margin: 0 }}>No payment details available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Items */}
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#495057' }}>
                    📦 Product Items
                  </h3>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Product</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Grade</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Quantity</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Price/Unit</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Total</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Market</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrder.productItems.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.productName}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.grade}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{formatCurrency(item.pricePerUnit)}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                              <strong>{formatCurrency(item.totalAmount)}</strong>
                            </td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                              {item.marketDetails ? (
                                <>
                                  <strong>{item.marketDetails.marketName}</strong>
                                  <br />
                                  <small style={{ color: '#6c757d' }}>
                                    {item.marketDetails.exactAddress}
                                    {item.marketDetails.district && (
                                      <>, {item.marketDetails.district}</>
                                    )}
                                  </small>
                                </>
                              ) : (
                                item.nearestMarket || 'N/A'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Transporter Details and Verification */}
              {currentOrder.transporterDetails && (
                <>
                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #0dcaf0',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#0dcaf0',
                      color: '#fff',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1rem' }}>
                        🚚 Transporter Information
                      </h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <table style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Name:</td>
                                <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{currentOrder.transporterDetails.transporterName}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Mobile:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.transporterMobile || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Email:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.transporterEmail || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Driver:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.driverName || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <table style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Vehicle Type:</td>
                                <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{currentOrder.transporterDetails.vehicleType}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Vehicle Number:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.vehicleNumber}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Capacity:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Accepted At:</td>
                                <td style={{ padding: '0.5rem 0' }}>{new Date(currentOrder.transporterDetails.acceptedAt).toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #198754',
                    borderRadius: '0.375rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#198754',
                      color: '#fff',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1rem' }}>
                        ✅ Verification Checklist
                      </h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div
                        onMouseEnter={(e) => {
                          // hover color
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }}
                        onMouseLeave={(e) => {
                          // restore original color based on condition
                          e.currentTarget.style.backgroundColor =
                            verificationData.transporterReached ? '#d1e7dd' : '#f8f9fa';
                        }}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.25rem',
                          backgroundColor: verificationData.transporterReached
                            ? '#d1e7dd'
                            : '#f8f9fa',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verificationData.transporterReached}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                transporterReached: e.target.checked,
                              })
                            }
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                          />
                          <div>
                            <strong>Transporter Reached Destination</strong>
                            <small style={{ display: 'block', color: '#6c757d', marginTop: '0.25rem' }}>
                              Confirm that transporter has arrived at the delivery location
                            </small>
                          </div>
                        </label>
                      </div>

                      <div
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            verificationData.goodsConditionCorrect ? '#d1e7dd' : '#f8f9fa';
                        }}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.25rem',
                          backgroundColor: verificationData.goodsConditionCorrect
                            ? '#d1e7dd'
                            : '#f8f9fa',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verificationData.goodsConditionCorrect}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                goodsConditionCorrect: e.target.checked,
                              })
                            }
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                          />
                          <div>
                            <strong>Goods Condition is Correct</strong>
                            <small style={{ display: 'block', color: '#6c757d', marginTop: '0.25rem' }}>
                              Verify that goods are in good condition without damage
                            </small>
                          </div>
                        </label>
                      </div>

                      <div
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            verificationData.quantityCorrect ? '#d1e7dd' : '#f8f9fa';
                        }}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '1rem',
                          borderRadius: '0.25rem',
                          backgroundColor: verificationData.quantityCorrect
                            ? '#d1e7dd'
                            : '#f8f9fa',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verificationData.quantityCorrect}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                quantityCorrect: e.target.checked,
                              })
                            }
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                          />
                          <div>
                            <strong>Quantity is Correct</strong>
                            <small style={{ display: 'block', color: '#6c757d', marginTop: '0.25rem' }}>
                              Confirm that delivered quantity matches order quantity
                            </small>
                          </div>
                        </label>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057' }}>
                          Admin Notes
                        </label>
                        <textarea
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #ced4da',
                            minHeight: '100px',
                            resize: 'vertical'
                          }}
                          placeholder="Add any notes or observations..."
                          value={verificationData.adminNotes}
                          onChange={(e) =>
                            setVerificationData({
                              ...verificationData,
                              adminNotes: e.target.value,
                            })
                          }
                        />
                      </div>

                      {currentOrder.transporterDetails.verifiedAt && (
                        <div style={{
                          backgroundColor: '#d1ecf1',
                          color: '#0c5460',
                          padding: '0.75rem',
                          borderRadius: '0.25rem',
                          marginBottom: '1rem',
                          border: '1px solid #bee5eb'
                        }}>
                          <small>
                            ℹ️ Last verified by{' '}
                            <strong>
                              {currentOrder.transporterDetails.verifiedByName || 'Admin'}
                            </strong>{' '}
                            on{' '}
                            {new Date(
                              currentOrder.transporterDetails.verifiedAt
                            ).toLocaleString()}
                          </small>
                        </div>
                      )}

                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#198754',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '1rem'
                        }}
                        onClick={saveVerification}
                      >
                        ✅ Save Verification
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!currentOrder.transporterDetails && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  marginTop: '1rem',
                  border: '1px solid #ffeaa7'
                }}>
                  ⚠️ No transporter assigned to this order yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
