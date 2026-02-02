



// 'use client';

// import { useState, useEffect } from 'react';
// import { FiSearch, FiX, FiSave, FiPackage, FiDollarSign, FiUser, FiPercent, FiTruck, FiCheckCircle, FiAlertCircle, FiEdit } from 'react-icons/fi';

// interface AvailableGrade {
//   grade: string;
//   pricePerUnit: number;
//   availableQty: number;
// }

// interface GradeRow {
//   grade: string;
//   price: number;
//   totalQuantity: number;
//   depreciation: number;
//   appreciation: number;
//   isAvailable: boolean;
//   availableQty?: number;
// }

// interface ProductItemData {
//   productId: string;
//   productName: string;
//   farmerId: string;
//   selectedGrade: string;
//   quantity: number;
//   pricePerUnit: number;
//   deliveryDate: string;
//   availableGrades: AvailableGrade[];
// }

// interface PaymentFees {
//   labourFee?: number;
//   transportFee?: number;
//   advanceAmount?: number;
// }

// interface PaymentDetails {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   fees?: PaymentFees;
// }

// interface OrderData {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   farmerName?: string;
//   orderStatus: string;
//   productItems: ProductItemData[];
//   traderToAdminPayment?: PaymentDetails;
//   adminToFarmerPayment?: PaymentDetails;
// }

// interface EditData {
//   productItems: ProductItemData[];
//   gradeData: { [productId: string]: GradeRow[] };
//   processingFeesFarmer: number;
//   processingFeesTrader: number;
//   farmerLabourFee: number;
//   traderLabourFee: number;
//   farmerTransportFee: number;
//   traderTransportFee: number;
//   advanceAmount: number;
// }

// interface Calculations {
//   productTotal: number;
//   farmerTotal: number;
//   traderTotal: number;
//   farmerRemaining: number;
// }

// declare global {
//   interface Window {
//     openEditOrderModal?: (orderId: string) => void;
//   }
// }

// const OrderEditModal: React.FC = () => {
//   const [orderData, setOrderData] = useState<OrderData | null>(null);
//   const [editData, setEditData] = useState<EditData>({
//     productItems: [],
//     gradeData: {},
//     processingFeesFarmer: 0,
//     processingFeesTrader: 3,
//     farmerLabourFee: 0,
//     traderLabourFee: 0,
//     farmerTransportFee: 0,
//     traderTransportFee: 0,
//     advanceAmount: 0
//   });
//   const [calculations, setCalculations] = useState<Calculations>({
//     productTotal: 0,
//     farmerTotal: 0,
//     traderTotal: 0,
//     farmerRemaining: 0
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Search states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredProductItems, setFilteredProductItems] = useState<ProductItemData[]>([]);

//   const API_BASE = 'https://kisan.etpl.ai/api/admin';
//   const ALL_GRADES = ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'All Mixed Grades'];

//   // Clear messages after timeout
//   useEffect(() => {
//     if (successMessage || errorMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//         setErrorMessage('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, errorMessage]);

//   const openEditModal = async (orderId: string): Promise<void> => {
//     try {
//       setSuccessMessage('');
//       setErrorMessage('');

//       const response = await fetch(`${API_BASE}/orders/${orderId}/details`);
//       const data = await response.json();

//       if (data.success) {
//         setOrderData(data.data);

//         // Initialize grade data for each product
//         const gradeDataMap: { [productId: string]: GradeRow[] } = {};

//         data.data.productItems.forEach((item: any) => {
//           const gradeRows: GradeRow[] = ALL_GRADES.map(gradeName => {
//             const availableGrade = item.availableGrades?.find((g: AvailableGrade) => g.grade === gradeName);
//             const isSelectedGrade = item.grade === gradeName;

//             return {
//               grade: gradeName,
//               price: availableGrade ? availableGrade.pricePerUnit : 0,
//               totalQuantity: isSelectedGrade ? item.quantity : 0,
//               depreciation: 0,
//               appreciation: 0,
//               isAvailable: !!availableGrade,
//               availableQty: availableGrade?.availableQty
//             };
//           });

//           gradeDataMap[item.productId] = gradeRows;
//         });

//         const productItems = data.data.productItems.map((item: any) => ({
//           productId: item.productId || '',
//           productName: item.productName || '',
//           farmerId: item.farmerId || '',
//           selectedGrade: item.grade || '',
//           quantity: item.quantity || 0,
//           pricePerUnit: item.pricePerUnit || 0,
//           deliveryDate: item.deliveryDate || '',
//           availableGrades: item.availableGrades || []
//         }));

//         setEditData({
//           productItems: productItems,
//           gradeData: gradeDataMap,
//           processingFeesFarmer: data.data.adminToFarmerPayment?.fees?.processingFee || 0,
//           processingFeesTrader: data.data.traderToAdminPayment?.fees?.processingFee || 3,
//           farmerLabourFee: data.data.adminToFarmerPayment?.fees?.labourFee || 0,
//           traderLabourFee: data.data.traderToAdminPayment?.fees?.labourFee || 0,
//           farmerTransportFee: data.data.adminToFarmerPayment?.fees?.transportFee || 0,
//           traderTransportFee: data.data.traderToAdminPayment?.fees?.transportFee || 0,
//           advanceAmount: data.data.adminToFarmerPayment?.fees?.advanceAmount || 0
//         });

//         // Initialize filtered product items
//         setFilteredProductItems(productItems);
//         setSearchQuery('');
//         setIsModalOpen(true);
//       }
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       setErrorMessage('Error loading order details');
//     }
//   };

//   useEffect(() => {
//     calculateTotals();
//   }, [editData]);

//   // Filter product items based on search query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredProductItems(editData.productItems);
//       return;
//     }

//     const query = searchQuery.toLowerCase().trim();
//     const filtered = editData.productItems.filter(item => {
//       const productName = item.productName || '';
//       const productId = item.productId || '';
//       const selectedGrade = item.selectedGrade || '';
//       const farmerId = item.farmerId || '';

//       return (
//         productName.toLowerCase().includes(query) ||
//         productId.toLowerCase().includes(query) ||
//         selectedGrade.toLowerCase().includes(query) ||
//         farmerId.toLowerCase().includes(query)
//       );
//     });

//     setFilteredProductItems(filtered);
//   }, [searchQuery, editData.productItems]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const calculateTotals = (): void => {
//     let productTotal = 0;

//     // Calculate product total from grade data
//     editData.productItems.forEach(item => {
//       const grades = editData.gradeData[item.productId] || [];
//       grades.forEach(grade => {
//         if (grade.totalQuantity > 0) {
//           const baseAmount = grade.price * grade.totalQuantity;
//           const finalPrice = baseAmount - grade.depreciation + grade.appreciation;
//           productTotal += finalPrice;
//         }
//       });
//     });

//     // Calculate processing fees
//     const farmerProcessingFee = (productTotal * editData.processingFeesFarmer) / 100;
//     const traderProcessingFee = (productTotal * editData.processingFeesTrader) / 100;

//     // Farmer calculation: Total - Deductions
//     const farmerTotal = productTotal - farmerProcessingFee - editData.farmerLabourFee - editData.farmerTransportFee;
//     const farmerRemaining = farmerTotal - editData.advanceAmount;

//     // Trader calculation: Total + Additions
//     const traderTotal = productTotal + traderProcessingFee + editData.traderLabourFee + editData.traderTransportFee;

//     setCalculations({
//       productTotal,
//       farmerTotal,
//       traderTotal,
//       farmerRemaining
//     });
//   };

//   const handleGradeDataChange = (
//     productId: string,
//     gradeIndex: number,
//     field: keyof GradeRow,
//     value: number
//   ): void => {
//     const updatedGradeData = { ...editData.gradeData };
//     if (updatedGradeData[productId] && updatedGradeData[productId][gradeIndex]) {
//       updatedGradeData[productId][gradeIndex] = {
//         ...updatedGradeData[productId][gradeIndex],
//         [field]: value
//       };

//       setEditData({
//         ...editData,
//         gradeData: updatedGradeData
//       });
//     }
//   };

