


'use client';

import React, { useState } from 'react';
import { EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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

interface ProductCardProps {
  product: Product;
  onViewReport?: () => void; // Add this prop
}

export default function ProductCard({ product, onViewReport }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate total purchases for this product
  const totalPurchases = product.gradePrices.reduce((acc, grade) => 
    acc + grade.purchaseHistory.length, 0
  );

  // Calculate total sold amount for this product
  const totalSoldAmount = product.gradePrices.reduce((acc, grade) => 
    acc + grade.purchaseHistory.reduce((sum, purchase) => 
      sum + (purchase.totalAmount || 0), 0
    ), 0
  );

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.cropBriefDetails}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                product.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : product.status === 'sold'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Product ID: {product.productId} • Farmer ID: {product.farmerId}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Report Button */}
            {onViewReport && (
              <button
                onClick={onViewReport}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                title="View Farmer Accept Report"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-sm font-medium">View Report</span>
              </button>
            )}
            
            {/* View Details Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <EyeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {expanded ? 'Hide' : 'View'} Details
              </span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Farming Type</p>
            <p className="font-medium">{product.farmingType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Packaging</p>
            <p className="font-medium">
              {product.packagingType} ({product.packageMeasurement})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery</p>
            <p className="font-medium">
              {new Date(product.deliveryDate).toLocaleDateString()} • {product.deliveryTime}
            </p>
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Purchase Summary</p>
              <p className="text-xs text-blue-600">
                Total purchases: {totalPurchases} • Amount: ₹{totalSoldAmount.toLocaleString()}
              </p>
            </div>
            <span className="text-sm font-medium text-blue-700">
              {product.gradePrices.length} Grade{product.gradePrices.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-6 border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Grade Details & Purchase History</h4>
            
            {product.gradePrices.map((grade, index) => (
              <div key={index} className="mb-6 last:mb-0 border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="font-medium">{grade.grade}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      grade.status === 'available' ? 'bg-green-100 text-green-800' :
                      grade.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {grade.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Price: ₹{grade.pricePerUnit}/{grade.quantityType}
                  </div>
                </div>

                {/* Purchase History Table */}
                {grade.purchaseHistory.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Trader</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Qty</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Price/Unit</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Total</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Payment</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {grade.purchaseHistory.map((purchase, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div>
                                <p className="font-medium">{purchase.traderName}</p>
                                <p className="text-xs text-gray-500">{purchase.traderId}</p>
                              </div>
                            </td>
                            <td className="px-3 py-2">{purchase.quantity}</td>
                            <td className="px-3 py-2">₹{purchase.pricePerUnit}</td>
                            <td className="px-3 py-2">₹{purchase.totalAmount.toLocaleString()}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                purchase.purchaseType === 'offer_accepted' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {purchase.purchaseType.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                purchase.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {purchase.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {grade.purchaseHistory.length === 0 && (
                  <p className="text-gray-500 text-sm italic text-center py-4">
                    No purchase history for this grade
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-gray-500">
          <span>
            Created: {new Date(product.createdAt).toLocaleDateString()}
          </span>
          <span className="font-medium">
            {totalPurchases} purchase{totalPurchases !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}