'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PurchaseHistory {
  traderId: string;
  traderName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  purchaseDate: string;
  purchaseType: 'direct' | 'offer_accepted';
  paymentStatus: 'pending' | 'paid';
  orderCreated: boolean;
  orderId: string | null;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  _id: string;
}

interface GradePrice {
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  quantityType: string;
  priceType: string;
  status: string;
  purchaseHistory: PurchaseHistory[];
}

interface Product {
  _id: string;
  productId: string;
  farmerId: string;
  cropBriefDetails: string;
  farmingType: string;
  typeOfSeeds: string;
  packagingType: string;
  packageMeasurement: string;
  gradePrices: GradePrice[];
  deliveryDate: string;
  deliveryTime: string;
  status: string;
  createdAt: string;
}

interface PurchaseDetailsProps {
  product: Product;
}

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ product }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get all purchases from all grades
  const allPurchases: (PurchaseHistory & { grade: string; productId: string; farmerId: string })[] = [];
  
  product.gradePrices.forEach(grade => {
    grade.purchaseHistory.forEach(purchase => {
      allPurchases.push({
        ...purchase,
        grade: grade.grade,
        productId: product.productId,
        farmerId: product.farmerId
      });
    });
  });

  // Sort purchases by date (newest first)
  const sortedPurchases = allPurchases.sort((a, b) => 
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  // Calculate totals
  const totalPurchases = allPurchases.length;
  const totalQuantity = allPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
  const totalAmount = allPurchases.reduce((sum, purchase) => sum + (purchase.totalAmount || 0), 0);
  const paidPurchases = allPurchases.filter(p => p.paymentStatus === 'paid').length;
  const pendingPurchases = allPurchases.filter(p => p.paymentStatus === 'pending').length;

  if (totalPurchases === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Purchase History</h3>
            <p className="mt-2 text-gray-600">This product has no purchase history yet.</p>
            <button
              onClick={() => router.back()}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Details</h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-gray-600">Product: <span className="font-medium">{product.cropBriefDetails}</span></p>
                <p className="text-gray-600">ID: <span className="font-medium">{product.productId}</span></p>
                <p className="text-gray-600">Farmer: <span className="font-medium">{product.farmerId}</span></p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back to Products
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Purchases</p>
            <p className="text-2xl font-bold text-blue-600">{totalPurchases}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Quantity</p>
            <p className="text-2xl font-bold text-green-600">{totalQuantity} units</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Payment Status</p>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">{paidPurchases} paid</span>
              <span className="text-gray-300">|</span>
              <span className="text-yellow-600 font-bold">{pendingPurchases} pending</span>
            </div>
          </div>
        </div>

        {/* All Purchases Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Purchase Records ({totalPurchases})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trader Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade & Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPurchases.map((purchase, index) => (
                  <tr key={purchase._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(purchase.purchaseDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{purchase.traderName}</div>
                        <div className="text-gray-500">ID: {purchase.traderId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{purchase.grade}</div>
                        <div className="text-gray-500">{purchase.quantity} units</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          ₹{purchase.pricePerUnit}/unit
                        </div>
                        <div className="text-gray-900 font-bold">
                          {formatCurrency(purchase.totalAmount)}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {purchase.purchaseType === 'direct' ? 'Direct Purchase' : 'Offer Accepted'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {purchase.orderCreated ? (
                          <>
                            <div className="font-medium text-green-600">Order Created ✓</div>
                            <div className="text-gray-500 text-xs">ID: {purchase.orderId}</div>
                            {purchase.razorpayOrderId && (
                              <div className="text-gray-500 text-xs truncate max-w-xs">
                                Razorpay: {purchase.razorpayOrderId}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500">No Order</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-center ${
                          purchase.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {purchase.paymentStatus.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium text-center ${
                          purchase.purchaseType === 'direct' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {purchase.purchaseType.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Purchase Cards (Alternative View) */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Purchase Information</h2>
          <div className="grid grid-cols-1 gap-4">
            {sortedPurchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Purchase ID: {purchase._id}</h3>
                    <p className="text-sm text-gray-600">{formatDate(purchase.purchaseDate)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      purchase.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.paymentStatus.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      purchase.purchaseType === 'direct' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {purchase.purchaseType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Trader Information</p>
                    <div className="space-y-1">
                      <p className="text-gray-900">Name: {purchase.traderName}</p>
                      <p className="text-gray-600 text-sm">ID: {purchase.traderId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Product Information</p>
                    <div className="space-y-1">
                      <p className="text-gray-900">Grade: {purchase.grade}</p>
                      <p className="text-gray-600 text-sm">Product ID: {product.productId}</p>
                      <p className="text-gray-600 text-sm">Farmer ID: {product.farmerId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Quantity & Price</p>
                    <div className="space-y-1">
                      <p className="text-gray-900">Quantity: {purchase.quantity} units</p>
                      <p className="text-gray-900">Price per unit: ₹{purchase.pricePerUnit}</p>
                      <p className="text-lg font-bold text-green-600">
                        Total: {formatCurrency(purchase.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Order Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Created</p>
                      <p className={`font-medium ${
                        purchase.orderCreated ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {purchase.orderCreated ? 'Yes ✓' : 'No'}
                      </p>
                      {purchase.orderId && (
                        <p className="text-sm text-gray-600 mt-1">Order ID: {purchase.orderId}</p>
                      )}
                    </div>
                    {(purchase.razorpayOrderId || purchase.razorpayPaymentId) && (
                      <div>
                        <p className="text-sm text-gray-600">Payment Gateway</p>
                        {purchase.razorpayOrderId && (
                          <p className="text-sm text-gray-600 truncate">Order: {purchase.razorpayOrderId}</p>
                        )}
                        {purchase.razorpayPaymentId && (
                          <p className="text-sm text-gray-600 truncate">Payment: {purchase.razorpayPaymentId}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;