//   const handleFeeChange = (field: keyof EditData, value: string): void => {
//     setEditData({
//       ...editData,
//       [field]: parseFloat(value) || 0
//     });
//   };

//   const saveOrderUpdate = async (e: React.MouseEvent): Promise<void> => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!orderData) return;

//     setIsSaving(true);
//     setSuccessMessage('');
//     setErrorMessage('');

//     try {
//       // Prepare updated product items from grade data
//       const updatedProductItems = editData.productItems.map(item => {
//         const grades = editData.gradeData[item.productId] || [];
//         const selectedGrade = grades.find(g => g.totalQuantity > 0);

//         if (selectedGrade) {
//           const baseAmount = selectedGrade.price * selectedGrade.totalQuantity;
//           const totalAmount = baseAmount - selectedGrade.depreciation + selectedGrade.appreciation;

//           return {
//             productId: item.productId,
//             productName: item.productName,
//             farmerId: item.farmerId,
//             grade: selectedGrade.grade,
//             quantity: selectedGrade.totalQuantity,
//             pricePerUnit: selectedGrade.price,
//             deliveryDate: item.deliveryDate,
//             totalAmount: totalAmount
//           };
//         }

//         return null;
//       }).filter(Boolean);

//       const response = await fetch(`${API_BASE}/orders/${orderData.orderId}/update`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productItems: updatedProductItems,
//           processingFeesFarmer: editData.processingFeesFarmer,
//           processingFeesTrader: editData.processingFeesTrader,
//           farmerLabourFee: editData.farmerLabourFee,
//           traderLabourFee: editData.traderLabourFee,
//           farmerTransportFee: editData.farmerTransportFee,
//           traderTransportFee: editData.traderTransportFee,
//           advanceAmount: editData.advanceAmount
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         setSuccessMessage('Order updated successfully!');

//         // Close modal after 1.5 seconds
//         setTimeout(() => {
//           setIsModalOpen(false);
//         }, 1500);
//       } else {
//         setErrorMessage('Failed to update order: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//       setErrorMessage('Error updating order');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   useEffect(() => {
//     window.openEditOrderModal = openEditModal;
//     return () => {
//       delete window.openEditOrderModal;
//     };
//   }, []);

//   return (
//     <>
//       {/* Success/Error Messages */}
//       {(successMessage || errorMessage) && (
//         <div className="fixed top-6 right-6 z-[1100] flex flex-col gap-3">
//           {successMessage && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
//               <FiCheckCircle className="w-5 h-5 text-green-600" />
//               <div>
//                 <p className="font-medium text-green-800">Success!</p>
//                 <p className="text-sm text-green-600">{successMessage}</p>
//               </div>
//             </div>
//           )}
//           {errorMessage && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
//               <FiAlertCircle className="w-5 h-5 text-red-600" />
//               <div>
//                 <p className="font-medium text-red-800">Error!</p>
//                 <p className="text-sm text-red-600">{errorMessage}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-[#49494959] bg-opacity-50 flex items-center justify-center z-[1050] p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <FiEdit className="w-6 h-6 text-white" />
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Edit Order Details</h2>
//                     <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
//                       <span>Order: {orderData?.orderId || ''}</span>
//                       <span>Trader: {orderData?.traderName || ''}</span>
//                       <span>Farmer: {orderData?.farmerName || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => !isSaving && setIsModalOpen(false)}
//                   disabled={isSaving}
//                   className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
//                 >
//                   <FiX className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {orderData && (
//                 <div className="space-y-6">
//                   {/* Search Section */}
//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//                       <div className="relative flex-1 w-full">
//                         <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="text"
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                           placeholder="Search products..."
//                           value={searchQuery}
//                           onChange={handleSearch}
//                           disabled={isSaving}
//                         />
//                       </div>
//                       {searchQuery && (
//                         <div className="flex items-center gap-2">
//                           <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
//                             Found {filteredProductItems.length} product{filteredProductItems.length !== 1 ? 's' : ''}
//                           </span>
//                           <button
//                             onClick={() => setSearchQuery('')}
//                             className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                             disabled={isSaving}
//                           >
//                             Clear
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Products Section */}
//                   <div>
//                     <div className="flex items-center gap-2 mb-4">
//                       <FiPackage className="w-5 h-5 text-blue-600" />
//                       <h3 className="text-lg font-semibold text-gray-900">Products ({filteredProductItems.length})</h3>
//                     </div>

//                     {filteredProductItems.length === 0 ? (
//                       <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                         <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-600 mb-2">No products found</p>
//                         <p className="text-sm text-gray-500 mb-4">Try adjusting your search</p>
//                         <button
//                           onClick={() => setSearchQuery('')}
//                           className="text-blue-600 hover:text-blue-700 font-medium"
//                           disabled={isSaving}
//                         >
//                           Show all products
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {filteredProductItems.map((item, itemIndex) => (
//                           <div key={`${item.productId}-${itemIndex}`} className="border border-gray-200 rounded-lg overflow-hidden">
//                             {/* Product Header */}
//                             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                                 <div className="flex items-center gap-2">
//                                   <FiPackage className="w-4 h-4 text-blue-600" />
//                                   <span className="font-medium text-gray-900">{item.productName || 'Unnamed Product'}</span>
//                                 </div>
//                                 <div className="text-sm text-gray-600">
//                                   ID: {item.productId || 'N/A'} • Farmer: {item.farmerId || 'N/A'}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Grades Table */}
//                             <div className="overflow-x-auto">
//                               <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                   <tr>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Grade</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Qty</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Deprec.</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Apprec.</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Final</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {(editData.gradeData[item.productId] || []).map((gradeRow, gradeIndex) => {
//                                     const baseAmount = gradeRow.price * gradeRow.totalQuantity;
//                                     const finalAmount = baseAmount - gradeRow.depreciation + gradeRow.appreciation;

//                                     return (
//                                       <tr key={gradeIndex} className={gradeRow.isAvailable ? 'bg-green-50/50' : 'bg-yellow-50/50'}>
//                                         <td className="px-4 py-3">
//                                           <div className="space-y-1">
//                                             <span className="font-medium text-gray-900">{gradeRow.grade || 'N/A'}</span>
//                                             {gradeRow.isAvailable ? (
//                                               <div className="text-xs text-green-600 flex items-center gap-1">
//                                                 <FiCheckCircle className="w-3 h-3" />
//                                                 Available ({gradeRow.availableQty || 0})
//                                               </div>
//                                             ) : (
//                                               <div className="text-xs text-yellow-600 flex items-center gap-1">
//                                                 <FiAlertCircle className="w-3 h-3" />
//                                                 Manual entry
//                                               </div>
//                                             )}
//                                           </div>
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className={`w-24 px-2 py-1 text-sm border rounded ${gradeRow.isAvailable ? 'border-gray-300' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}`}
//                                             value={gradeRow.price}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'price',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={gradeRow.isAvailable || isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
//                                             value={gradeRow.totalQuantity}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'totalQuantity',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
//                                             value={gradeRow.depreciation}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'depreciation',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
//                                             value={gradeRow.appreciation}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'appreciation',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <div className="font-medium text-green-700">
//                                             {formatCurrency(finalAmount)}
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     );
//                                   })}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Fees Section */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Farmer Fees */}
//                     <div className="border border-gray-200 rounded-lg">
//                       <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-t-lg">
//                         <div className="flex items-center gap-2">
//                           <FiUser className="w-5 h-5 text-white" />
//                           <h3 className="text-lg font-semibold text-white">Farmer Payments (Deductions)</h3>
//                         </div>
//                       </div>
//                       <div className="p-4 space-y-4">
//                         {/* Processing Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiPercent className="w-4 h-4" />
//                             Processing Fee (%)
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.processingFeesFarmer}
//                             onChange={(e) => handleFeeChange('processingFeesFarmer', e.target.value)}
//                             disabled={isSaving}
//                             step="0.1"
//                           />
//                         </div>

//                         {/* Labour Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Labour Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.farmerLabourFee}
//                             onChange={(e) => handleFeeChange('farmerLabourFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Transport Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiTruck className="w-4 h-4" />
//                             Transport Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.farmerTransportFee}
//                             onChange={(e) => handleFeeChange('farmerTransportFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Advance */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Advance Amount
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.advanceAmount}
//                             onChange={(e) => handleFeeChange('advanceAmount', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Farmer Calculation Summary */}
//                         <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Product Total:</span>
//                             <span className="font-medium">{formatCurrency(calculations.productTotal)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-red-600">
//                             <span>Processing Fee ({editData.processingFeesFarmer}%):</span>
//                             <span>-{formatCurrency((calculations.productTotal * editData.processingFeesFarmer) / 100)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-red-600">
//                             <span>Labour Fee:</span>
//                             <span>-{formatCurrency(editData.farmerLabourFee)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-red-600">
//                             <span>Transport Fee:</span>
//                             <span>-{formatCurrency(editData.farmerTransportFee)}</span>
//                           </div>
//                           <div className="border-t border-gray-300 pt-2 mt-2">
//                             <div className="flex justify-between text-sm">
//                               <span className="font-medium">Total Payable:</span>
//                               <span className="font-semibold text-green-700">{formatCurrency(calculations.farmerTotal)}</span>
//                             </div>
//                             <div className="flex justify-between text-sm text-yellow-600 mt-1">
//                               <span>Advance:</span>
//                               <span>-{formatCurrency(editData.advanceAmount)}</span>
//                             </div>
//                             <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-300">
//                               <span>Remaining:</span>
//                               <span className="text-blue-700">{formatCurrency(calculations.farmerRemaining)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Trader Fees */}
//                     <div className="border border-gray-200 rounded-lg">
//                       <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 rounded-t-lg">
//                         <div className="flex items-center gap-2">
//                           <FiUser className="w-5 h-5 text-white" />
//                           <h3 className="text-lg font-semibold text-white">Trader Payments (Additions)</h3>
//                         </div>
//                       </div>
//                       <div className="p-4 space-y-4">
//                         {/* Processing Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiPercent className="w-4 h-4" />
//                             Processing Fee (%)
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//                             value={editData.processingFeesTrader}
//                             onChange={(e) => handleFeeChange('processingFeesTrader', e.target.value)}
//                             disabled={isSaving}
//                             step="0.1"
//                           />
//                         </div>

