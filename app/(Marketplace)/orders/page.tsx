'use client';

import React, { useEffect, useState } from 'react';
import OrderEditModal from '../OrderEditModal/page';


declare global {
  interface Window {
    openEditOrderModal?: (orderId: string) => void;
  }
}

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [verificationData, setVerificationData] = useState({
    transporterReached: false,
    goodsConditionCorrect: false,
    quantityCorrect: false,
    adminNotes: '',
  });

  const API_BASE = 'https://kisan.etpl.ai/api/admin';

  useEffect(() => {
    fetchOrders();
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
        setShowModal(false);
        fetchOrders();
      } else {
        alert('Failed to update verification: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating verification');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: '#ffc107',
      processing: '#0dcaf0',
      in_transit: '#0d6efd',
      completed: '#198754',
      cancelled: '#dc3545',
      accepted: '#198754',
      rejected: '#dc3545',
      partial: '#ffc107',
      paid: '#198754',
    };
    return statusColors[status] || '#6c757d';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const generateFarmerInvoice = (order: Order) => {
    if (!order || !order.adminToFarmerPayment) return;

    const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Farmer Payment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #198754;
            padding-bottom: 20px;
        }
        .company-name {
            color: #198754;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .company-tagline {
            color: #666;
            font-size: 14px;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .details-left, .details-right {
            flex: 1;
        }
        .detail-row {
            margin-bottom: 8px;
        }
        .detail-label {
            font-weight: bold;
            color: #495057;
            min-width: 150px;
            display: inline-block;
        }
        .table-container {
            margin: 30px 0;
            overflow-x: auto;
        }
        table {
            width: '100%';
            border-collapse: collapse;
        }
        th {
            background-color: #198754;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #dee2e6;
        }
        .total-section {
            background: #e9ecef;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .total-row.final {
            border-top: 2px solid #198754;
            padding-top: 15px;
            font-weight: bold;
            font-size: 18px;
            color: #198754;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin: 40px 0 10px 0;
        }
        .important-notes {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .payment-status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin-left: 10px;
        }
        .status-paid { background: #d1e7dd; color: #0f5132; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-partial { background: #cff4fc; color: #055160; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-name">KISAN TRADING</div>
            <div class="company-tagline">Agricultural Produce Trading Platform</div>
            <div class="invoice-title">FARMER PAYMENT INVOICE</div>
        </div>
        
        <div class="invoice-details">
            <div class="details-left">
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span> ${order.orderId}-FARMER
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Date:</span> ${formatDate(new Date().toISOString())}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date:</span> ${formatDate(order.createdAt)}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Farmer Name:</span> ${order.farmerName || 'N/A'}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Farmer Contact:</span> ${order.farmerMobile || 'N/A'}
                </div>
            </div>
            <div class="details-right">
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span> ${order.orderId}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Trader Name:</span> ${order.traderName}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span> 
                    <span class="payment-status status-${order.adminToFarmerPayment.paymentStatus.toLowerCase()}">
                        ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Grade</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.productItems.map(item => `
                    <tr>
                        <td>${item.productName}</td>
                        <td>${item.grade}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.pricePerUnit)}</td>
                        <td>${formatCurrency(item.totalAmount)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="total-section">
            <div class="total-row">
                <span>Total Product Value:</span>
                <span>${formatCurrency(order.adminToFarmerPayment.totalAmount)}</span>
            </div>
            <div class="total-row">
                <span>Paid Amount:</span>
                <span style="color: #198754;">${formatCurrency(order.adminToFarmerPayment.paidAmount)}</span>
            </div>
            <div class="total-row">
                <span>Remaining Amount:</span>
                <span style="color: #dc3545;">${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</span>
            </div>
            <div class="total-row final">
                <span>TOTAL PAYABLE TO FARMER:</span>
                <span>${formatCurrency(order.adminToFarmerPayment.totalAmount)}</span>
            </div>
        </div>
        
        ${order.adminToFarmerPayment.paymentHistory && order.adminToFarmerPayment.paymentHistory.length > 0 ? `
        <div class="important-notes">
            <strong>Payment History:</strong><br>
            ${order.adminToFarmerPayment.paymentHistory.map(payment => `
            • ${formatDate(payment.paidDate)}: ${formatCurrency(payment.amount)}${payment.razorpayPaymentId ? ` (ID: ${payment.razorpayPaymentId})` : ''}<br>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div>Farmer's Signature</div>
                <div style="font-size: 11px; color: #666;">Date: _______________</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div>Authorized Signatory</div>
                <div style="font-size: 11px; color: #666;">KISAN TRADING</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This is a computer generated invoice. No signature required.</p>
            <p>KISAN TRADING • Agricultural Produce Trading Platform • Contact: support@kisanetpl.ai</p>
            <p>Invoice generated on: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Farmer_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTraderInvoice = (order: Order) => {
    if (!order || !order.traderToAdminPayment) return;

    const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Trader Payment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 20px;
        }
        .company-name {
            color: #0d6efd;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .company-tagline {
            color: #666;
            font-size: 14px;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .details-left, .details-right {
            flex: 1;
        }
        .detail-row {
            margin-bottom: 8px;
        }
        .detail-label {
            font-weight: bold;
            color: #495057;
            min-width: 150px;
            display: inline-block;
        }
        .table-container {
            margin: 30px 0;
            overflow-x: auto;
        }
        table {
            width: '100%';
            border-collapse: collapse;
        }
        th {
            background-color: #0d6efd;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #dee2e6;
        }
        .total-section {
            background: #e9ecef;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .total-row.final {
            border-top: 2px solid #0d6efd;
            padding-top: 15px;
            font-weight: bold;
            font-size: 18px;
            color: #0d6efd;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin: 40px 0 10px 0;
        }
        .important-notes {
            background: #d1ecf1;
            border-left: 4px solid #0dcaf0;
            padding: 15px;
            margin: 20px 0;
        }
        .payment-status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin-left: 10px;
        }
        .status-paid { background: #d1e7dd; color: #0f5132; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-partial { background: #cff4fc; color: #055160; }
        .charges-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-name">KISAN TRADING</div>
            <div class="company-tagline">Agricultural Produce Trading Platform</div>
            <div class="invoice-title">TRADER PAYMENT INVOICE</div>
        </div>
        
        <div class="invoice-details">
            <div class="details-left">
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span> ${order.orderId}-TRADER
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Date:</span> ${formatDate(new Date().toISOString())}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date:</span> ${formatDate(order.createdAt)}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Trader Name:</span> ${order.traderName}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Trader Contact:</span> ${order.traderMobile || 'N/A'}
                </div>
            </div>
            <div class="details-right">
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span> ${order.orderId}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Farmer Name:</span> ${order.farmerName || 'N/A'}
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span> 
                    <span class="payment-status status-${order.traderToAdminPayment.paymentStatus.toLowerCase()}">
                        ${order.traderToAdminPayment.paymentStatus.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Grade</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.productItems.map(item => `
                    <tr>
                        <td>${item.productName}</td>
                        <td>${item.grade}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.pricePerUnit)}</td>
                        <td>${formatCurrency(item.totalAmount)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="charges-section">
            <h4 style="margin-top: 0; color: #0d6efd;">Additional Charges</h4>
            <div class="total-row">
                <span>Platform Service Fee:</span>
                <span>Included in total</span>
            </div>
            <div class="total-row">
                <span>Transportation Charges:</span>
                <span>Included in total</span>
            </div>
            <div class="total-row">
                <span>Quality Inspection:</span>
                <span>Included in total</span>
            </div>
        </div>
        
        <div class="total-section">
            <div class="total-row">
                <span>Total Product Value:</span>
                <span>${formatCurrency(order.traderToAdminPayment.totalAmount)}</span>
            </div>
            <div class="total-row">
                <span>Paid Amount:</span>
                <span style="color: #198754;">${formatCurrency(order.traderToAdminPayment.paidAmount)}</span>
            </div>
            <div class="total-row">
                <span>Remaining Amount:</span>
                <span style="color: #dc3545;">${formatCurrency(order.traderToAdminPayment.remainingAmount)}</span>
            </div>
            <div class="total-row final">
                <span>TOTAL PAYABLE BY TRADER:</span>
                <span>${formatCurrency(order.traderToAdminPayment.totalAmount)}</span>
            </div>
        </div>
        
        ${order.traderToAdminPayment.paymentHistory && order.traderToAdminPayment.paymentHistory.length > 0 ? `
        <div class="important-notes">
            <strong>Payment History:</strong><br>
            ${order.traderToAdminPayment.paymentHistory.map(payment => `
            • ${formatDate(payment.paidDate)}: ${formatCurrency(payment.amount)}${payment.razorpayPaymentId ? ` (ID: ${payment.razorpayPaymentId})` : ''}<br>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="important-notes">
            <strong>Terms & Conditions:</strong><br>
            1. All payments are due within 7 days of invoice date<br>
            2. Late payments may incur additional charges<br>
            3. Goods remain property of KISAN TRADING until full payment is received<br>
            4. Disputes must be raised within 48 hours of delivery
        </div>
        
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div>Trader's Signature</div>
                <div style="font-size: 11px; color: #666;">Date: _______________</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div>Authorized Signatory</div>
                <div style="font-size: 11px; color: #666;">KISAN TRADING</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This is a computer generated invoice. No signature required.</p>
            <p>KISAN TRADING • Agricultural Produce Trading Platform • Contact: support@kisanetpl.ai</p>
            <p>Invoice generated on: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trader_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateFarmerInvoiceFromModal = () => {
    if (!currentOrder || !currentOrder.adminToFarmerPayment) return;
    generateFarmerInvoice(currentOrder);
  };

  const generateTraderInvoiceFromModal = () => {
    if (!currentOrder || !currentOrder.traderToAdminPayment) return;
    generateTraderInvoice(currentOrder);
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem 0', backgroundColor: '#f8f9fa' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid #0d6efd',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
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
    <>
      <div style={{ padding: '1rem 0', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <span style={{ marginRight: '0.5rem' }}>📋</span> Order Management
            </h1>
            <p style={{ color: '#6c757d' }}>Manage and verify transportation orders with payment details</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              padding: '1rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Order Status</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #ced4da',
                      backgroundColor: 'white',
                      color: '#495057',
                      fontSize: '1rem'
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Transporter Status</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #ced4da',
                      backgroundColor: 'white',
                      color: '#495057',
                      fontSize: '1rem'
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Search</label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #ced4da',
                      backgroundColor: 'white',
                      color: '#495057',
                      fontSize: '1rem'
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
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                    onClick={fetchOrders}
                  >
                    🔍 Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div>
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              padding: '1rem'
            }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}>📦</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>No orders found</h4>
                  <p style={{ color: '#6c757d' }}>Try adjusting your filters</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Order ID</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Trader</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Farmer</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Products</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Order Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Transporter Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Trader Payment</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Farmer Payment</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Verification</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          style={{
                            borderBottom: '1px solid #dee2e6',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '0.75rem' }}>
                            <strong style={{ color: '#0d6efd' }}>{order.orderId}</strong>
                            <br />
                            <small style={{ color: '#6c757d' }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div>{order.traderName}</div>
                            {order.traderMobile && (
                              <small style={{ color: '#6c757d' }}>{order.traderMobile}</small>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div>{order.farmerName || 'N/A'}</div>
                            {order.farmerMobile && (
                              <small style={{ color: '#6c757d' }}>{order.farmerMobile}</small>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.375rem',
                              backgroundColor: '#0dcaf0',
                              color: 'white',
                              fontSize: '0.875rem'
                            }}>
                              {order.productItems.length} item(s)
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.375rem',
                              backgroundColor: getStatusBadge(order.orderStatus),
                              color: 'white',
                              fontSize: '0.875rem'
                            }}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.375rem',
                              backgroundColor: getStatusBadge(order.transporterStatus || 'pending'),
                              color: 'white',
                              fontSize: '0.875rem'
                            }}>
                              {order.transporterStatus || 'pending'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
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
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: getStatusBadge(order.traderToAdminPayment.paymentStatus),
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  marginTop: '0.25rem'
                                }}>
                                  {order.traderToAdminPayment.paymentStatus}
                                </span>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
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
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: getStatusBadge(order.adminToFarmerPayment.paymentStatus),
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  marginTop: '0.25rem'
                                }}>
                                  {order.adminToFarmerPayment.paymentStatus}
                                </span>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {order.transporterDetails ? (
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: order.transporterDetails.transporterReached ? '#198754' : '#6c757d',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  cursor: 'help'
                                }}
                                  title="Reached">
                                  {order.transporterDetails.transporterReached ? '✓' : '✗'}
                                </span>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: order.transporterDetails.goodsConditionCorrect ? '#198754' : '#6c757d',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  cursor: 'help'
                                }}
                                  title="Condition">
                                  {order.transporterDetails.goodsConditionCorrect ? '✓' : '✗'}
                                </span>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: order.transporterDetails.quantityCorrect ? '#198754' : '#6c757d',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  cursor: 'help'
                                }}
                                  title="Quantity">
                                  {order.transporterDetails.quantityCorrect ? '✓' : '✗'}
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: '#6c757d' }}>No transporter</span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              <button
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  border: 'none',
                                  backgroundColor: '#0d6efd',
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer'
                                }}
                                onClick={() => openDetailsModal(order)}
                              >
                                👁️ View
                              </button>
                              <button
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  border: 'none',
                                  backgroundColor: '#ffc107',
                                  color: 'black',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  if (window.openEditOrderModal) {
                                    window.openEditOrderModal(order.orderId);
                                  }
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  border: 'none',
                                  backgroundColor: '#198754',
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generateTraderInvoice(order);
                                }}
                                disabled={!order.traderToAdminPayment}
                              >
                                📥 Trader Invoice
                              </button>
                              <button
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  border: 'none',
                                  backgroundColor: '#20c997',
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generateFarmerInvoice(order);
                                }}
                                disabled={!order.adminToFarmerPayment}
                              >
                                📥 Farmer Invoice
                              </button>
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
      </div>

      {/* Details Modal */}
      {showModal && (
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
          zIndex: 1050
        }}>
          <div style={{
            width: '90%',
            maxWidth: '1140px',
            maxHeight: '90vh',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              backgroundColor: '#0d6efd',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0 }}>
                📄 Order Details
              </h5>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              {currentOrder && (
                <>
                  {/* Invoice Download Buttons */}
                  <div style={{
                    marginBottom: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #dee2e6',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h6 style={{ margin: 0 }}>
                        📄 Download Invoices
                      </h6>
                    </div>
                    <div style={{
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: '#198754',
                          color: 'white',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onClick={generateFarmerInvoiceFromModal}
                        disabled={!currentOrder.adminToFarmerPayment}
                      >
                        <span>📥</span> View Farmer Invoice
                      </button>
                      <button
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: '#0d6efd',
                          color: 'white',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onClick={generateTraderInvoiceFromModal}
                        disabled={!currentOrder.traderToAdminPayment}
                      >
                        <span>📥</span> View Trader Invoice
                      </button>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div style={{
                    marginBottom: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #dee2e6',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h6 style={{ margin: 0 }}>
                        ℹ️ Order Information
                      </h6>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        <div>
                          <table style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Order ID:</td>
                                <td style={{ padding: '0.375rem' }}>
                                  <strong>{currentOrder.orderId}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.375rem', color: '#6c757d' }}>Trader:</td>
                                <td style={{ padding: '0.375rem' }}>
                                  {currentOrder.traderName}
                                  {currentOrder.traderMobile && (
                                    <>
                                      <br />
                                      <small>{currentOrder.traderMobile}</small>
                                    </>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.375rem', color: '#6c757d' }}>Farmer:</td>
                                <td style={{ padding: '0.375rem' }}>
                                  {currentOrder.farmerName || 'N/A'}
                                  {currentOrder.farmerMobile && (
                                    <>
                                      <br />
                                      <small>{currentOrder.farmerMobile}</small>
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
                                <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Order Status:</td>
                                <td style={{ padding: '0.375rem' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    backgroundColor: getStatusBadge(currentOrder.orderStatus),
                                    color: 'white',
                                    fontSize: '0.875rem'
                                  }}>
                                    {currentOrder.orderStatus}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.375rem', color: '#6c757d' }}>Transporter Status:</td>
                                <td style={{ padding: '0.375rem' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    backgroundColor: getStatusBadge(currentOrder.transporterStatus || 'pending'),
                                    color: 'white',
                                    fontSize: '0.875rem'
                                  }}>
                                    {currentOrder.transporterStatus || 'pending'}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.375rem', color: '#6c757d' }}>Created At:</td>
                                <td style={{ padding: '0.375rem' }}>{new Date(currentOrder.createdAt).toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Trader to Admin Payment */}
                    <div style={{
                      borderRadius: '0.375rem',
                      border: '1px solid #dee2e6',
                      borderLeft: '3px solid #0d6efd',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}>
                      <div style={{
                        backgroundColor: '#0d6efd',
                        color: 'white',
                        padding: '0.75rem 1rem'
                      }}>
                        🔄 Trader to Admin Payment
                      </div>
                      <div style={{ padding: '1rem', flex: 1 }}>
                        {currentOrder.traderToAdminPayment ? (
                          <>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#6c757d' }}>Total Amount:</span>
                                <strong style={{ fontSize: '1.25rem', margin: 0 }}>
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
                                  {formatCurrency(
                                    currentOrder.traderToAdminPayment.remainingAmount
                                  )}
                                </strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6c757d' }}>Status:</span>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus),
                                  color: 'white',
                                  fontSize: '0.875rem'
                                }}>
                                  {currentOrder.traderToAdminPayment.paymentStatus}
                                </span>
                              </div>
                            </div>

                            {currentOrder.traderToAdminPayment.paymentHistory &&
                              currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
                                <div>
                                  <h6 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Payment History:</h6>
                                  <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                          <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Date</th>
                                          <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Amount</th>
                                          <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Payment ID</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {currentOrder.traderToAdminPayment.paymentHistory.map(
                                          (payment, idx) => (
                                            <tr key={idx}>
                                              <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
                                                <small>
                                                  {new Date(payment.paidDate).toLocaleDateString()}
                                                </small>
                                              </td>
                                              <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>{formatCurrency(payment.amount)}</td>
                                              <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
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
                          <p style={{ color: '#6c757d' }}>No payment details available</p>
                        )}
                      </div>
                    </div>

                    {/* Admin to Farmer Payment */}
                    <div style={{
                      borderRadius: '0.375rem',
                      border: '1px solid #dee2e6',
                      borderLeft: '3px solid #198754',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}>
                      <div style={{
                        backgroundColor: '#198754',
                        color: 'white',
                        padding: '0.75rem 1rem'
                      }}>
                        🔄 Admin to Farmer Payment
                      </div>
                      <div style={{ padding: '1rem', flex: 1 }}>
                        {currentOrder.adminToFarmerPayment ? (
                          <>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#6c757d' }}>Total Amount:</span>
                                <strong style={{ fontSize: '1.25rem', margin: 0 }}>
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
                                  {formatCurrency(
                                    currentOrder.adminToFarmerPayment.remainingAmount
                                  )}
                                </strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6c757d' }}>Status:</span>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus),
                                  color: 'white',
                                  fontSize: '0.875rem'
                                }}>
                                  {currentOrder.adminToFarmerPayment.paymentStatus}
                                </span>
                              </div>
                            </div>

                            {currentOrder.adminToFarmerPayment.paymentHistory &&
                              currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
                                <div>
                                  <h6 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Payment History:</h6>
                                  <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                          <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Date</th>
                                          <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Amount</th>
                                          <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Payment ID</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {currentOrder.adminToFarmerPayment.paymentHistory.map(
                                          (payment, idx) => (
                                            <tr key={idx}>
                                              <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
                                                <small>
                                                  {new Date(payment.paidDate).toLocaleDateString()}
                                                </small>
                                              </td>
                                              <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>{formatCurrency(payment.amount)}</td>
                                              <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
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
                          <p style={{ color: '#6c757d' }}>No payment details available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Items */}
                  <div style={{
                    marginBottom: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #dee2e6',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h6 style={{ margin: 0 }}>
                        📦 Product Items
                      </h6>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Product</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Grade</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Quantity</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Price/Unit</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Total</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Market</th>
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
                        marginBottom: '1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #0dcaf0',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          backgroundColor: '#0dcaf0',
                          color: 'white',
                          padding: '0.75rem 1rem'
                        }}>
                          🚚 Transporter Information
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            <div>
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Name:</td>
                                    <td style={{ padding: '0.375rem' }}><strong>{currentOrder.transporterDetails.transporterName}</strong></td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d' }}>Mobile:</td>
                                    <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.transporterMobile || 'N/A'}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d' }}>Email:</td>
                                    <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.transporterEmail || 'N/A'}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d' }}>Driver:</td>
                                    <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.driverName || 'N/A'}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Vehicle Type:</td>
                                    <td style={{ padding: '0.375rem' }}><strong>{currentOrder.transporterDetails.vehicleType}</strong></td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d' }}>Vehicle Number:</td>
                                    <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.vehicleNumber}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d' }}>Capacity:</td>
                                    <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '0.375rem', color: '#6c757d' }}>Accepted At:</td>
                                    <td style={{ padding: '0.375rem' }}>{new Date(currentOrder.transporterDetails.acceptedAt).toLocaleString()}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        borderRadius: '0.375rem',
                        border: '1px solid #198754',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          backgroundColor: '#198754',
                          color: 'white',
                          padding: '0.75rem 1rem'
                        }}>
                          ✅ Verification Checklist
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <div style={{
                            backgroundColor: verificationData.transporterReached ? '#d1e7dd' : '#f8f9fa',
                            borderRadius: '5px',
                            padding: '1rem',
                            marginBottom: '1rem',
                            transition: 'background-color 0.2s'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <input
                                type="checkbox"
                                id="transporterReached"
                                checked={verificationData.transporterReached}
                                onChange={(e) =>
                                  setVerificationData({
                                    ...verificationData,
                                    transporterReached: e.target.checked,
                                  })
                                }
                                style={{ marginTop: '0.25rem' }}
                              />
                              <div>
                                <label htmlFor="transporterReached" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                                  Transporter Reached Destination
                                </label>
                                <small style={{ color: '#6c757d', display: 'block' }}>
                                  Confirm that transporter has arrived at the delivery location
                                </small>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            backgroundColor: verificationData.goodsConditionCorrect ? '#d1e7dd' : '#f8f9fa',
                            borderRadius: '5px',
                            padding: '1rem',
                            marginBottom: '1rem',
                            transition: 'background-color 0.2s'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <input
                                type="checkbox"
                                id="goodsConditionCorrect"
                                checked={verificationData.goodsConditionCorrect}
                                onChange={(e) =>
                                  setVerificationData({
                                    ...verificationData,
                                    goodsConditionCorrect: e.target.checked,
                                  })
                                }
                                style={{ marginTop: '0.25rem' }}
                              />
                              <div>
                                <label htmlFor="goodsConditionCorrect" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                                  Goods Condition is Correct
                                </label>
                                <small style={{ color: '#6c757d', display: 'block' }}>
                                  Verify that goods are in good condition without damage
                                </small>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            backgroundColor: verificationData.quantityCorrect ? '#d1e7dd' : '#f8f9fa',
                            borderRadius: '5px',
                            padding: '1rem',
                            marginBottom: '1rem',
                            transition: 'background-color 0.2s'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <input
                                type="checkbox"
                                id="quantityCorrect"
                                checked={verificationData.quantityCorrect}
                                onChange={(e) =>
                                  setVerificationData({
                                    ...verificationData,
                                    quantityCorrect: e.target.checked,
                                  })
                                }
                                style={{ marginTop: '0.25rem' }}
                              />
                              <div>
                                <label htmlFor="quantityCorrect" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                                  Quantity is Correct
                                </label>
                                <small style={{ color: '#6c757d', display: 'block' }}>
                                  Confirm that delivered quantity matches order quantity
                                </small>
                              </div>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="adminNotes" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                              Admin Notes
                            </label>
                            <textarea
                              style={{
                                width: '100%',
                                padding: '0.375rem 0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #ced4da',
                                minHeight: '6rem'
                              }}
                              id="adminNotes"
                              placeholder="Add any notes or observations..."
                              value={verificationData.adminNotes}
                              onChange={(e) =>
                                setVerificationData({
                                  ...verificationData,
                                  adminNotes: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>

                          {currentOrder.transporterDetails.verifiedAt && (
                            <div style={{
                              backgroundColor: '#d1ecf1',
                              border: '1px solid #bee5eb',
                              borderRadius: '0.375rem',
                              padding: '1rem',
                              marginBottom: '1rem'
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
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              border: 'none',
                              backgroundColor: '#198754',
                              color: 'white',
                              fontSize: '1rem',
                              cursor: 'pointer'
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
                      border: '1px solid #ffecb5',
                      borderRadius: '0.375rem',
                      padding: '1rem',
                      color: '#856404'
                    }}>
                      ⚠️ No transporter assigned to this order yet.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <OrderEditModal />
    </>
  );
};

export default AdminOrders;