// 'use client';

// import React, { useEffect, useState } from 'react';
// import OrderEditModal from '../OrderEditModal/page';


// declare global {
//   interface Window {
//     openEditOrderModal?: (orderId: string) => void;
//   }
// }

// interface MarketDetails {
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }

// interface ProductItem {
//   productId: string;
//   productName: string;
//   grade: string;
//   quantity: number;
//   deliveryDate: string;
//   nearestMarket: string;
//   marketDetails: MarketDetails | null;
//   pricePerUnit: number;
//   totalAmount: number;
// }

// interface PaymentRecord {
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
// }

// interface PaymentDetails {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   paymentHistory: PaymentRecord[];
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile?: string;
//   transporterEmail?: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity?: string;
//   driverName?: string;
//   driverMobile?: string;
//   acceptedAt: string;
//   transporterReached?: boolean;
//   goodsConditionCorrect?: boolean;
//   quantityCorrect?: boolean;
//   adminNotes?: string;
//   verifiedBy?: string;
//   verifiedByName?: string;
//   verifiedAt?: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   traderMobile?: string;
//   traderEmail?: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   farmerEmail?: string;
//   productItems: ProductItem[];
//   orderStatus: string;
//   transporterStatus?: string;
//   transporterDetails?: TransporterDetails;
//   traderToAdminPayment?: PaymentDetails;
//   adminToFarmerPayment?: PaymentDetails;
//   createdAt: string;
// }

// const AdminOrders: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [verificationData, setVerificationData] = useState({
//     transporterReached: false,
//     goodsConditionCorrect: false,
//     quantityCorrect: false,
//     adminNotes: '',
//   });