//                         {/* Labour Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Labour Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//                             value={editData.traderLabourFee}
//                             onChange={(e) => handleFeeChange('traderLabourFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Transport Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiTruck className="w-4 h-4" />
//                             Transport Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//                             value={editData.traderTransportFee}
//                             onChange={(e) => handleFeeChange('traderTransportFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Trader Calculation Summary */}
//                         <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Product Total:</span>
//                             <span className="font-medium">{formatCurrency(calculations.productTotal)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Processing Fee ({editData.processingFeesTrader}%):</span>
//                             <span>+{formatCurrency((calculations.productTotal * editData.processingFeesTrader) / 100)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Labour Fee:</span>
//                             <span>+{formatCurrency(editData.traderLabourFee)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Transport Fee:</span>
//                             <span>+{formatCurrency(editData.traderTransportFee)}</span>
//                           </div>
//                           <div className="border-t border-gray-300 pt-2 mt-2">
//                             <div className="flex justify-between text-base font-bold">
//                               <span>Total Payable:</span>
//                               <span className="text-purple-700">{formatCurrency(calculations.traderTotal)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="flex flex-wrap items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <FiDollarSign className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Product Total</p>
//                       <p className="font-semibold text-gray-900">{formatCurrency(calculations.productTotal)}</p>
//                     </div>
//                   </div>
//                   <div className="h-6 w-px bg-gray-300" />
//                   <div className="flex items-center gap-2">
//                     <FiUser className="w-5 h-5 text-green-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Farmer Receives</p>
//                       <p className="font-semibold text-green-700">{formatCurrency(calculations.farmerRemaining)}</p>
//                     </div>
//                   </div>
//                   <div className="h-6 w-px bg-gray-300" />
//                   <div className="flex items-center gap-2">
//                     <FiUser className="w-5 h-5 text-purple-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Trader Pays</p>
//                       <p className="font-semibold text-purple-700">{formatCurrency(calculations.traderTotal)}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={isSaving}
//                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={saveOrderUpdate}
//                     disabled={isSaving}
//                     className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
//                       isSaving
//                         ? 'bg-gray-400 text-white cursor-not-allowed'
//                         : 'bg-green-600 text-white hover:bg-green-700'
//                     }`}
//                   >
//                     {isSaving ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <FiSave className="w-5 h-5" />
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderEditModal;











// 'use client';

// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { FiSearch, FiX, FiSave, FiPackage, FiDollarSign, FiUser, FiPercent, FiTruck, FiCheckCircle, FiAlertCircle, FiEdit } from 'react-icons/fi';
// import { getAdminSessionAction } from '@/app/actions/auth-actions';


// interface AvailableGrade {
//   grade: string;
//   pricePerUnit: number;
//   availableQty: number;
// }

// interface GradeRow {
//   grade: string;
//   price: number;
//   totalQuantity: number;
//   depreciation: number;
//   appreciation: number;
//   isAvailable: boolean;
//   availableQty?: number;
// }

// interface ProductItemData {
//   productId: string;
//   productName: string;
//   farmerId: string;
//   selectedGrade: string;
//   quantity: number;
//   pricePerUnit: number;
//   deliveryDate: string;
//   availableGrades: AvailableGrade[];
// }

// interface PaymentFees {
//   labourFee?: number;
//   transportFee?: number;
//   advanceAmount?: number;
// }

// interface PaymentDetails {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   fees?: PaymentFees;
// }

// interface OrderData {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   farmerName?: string;
//   orderStatus: string;
//   productItems: ProductItemData[];
//   traderToAdminPayment?: PaymentDetails;
//   adminToFarmerPayment?: PaymentDetails;
// }

// interface EditData {
//   productItems: ProductItemData[];
//   gradeData: { [productId: string]: GradeRow[] };
//   processingFeesFarmer: number;
//   processingFeesTrader: number;
//   farmerLabourFee: number;
//   traderLabourFee: number;
//   farmerTransportFee: number;
//   traderTransportFee: number;
//   advanceAmount: number;
// }

// interface Calculations {
//   productTotal: number;
//   farmerTotal: number;
//   traderTotal: number;
//   farmerRemaining: number;
// }

// declare global {
//   interface Window {
//     openEditOrderModal?: (orderId: string) => void;
//   }
// }

// const OrderEditModal: React.FC = () => {
//   const [originalOrderData, setOriginalOrderData] = useState<OrderData | null>(null);

//   const [orderData, setOrderData] = useState<OrderData | null>(null);
//   const [editData, setEditData] = useState<EditData>({
//     productItems: [],
//     gradeData: {},
//     processingFeesFarmer: 0,
//     processingFeesTrader: 3,
//     farmerLabourFee: 0,
//     traderLabourFee: 0,
//     farmerTransportFee: 0,
//     traderTransportFee: 0,
//     advanceAmount: 0
//   });
//   const [calculations, setCalculations] = useState<Calculations>({
//     productTotal: 0,
//     farmerTotal: 0,
//     traderTotal: 0,
//     farmerRemaining: 0
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Search states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredProductItems, setFilteredProductItems] = useState<ProductItemData[]>([]);

//   const API_BASE = 'https://kisan.etpl.ai/api/admin';
//   const ALL_GRADES = ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'All Mixed Grades'];

//   // Clear messages after timeout
//   useEffect(() => {
//     if (successMessage || errorMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//         setErrorMessage('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, errorMessage]);

//   const openEditModal = async (orderId: string): Promise<void> => {
//     try {
//       setSuccessMessage('');
//       setErrorMessage('');

//       const response = await fetch(`${API_BASE}/orders/${orderId}/details`);
//       const data = await response.json();

//       if (data.success) {
//         setOrderData(data.data);
//         setOriginalOrderData(JSON.parse(JSON.stringify(data.data)));

//         // Initialize grade data for each product
//         const gradeDataMap: { [productId: string]: GradeRow[] } = {};

