// components/ProductDetails.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch product details');
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-red-800">Error Loading Product</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{product.cropBriefDetails}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-lg text-gray-600">ID: {product.productId}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.status === 'active' ? 'bg-green-100 text-green-800' :
              product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
          </div>
        </div>
        
        {product.status === 'active' && (
          <button
            onClick={() => router.push(`/products/edit/${product._id}`)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Product
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {product.cropPhotos && product.cropPhotos.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Crop Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.cropPhotos.map((photo: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Crop ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Cultivation Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Farming Type</label>
                    <p className="font-medium">{product.farmingType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type of Seeds</label>
                    <p className="font-medium">{product.typeOfSeeds}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Packaging & Delivery</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Packaging Type</label>
                    <p className="font-medium">{product.packagingType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Package Measurement</label>
                    <p className="font-medium">{product.packageMeasurement}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Delivery Date</label>
                    <p className="font-medium">{formatDate(product.deliveryDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Delivery Time</label>
                    <p className="font-medium">{product.deliveryTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Prices */}
          {product.gradePrices && product.gradePrices.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Grades</h2>
              <div className="space-y-4">
                {product.gradePrices.map((grade: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{grade.grade}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            grade.status === 'available' ? 'bg-green-100 text-green-800' :
                            grade.status === 'partially_sold' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {grade.status.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-600">{grade.quantityType}</span>
                          <span className="text-sm text-gray-600">{grade.priceType}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">
                          {formatCurrency(grade.pricePerUnit)}
                        </div>
                        <div className="text-sm text-gray-600">per unit</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-gray-500">Quantity</label>
                        <p className="font-medium">{grade.totalQty} units</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Total Value</label>
                        <p className="font-medium">{formatCurrency(grade.pricePerUnit * grade.totalQty)}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Type</label>
                        <p className="font-medium">{grade.quantityType}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Price Type</label>
                        <p className="font-medium">{grade.priceType}</p>
                      </div>
                    </div>

                    {/* Grade Photos */}
                    {grade.gradePhotos && grade.gradePhotos.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Grade Photos</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {grade.gradePhotos.map((photo: string, photoIndex: number) => (
                            <div key={photoIndex} className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                              <img
                                src={photo}
                                alt={`Grade ${grade.grade} - ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Location Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Nearest Market</label>
                <p className="font-medium">{product.nearestMarket}</p>
              </div>
              {product.farmLocation && (
                <div>
                  <label className="text-sm text-gray-500">Farm Coordinates</label>
                  <p className="font-medium">
                    Lat: {product.farmLocation.lat}, Lng: {product.farmLocation.lng}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Created On</label>
                <p className="font-medium">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Updated</label>
                <p className="font-medium">{formatDate(product.updatedAt)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Delivery Scheduled</label>
                <p className="font-medium">{formatDate(product.deliveryDate)}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Grades</span>
                <span className="font-bold">{product.gradePrices?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Quantity</span>
                <span className="font-bold">
                  {product.gradePrices?.reduce((total: number, grade: any) => total + grade.totalQty, 0) || 0} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Value</span>
                <span className="font-bold">
                  {formatCurrency(
                    product.gradePrices?.reduce((total: number, grade: any) => 
                      total + (grade.pricePerUnit * grade.totalQty), 0) || 0
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {product.status === 'active' && (
                <>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    View Offers
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Update Status
                  </button>
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                    Add Grade
                  </button>
                </>
              )}
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Print Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;