//   const API_BASE = 'https://kisan.etpl.ai/api/admin';

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     let url = `${API_BASE}/orders?`;
//     if (statusFilter) url += `status=${statusFilter}&`;
//     if (transporterStatusFilter) url += `transporterStatus=${transporterStatusFilter}&`;
//     if (searchInput) url += `search=${searchInput}&`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setOrders(data.data);
//       } else {
//         alert('Failed to fetch orders');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openDetailsModal = (order: Order) => {
//     setCurrentOrder(order);
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const saveVerification = async () => {
//     if (!currentOrder || !currentOrder.transporterDetails) {
//       alert('No transporter details available');
//       return;
//     }

//     const adminId = localStorage.getItem('adminId') || 'admin-001';
//     const adminName = localStorage.getItem('userName') || 'Admin';

//     const data = {
//       ...verificationData,
//       adminId,
//       adminName,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert('Verification updated successfully!');
//         setShowModal(false);
//         fetchOrders();
//       } else {
//         alert('Failed to update verification: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error updating verification');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusColors: { [key: string]: string } = {
//       pending: '#ffc107',
//       processing: '#0dcaf0',
//       in_transit: '#0d6efd',
//       completed: '#198754',
//       cancelled: '#dc3545',
//       accepted: '#198754',
//       rejected: '#dc3545',
//       partial: '#ffc107',
//       paid: '#198754',
//     };
//     return statusColors[status] || '#6c757d';
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const generateFarmerInvoice = (order: Order) => {
//     if (!order || !order.adminToFarmerPayment) return;

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Farmer Payment</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 20px;
//             background-color: #f8f9fa;
//         }
//         .invoice-container {
//             max-width: 800px;
//             margin: 0 auto;
//             background: white;
//             padding: 30px;
//             border-radius: 10px;
//             box-shadow: 0 0 20px rgba(0,0,0,0.1);
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 2px solid #198754;
//             padding-bottom: 20px;
//         }
//         .company-name {
//             color: #198754;
//             font-size: 28px;
//             font-weight: bold;
//             margin-bottom: 5px;
//         }
//         .company-tagline {
//             color: #666;
//             font-size: 14px;
//         }
//         .invoice-title {
//             font-size: 24px;
//             font-weight: bold;
//             color: #333;
//             margin: 20px 0;
//         }
//         .invoice-details {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 30px;
//             background: #f8f9fa;
//             padding: 15px;
//             border-radius: 5px;
//         }
//         .details-left, .details-right {
//             flex: 1;
//         }
//         .detail-row {
//             margin-bottom: 8px;
//         }
//         .detail-label {
//             font-weight: bold;
//             color: #495057;
//             min-width: 150px;
//             display: inline-block;
//         }
//         .table-container {
//             margin: 30px 0;
//             overflow-x: auto;
//         }
//         table {
//             width: '100%';
//             border-collapse: collapse;
//         }
//         th {
//             background-color: #198754;
//             color: white;
//             padding: 12px;
//             text-align: left;
//         }
//         td {
//             padding: 10px;
//             border-bottom: 1px solid #dee2e6;
//         }
//         .total-section {
//             background: #e9ecef;
//             padding: 20px;
//             border-radius: 5px;
//             margin: 20px 0;
//         }
//         .total-row {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 10px;
//             padding: 5px 0;
//         }
//         .total-row.final {
//             border-top: 2px solid #198754;
//             padding-top: 15px;
//             font-weight: bold;
//             font-size: 18px;
//             color: #198754;
//         }
//         .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #dee2e6;
//             text-align: center;
//             color: #666;
//             font-size: 12px;
//         }
//         .signature-section {
//             margin-top: 50px;
//             display: flex;
//             justify-content: space-between;
//         }
//         .signature-box {
//             text-align: center;
//             width: 200px;
//         }
//         .signature-line {
//             border-top: 1px solid #333;
//             margin: 40px 0 10px 0;
//         }
//         .important-notes {
//             background: #fff3cd;
//             border-left: 4px solid #ffc107;
//             padding: 15px;
//             margin: 20px 0;
//         }
//         .payment-status {
//             display: inline-block;
//             padding: 5px 15px;
//             border-radius: 20px;
//             font-weight: bold;
//             margin-left: 10px;
//         }
//         .status-paid { background: #d1e7dd; color: #0f5132; }
//         .status-pending { background: #fff3cd; color: #856404; }
//         .status-partial { background: #cff4fc; color: #055160; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="company-tagline">Agricultural Produce Trading Platform</div>
//             <div class="invoice-title">FARMER PAYMENT INVOICE</div>
//         </div>
        
//         <div class="invoice-details">
//             <div class="details-left">
//                 <div class="detail-row">
//                     <span class="detail-label">Invoice Number:</span> ${order.orderId}-FARMER
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Invoice Date:</span> ${formatDate(new Date().toISOString())}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Order Date:</span> ${formatDate(order.createdAt)}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Farmer Name:</span> ${order.farmerName || 'N/A'}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Farmer Contact:</span> ${order.farmerMobile || 'N/A'}
//                 </div>
//             </div>
//             <div class="details-right">
//                 <div class="detail-row">
//                     <span class="detail-label">Order ID:</span> ${order.orderId}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Trader Name:</span> ${order.traderName}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Payment Status:</span> 
//                     <span class="payment-status status-${order.adminToFarmerPayment.paymentStatus.toLowerCase()}">
//                         ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}
//                     </span>
//                 </div>
//             </div>
//         </div>
        
//         <div class="table-container">
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Grade</th>
//                         <th>Quantity</th>
//                         <th>Unit Price</th>
//                         <th>Total Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${order.productItems.map(item => `
//                     <tr>
//                         <td>${item.productName}</td>
//                         <td>${item.grade}</td>
//                         <td>${item.quantity}</td>
//                         <td>${formatCurrency(item.pricePerUnit)}</td>
//                         <td>${formatCurrency(item.totalAmount)}</td>
//                     </tr>
//                     `).join('')}
//                 </tbody>
//             </table>
//         </div>
        
//         <div class="total-section">
//             <div class="total-row">
//                 <span>Total Product Value:</span>
//                 <span>${formatCurrency(order.adminToFarmerPayment.totalAmount)}</span>
//             </div>
//             <div class="total-row">
//                 <span>Paid Amount:</span>
//                 <span style="color: #198754;">${formatCurrency(order.adminToFarmerPayment.paidAmount)}</span>
//             </div>
//             <div class="total-row">
//                 <span>Remaining Amount:</span>
//                 <span style="color: #dc3545;">${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</span>
//             </div>
//             <div class="total-row final">
//                 <span>TOTAL PAYABLE TO FARMER:</span>
//                 <span>${formatCurrency(order.adminToFarmerPayment.totalAmount)}</span>
//             </div>
//         </div>
        
//         ${order.adminToFarmerPayment.paymentHistory && order.adminToFarmerPayment.paymentHistory.length > 0 ? `
//         <div class="important-notes">
//             <strong>Payment History:</strong><br>
//             ${order.adminToFarmerPayment.paymentHistory.map(payment => `
//             • ${formatDate(payment.paidDate)}: ${formatCurrency(payment.amount)}${payment.razorpayPaymentId ? ` (ID: ${payment.razorpayPaymentId})` : ''}<br>
//             `).join('')}
//         </div>
//         ` : ''}
        
//         <div class="signature-section">
//             <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Farmer's Signature</div>
//                 <div style="font-size: 11px; color: #666;">Date: _______________</div>
//             </div>
//             <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Authorized Signatory</div>
//                 <div style="font-size: 11px; color: #666;">KISAN TRADING</div>
//             </div>
//         </div>
        
//         <div class="footer">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform • Contact: support@kisanetpl.ai</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Farmer_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const generateTraderInvoice = (order: Order) => {
//     if (!order || !order.traderToAdminPayment) return;

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Trader Payment</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 20px;
//             background-color: #f8f9fa;
//         }
//         .invoice-container {
//             max-width: 800px;
//             margin: 0 auto;
//             background: white;
//             padding: 30px;
//             border-radius: 10px;
//             box-shadow: 0 0 20px rgba(0,0,0,0.1);
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 2px solid #0d6efd;
//             padding-bottom: 20px;
//         }
//         .company-name {
//             color: #0d6efd;
//             font-size: 28px;
//             font-weight: bold;
//             margin-bottom: 5px;
//         }
//         .company-tagline {
//             color: #666;
//             font-size: 14px;
//         }
//         .invoice-title {
//             font-size: 24px;
//             font-weight: bold;
//             color: #333;
//             margin: 20px 0;
//         }
//         .invoice-details {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 30px;
//             background: #f8f9fa;
//             padding: 15px;
//             border-radius: 5px;
//         }
//         .details-left, .details-right {
//             flex: 1;
//         }
//         .detail-row {
//             margin-bottom: 8px;
//         }
//         .detail-label {
//             font-weight: bold;
//             color: #495057;
//             min-width: 150px;
//             display: inline-block;
//         }
//         .table-container {
//             margin: 30px 0;
//             overflow-x: auto;
//         }
//         table {
//             width: '100%';
//             border-collapse: collapse;
//         }
//         th {
//             background-color: #0d6efd;
//             color: white;
//             padding: 12px;
//             text-align: left;
//         }
//         td {
//             padding: 10px;
//             border-bottom: 1px solid #dee2e6;
//         }
//         .total-section {
//             background: #e9ecef;
//             padding: 20px;
//             border-radius: 5px;
//             margin: 20px 0;
//         }
//         .total-row {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 10px;
//             padding: 5px 0;
//         }
//         .total-row.final {
//             border-top: 2px solid #0d6efd;
//             padding-top: 15px;
//             font-weight: bold;
//             font-size: 18px;
//             color: #0d6efd;
//         }
//         .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #dee2e6;
//             text-align: center;
//             color: #666;
//             font-size: 12px;
//         }
//         .signature-section {
//             margin-top: 50px;
//             display: flex;
//             justify-content: space-between;
//         }
//         .signature-box {
//             text-align: center;
//             width: 200px;
//         }
//         .signature-line {
//             border-top: 1px solid #333;
//             margin: 40px 0 10px 0;
//         }
//         .important-notes {
//             background: #d1ecf1;
//             border-left: 4px solid #0dcaf0;
//             padding: 15px;
//             margin: 20px 0;
//         }
//         .payment-status {
//             display: inline-block;
//             padding: 5px 15px;
//             border-radius: 20px;
//             font-weight: bold;
//             margin-left: 10px;
//         }
//         .status-paid { background: #d1e7dd; color: #0f5132; }
//         .status-pending { background: #fff3cd; color: #856404; }
//         .status-partial { background: #cff4fc; color: #055160; }
//         .charges-section {
//             background: #f8f9fa;
//             padding: 15px;
//             border-radius: 5px;
//             margin: 15px 0;
//         }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="company-tagline">Agricultural Produce Trading Platform</div>
//             <div class="invoice-title">TRADER PAYMENT INVOICE</div>
//         </div>
        
//         <div class="invoice-details">
//             <div class="details-left">
//                 <div class="detail-row">
//                     <span class="detail-label">Invoice Number:</span> ${order.orderId}-TRADER
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Invoice Date:</span> ${formatDate(new Date().toISOString())}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Order Date:</span> ${formatDate(order.createdAt)}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Trader Name:</span> ${order.traderName}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Trader Contact:</span> ${order.traderMobile || 'N/A'}
//                 </div>
//             </div>
//             <div class="details-right">
//                 <div class="detail-row">
//                     <span class="detail-label">Order ID:</span> ${order.orderId}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Farmer Name:</span> ${order.farmerName || 'N/A'}
//                 </div>
//                 <div class="detail-row">
//                     <span class="detail-label">Payment Status:</span> 
//                     <span class="payment-status status-${order.traderToAdminPayment.paymentStatus.toLowerCase()}">
//                         ${order.traderToAdminPayment.paymentStatus.toUpperCase()}
//                     </span>
//                 </div>
//             </div>
//         </div>
        
//         <div class="table-container">
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Grade</th>
//                         <th>Quantity</th>
//                         <th>Unit Price</th>
//                         <th>Total Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${order.productItems.map(item => `
//                     <tr>
//                         <td>${item.productName}</td>
//                         <td>${item.grade}</td>
//                         <td>${item.quantity}</td>
//                         <td>${formatCurrency(item.pricePerUnit)}</td>
//                         <td>${formatCurrency(item.totalAmount)}</td>
//                     </tr>
//                     `).join('')}
//                 </tbody>
//             </table>
//         </div>
        
//         <div class="charges-section">
//             <h4 style="margin-top: 0; color: #0d6efd;">Additional Charges</h4>
//             <div class="total-row">
//                 <span>Platform Service Fee:</span>
//                 <span>Included in total</span>
//             </div>
//             <div class="total-row">
//                 <span>Transportation Charges:</span>
//                 <span>Included in total</span>
//             </div>
//             <div class="total-row">
//                 <span>Quality Inspection:</span>
//                 <span>Included in total</span>
//             </div>
//         </div>
        
//         <div class="total-section">
//             <div class="total-row">
//                 <span>Total Product Value:</span>
//                 <span>${formatCurrency(order.traderToAdminPayment.totalAmount)}</span>
//             </div>
//             <div class="total-row">
//                 <span>Paid Amount:</span>
//                 <span style="color: #198754;">${formatCurrency(order.traderToAdminPayment.paidAmount)}</span>
//             </div>
//             <div class="total-row">
//                 <span>Remaining Amount:</span>
//                 <span style="color: #dc3545;">${formatCurrency(order.traderToAdminPayment.remainingAmount)}</span>
//             </div>
//             <div class="total-row final">
//                 <span>TOTAL PAYABLE BY TRADER:</span>
//                 <span>${formatCurrency(order.traderToAdminPayment.totalAmount)}</span>
//             </div>
//         </div>
        
//         ${order.traderToAdminPayment.paymentHistory && order.traderToAdminPayment.paymentHistory.length > 0 ? `
//         <div class="important-notes">
//             <strong>Payment History:</strong><br>
//             ${order.traderToAdminPayment.paymentHistory.map(payment => `
//             • ${formatDate(payment.paidDate)}: ${formatCurrency(payment.amount)}${payment.razorpayPaymentId ? ` (ID: ${payment.razorpayPaymentId})` : ''}<br>
//             `).join('')}
//         </div>
//         ` : ''}
        
//         <div class="important-notes">
//             <strong>Terms & Conditions:</strong><br>
//             1. All payments are due within 7 days of invoice date<br>
//             2. Late payments may incur additional charges<br>
//             3. Goods remain property of KISAN TRADING until full payment is received<br>
//             4. Disputes must be raised within 48 hours of delivery
//         </div>
        
//         <div class="signature-section">
//             <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Trader's Signature</div>
//                 <div style="font-size: 11px; color: #666;">Date: _______________</div>
//             </div>
//             <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Authorized Signatory</div>
//                 <div style="font-size: 11px; color: #666;">KISAN TRADING</div>
//             </div>
//         </div>
        
//         <div class="footer">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform • Contact: support@kisanetpl.ai</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Trader_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const generateFarmerInvoiceFromModal = () => {
//     if (!currentOrder || !currentOrder.adminToFarmerPayment) return;
//     generateFarmerInvoice(currentOrder);
//   };

//   const generateTraderInvoiceFromModal = () => {
//     if (!currentOrder || !currentOrder.traderToAdminPayment) return;
//     generateTraderInvoice(currentOrder);
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '1rem 0', backgroundColor: '#f8f9fa' }}>
//         <div style={{ textAlign: 'center', padding: '3rem 0' }}>
//           <div style={{
//             width: '3rem',
//             height: '3rem',
//             border: '4px solid #0d6efd',
//             borderTopColor: 'transparent',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto'
//           }}></div>
//           <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading orders...</p>
//         </div>
//         <style jsx>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div style={{ padding: '1rem 0', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//         {/* Header */}
//         <div style={{ marginBottom: '1.5rem' }}>
//           <div>
//             <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
//               <span style={{ marginRight: '0.5rem' }}>📋</span> Order Management
//             </h1>
//             <p style={{ color: '#6c757d' }}>Manage and verify transportation orders with payment details</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div style={{ marginBottom: '1.5rem' }}>
//           <div>
//             <div style={{
//               backgroundColor: 'white',
//               borderRadius: '0.375rem',
//               boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
//               padding: '1rem'
//             }}>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Order Status</label>
//                   <select
//                     style={{
//                       width: '100%',
//                       padding: '0.375rem 0.75rem',
//                       borderRadius: '0.375rem',
//                       border: '1px solid #ced4da',
//                       backgroundColor: 'white',
//                       color: '#495057',
//                       fontSize: '1rem'
//                     }}
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                   >
//                     <option value="">All Statuses</option>
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                     <option value="in_transit">In Transit</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Transporter Status</label>
//                   <select
//                     style={{
//                       width: '100%',
//                       padding: '0.375rem 0.75rem',
//                       borderRadius: '0.375rem',
//                       border: '1px solid #ced4da',
//                       backgroundColor: 'white',
//                       color: '#495057',
//                       fontSize: '1rem'
//                     }}
//                     value={transporterStatusFilter}
//                     onChange={(e) => setTransporterStatusFilter(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="completed">Completed</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057' }}>Search</label>
//                   <input
//                     type="text"
//                     style={{
//                       width: '100%',
//                       padding: '0.375rem 0.75rem',
//                       borderRadius: '0.375rem',
//                       border: '1px solid #ced4da',
//                       backgroundColor: 'white',
//                       color: '#495057',
//                       fontSize: '1rem'
//                     }}
//                     value={searchInput}
//                     onChange={(e) => setSearchInput(e.target.value)}
//                     placeholder="Order ID, Trader, Farmer..."
//                   />
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'flex-end' }}>
//                   <button
//                     style={{
//                       width: '100%',
//                       padding: '0.375rem 0.75rem',
//                       borderRadius: '0.375rem',
//                       border: 'none',
//                       backgroundColor: '#0d6efd',
//                       color: 'white',
//                       fontSize: '1rem',
//                       cursor: 'pointer'
//                     }}
//                     onClick={fetchOrders}
//                   >
//                     🔍 Filter
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div>
//           <div>
//             <div style={{
//               backgroundColor: 'white',
//               borderRadius: '0.375rem',
//               boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
//               padding: '1rem'
//             }}>
//               {orders.length === 0 ? (
//                 <div style={{ textAlign: 'center', padding: '3rem 0' }}>
//                   <div style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}>📦</div>
//                   <h4 style={{ marginBottom: '0.5rem' }}>No orders found</h4>
//                   <p style={{ color: '#6c757d' }}>Try adjusting your filters</p>
//                 </div>
//               ) : (
//                 <div style={{ overflowX: 'auto' }}>
//                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead style={{ backgroundColor: '#f8f9fa' }}>
//                       <tr>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Order ID</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Trader</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Farmer</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Products</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Order Status</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Transporter Status</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Trader Payment</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Farmer Payment</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Verification</th>
//                         <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map((order) => (
//                         <tr
//                           key={order._id}
//                           style={{
//                             borderBottom: '1px solid #dee2e6',
//                             cursor: 'pointer',
//                             transition: 'background-color 0.2s'
//                           }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <td style={{ padding: '0.75rem' }}>
//                             <strong style={{ color: '#0d6efd' }}>{order.orderId}</strong>
//                             <br />
//                             <small style={{ color: '#6c757d' }}>
//                               {new Date(order.createdAt).toLocaleDateString()}
//                             </small>
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             <div>{order.traderName}</div>
//                             {order.traderMobile && (
//                               <small style={{ color: '#6c757d' }}>{order.traderMobile}</small>
//                             )}
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             <div>{order.farmerName || 'N/A'}</div>
//                             {order.farmerMobile && (
//                               <small style={{ color: '#6c757d' }}>{order.farmerMobile}</small>
//                             )}
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             <span style={{
//                               display: 'inline-block',
//                               padding: '0.25rem 0.5rem',
//                               borderRadius: '0.375rem',
//                               backgroundColor: '#0dcaf0',
//                               color: 'white',
//                               fontSize: '0.875rem'
//                             }}>
//                               {order.productItems.length} item(s)
//                             </span>
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             <span style={{
//                               display: 'inline-block',
//                               padding: '0.25rem 0.5rem',
//                               borderRadius: '0.375rem',
//                               backgroundColor: getStatusBadge(order.orderStatus),
//                               color: 'white',
//                               fontSize: '0.875rem'
//                             }}>
//                               {order.orderStatus}
//                             </span>
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             <span style={{
//                               display: 'inline-block',
//                               padding: '0.25rem 0.5rem',
//                               borderRadius: '0.375rem',
//                               backgroundColor: getStatusBadge(order.transporterStatus || 'pending'),
//                               color: 'white',
//                               fontSize: '0.875rem'
//                             }}>
//                               {order.transporterStatus || 'pending'}
//                             </span>
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             {order.traderToAdminPayment ? (
//                               <div>
//                                 <div>
//                                   <small style={{ color: '#6c757d' }}>Total:</small>{' '}
//                                   <strong>
//                                     {formatCurrency(order.traderToAdminPayment.totalAmount)}
//                                   </strong>
//                                 </div>
//                                 <div>
//                                   <small style={{ color: '#6c757d' }}>Paid:</small>{' '}
//                                   {formatCurrency(order.traderToAdminPayment.paidAmount)}
//                                 </div>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: getStatusBadge(order.traderToAdminPayment.paymentStatus),
//                                   color: 'white',
//                                   fontSize: '0.75rem',
//                                   marginTop: '0.25rem'
//                                 }}>
//                                   {order.traderToAdminPayment.paymentStatus}
//                                 </span>
//                               </div>
//                             ) : (
//                               'N/A'
//                             )}
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             {order.adminToFarmerPayment ? (
//                               <div>
//                                 <div>
//                                   <small style={{ color: '#6c757d' }}>Total:</small>{' '}
//                                   <strong>
//                                     {formatCurrency(order.adminToFarmerPayment.totalAmount)}
//                                   </strong>
//                                 </div>
//                                 <div>
//                                   <small style={{ color: '#6c757d' }}>Paid:</small>{' '}
//                                   {formatCurrency(order.adminToFarmerPayment.paidAmount)}
//                                 </div>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: getStatusBadge(order.adminToFarmerPayment.paymentStatus),
//                                   color: 'white',
//                                   fontSize: '0.75rem',
//                                   marginTop: '0.25rem'
//                                 }}>
//                                   {order.adminToFarmerPayment.paymentStatus}
//                                 </span>
//                               </div>
//                             ) : (
//                               'N/A'
//                             )}
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             {order.transporterDetails ? (
//                               <div style={{ display: 'flex', gap: '0.25rem' }}>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: order.transporterDetails.transporterReached ? '#198754' : '#6c757d',
//                                   color: 'white',
//                                   fontSize: '0.75rem',
//                                   cursor: 'help'
//                                 }}
//                                   title="Reached">
//                                   {order.transporterDetails.transporterReached ? '✓' : '✗'}
//                                 </span>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: order.transporterDetails.goodsConditionCorrect ? '#198754' : '#6c757d',
//                                   color: 'white',
//                                   fontSize: '0.75rem',
//                                   cursor: 'help'
//                                 }}
//                                   title="Condition">
//                                   {order.transporterDetails.goodsConditionCorrect ? '✓' : '✗'}
//                                 </span>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: order.transporterDetails.quantityCorrect ? '#198754' : '#6c757d',
//                                   color: 'white',
//                                   fontSize: '0.75rem',
//                                   cursor: 'help'
//                                 }}
//                                   title="Quantity">
//                                   {order.transporterDetails.quantityCorrect ? '✓' : '✗'}
//                                 </span>
//                               </div>
//                             ) : (
//                               <span style={{ color: '#6c757d' }}>No transporter</span>
//                             )}
//                           </td>
//                           <td style={{ padding: '0.75rem' }}>
//                             <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
//                               <button
//                                 style={{
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   border: 'none',
//                                   backgroundColor: '#0d6efd',
//                                   color: 'white',
//                                   fontSize: '0.875rem',
//                                   cursor: 'pointer'
//                                 }}
//                                 onClick={() => openDetailsModal(order)}
//                               >
//                                 👁️ View
//                               </button>
//                               <button
//                                 style={{
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   border: 'none',
//                                   backgroundColor: '#ffc107',
//                                   color: 'black',
//                                   fontSize: '0.875rem',
//                                   cursor: 'pointer'
//                                 }}
//                                 onClick={() => {
//                                   if (window.openEditOrderModal) {
//                                     window.openEditOrderModal(order.orderId);
//                                   }
//                                 }}
//                               >
//                                 ✏️ Edit
//                               </button>
//                               <button
//                                 style={{
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   border: 'none',
//                                   backgroundColor: '#198754',
//                                   color: 'white',
//                                   fontSize: '0.875rem',
//                                   cursor: 'pointer'
//                                 }}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   generateTraderInvoice(order);
//                                 }}
//                                 disabled={!order.traderToAdminPayment}
//                               >
//                                 📥 Trader Invoice
//                               </button>
//                               <button
//                                 style={{
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   border: 'none',
//                                   backgroundColor: '#20c997',
//                                   color: 'white',
//                                   fontSize: '0.875rem',
//                                   cursor: 'pointer'
//                                 }}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   generateFarmerInvoice(order);
//                                 }}
//                                 disabled={!order.adminToFarmerPayment}
//                               >
//                                 📥 Farmer Invoice
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Details Modal */}
//       {showModal && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1050
//         }}>
//           <div style={{
//             width: '90%',
//             maxWidth: '1140px',
//             maxHeight: '90vh',
//             backgroundColor: 'white',
//             borderRadius: '0.375rem',
//             overflow: 'hidden',
//             display: 'flex',
//             flexDirection: 'column'
//           }}>
//             <div style={{
//               backgroundColor: '#0d6efd',
//               color: 'white',
//               padding: '1rem',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <h5 style={{ margin: 0 }}>
//                 📄 Order Details
//               </h5>
//               <button
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: 'white',
//                   fontSize: '1.5rem',
//                   cursor: 'pointer'
//                 }}
//                 onClick={closeModal}
//               >
//                 ×
//               </button>
//             </div>
//             <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
//               {currentOrder && (
//                 <>
//                   {/* Invoice Download Buttons */}
//                   <div style={{
//                     marginBottom: '1rem',
//                     borderRadius: '0.375rem',
//                     border: '1px solid #dee2e6',
//                     overflow: 'hidden'
//                   }}>
//                     <div style={{
//                       backgroundColor: '#f8f9fa',
//                       padding: '0.75rem 1rem',
//                       borderBottom: '1px solid #dee2e6'
//                     }}>
//                       <h6 style={{ margin: 0 }}>
//                         📄 Download Invoices
//                       </h6>
//                     </div>
//                     <div style={{
//                       padding: '1rem',
//                       display: 'flex',
//                       gap: '1rem',
//                       flexWrap: 'wrap'
//                     }}>
//                       <button
//                         style={{
//                           padding: '0.75rem 1.5rem',
//                           borderRadius: '0.375rem',
//                           border: 'none',
//                           backgroundColor: '#198754',
//                           color: 'white',
//                           fontSize: '1rem',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.5rem'
//                         }}
//                         onClick={generateFarmerInvoiceFromModal}
//                         disabled={!currentOrder.adminToFarmerPayment}
//                       >
//                         <span>📥</span> View Farmer Invoice
//                       </button>
//                       <button
//                         style={{
//                           padding: '0.75rem 1.5rem',
//                           borderRadius: '0.375rem',
//                           border: 'none',
//                           backgroundColor: '#0d6efd',
//                           color: 'white',
//                           fontSize: '1rem',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.5rem'
//                         }}
//                         onClick={generateTraderInvoiceFromModal}
//                         disabled={!currentOrder.traderToAdminPayment}
//                       >
//                         <span>📥</span> View Trader Invoice
//                       </button>
//                     </div>
//                   </div>

//                   {/* Order Information */}
//                   <div style={{
//                     marginBottom: '1rem',
//                     borderRadius: '0.375rem',
//                     border: '1px solid #dee2e6',
//                     overflow: 'hidden'
//                   }}>
//                     <div style={{
//                       backgroundColor: '#f8f9fa',
//                       padding: '0.75rem 1rem',
//                       borderBottom: '1px solid #dee2e6'
//                     }}>
//                       <h6 style={{ margin: 0 }}>
//                         ℹ️ Order Information
//                       </h6>
//                     </div>
//                     <div style={{ padding: '1rem' }}>
//                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
//                         <div>
//                           <table style={{ width: '100%' }}>
//                             <tbody>
//                               <tr>
//                                 <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Order ID:</td>
//                                 <td style={{ padding: '0.375rem' }}>
//                                   <strong>{currentOrder.orderId}</strong>
//                                 </td>
//                               </tr>
//                               <tr>
//                                 <td style={{ padding: '0.375rem', color: '#6c757d' }}>Trader:</td>
//                                 <td style={{ padding: '0.375rem' }}>
//                                   {currentOrder.traderName}
//                                   {currentOrder.traderMobile && (
//                                     <>
//                                       <br />
//                                       <small>{currentOrder.traderMobile}</small>
//                                     </>
//                                   )}
//                                 </td>
//                               </tr>
//                               <tr>
//                                 <td style={{ padding: '0.375rem', color: '#6c757d' }}>Farmer:</td>
//                                 <td style={{ padding: '0.375rem' }}>
//                                   {currentOrder.farmerName || 'N/A'}
//                                   {currentOrder.farmerMobile && (
//                                     <>
//                                       <br />
//                                       <small>{currentOrder.farmerMobile}</small>
//                                     </>
//                                   )}
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                         <div>
//                           <table style={{ width: '100%' }}>
//                             <tbody>
//                               <tr>
//                                 <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Order Status:</td>
//                                 <td style={{ padding: '0.375rem' }}>
//                                   <span style={{
//                                     display: 'inline-block',
//                                     padding: '0.25rem 0.5rem',
//                                     borderRadius: '0.375rem',
//                                     backgroundColor: getStatusBadge(currentOrder.orderStatus),
//                                     color: 'white',
//                                     fontSize: '0.875rem'
//                                   }}>
//                                     {currentOrder.orderStatus}
//                                   </span>
//                                 </td>
//                               </tr>
//                               <tr>
//                                 <td style={{ padding: '0.375rem', color: '#6c757d' }}>Transporter Status:</td>
//                                 <td style={{ padding: '0.375rem' }}>
//                                   <span style={{
//                                     display: 'inline-block',
//                                     padding: '0.25rem 0.5rem',
//                                     borderRadius: '0.375rem',
//                                     backgroundColor: getStatusBadge(currentOrder.transporterStatus || 'pending'),
//                                     color: 'white',
//                                     fontSize: '0.875rem'
//                                   }}>
//                                     {currentOrder.transporterStatus || 'pending'}
//                                   </span>
//                                 </td>
//                               </tr>
//                               <tr>
//                                 <td style={{ padding: '0.375rem', color: '#6c757d' }}>Created At:</td>
//                                 <td style={{ padding: '0.375rem' }}>{new Date(currentOrder.createdAt).toLocaleString()}</td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment Details */}
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
//                     {/* Trader to Admin Payment */}
//                     <div style={{
//                       borderRadius: '0.375rem',
//                       border: '1px solid #dee2e6',
//                       borderLeft: '3px solid #0d6efd',
//                       overflow: 'hidden',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       height: '100%'
//                     }}>
//                       <div style={{
//                         backgroundColor: '#0d6efd',
//                         color: 'white',
//                         padding: '0.75rem 1rem'
//                       }}>
//                         🔄 Trader to Admin Payment
//                       </div>
//                       <div style={{ padding: '1rem', flex: 1 }}>
//                         {currentOrder.traderToAdminPayment ? (
//                           <>
//                             <div style={{ marginBottom: '1rem' }}>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                                 <span style={{ color: '#6c757d' }}>Total Amount:</span>
//                                 <strong style={{ fontSize: '1.25rem', margin: 0 }}>
//                                   {formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}
//                                 </strong>
//                               </div>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                                 <span style={{ color: '#6c757d' }}>Paid Amount:</span>
//                                 <strong style={{ color: '#198754' }}>
//                                   {formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}
//                                 </strong>
//                               </div>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                                 <span style={{ color: '#6c757d' }}>Remaining:</span>
//                                 <strong style={{ color: '#dc3545' }}>
//                                   {formatCurrency(
//                                     currentOrder.traderToAdminPayment.remainingAmount
//                                   )}
//                                 </strong>
//                               </div>
//                               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                 <span style={{ color: '#6c757d' }}>Status:</span>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus),
//                                   color: 'white',
//                                   fontSize: '0.875rem'
//                                 }}>
//                                   {currentOrder.traderToAdminPayment.paymentStatus}
//                                 </span>
//                               </div>
//                             </div>

//                             {currentOrder.traderToAdminPayment.paymentHistory &&
//                               currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
//                                 <div>
//                                   <h6 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Payment History:</h6>
//                                   <div style={{ overflowX: 'auto' }}>
//                                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                       <thead style={{ backgroundColor: '#f8f9fa' }}>
//                                         <tr>
//                                           <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Date</th>
//                                           <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Amount</th>
//                                           <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Payment ID</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {currentOrder.traderToAdminPayment.paymentHistory.map(
//                                           (payment, idx) => (
//                                             <tr key={idx}>
//                                               <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
//                                                 <small>
//                                                   {new Date(payment.paidDate).toLocaleDateString()}
//                                                 </small>
//                                               </td>
//                                               <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>{formatCurrency(payment.amount)}</td>
//                                               <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
//                                                 <small style={{ color: '#6c757d' }}>
//                                                   {payment.razorpayPaymentId || 'N/A'}
//                                                 </small>
//                                               </td>
//                                             </tr>
//                                           )
//                                         )}
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 </div>
//                               )}
//                           </>
//                         ) : (
//                           <p style={{ color: '#6c757d' }}>No payment details available</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Admin to Farmer Payment */}
//                     <div style={{
//                       borderRadius: '0.375rem',
//                       border: '1px solid #dee2e6',
//                       borderLeft: '3px solid #198754',
//                       overflow: 'hidden',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       height: '100%'
//                     }}>
//                       <div style={{
//                         backgroundColor: '#198754',
//                         color: 'white',
//                         padding: '0.75rem 1rem'
//                       }}>
//                         🔄 Admin to Farmer Payment
//                       </div>
//                       <div style={{ padding: '1rem', flex: 1 }}>
//                         {currentOrder.adminToFarmerPayment ? (
//                           <>
//                             <div style={{ marginBottom: '1rem' }}>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                                 <span style={{ color: '#6c757d' }}>Total Amount:</span>
//                                 <strong style={{ fontSize: '1.25rem', margin: 0 }}>
//                                   {formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}
//                                 </strong>
//                               </div>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                                 <span style={{ color: '#6c757d' }}>Paid Amount:</span>
//                                 <strong style={{ color: '#198754' }}>
//                                   {formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}
//                                 </strong>
//                               </div>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                                 <span style={{ color: '#6c757d' }}>Remaining:</span>
//                                 <strong style={{ color: '#dc3545' }}>
//                                   {formatCurrency(
//                                     currentOrder.adminToFarmerPayment.remainingAmount
//                                   )}
//                                 </strong>
//                               </div>
//                               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                 <span style={{ color: '#6c757d' }}>Status:</span>
//                                 <span style={{
//                                   display: 'inline-block',
//                                   padding: '0.25rem 0.5rem',
//                                   borderRadius: '0.375rem',
//                                   backgroundColor: getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus),
//                                   color: 'white',
//                                   fontSize: '0.875rem'
//                                 }}>
//                                   {currentOrder.adminToFarmerPayment.paymentStatus}
//                                 </span>
//                               </div>
//                             </div>

//                             {currentOrder.adminToFarmerPayment.paymentHistory &&
//                               currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
//                                 <div>
//                                   <h6 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Payment History:</h6>
//                                   <div style={{ overflowX: 'auto' }}>
//                                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                       <thead style={{ backgroundColor: '#f8f9fa' }}>
//                                         <tr>
//                                           <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Date</th>
//                                           <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Amount</th>
//                                           <th style={{ padding: '0.375rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Payment ID</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {currentOrder.adminToFarmerPayment.paymentHistory.map(
//                                           (payment, idx) => (
//                                             <tr key={idx}>
//                                               <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
//                                                 <small>
//                                                   {new Date(payment.paidDate).toLocaleDateString()}
//                                                 </small>
//                                               </td>
//                                               <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>{formatCurrency(payment.amount)}</td>
//                                               <td style={{ padding: '0.375rem', border: '1px solid #dee2e6' }}>
//                                                 <small style={{ color: '#6c757d' }}>
//                                                   {payment.razorpayPaymentId || 'N/A'}
//                                                 </small>
//                                               </td>
//                                             </tr>
//                                           )
//                                         )}
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 </div>
//                               )}
//                           </>
//                         ) : (
//                           <p style={{ color: '#6c757d' }}>No payment details available</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Product Items */}
//                   <div style={{
//                     marginBottom: '1rem',
//                     borderRadius: '0.375rem',
//                     border: '1px solid #dee2e6',
//                     overflow: 'hidden'
//                   }}>
//                     <div style={{
//                       backgroundColor: '#f8f9fa',
//                       padding: '0.75rem 1rem',
//                       borderBottom: '1px solid #dee2e6'
//                     }}>
//                       <h6 style={{ margin: 0 }}>
//                         📦 Product Items
//                       </h6>
//                     </div>
//                     <div style={{ padding: '1rem' }}>
//                       <div style={{ overflowX: 'auto' }}>
//                         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                           <thead style={{ backgroundColor: '#f8f9fa' }}>
//                             <tr>
//                               <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Product</th>
//                               <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Grade</th>
//                               <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Quantity</th>
//                               <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Price/Unit</th>
//                               <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Total</th>
//                               <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Market</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {currentOrder.productItems.map((item, idx) => (
//                               <tr key={idx}>
//                                 <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.productName}</td>
//                                 <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.grade}</td>
//                                 <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.quantity}</td>
//                                 <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{formatCurrency(item.pricePerUnit)}</td>
//                                 <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
//                                   <strong>{formatCurrency(item.totalAmount)}</strong>
//                                 </td>
//                                 <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
//                                   {item.marketDetails ? (
//                                     <>
//                                       <strong>{item.marketDetails.marketName}</strong>
//                                       <br />
//                                       <small style={{ color: '#6c757d' }}>
//                                         {item.marketDetails.exactAddress}
//                                         {item.marketDetails.district && (
//                                           <>, {item.marketDetails.district}</>
//                                         )}
//                                       </small>
//                                     </>
//                                   ) : (
//                                     item.nearestMarket || 'N/A'
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Transporter Details and Verification */}
//                   {currentOrder.transporterDetails && (
//                     <>
//                       <div style={{
//                         marginBottom: '1rem',
//                         borderRadius: '0.375rem',
//                         border: '1px solid #0dcaf0',
//                         overflow: 'hidden'
//                       }}>
//                         <div style={{
//                           backgroundColor: '#0dcaf0',
//                           color: 'white',
//                           padding: '0.75rem 1rem'
//                         }}>
//                           🚚 Transporter Information
//                         </div>
//                         <div style={{ padding: '1rem' }}>
//                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
//                             <div>
//                               <table style={{ width: '100%' }}>
//                                 <tbody>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Name:</td>
//                                     <td style={{ padding: '0.375rem' }}><strong>{currentOrder.transporterDetails.transporterName}</strong></td>
//                                   </tr>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d' }}>Mobile:</td>
//                                     <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.transporterMobile || 'N/A'}</td>
//                                   </tr>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d' }}>Email:</td>
//                                     <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.transporterEmail || 'N/A'}</td>
//                                   </tr>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d' }}>Driver:</td>
//                                     <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.driverName || 'N/A'}</td>
//                                   </tr>
//                                 </tbody>
//                               </table>
//                             </div>
//                             <div>
//                               <table style={{ width: '100%' }}>
//                                 <tbody>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d', width: '40%' }}>Vehicle Type:</td>
//                                     <td style={{ padding: '0.375rem' }}><strong>{currentOrder.transporterDetails.vehicleType}</strong></td>
//                                   </tr>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d' }}>Vehicle Number:</td>
//                                     <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.vehicleNumber}</td>
//                                   </tr>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d' }}>Capacity:</td>
//                                     <td style={{ padding: '0.375rem' }}>{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</td>
//                                   </tr>
//                                   <tr>
//                                     <td style={{ padding: '0.375rem', color: '#6c757d' }}>Accepted At:</td>
//                                     <td style={{ padding: '0.375rem' }}>{new Date(currentOrder.transporterDetails.acceptedAt).toLocaleString()}</td>
//                                   </tr>
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div style={{
//                         borderRadius: '0.375rem',
//                         border: '1px solid #198754',
//                         overflow: 'hidden'
//                       }}>
//                         <div style={{
//                           backgroundColor: '#198754',
//                           color: 'white',
//                           padding: '0.75rem 1rem'
//                         }}>
//                           ✅ Verification Checklist
//                         </div>
//                         <div style={{ padding: '1rem' }}>
//                           <div style={{
//                             backgroundColor: verificationData.transporterReached ? '#d1e7dd' : '#f8f9fa',
//                             borderRadius: '5px',
//                             padding: '1rem',
//                             marginBottom: '1rem',
//                             transition: 'background-color 0.2s'
//                           }}>
//                             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
//                               <input
//                                 type="checkbox"
//                                 id="transporterReached"
//                                 checked={verificationData.transporterReached}
//                                 onChange={(e) =>
//                                   setVerificationData({
//                                     ...verificationData,
//                                     transporterReached: e.target.checked,
//                                   })
//                                 }
//                                 style={{ marginTop: '0.25rem' }}
//                               />
//                               <div>
//                                 <label htmlFor="transporterReached" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
//                                   Transporter Reached Destination
//                                 </label>
//                                 <small style={{ color: '#6c757d', display: 'block' }}>
//                                   Confirm that transporter has arrived at the delivery location
//                                 </small>
//                               </div>
//                             </div>
//                           </div>

//                           <div style={{
//                             backgroundColor: verificationData.goodsConditionCorrect ? '#d1e7dd' : '#f8f9fa',
//                             borderRadius: '5px',
//                             padding: '1rem',
//                             marginBottom: '1rem',
//                             transition: 'background-color 0.2s'
//                           }}>
//                             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
//                               <input
//                                 type="checkbox"
//                                 id="goodsConditionCorrect"
//                                 checked={verificationData.goodsConditionCorrect}
//                                 onChange={(e) =>
//                                   setVerificationData({
//                                     ...verificationData,
//                                     goodsConditionCorrect: e.target.checked,
//                                   })
//                                 }
//                                 style={{ marginTop: '0.25rem' }}
//                               />
//                               <div>
//                                 <label htmlFor="goodsConditionCorrect" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
//                                   Goods Condition is Correct
//                                 </label>
//                                 <small style={{ color: '#6c757d', display: 'block' }}>
//                                   Verify that goods are in good condition without damage
//                                 </small>
//                               </div>
//                             </div>
//                           </div>

//                           <div style={{
//                             backgroundColor: verificationData.quantityCorrect ? '#d1e7dd' : '#f8f9fa',
//                             borderRadius: '5px',
//                             padding: '1rem',
//                             marginBottom: '1rem',
//                             transition: 'background-color 0.2s'
//                           }}>
//                             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
//                               <input
//                                 type="checkbox"
//                                 id="quantityCorrect"
//                                 checked={verificationData.quantityCorrect}
//                                 onChange={(e) =>
//                                   setVerificationData({
//                                     ...verificationData,
//                                     quantityCorrect: e.target.checked,
//                                   })
//                                 }
//                                 style={{ marginTop: '0.25rem' }}
//                               />
//                               <div>
//                                 <label htmlFor="quantityCorrect" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
//                                   Quantity is Correct
//                                 </label>
//                                 <small style={{ color: '#6c757d', display: 'block' }}>
//                                   Confirm that delivered quantity matches order quantity
//                                 </small>
//                               </div>
//                             </div>
//                           </div>

//                           <div style={{ marginBottom: '1rem' }}>
//                             <label htmlFor="adminNotes" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
//                               Admin Notes
//                             </label>
//                             <textarea
//                               style={{
//                                 width: '100%',
//                                 padding: '0.375rem 0.75rem',
//                                 borderRadius: '0.375rem',
//                                 border: '1px solid #ced4da',
//                                 minHeight: '6rem'
//                               }}
//                               id="adminNotes"
//                               placeholder="Add any notes or observations..."
//                               value={verificationData.adminNotes}
//                               onChange={(e) =>
//                                 setVerificationData({
//                                   ...verificationData,
//                                   adminNotes: e.target.value,
//                                 })
//                               }
//                             ></textarea>
//                           </div>

//                           {currentOrder.transporterDetails.verifiedAt && (
//                             <div style={{
//                               backgroundColor: '#d1ecf1',
//                               border: '1px solid #bee5eb',
//                               borderRadius: '0.375rem',
//                               padding: '1rem',
//                               marginBottom: '1rem'
//                             }}>
//                               <small>
//                                 ℹ️ Last verified by{' '}
//                                 <strong>
//                                   {currentOrder.transporterDetails.verifiedByName || 'Admin'}
//                                 </strong>{' '}
//                                 on{' '}
//                                 {new Date(
//                                   currentOrder.transporterDetails.verifiedAt
//                                 ).toLocaleString()}
//                               </small>
//                             </div>
//                           )}

//                           <button
//                             style={{
//                               width: '100%',
//                               padding: '0.5rem',
//                               borderRadius: '0.375rem',
//                               border: 'none',
//                               backgroundColor: '#198754',
//                               color: 'white',
//                               fontSize: '1rem',
//                               cursor: 'pointer'
//                             }}
//                             onClick={saveVerification}
//                           >
//                             ✅ Save Verification
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {!currentOrder.transporterDetails && (
//                     <div style={{
//                       backgroundColor: '#fff3cd',
//                       border: '1px solid #ffecb5',
//                       borderRadius: '0.375rem',
//                       padding: '1rem',
//                       color: '#856404'
//                     }}>
//                       ⚠️ No transporter assigned to this order yet.
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <OrderEditModal />
//     </>
//   );
// };

// export default AdminOrders;




























'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Dialog } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaUser,
  FaStore,
  FaTruck,
  FaReceipt,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaCopy,
  FaTimes,
  FaSave,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaBox,
  FaTags,
  FaMapMarkerAlt,
  FaCheck,
  FaBoxes,
  FaFileCsv,
  FaChevronDown,
  FaChevronUp,
  FaCreditCard,
  FaInfoCircle,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import OrderEditModal from '../OrderEditModal/page';

// Interfaces
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
  farmerMobile: string;
  farmerEmail?: string;
  productItems: ProductItem[];
  orderStatus: string;
  transporterStatus?: string;
  transporterDetails?: TransporterDetails;
  traderToAdminPayment?: PaymentDetails;
  adminToFarmerPayment?: PaymentDetails;
  createdAt: string;
}

const AdminOrdersRedesign: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Mobile view state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Verification state
  const [verificationData, setVerificationData] = useState({
    transporterReached: false,
    goodsConditionCorrect: false,
    quantityCorrect: false,
    adminNotes: '',
  });

  const API_BASE = 'https://kisan.etpl.ai/api/admin';
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch orders function
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let url = `${API_BASE}/orders`;
    
    // Add filters to URL if present
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (transporterStatusFilter) params.append('transporterStatus', transporterStatusFilter);
    if (searchInput) params.append('search', searchInput);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
        // toast.success(`Loaded ${data.data?.length || 0} orders`);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, transporterStatusFilter, searchInput]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Invoice generation functions
  const generateFarmerInvoice = (order: Order) => {
    if (!order || !order.adminToFarmerPayment) {
      toast.error('No farmer payment details available');
      return;
    }

    const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Farmer Payment</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
        .invoice-container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { color: #198754; font-size: 28px; font-weight: bold; }
        .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #198754; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-name">KISAN TRADING</div>
            <div class="invoice-title">FARMER PAYMENT INVOICE</div>
        </div>
        
        <div>
            <p><strong>Invoice Number:</strong> ${order.orderId}-FARMER</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
            <p><strong>Trader Name:</strong> ${order.traderName}</p>
            <p><strong>Payment Status:</strong> ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}</p>
        </div>
        
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
        
        <div class="total-section">
            <p><strong>Total Product Value:</strong> ${formatCurrency(order.adminToFarmerPayment.totalAmount)}</p>
            <p><strong>Paid Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.paidAmount)}</p>
            <p><strong>Remaining Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</p>
            <p style="font-size: 18px; font-weight: bold; color: #198754;">
                TOTAL PAYABLE TO FARMER: ${formatCurrency(order.adminToFarmerPayment.totalAmount)}
            </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>This is a computer generated invoice. No signature required.</p>
            <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
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
    toast.success(`Farmer invoice generated for order: ${order.orderId}`);
  };

  const generateTraderInvoice = (order: Order) => {
    if (!order || !order.traderToAdminPayment) {
      toast.error('No trader payment details available');
      return;
    }

    const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Trader Payment</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
        .invoice-container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { color: #0d6efd; font-size: 28px; font-weight: bold; }
        .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #0d6efd; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-name">KISAN TRADING</div>
            <div class="invoice-title">TRADER PAYMENT INVOICE</div>
        </div>
        
        <div>
            <p><strong>Invoice Number:</strong> ${order.orderId}-TRADER</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Trader Name:</strong> ${order.traderName}</p>
            <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
            <p><strong>Payment Status:</strong> ${order.traderToAdminPayment.paymentStatus.toUpperCase()}</p>
        </div>
        
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
        
        <div class="total-section">
            <p><strong>Total Product Value:</strong> ${formatCurrency(order.traderToAdminPayment.totalAmount)}</p>
            <p><strong>Paid Amount:</strong> ${formatCurrency(order.traderToAdminPayment.paidAmount)}</p>
            <p><strong>Remaining Amount:</strong> ${formatCurrency(order.traderToAdminPayment.remainingAmount)}</p>
            <p style="font-size: 18px; font-weight: bold; color: #0d6efd;">
                TOTAL PAYABLE BY TRADER: ${formatCurrency(order.traderToAdminPayment.totalAmount)}
            </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>This is a computer generated invoice. No signature required.</p>
            <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
            <p>Invoice generated on: ${new Date().toLocaleString()}</p>
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
    toast.success(`Trader invoice generated for order: ${order.orderId}`);
  };

  // Export functions
  const handleCopyToClipboard = async () => {
    const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
    const csvContent = [
      headers.join("\t"),
      ...orders.map((order) => {
        const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
        const verificationStatus = getVerificationStatus(order);
        return [
          order.orderId,
          new Date(order.createdAt).toLocaleDateString(),
          order.traderName,
          order.farmerName || "N/A",
          order.productItems.length,
          totalAmount,
          order.orderStatus,
          verificationStatus,
          order.traderToAdminPayment?.paymentStatus || "N/A",
          order.adminToFarmerPayment?.paymentStatus || "N/A"
        ].join("\t");
      })
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(csvContent);
      toast.success("Orders copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = orders.map((order) => {
      const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const verificationStatus = getVerificationStatus(order);
      return {
        "Order ID": order.orderId,
        "Date": new Date(order.createdAt).toLocaleDateString(),
        "Trader Name": order.traderName,
        "Trader Mobile": order.traderMobile || "N/A",
        "Farmer Name": order.farmerName || "N/A",
        "Farmer Mobile": order.farmerMobile || "N/A",
        "Items Count": order.productItems.length,
        "Total Quantity": order.productItems.reduce((sum, item) => sum + item.quantity, 0),
        "Total Amount": totalAmount,
        "Order Status": order.orderStatus,
        "Verification Status": verificationStatus,
        "Transporter Status": order.transporterStatus || "N/A",
        "Trader Payment Status": order.traderToAdminPayment?.paymentStatus || "N/A",
        "Trader Paid Amount": order.traderToAdminPayment?.paidAmount || 0,
        "Farmer Payment Status": order.adminToFarmerPayment?.paymentStatus || "N/A",
        "Farmer Paid Amount": order.adminToFarmerPayment?.paidAmount || 0,
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
    const csvContent = [
      headers.join(","),
      ...orders.map((order) => {
        const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
        const verificationStatus = getVerificationStatus(order);
        return [
          `"${order.orderId}"`,
          `"${new Date(order.createdAt).toLocaleDateString()}"`,
          `"${order.traderName}"`,
          `"${order.farmerName || "N/A"}"`,
          order.productItems.length,
          totalAmount,
          `"${order.orderStatus}"`,
          `"${verificationStatus}"`,
          `"${order.traderToAdminPayment?.paymentStatus || "N/A"}"`,
          `"${order.adminToFarmerPayment?.paymentStatus || "N/A"}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders Management Report", 14, 16);
    
    const tableColumn = ["Order ID", "Trader", "Farmer", "Items", "Total Amount", "Status", "Verification"];
    const tableRows: any = orders.map((order) => {
      const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const verificationStatus = getVerificationStatus(order);
      return [
        order.orderId,
        order.traderName,
        order.farmerName || "N/A",
        order.productItems.length,
        `₹${totalAmount}`,
        order.orderStatus,
        verificationStatus
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orders Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f3f4f6; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          @media print { @page { size: landscape; } }
        </style>
      </head>
      <body>
        <h1>Orders Management Report</h1>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Trader</th>
              <th>Farmer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Verification</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((order) => {
              const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
              const verificationStatus = getVerificationStatus(order);
              return `
                <tr>
                  <td>${order.orderId}</td>
                  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.traderName}</td>
                  <td>${order.farmerName || "N/A"}</td>
                  <td>${order.productItems.length}</td>
                  <td>₹${totalAmount}</td>
                  <td>${order.orderStatus}</td>
                  <td>${verificationStatus}</td>
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
    toast.success("Printing orders...");
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Verification status badge colors
  const getVerificationColor = (order: Order) => {
    const details = order.transporterDetails;
    
    if (!details) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
    if (transporterReached && goodsConditionCorrect && quantityCorrect) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (details.verifiedAt) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get verification status text
  const getVerificationStatus = (order: Order) => {
    const details = order.transporterDetails;
    
    if (!details) {
      return 'Not Available';
    }
    
    const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
    if (transporterReached && goodsConditionCorrect && quantityCorrect) {
      return 'Verified';
    } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
      return 'Partial';
    } else if (details.verifiedAt) {
      return 'Pending';
    } else {
      return 'Not Verified';
    }
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
  const openDetailsDialog = (order: Order) => {
    setCurrentOrder(order);
    setVerificationData({
      transporterReached: order.transporterDetails?.transporterReached || false,
      goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
      quantityCorrect: order.transporterDetails?.quantityCorrect || false,
      adminNotes: order.transporterDetails?.adminNotes || '',
    });
    setDetailsDialogOpen(true);
  };

  // Open edit dialog - UPDATED TO USE OrderEditModal
  const openEditDialog = (order: Order) => {
    if (window.openEditOrderModal) {
      window.openEditOrderModal(order.orderId);
    }
  };

  // Open verification dialog
  const openVerificationDialog = (order: Order) => {
    setCurrentOrder(order);
    setVerificationData({
      transporterReached: order.transporterDetails?.transporterReached || false,
      goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
      quantityCorrect: order.transporterDetails?.quantityCorrect || false,
      adminNotes: order.transporterDetails?.adminNotes || '',
    });
    setVerificationDialogOpen(true);
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!currentOrder) return;
    console.log(currentOrder._id)
    try {
      const response = await fetch(`/api/order/${currentOrder._id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Order deleted successfully!');
        setDeleteDialogOpen(false);
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting order');
    }
  };

  // Save verification
  const saveVerification = async () => {
    if (!currentOrder || !currentOrder.transporterDetails) {
      toast.error('No transporter details available');
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
        toast.success('Verification updated successfully!');
        setVerificationDialogOpen(false);
        fetchOrders();
      } else {
        toast.error('Failed to update verification');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating verification');
    }
  };

  // Calculate order total
  const calculateOrderTotal = (order: Order) => {
    return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  // Toggle mobile card expansion
  const toggleMobileCard = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      {/* Header */}
      <div className="lg:mb-0 mb-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaShoppingCart className="text-blue-600" />
          Order Management
        </h1>
        <p className="text-gray-600 mt-2">Manage and monitor all marketplace orders</p>
      </div>

      {/* Export Buttons - Desktop */}
      <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2  p-3 rounded  mb-1">
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
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
          >
            <btn.icon className="text-sm" />
  
          </button>
        ))}
      </div>

      {/* Export Buttons - Mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-3">
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
            className={`flex items-center justify-center gap-1 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
           
          >
            <btn.icon className="text-sm" />
           
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <FaShoppingCart className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.orderStatus === 'completed').length}
              </p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.orderStatus === 'pending').length}
              </p>
            </div>
            <FaTimesCircle className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0))}
              </p>
            </div>
            <FaRupeeSign className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search orders..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Transporter Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTruck className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              value={transporterStatusFilter}
              onChange={(e) => setTransporterStatusFilter(e.target.value)}
            >
              <option value="">All Transporter Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={fetchOrders}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <FaSearch />
              Search
            </button>
            <button
              onClick={() => {
                setStatusFilter('');
                setTransporterStatusFilter('');
                setSearchInput('');
              }}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  {/* Order ID */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
                      <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                    </div>
                  </td>

                  {/* Trader */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaStore className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.traderName}</div>
                        {order.traderMobile && (
                          <div className="text-xs text-gray-500">{order.traderMobile}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Farmer */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.farmerName || 'N/A'}</div>
                        {order.farmerMobile && (
                          <div className="text-xs text-gray-500">{order.farmerMobile}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Products */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBox className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.productItems.length} items</div>
                        <div className="text-xs text-gray-500">
                          {order.productItems.reduce((sum, item) => sum + item.quantity, 0)} units
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      <FaRupeeSign className="inline mr-1" />
                      {calculateOrderTotal(order).toLocaleString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Verification Status - NEW FIELD */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
                      {getVerificationStatus(order)}
                    </span>
                  </td>

                  {/* Actions - UPDATED WITH INVOICE DOWNLOAD ICON */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openDetailsDialog(order)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEditDialog(order)}
                        className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition-colors"
                        title="Edit Order"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentOrder(order);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
                        title="Delete Order"
                      >
                        <FaTrash />
                      </button>
                      {order.transporterDetails && (
                        <button
                          onClick={() => openVerificationDialog(order)}
                          className="text-purple-600 hover:text-purple-900 p-2 rounded hover:bg-purple-50 transition-colors"
                          title="Verification"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {/* INVOICE DOWNLOAD BUTTON */}
                      {order.traderToAdminPayment && (
                        <button
                          onClick={() => generateTraderInvoice(order)}
                          className="text-yellow-600 hover:text-yellow-900 p-2 rounded hover:bg-yellow-50 transition-colors"
                          title="Download Trader Invoice"
                        >
                          <FaFileInvoiceDollar />
                        </button>
                      )}
                      {order.adminToFarmerPayment && (
                        <button
                          onClick={() => generateFarmerInvoice(order)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition-colors"
                          title="Download Farmer Invoice"
                        >
                          <FaReceipt />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Orders State */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <FaShoppingCart />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-blue-600">{order.orderId}</div>
                <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openDetailsDialog(order)}
                  className="text-blue-600 p-1"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => toggleMobileCard(order._id)}
                  className="text-gray-500 p-1"
                >
                  {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Trader</div>
                <div className="font-medium text-sm">{order.traderName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Farmer</div>
                <div className="font-medium text-sm">{order.farmerName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Items</div>
                <div className="font-medium text-sm">{order.productItems.length}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-bold text-green-700 text-sm">
                  <FaRupeeSign className="inline mr-1" />
                  {calculateOrderTotal(order).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Verification</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
                  {getVerificationStatus(order)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEditDialog(order)}
                  className="text-green-600 p-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setCurrentOrder(order);
                    setDeleteDialogOpen(true);
                  }}
                  className="text-red-600 p-1"
                >
                  <FaTrash />
                </button>
                {/* INVOICE DOWNLOAD BUTTON FOR MOBILE */}
                {order.traderToAdminPayment && (
                  <button
                    onClick={() => generateTraderInvoice(order)}
                    className="text-yellow-600 p-1"
                    title="Trader Invoice"
                  >
                    <FaFileInvoiceDollar />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedOrder === order._id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Trader Mobile</div>
                    <div className="text-sm">{order.traderMobile || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Farmer Mobile</div>
                    <div className="text-sm">{order.farmerMobile || 'N/A'}</div>
                  </div>
                </div>
                
                {order.traderToAdminPayment && (
                  <div>
                    <div className="text-xs text-gray-500">Trader Payment</div>
                    <div className="text-sm font-medium">
                      {order.traderToAdminPayment.paymentStatus} - 
                      <span className="text-green-700 ml-1">
                        ₹{order.traderToAdminPayment.paidAmount} paid
                      </span>
                    </div>
                  </div>
                )}

                {order.adminToFarmerPayment && (
                  <div>
                    <div className="text-xs text-gray-500">Farmer Payment</div>
                    <div className="text-sm font-medium">
                      {order.adminToFarmerPayment.paymentStatus} - 
                      <span className="text-green-700 ml-1">
                        ₹{order.adminToFarmerPayment.paidAmount} paid
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {order.transporterDetails && (
                    <button
                      onClick={() => openVerificationDialog(order)}
                      className="flex-1 bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      Verification
                    </button>
                  )}
                  {order.traderToAdminPayment && (
                    <button
                      onClick={() => generateTraderInvoice(order)}
                      className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      Trader Invoice
                    </button>
                  )}
                  {order.adminToFarmerPayment && (
                    <button
                      onClick={() => generateFarmerInvoice(order)}
                      className="flex-1 bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      Farmer Invoice
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                Order Details: {currentOrder?.orderId}
              </h2>
              <p className="text-gray-600">Complete order information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {currentOrder && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Farmer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentOrder.farmerName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{currentOrder.farmerMobile || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{currentOrder.farmerEmail || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaStore className="text-green-600" />
                    Trader Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentOrder.traderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{currentOrder.traderMobile || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{currentOrder.traderEmail || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Order Status</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentOrder.orderStatus)}`}>
                    {currentOrder.orderStatus}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Transporter Status</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentOrder.transporterStatus || 'pending')}`}>
                    {currentOrder.transporterStatus || 'pending'}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Created</h4>
                  <p className="text-gray-700">{formatDateTime(currentOrder.createdAt)}</p>
                </div>
              </div>

              {/* Verification Status */}
              {currentOrder.transporterDetails && (
                <div className="border border-purple-200 rounded p-4">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
                    <FaCheck />
                    Verification Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.transporterReached ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {currentOrder.transporterDetails.transporterReached ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <div className="font-medium">Transporter Reached</div>
                        <div className="text-sm text-gray-500">Destination arrival</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.goodsConditionCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {currentOrder.transporterDetails.goodsConditionCorrect ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <div className="font-medium">Goods Condition</div>
                        <div className="text-sm text-gray-500">Quality check</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.quantityCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {currentOrder.transporterDetails.quantityCorrect ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <div className="font-medium">Quantity Correct</div>
                        <div className="text-sm text-gray-500">Amount verification</div>
                      </div>
                    </div>
                  </div>
                  {currentOrder.transporterDetails.verifiedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Verified by <span className="font-bold">{currentOrder.transporterDetails.verifiedByName || 'Admin'}</span> on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentOrder.traderToAdminPayment && (
                  <div className="border border-blue-200 rounded p-4">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Trader to Admin Payment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold">{formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Amount:</span>
                        <span className="font-bold text-green-600">{formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-bold text-red-600">{formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.traderToAdminPayment.paymentStatus)}`}>
                          {currentOrder.traderToAdminPayment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {currentOrder.adminToFarmerPayment && (
                  <div className="border border-green-200 rounded p-4">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">Admin to Farmer Payment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold">{formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Amount:</span>
                        <span className="font-bold text-green-600">{formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-bold text-red-600">{formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.adminToFarmerPayment.paymentStatus)}`}>
                          {currentOrder.adminToFarmerPayment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Table */}
              <div className="border rounded overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaBoxes className="text-purple-600" />
                    Product Items ({currentOrder.productItems.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentOrder.productItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">{item.productName}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {item.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">{formatCurrency(item.pricePerUnit)}</td>
                          <td className="px-4 py-3 font-bold">{formatCurrency(item.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right font-bold">Total:</td>
                        <td className="px-4 py-3 font-bold text-green-700">
                          {formatCurrency(calculateOrderTotal(currentOrder))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Transporter Details */}
              {currentOrder.transporterDetails && (
                <div className="border border-gray-200 rounded p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaTruck className="text-orange-600" />
                    Transporter Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.transporterName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.vehicleType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.driverName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accepted:</span>
                          <span className="font-medium">{formatDateTime(currentOrder.transporterDetails.acceptedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
            {currentOrder?.traderToAdminPayment && (
              <button
                onClick={() => generateTraderInvoice(currentOrder)}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <FaFileInvoiceDollar />
                Trader Invoice
              </button>
            )}
            {currentOrder?.adminToFarmerPayment && (
              <button
                onClick={() => generateFarmerInvoice(currentOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaReceipt />
                Farmer Invoice
              </button>
            )}
          </div>
        </div>
      </Dialog>

      {/* Edit Order Dialog - REMOVED and replaced with OrderEditModal */}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Order {currentOrder?.orderId}?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaCheck className="text-purple-600" />
              Verification: {currentOrder?.orderId}
            </h2>
            <button
              onClick={() => setVerificationDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {currentOrder && currentOrder.transporterDetails && (
            <div className="space-y-6">
              {/* Verification Checks */}
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded">
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
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="transporterReached" className="ml-3">
                    <div className="font-medium">Transporter Reached Destination</div>
                    <div className="text-sm text-gray-500">Confirm arrival at delivery location</div>
                  </label>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded">
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
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="goodsConditionCorrect" className="ml-3">
                    <div className="font-medium">Goods Condition is Correct</div>
                    <div className="text-sm text-gray-500">Verify goods are in good condition</div>
                  </label>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded">
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
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="quantityCorrect" className="ml-3">
                    <div className="font-medium">Quantity is Correct</div>
                    <div className="text-sm text-gray-500">Confirm delivered quantity matches order</div>
                  </label>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
                  value={verificationData.adminNotes}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      adminNotes: e.target.value,
                    })
                  }
                  placeholder="Add any notes or observations..."
                />
              </div>

              {/* Previous Verification Info */}
              {currentOrder.transporterDetails.verifiedAt && (
                <div className="p-4 bg-blue-50 rounded">
                  <div className="text-sm text-blue-700">
                    Last verified by{' '}
                    <span className="font-bold">
                      {currentOrder.transporterDetails.verifiedByName || 'Admin'}
                    </span>{' '}
                    on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setVerificationDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVerification}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FaSave />
                  Save Verification
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Order Edit Modal */}
      <OrderEditModal />
    </div>
  );
};

export default AdminOrdersRedesign;