//         data.data.productItems.forEach((item: any) => {
//           const gradeRows: GradeRow[] = ALL_GRADES.map(gradeName => {
//             const availableGrade = item.availableGrades?.find((g: AvailableGrade) => g.grade === gradeName);
//             const isSelectedGrade = item.grade === gradeName;

//             return {
//               grade: gradeName,
//               price: availableGrade ? availableGrade.pricePerUnit : 0,
//               totalQuantity: isSelectedGrade ? item.quantity : 0,
//               depreciation: 0,
//               appreciation: 0,
//               isAvailable: !!availableGrade,
//               availableQty: availableGrade?.availableQty
//             };
//           });

//           gradeDataMap[item.productId] = gradeRows;
//         });

//         const productItems = data.data.productItems.map((item: any) => ({
//           productId: item.productId || '',
//           productName: item.productName || '',
//           farmerId: item.farmerId || '',
//           selectedGrade: item.grade || '',
//           quantity: item.quantity || 0,
//           pricePerUnit: item.pricePerUnit || 0,
//           deliveryDate: item.deliveryDate || '',
//           availableGrades: item.availableGrades || []
//         }));

//         setEditData({
//           productItems: productItems,
//           gradeData: gradeDataMap,
//           processingFeesFarmer: data.data.adminToFarmerPayment?.fees?.processingFee || 0,
//           processingFeesTrader: data.data.traderToAdminPayment?.fees?.processingFee || 3,
//           farmerLabourFee: data.data.adminToFarmerPayment?.fees?.labourFee || 0,
//           traderLabourFee: data.data.traderToAdminPayment?.fees?.labourFee || 0,
//           farmerTransportFee: data.data.adminToFarmerPayment?.fees?.transportFee || 0,
//           traderTransportFee: data.data.traderToAdminPayment?.fees?.transportFee || 0,
//           advanceAmount: data.data.adminToFarmerPayment?.fees?.advanceAmount || 0
//         });

//         // Initialize filtered product items
//         setFilteredProductItems(productItems);
//         setSearchQuery('');
//         setIsModalOpen(true);
//       }
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       setErrorMessage('Error loading order details');
//     }
//   };

//   useEffect(() => {
//     calculateTotals();
//   }, [editData]);

//   // Filter product items based on search query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredProductItems(editData.productItems);
//       return;
//     }

//     const query = searchQuery.toLowerCase().trim();
//     const filtered = editData.productItems.filter(item => {
//       const productName = item.productName || '';
//       const productId = item.productId || '';
//       const selectedGrade = item.selectedGrade || '';
//       const farmerId = item.farmerId || '';

//       return (
//         productName.toLowerCase().includes(query) ||
//         productId.toLowerCase().includes(query) ||
//         selectedGrade.toLowerCase().includes(query) ||
//         farmerId.toLowerCase().includes(query)
//       );
//     });

//     setFilteredProductItems(filtered);
//   }, [searchQuery, editData.productItems]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const calculateTotals = (): void => {
//     let productTotal = 0;

//     // Calculate product total from grade data
//     editData.productItems.forEach(item => {
//       const grades = editData.gradeData[item.productId] || [];
//       grades.forEach(grade => {
//         if (grade.totalQuantity > 0) {
//           const baseAmount = grade.price * grade.totalQuantity;
//           const finalPrice = baseAmount - grade.depreciation + grade.appreciation;
//           productTotal += finalPrice;
//         }
//       });
//     });

//     // Calculate processing fees
//     const farmerProcessingFee = (productTotal * editData.processingFeesFarmer) / 100;
//     const traderProcessingFee = (productTotal * editData.processingFeesTrader) / 100;

//     // Farmer calculation: Total - Deductions
//     const farmerTotal = productTotal - farmerProcessingFee - editData.farmerLabourFee - editData.farmerTransportFee;
//     const farmerRemaining = farmerTotal - editData.advanceAmount;

//     // Trader calculation: Total + Additions
//     const traderTotal = productTotal + traderProcessingFee + editData.traderLabourFee + editData.traderTransportFee;

//     setCalculations({
//       productTotal,
//       farmerTotal,
//       traderTotal,
//       farmerRemaining
//     });
//   };

//   const handleGradeDataChange = (
//     productId: string,
//     gradeIndex: number,
//     field: keyof GradeRow,
//     value: number
//   ): void => {
//     const updatedGradeData = { ...editData.gradeData };
//     if (updatedGradeData[productId] && updatedGradeData[productId][gradeIndex]) {
//       updatedGradeData[productId][gradeIndex] = {
//         ...updatedGradeData[productId][gradeIndex],
//         [field]: value
//       };

//       setEditData({
//         ...editData,
//         gradeData: updatedGradeData
//       });
//     }
//   };

//   const handleFeeChange = (field: keyof EditData, value: string): void => {
//     setEditData({
//       ...editData,
//       [field]: parseFloat(value) || 0
//     });
//   };


//   const getOrderPriceQuantityChanges = () => {
//     const changes: Record<string, { old: any; new: any }> = {};

//     if (!originalOrderData) return changes;

//     originalOrderData.productItems.forEach((oldItem) => {
//       const newItem = editData.productItems.find(
//         p => p.productId === oldItem.productId
//       );

//       if (!newItem) return;

//       // OLD values
//       const oldPrice = oldItem.pricePerUnit;
//       const oldQty = oldItem.quantity;
//       const oldGrade = oldItem.selectedGrade;

//       // NEW values (from gradeData)
//       const grades = editData.gradeData[newItem.productId] || [];
//       const selectedGrade = grades.find(g => g.totalQuantity > 0);

//       if (!selectedGrade) return;

//       if (oldPrice !== selectedGrade.price) {
//         changes[`productItems.${newItem.productId}.price`] = {
//           old: oldPrice,
//           new: selectedGrade.price,
//         };
//       }

//       if (oldQty !== selectedGrade.totalQuantity) {
//         changes[`productItems.${newItem.productId}.quantity`] = {
//           old: oldQty,
//           new: selectedGrade.totalQuantity,
//         };
//       }

//       if (oldGrade !== selectedGrade.grade) {
//         changes[`productItems.${newItem.productId}.grade`] = {
//           old: oldGrade,
//           new: selectedGrade.grade,
//         };
//       }
//     });

//     return changes;
//   };

//   const saveOrderUpdate = async (e: React.MouseEvent): Promise<void> => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!orderData) return;

//     setIsSaving(true);
//     setSuccessMessage('');
//     setErrorMessage('');

//     try {
//       // Prepare updated product items from grade data
//       const updatedProductItems = editData.productItems.map(item => {
//         const grades = editData.gradeData[item.productId] || [];
//         const selectedGrade = grades.find(g => g.totalQuantity > 0);

//         if (selectedGrade) {
//           const baseAmount = selectedGrade.price * selectedGrade.totalQuantity;
//           const totalAmount = baseAmount - selectedGrade.depreciation + selectedGrade.appreciation;

//           return {
//             productId: item.productId,
//             productName: item.productName,
//             farmerId: item.farmerId,
//             grade: selectedGrade.grade,
//             quantity: selectedGrade.totalQuantity,
//             pricePerUnit: selectedGrade.price,
//             deliveryDate: item.deliveryDate,
//             totalAmount: totalAmount
//           };
//         }

//         return null;
//       }).filter(Boolean);

//       const response = await fetch(`${API_BASE}/orders/${orderData.orderId}/update`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productItems: updatedProductItems,
//           processingFeesFarmer: editData.processingFeesFarmer,
//           processingFeesTrader: editData.processingFeesTrader,
//           farmerLabourFee: editData.farmerLabourFee,
//           traderLabourFee: editData.traderLabourFee,
//           farmerTransportFee: editData.farmerTransportFee,
//           traderTransportFee: editData.traderTransportFee,
//           advanceAmount: editData.advanceAmount
//         })
//       });
//       const orderChanges = getOrderPriceQuantityChanges();

//       const result = await response.json();

//       console.log(`data is ::::: ${JSON.stringify(result.data, null, 2)}`)
//       const orderdata = result.data;
//       const { admin: { name, role, _id } } = await getAdminSessionAction();

//       const auditLogData = {
//         actorId: _id,
//         actorRole: "subadmin",
//         action: "Update",
//         module: "ORDER_UPDATED_" + `(${orderdata?._id})`,
//         targetId: orderdata._id,
//         description: `Order updated by` + `${name}` + `(${_id})`,
//         changes: orderChanges,
//         userAgent: orderdata.traderId || 'unknown',
//         ipAddress: "::1",

//       };
//       console.log("auditLogData", auditLogData)
//       const res = await axios.post('/api/audit-logs', auditLogData)
//       console.log(res.data)

//       if (result.success) {
//         setSuccessMessage('Order updated successfully!');

//         // Close modal after 1.5 seconds
//         setTimeout(() => {
//           setIsModalOpen(false);
//         }, 1500);
//       } else {
//         setErrorMessage('Failed to update order: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//       setErrorMessage('Error updating order');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   useEffect(() => {
//     window.openEditOrderModal = openEditModal;
//     return () => {
//       delete window.openEditOrderModal;
//     };
//   }, []);

//   return (
//     <>
//       {/* Success/Error Messages */}
//       {(successMessage || errorMessage) && (
//         <div className="fixed top-6 right-6 z-[1100] flex flex-col gap-3">
//           {successMessage && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
//               <FiCheckCircle className="w-5 h-5 text-green-600" />
//               <div>
//                 <p className="font-medium text-green-800">Success!</p>
//                 <p className="text-sm text-green-600">{successMessage}</p>
//               </div>
//             </div>
//           )}
//           {errorMessage && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
//               <FiAlertCircle className="w-5 h-5 text-red-600" />
//               <div>
//                 <p className="font-medium text-red-800">Error!</p>
//                 <p className="text-sm text-red-600">{errorMessage}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-[#49494959] bg-opacity-50 flex items-center justify-center z-[1050] p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <FiEdit className="w-6 h-6 text-white" />
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Edit Order Details</h2>
//                     <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
//                       <span>Order: {orderData?.orderId || ''}</span>
//                       <span>Trader: {orderData?.traderName || ''}</span>
//                       <span>Farmer: {orderData?.farmerName || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => !isSaving && setIsModalOpen(false)}
//                   disabled={isSaving}
//                   className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
//                 >
//                   <FiX className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {orderData && (
//                 <div className="space-y-6">
//                   {/* Search Section */}
//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//                       <div className="relative flex-1 w-full">
//                         <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="text"
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                           placeholder="Search products..."
//                           value={searchQuery}
//                           onChange={handleSearch}
//                           disabled={isSaving}
//                         />
//                       </div>
//                       {searchQuery && (
//                         <div className="flex items-center gap-2">
//                           <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
//                             Found {filteredProductItems.length} product{filteredProductItems.length !== 1 ? 's' : ''}
//                           </span>
//                           <button
//                             onClick={() => setSearchQuery('')}
//                             className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                             disabled={isSaving}
//                           >
//                             Clear
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Products Section */}
//                   <div>
//                     <div className="flex items-center gap-2 mb-4">
//                       <FiPackage className="w-5 h-5 text-blue-600" />
//                       <h3 className="text-lg font-semibold text-gray-900">Products ({filteredProductItems.length})</h3>
//                     </div>

//                     {filteredProductItems.length === 0 ? (
//                       <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                         <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-600 mb-2">No products found</p>
//                         <p className="text-sm text-gray-500 mb-4">Try adjusting your search</p>
//                         <button
//                           onClick={() => setSearchQuery('')}
//                           className="text-blue-600 hover:text-blue-700 font-medium"
//                           disabled={isSaving}
//                         >
//                           Show all products
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {filteredProductItems.map((item, itemIndex) => (
//                           <div key={`${item.productId}-${itemIndex}`} className="border border-gray-200 rounded-lg overflow-hidden">
//                             {/* Product Header */}
//                             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                                 <div className="flex items-center gap-2">
//                                   <FiPackage className="w-4 h-4 text-blue-600" />
//                                   <span className="font-medium text-gray-900">{item.productName || 'Unnamed Product'}</span>
//                                 </div>
//                                 <div className="text-sm text-gray-600">
//                                   ID: {item.productId || 'N/A'} • Farmer: {item.farmerId || 'N/A'}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Grades Table */}
//                             <div className="overflow-x-auto">
//                               <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                   <tr>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Grade</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Qty</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Deprec.</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Apprec.</th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Final</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {(editData.gradeData[item.productId] || []).map((gradeRow, gradeIndex) => {
//                                     const baseAmount = gradeRow.price * gradeRow.totalQuantity;
//                                     const finalAmount = baseAmount - gradeRow.depreciation + gradeRow.appreciation;

//                                     return (
//                                       <tr key={gradeIndex} className={gradeRow.isAvailable ? 'bg-green-50/50' : 'bg-yellow-50/50'}>
//                                         <td className="px-4 py-3">
//                                           <div className="space-y-1">
//                                             <span className="font-medium text-gray-900">{gradeRow.grade || 'N/A'}</span>
//                                             {gradeRow.isAvailable ? (
//                                               <div className="text-xs text-green-600 flex items-center gap-1">
//                                                 <FiCheckCircle className="w-3 h-3" />
//                                                 Available ({gradeRow.availableQty || 0})
//                                               </div>
//                                             ) : (
//                                               <div className="text-xs text-yellow-600 flex items-center gap-1">
//                                                 <FiAlertCircle className="w-3 h-3" />
//                                                 Manual entry
//                                               </div>
//                                             )}
//                                           </div>
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className={`w-24 px-2 py-1 text-sm border rounded ${gradeRow.isAvailable ? 'border-gray-300' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}`}
//                                             value={gradeRow.price}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'price',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={gradeRow.isAvailable || isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
//                                             value={gradeRow.totalQuantity}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'totalQuantity',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
//                                             value={gradeRow.depreciation}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'depreciation',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <input
//                                             type="number"
//                                             className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
//                                             value={gradeRow.appreciation}
//                                             onChange={(e) =>
//                                               handleGradeDataChange(
//                                                 item.productId,
//                                                 gradeIndex,
//                                                 'appreciation',
//                                                 parseFloat(e.target.value) || 0
//                                               )
//                                             }
//                                             disabled={isSaving}
//                                           />
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <div className="font-medium text-green-700">
//                                             {formatCurrency(finalAmount)}
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     );
//                                   })}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Fees Section */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Farmer Fees */}
//                     <div className="border border-gray-200 rounded-lg">
//                       <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-t-lg">
//                         <div className="flex items-center gap-2">
//                           <FiUser className="w-5 h-5 text-white" />
//                           <h3 className="text-lg font-semibold text-white">Farmer Payments (Deductions)</h3>
//                         </div>
//                       </div>
//                       <div className="p-4 space-y-4">
//                         {/* Processing Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiPercent className="w-4 h-4" />
//                             Processing Fee (%)
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.processingFeesFarmer}
//                             onChange={(e) => handleFeeChange('processingFeesFarmer', e.target.value)}
//                             disabled={isSaving}
//                             step="0.1"
//                           />
//                         </div>

//                         {/* Labour Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Labour Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.farmerLabourFee}
//                             onChange={(e) => handleFeeChange('farmerLabourFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Transport Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiTruck className="w-4 h-4" />
//                             Transport Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.farmerTransportFee}
//                             onChange={(e) => handleFeeChange('farmerTransportFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Advance */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Advance Amount
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                             value={editData.advanceAmount}
//                             onChange={(e) => handleFeeChange('advanceAmount', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Farmer Calculation Summary */}
//                         <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Product Total:</span>
//                             <span className="font-medium">{formatCurrency(calculations.productTotal)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-red-600">
//                             <span>Processing Fee ({editData.processingFeesFarmer}%):</span>
//                             <span>-{formatCurrency((calculations.productTotal * editData.processingFeesFarmer) / 100)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-red-600">
//                             <span>Labour Fee:</span>
//                             <span>-{formatCurrency(editData.farmerLabourFee)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-red-600">
//                             <span>Transport Fee:</span>
//                             <span>-{formatCurrency(editData.farmerTransportFee)}</span>
//                           </div>
//                           <div className="border-t border-gray-300 pt-2 mt-2">
//                             <div className="flex justify-between text-sm">
//                               <span className="font-medium">Total Payable:</span>
//                               <span className="font-semibold text-green-700">{formatCurrency(calculations.farmerTotal)}</span>
//                             </div>
//                             <div className="flex justify-between text-sm text-yellow-600 mt-1">
//                               <span>Advance:</span>
//                               <span>-{formatCurrency(editData.advanceAmount)}</span>
//                             </div>
//                             <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-300">
//                               <span>Remaining:</span>
//                               <span className="text-blue-700">{formatCurrency(calculations.farmerRemaining)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Trader Fees */}
//                     <div className="border border-gray-200 rounded-lg">
//                       <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 rounded-t-lg">
//                         <div className="flex items-center gap-2">
//                           <FiUser className="w-5 h-5 text-white" />
//                           <h3 className="text-lg font-semibold text-white">Trader Payments (Additions)</h3>
//                         </div>
//                       </div>
//                       <div className="p-4 space-y-4">
//                         {/* Processing Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiPercent className="w-4 h-4" />
//                             Processing Fee (%)
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//                             value={editData.processingFeesTrader}
//                             onChange={(e) => handleFeeChange('processingFeesTrader', e.target.value)}
//                             disabled={isSaving}
//                             step="0.1"
//                           />
//                         </div>

//                         {/* Labour Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Labour Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//                             value={editData.traderLabourFee}
//                             onChange={(e) => handleFeeChange('traderLabourFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Transport Fee */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                             <FiTruck className="w-4 h-4" />
//                             Transport Fee
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//                             value={editData.traderTransportFee}
//                             onChange={(e) => handleFeeChange('traderTransportFee', e.target.value)}
//                             disabled={isSaving}
//                           />
//                         </div>

//                         {/* Trader Calculation Summary */}
//                         <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Product Total:</span>
//                             <span className="font-medium">{formatCurrency(calculations.productTotal)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Processing Fee ({editData.processingFeesTrader}%):</span>
//                             <span>+{formatCurrency((calculations.productTotal * editData.processingFeesTrader) / 100)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Labour Fee:</span>
//                             <span>+{formatCurrency(editData.traderLabourFee)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Transport Fee:</span>
//                             <span>+{formatCurrency(editData.traderTransportFee)}</span>
//                           </div>
//                           <div className="border-t border-gray-300 pt-2 mt-2">
//                             <div className="flex justify-between text-base font-bold">
//                               <span>Total Payable:</span>
//                               <span className="text-purple-700">{formatCurrency(calculations.traderTotal)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="flex flex-wrap items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <FiDollarSign className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Product Total</p>
//                       <p className="font-semibold text-gray-900">{formatCurrency(calculations.productTotal)}</p>
//                     </div>
//                   </div>
//                   <div className="h-6 w-px bg-gray-300" />
//                   <div className="flex items-center gap-2">
//                     <FiUser className="w-5 h-5 text-green-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Farmer Receives</p>
//                       <p className="font-semibold text-green-700">{formatCurrency(calculations.farmerRemaining)}</p>
//                     </div>
//                   </div>
//                   <div className="h-6 w-px bg-gray-300" />
//                   <div className="flex items-center gap-2">
//                     <FiUser className="w-5 h-5 text-purple-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Trader Pays</p>
//                       <p className="font-semibold text-purple-700">{formatCurrency(calculations.traderTotal)}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={isSaving}
//                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={saveOrderUpdate}
//                     disabled={isSaving}
//                     className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${isSaving
//                         ? 'bg-gray-400 text-white cursor-not-allowed'
//                         : 'bg-green-600 text-white hover:bg-green-700'
//                       }`}
//                   >
//                     {isSaving ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <FiSave className="w-5 h-5" />
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderEditModal;



//updated by sagar
'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { FiSearch, FiX, FiSave, FiPackage, FiDollarSign, FiUser, FiPercent, FiTruck, FiCheckCircle, FiAlertCircle, FiEdit } from 'react-icons/fi';
import { getAdminSessionAction } from '@/app/actions/auth-actions';

interface AvailableGrade {
  grade: string;
  pricePerUnit: number;
  availableQty: number;
}

interface GradeRow {
  grade: string;
  price: number;
  totalQuantity: number;
  depreciation: number;
  appreciation: number;
  isAvailable: boolean;
  availableQty?: number;
}

interface ProductItemData {
  productId: string;
  productName: string;
  farmerId: string;
  selectedGrade: string;
  quantity: number;
  pricePerUnit: number;
  deliveryDate: string;
  availableGrades: AvailableGrade[];
  totalAmount?: number; // Added totalAmount to track
}

interface PaymentFees {
  labourFee?: number;
  transportFee?: number;
  advanceAmount?: number;
}

interface PaymentDetails {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  fees?: PaymentFees;
}

interface OrderData {
  _id: string;
  orderId: string;
  traderName: string;
  farmerName?: string;
  orderStatus: string;
  productItems: ProductItemData[];
  traderToAdminPayment?: PaymentDetails;
  adminToFarmerPayment?: PaymentDetails;
}

interface EditData {
  productItems: ProductItemData[];
  gradeData: { [productId: string]: GradeRow[] };
  processingFeesFarmer: number;
  processingFeesTrader: number;
  farmerLabourFee: number;
  traderLabourFee: number;
  farmerTransportFee: number;
  traderTransportFee: number;
  advanceAmount: number;
}

interface Calculations {
  productTotal: number;
  farmerTotal: number;
  traderTotal: number;
  farmerRemaining: number;
}

declare global {
  interface Window {
    openEditOrderModal?: (orderId: string) => void;
  }
}

const OrderEditModal: React.FC = () => {
  const [originalOrderData, setOriginalOrderData] = useState<OrderData | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [editData, setEditData] = useState<EditData>({
    productItems: [],
    gradeData: {},
    processingFeesFarmer: 0,
    processingFeesTrader: 3,
    farmerLabourFee: 0,
    traderLabourFee: 0,
    farmerTransportFee: 0,
    traderTransportFee: 0,
    advanceAmount: 0
  });
  const [calculations, setCalculations] = useState<Calculations>({
    productTotal: 0,
    farmerTotal: 0,
    traderTotal: 0,
    farmerRemaining: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProductItems, setFilteredProductItems] = useState<ProductItemData[]>([]);

  const API_BASE = 'https://kisan.etpl.ai/api/admin';
  const ALL_GRADES = ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'All Mixed Grades'];

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const openEditModal = async (orderId: string): Promise<void> => {
    try {
      setSuccessMessage('');
      setErrorMessage('');

      const response = await fetch(`${API_BASE}/orders/${orderId}/details`);
      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);
        setOriginalOrderData(JSON.parse(JSON.stringify(data.data)));

        // Initialize grade data for each product
        const gradeDataMap: { [productId: string]: GradeRow[] } = {};

        data.data.productItems.forEach((item: any) => {
          const gradeRows: GradeRow[] = ALL_GRADES.map(gradeName => {
            const availableGrade = item.availableGrades?.find((g: AvailableGrade) => g.grade === gradeName);
            const isSelectedGrade = item.grade === gradeName;

            return {
              grade: gradeName,
              price: availableGrade ? availableGrade.pricePerUnit : 0,
              totalQuantity: isSelectedGrade ? item.quantity : 0,
              depreciation: 0,
              appreciation: 0,
              isAvailable: !!availableGrade,
              availableQty: availableGrade?.availableQty
            };
          });

          gradeDataMap[item.productId] = gradeRows;
        });

        const productItems = data.data.productItems.map((item: any) => ({
          productId: item.productId || '',
          productName: item.productName || '',
          farmerId: item.farmerId || '',
          selectedGrade: item.grade || '',
          quantity: item.quantity || 0,
          pricePerUnit: item.pricePerUnit || 0,
          deliveryDate: item.deliveryDate || '',
          availableGrades: item.availableGrades || [],
          totalAmount: item.totalAmount || 0 // Initialize totalAmount
        }));

        setEditData({
          productItems: productItems,
          gradeData: gradeDataMap,
          processingFeesFarmer: data.data.adminToFarmerPayment?.fees?.processingFee || 0,
          processingFeesTrader: data.data.traderToAdminPayment?.fees?.processingFee || 3,
          farmerLabourFee: data.data.adminToFarmerPayment?.fees?.labourFee || 0,
          traderLabourFee: data.data.traderToAdminPayment?.fees?.labourFee || 0,
          farmerTransportFee: data.data.adminToFarmerPayment?.fees?.transportFee || 0,
          traderTransportFee: data.data.traderToAdminPayment?.fees?.transportFee || 0,
          advanceAmount: data.data.adminToFarmerPayment?.fees?.advanceAmount || 0
        });

        // Initialize filtered product items
        setFilteredProductItems(productItems);
        setSearchQuery('');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setErrorMessage('Error loading order details');
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [editData]);

  // Filter product items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProductItems(editData.productItems);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = editData.productItems.filter(item => {
      const productName = item.productName || '';
      const productId = item.productId || '';
      const selectedGrade = item.selectedGrade || '';
      const farmerId = item.farmerId || '';

      return (
        productName.toLowerCase().includes(query) ||
        productId.toLowerCase().includes(query) ||
        selectedGrade.toLowerCase().includes(query) ||
        farmerId.toLowerCase().includes(query)
      );
    });

    setFilteredProductItems(filtered);
  }, [searchQuery, editData.productItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const calculateTotals = (): void => {
    let productTotal = 0;

    // Calculate product total from grade data
    editData.productItems.forEach(item => {
      const grades = editData.gradeData[item.productId] || [];
      grades.forEach(grade => {
        if (grade.totalQuantity > 0) {
          const baseAmount = grade.price * grade.totalQuantity;
          const finalPrice = baseAmount - grade.depreciation + grade.appreciation;
          productTotal += finalPrice;
        }
      });
    });

    // Calculate processing fees
    const farmerProcessingFee = (productTotal * editData.processingFeesFarmer) / 100;
    const traderProcessingFee = (productTotal * editData.processingFeesTrader) / 100;

    // Farmer calculation: Total - Deductions
    const farmerTotal = productTotal - farmerProcessingFee - editData.farmerLabourFee - editData.farmerTransportFee;
    const farmerRemaining = farmerTotal - editData.advanceAmount;

    // Trader calculation: Total + Additions
    const traderTotal = productTotal + traderProcessingFee + editData.traderLabourFee + editData.traderTransportFee;

    setCalculations({
      productTotal,
      farmerTotal,
      traderTotal,
      farmerRemaining
    });
  };

  const handleGradeDataChange = (
    productId: string,
    gradeIndex: number,
    field: keyof GradeRow,
    value: number
  ): void => {
    const updatedGradeData = { ...editData.gradeData };
    if (updatedGradeData[productId] && updatedGradeData[productId][gradeIndex]) {
      updatedGradeData[productId][gradeIndex] = {
        ...updatedGradeData[productId][gradeIndex],
        [field]: value
      };

      setEditData({
        ...editData,
        gradeData: updatedGradeData
      });
    }
  };

  const handleFeeChange = (field: keyof EditData, value: string): void => {
    setEditData({
      ...editData,
      [field]: parseFloat(value) || 0
    });
  };

  const getOrderPriceQuantityChanges = () => {
    const changes: Record<string, { old: any; new: any }> = {};

    if (!originalOrderData) return changes;

    originalOrderData.productItems.forEach((oldItem) => {
      const newItem = editData.productItems.find(
        p => p.productId === oldItem.productId
      );

      if (!newItem) return;

      // OLD values
      const oldQty = oldItem.quantity;
      const oldTotalAmount = oldItem.totalAmount || 0; // Get old total amount

      // NEW values (from gradeData)
      const grades = editData.gradeData[newItem.productId] || [];
      const selectedGrade = grades.find(g => g.totalQuantity > 0);

      if (!selectedGrade) return;

      // Calculate new total amount
      const baseAmount = selectedGrade.price * selectedGrade.totalQuantity;
      const newTotalAmount = baseAmount - selectedGrade.depreciation + selectedGrade.appreciation;

      // Only track quantity changes if quantity has changed
      if (oldQty !== selectedGrade.totalQuantity) {
        changes[`productItems.${newItem.productId}.quantity`] = {
          old: oldQty,
          new: selectedGrade.totalQuantity,
        };
      }

      // Only track total amount changes if total amount has changed
      if (oldTotalAmount !== newTotalAmount) {
        changes[`productItems.${newItem.productId}.totalAmount`] = {
          old: oldTotalAmount,
          new: newTotalAmount,
        };
      }
    });

    return changes;
  };

  const saveOrderUpdate = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    if (!orderData) return;

    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Prepare updated product items from grade data
      const updatedProductItems = editData.productItems.map(item => {
        const grades = editData.gradeData[item.productId] || [];
        const selectedGrade = grades.find(g => g.totalQuantity > 0);

        if (selectedGrade) {
          const baseAmount = selectedGrade.price * selectedGrade.totalQuantity;
          const totalAmount = baseAmount - selectedGrade.depreciation + selectedGrade.appreciation;

          return {
            productId: item.productId,
            productName: item.productName,
            farmerId: item.farmerId,
            grade: selectedGrade.grade,
            quantity: selectedGrade.totalQuantity,
            pricePerUnit: selectedGrade.price,
            deliveryDate: item.deliveryDate,
            totalAmount: totalAmount
          };
        }

        return null;
      }).filter(Boolean);

      const response = await fetch(`${API_BASE}/orders/${orderData.orderId}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productItems: updatedProductItems,
          processingFeesFarmer: editData.processingFeesFarmer,
          processingFeesTrader: editData.processingFeesTrader,
          farmerLabourFee: editData.farmerLabourFee,
          traderLabourFee: editData.traderLabourFee,
          farmerTransportFee: editData.farmerTransportFee,
          traderTransportFee: editData.traderTransportFee,
          advanceAmount: editData.advanceAmount
        })
      });
      
      const orderChanges = getOrderPriceQuantityChanges();

      const result = await response.json();

      console.log(`data is ::::: ${JSON.stringify(result.data, null, 2)}`)
      const orderdata = result.data;
      const { admin: { name, role, _id } } = await getAdminSessionAction();

      // Only create audit log if there are actual changes
      if (Object.keys(orderChanges).length > 0) {
        const auditLogData = {
          actorId: _id,
          actorRole: "subadmin",
          action: "Update",
          module: "ORDER_UPDATED_" + `(${orderdata?._id})`,
          targetId: orderdata._id,
          description: `Order updated by ${name} (${_id})`,
          changes: orderChanges,
          userAgent: orderdata.traderId || 'unknown',
          ipAddress: "::1",
        };
        
        console.log("auditLogData", auditLogData)
        const res = await axios.post('/api/audit-logs', auditLogData)
        console.log(res.data)
      } else {
        console.log("No changes detected, skipping audit log creation.");
      }

      if (result.success) {
        setSuccessMessage('Order updated successfully!');

        // Close modal after 1.5 seconds
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1500);
      } else {
        setErrorMessage('Failed to update order: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setErrorMessage('Error updating order');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  useEffect(() => {
    window.openEditOrderModal = openEditModal;
    return () => {
      delete window.openEditOrderModal;
    };
  }, []);

  return (
    <>
      {/* Success/Error Messages */}
      {(successMessage || errorMessage) && (
        <div className="fixed top-6 right-6 z-[1100] flex flex-col gap-3">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Success!</p>
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Error!</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#49494959] bg-opacity-50 flex items-center justify-center z-[1050] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiEdit className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Edit Order Details</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                      <span>Order: {orderData?.orderId || ''}</span>
                      <span>Trader: {orderData?.traderName || ''}</span>
                      <span>Farmer: {orderData?.farmerName || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => !isSaving && setIsModalOpen(false)}
                  disabled={isSaving}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {orderData && (
                <div className="space-y-6">
                  {/* Search Section */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="relative flex-1 w-full">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={handleSearch}
                          disabled={isSaving}
                        />
                      </div>
                      {searchQuery && (
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                            Found {filteredProductItems.length} product{filteredProductItems.length !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                            disabled={isSaving}
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FiPackage className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Products ({filteredProductItems.length})</h3>
                    </div>

                    {filteredProductItems.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No products found</p>
                        <p className="text-sm text-gray-500 mb-4">Try adjusting your search</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          disabled={isSaving}
                        >
                          Show all products
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredProductItems.map((item, itemIndex) => (
                          <div key={`${item.productId}-${itemIndex}`} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Product Header */}
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <FiPackage className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-gray-900">{item.productName || 'Unnamed Product'}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  ID: {item.productId || 'N/A'} • Farmer: {item.farmerId || 'N/A'}
                                </div>
                              </div>
                            </div>

                            {/* Grades Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Grade</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price Per Unit</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Depreciation</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Appreciation</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Final Amount</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {(editData.gradeData[item.productId] || []).map((gradeRow, gradeIndex) => {
                                    const baseAmount = gradeRow.price * gradeRow.totalQuantity;
                                    const finalAmount = baseAmount - gradeRow.depreciation + gradeRow.appreciation;

                                    return (
                                      <tr key={gradeIndex} className={gradeRow.isAvailable ? 'bg-green-50/50' : 'bg-yellow-50/50'}>
                                        <td className="px-4 py-3">
                                          <div className="space-y-1">
                                            <span className="font-medium text-gray-900">{gradeRow.grade || 'N/A'}</span>
                                            {gradeRow.isAvailable ? (
                                              <div className="text-xs text-green-600 flex items-center gap-1">
                                                <FiCheckCircle className="w-3 h-3" />
                                                Available ({gradeRow.availableQty || 0})
                                              </div>
                                            ) : (
                                              <div className="text-xs text-yellow-600 flex items-center gap-1">
                                                <FiAlertCircle className="w-3 h-3" />
                                                Manual entry
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <input
                                            type="number"
                                            className={`w-24 px-2 py-1 text-sm border rounded ${gradeRow.isAvailable ? 'border-gray-300' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}`}
                                            value={gradeRow.price}
                                            onChange={(e) =>
                                              handleGradeDataChange(
                                                item.productId,
                                                gradeIndex,
                                                'price',
                                                parseFloat(e.target.value) || 0
                                              )
                                            }
                                            disabled={gradeRow.isAvailable || isSaving}
                                          />
                                        </td>
                                        <td className="px-4 py-3">
                                          <input
                                            type="number"
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                            value={gradeRow.totalQuantity}
                                            onChange={(e) =>
                                              handleGradeDataChange(
                                                item.productId,
                                                gradeIndex,
                                                'totalQuantity',
                                                parseFloat(e.target.value) || 0
                                              )
                                            }
                                            disabled={isSaving}
                                          />
                                        </td>
                                        <td className="px-4 py-3">
                                          <input
                                            type="number"
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                            value={gradeRow.depreciation}
                                            onChange={(e) =>
                                              handleGradeDataChange(
                                                item.productId,
                                                gradeIndex,
                                                'depreciation',
                                                parseFloat(e.target.value) || 0
                                              )
                                            }
                                            disabled={isSaving}
                                          />
                                        </td>
                                        <td className="px-4 py-3">
                                          <input
                                            type="number"
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                            value={gradeRow.appreciation}
                                            onChange={(e) =>
                                              handleGradeDataChange(
                                                item.productId,
                                                gradeIndex,
                                                'appreciation',
                                                parseFloat(e.target.value) || 0
                                              )
                                            }
                                            disabled={isSaving}
                                          />
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="font-medium text-green-700">
                                            {formatCurrency(finalAmount)}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fees Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Farmer Fees */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-t-lg">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-5 h-5 text-white" />
                          <h3 className="text-lg font-semibold text-white">Farmer Payments (Deductions)</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Processing Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiPercent className="w-4 h-4" />
                            Processing Fee (%)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            value={editData.processingFeesFarmer}
                            onChange={(e) => handleFeeChange('processingFeesFarmer', e.target.value)}
                            disabled={isSaving}
                            step="0.1"
                          />
                        </div>

                        {/* Labour Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Labour Fee
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            value={editData.farmerLabourFee}
                            onChange={(e) => handleFeeChange('farmerLabourFee', e.target.value)}
                            disabled={isSaving}
                          />
                        </div>

                        {/* Transport Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiTruck className="w-4 h-4" />
                            Transport Fee
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            value={editData.farmerTransportFee}
                            onChange={(e) => handleFeeChange('farmerTransportFee', e.target.value)}
                            disabled={isSaving}
                          />
                        </div>

                        {/* Advance */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Advance Amount
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            value={editData.advanceAmount}
                            onChange={(e) => handleFeeChange('advanceAmount', e.target.value)}
                            disabled={isSaving}
                          />
                        </div>

                        {/* Farmer Calculation Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Product Total:</span>
                            <span className="font-medium">{formatCurrency(calculations.productTotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Processing Fee ({editData.processingFeesFarmer}%):</span>
                            <span>-{formatCurrency((calculations.productTotal * editData.processingFeesFarmer) / 100)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Labour Fee:</span>
                            <span>-{formatCurrency(editData.farmerLabourFee)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Transport Fee:</span>
                            <span>-{formatCurrency(editData.farmerTransportFee)}</span>
                          </div>
                          <div className="border-t border-gray-300 pt-2 mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Total Payable:</span>
                              <span className="font-semibold text-green-700">{formatCurrency(calculations.farmerTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-yellow-600 mt-1">
                              <span>Advance:</span>
                              <span>-{formatCurrency(editData.advanceAmount)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-300">
                              <span>Remaining:</span>
                              <span className="text-blue-700">{formatCurrency(calculations.farmerRemaining)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trader Fees */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 rounded-t-lg">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-5 h-5 text-white" />
                          <h3 className="text-lg font-semibold text-white">Trader Payments (Additions)</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Processing Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiPercent className="w-4 h-4" />
                            Processing Fee (%)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            value={editData.processingFeesTrader}
                            onChange={(e) => handleFeeChange('processingFeesTrader', e.target.value)}
                            disabled={isSaving}
                            step="0.1"
                          />
                        </div>

                        {/* Labour Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Labour Fee
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            value={editData.traderLabourFee}
                            onChange={(e) => handleFeeChange('traderLabourFee', e.target.value)}
                            disabled={isSaving}
                          />
                        </div>

                        {/* Transport Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiTruck className="w-4 h-4" />
                            Transport Fee
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            value={editData.traderTransportFee}
                            onChange={(e) => handleFeeChange('traderTransportFee', e.target.value)}
                            disabled={isSaving}
                          />
                        </div>

                        {/* Trader Calculation Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Product Total:</span>
                            <span className="font-medium">{formatCurrency(calculations.productTotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Processing Fee ({editData.processingFeesTrader}%):</span>
                            <span>+{formatCurrency((calculations.productTotal * editData.processingFeesTrader) / 100)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Labour Fee:</span>
                            <span>+{formatCurrency(editData.traderLabourFee)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Transport Fee:</span>
                            <span>+{formatCurrency(editData.traderTransportFee)}</span>
                          </div>
                          <div className="border-t border-gray-300 pt-2 mt-2">
                            <div className="flex justify-between text-base font-bold">
                              <span>Total Payable:</span>
                              <span className="text-purple-700">{formatCurrency(calculations.traderTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Product Total</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(calculations.productTotal)}</p>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Farmer Receives</p>
                      <p className="font-semibold text-green-700">{formatCurrency(calculations.farmerRemaining)}</p>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Trader Pays</p>
                      <p className="font-semibold text-purple-700">{formatCurrency(calculations.traderTotal)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveOrderUpdate}
                    disabled={isSaving}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${isSaving
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderEditModal;