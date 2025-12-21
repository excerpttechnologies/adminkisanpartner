

// // components/AdminAdvertisement.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { Plus, Edit, Trash2, Eye, Upload, X, Save } from 'lucide-react';

// // Types
// interface Product {
//   id: string;
//   images: (File | string)[];
//   productName: string;
//   description: string;
//   mrpPrice: number;
//   salesPrice: number;
// }

// interface Advertisement {
//   id: string;
//   stage: string;
//   heading: string;
//   guide: string;
//   companyLogo: File | string | null;
//   companyName: string;
//   description: string;
//   advice: string;
//   banner: File | string | null;
//   callToAction: {
//     buyNowLink: string;
//     visitWebsiteLink: string;
//     callNowNumber: string;
//     whatsappNowNumber: string;
//     price: number;
//     selectedAction: string;
//   };
//   products: Product[];
//   createdAt: Date;
// }

// interface TabContent {
//   id: string;
//   label: string;
//   stage: string;
// }

// const AdminAdvertisement: React.FC = () => {
//   // State
//   const [activeTab, setActiveTab] = useState<string>('stage01');
//   const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
//   const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [showProductForm, setShowProductForm] = useState<boolean>(false);
//   const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
//     images: [],
//     productName: '',
//     description: '',
//     mrpPrice: 0,
//     salesPrice: 0,
//   });
  
//   // Form state
//   const [formData, setFormData] = useState({
//     stage: 'stage01',
//     heading: '',
//     guide: '',
//     companyLogo: null as File | string | null,
//     companyName: '',
//     description: '',
//     advice: '',
//     banner: null as File | string | null,
//     callToAction: {
//       buyNowLink: '',
//       visitWebsiteLink: '',
//       callNowNumber: '',
//       whatsappNowNumber: '',
//       price: 0,
//       selectedAction: 'buyNow',
//     },
//   });

//   // Tabs configuration
//   const tabs: TabContent[] = [
//     { id: 'tab01', label: 'Stages Advertisement', stage: 'stage01' },
//     { id: 'tab02', label: 'Crops Care', stage: 'crops_care' },
//     { id: 'tab03', label: 'General Advertisement', stage: 'general' },
//   ];

//   // Stage options for tab 01
//   const stageOptions = [
//     { value: 'stage01', label: 'Stage 01' },
//     { value: 'stage02', label: 'Stage 02' },
//     { value: 'stage03', label: 'Stage 03' },
//     { value: 'stage04', label: 'Stage 04' },
//     { value: 'stage05', label: 'Stage 05' },
//     { value: 'stage06', label: 'Stage 06' },
//     { value: 'stage07', label: 'Stage 07' },
//     { value: 'sale', label: 'Sale' },
//   ];

//   // Action options for radio buttons
//   const actionOptions = [
//     { value: 'buyNow', label: 'Buy Now' },
//     { value: 'visitWebsite', label: 'Visit Website' },
//     { value: 'callNow', label: 'Call Now' },
//     { value: 'whatsappNow', label: 'WhatsApp Now' },
//   ];

//   // Load sample data
//   useEffect(() => {
//     // Load sample advertisements
//     const sampleAds: Advertisement[] = [
//       {
//         id: '1',
//         stage: 'stage01',
//         heading: 'Premium Fertilizer Offer',
//         guide: 'Best for summer crops',
//         companyLogo: '/sample-logo.png',
//         companyName: 'AgroTech Solutions',
//         description: 'High-quality fertilizer for better yield',
//         advice: 'Use twice a month for best results',
//         banner: '/sample-banner.jpg',
//         callToAction: {
//           buyNowLink: 'https://example.com/buy',
//           visitWebsiteLink: 'https://agrotech.com',
//           callNowNumber: '+1234567890',
//           whatsappNowNumber: '+1234567890',
//           price: 2999,
//           selectedAction: 'buyNow',
//         },
//         products: [
//           {
//             id: 'p1',
//             images: ['/product1.jpg'],
//             productName: 'Organic Fertilizer 5kg',
//             description: '100% organic fertilizer',
//             mrpPrice: 3500,
//             salesPrice: 2999,
//           },
//         ],
//         createdAt: new Date(),
//       },
//     ];
//     setAdvertisements(sampleAds);
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name.startsWith('callToAction.')) {
//       const actionField = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         callToAction: {
//           ...prev.callToAction,
//           [actionField]: value,
//         },
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // Handle file uploads
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (field === 'companyLogo' || field === 'banner') {
//         setFormData(prev => ({
//           ...prev,
//           [field]: file,
//         }));
//       }
//     }
//   };

//   // Handle product image upload
//   const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newImages = Array.from(files).slice(0, 3);
//       setCurrentProduct(prev => ({
//         ...prev,
//         images: [...(prev.images || []), ...newImages],
//       }));
//     }
//   };

//   // Remove product image
//   const removeProductImage = (index: number) => {
//     setCurrentProduct(prev => ({
//       ...prev,
//       images: prev.images?.filter((_, i) => i !== index) || [],
//     }));
//   };

//   // Add product to current advertisement
//   const addProduct = () => {
//     if (!currentProduct.productName || currentProduct.images?.length === 0) {
//       alert('Please add product name and at least one image');
//       return;
//     }

//     const newProduct: Product = {
//       id: Date.now().toString(),
//       images: currentProduct.images || [],
//       productName: currentProduct.productName || '',
//       description: currentProduct.description || '',
//       mrpPrice: currentProduct.mrpPrice || 0,
//       salesPrice: currentProduct.salesPrice || 0,
//     };

//     if (editingAd) {
//       const updatedAd = {
//         ...editingAd,
//         products: [...editingAd.products, newProduct],
//       };
//       setEditingAd(updatedAd);
//     }

//     setCurrentProduct({
//       images: [],
//       productName: '',
//       description: '',
//       mrpPrice: 0,
//       salesPrice: 0,
//     });
//     setShowProductForm(false);
//   };

//   // Submit advertisement
//  // Replace the submitAdvertisement function:
// const submitAdvertisement = async () => {
//   try {
//     const formDataToSend = new FormData();
    
//     // Append all form data
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === 'callToAction') {
//         Object.entries(value).forEach(([subKey, subValue]) => {
//           formDataToSend.append(`callToAction.${subKey}`, String(subValue));
//         });
//       } else if (value instanceof File) {
//         formDataToSend.append(key, value);
//       } else {
//         formDataToSend.append(key, String(value));
//       }
//     });

//     // Append tab info
//     formDataToSend.append('tab', activeTab);
    
//     // Append products
//     formDataToSend.append('products', JSON.stringify(editingAd?.products || []));

//     const response = await fetch('/api/ads', {
//       method: isEditing ? 'PUT' : 'POST',
//       body: formDataToSend,
//     });

//     const result = await response.json();
    
//     if (result.success) {
//       alert(isEditing ? 'Advertisement updated!' : 'Advertisement created!');
//       // Refresh ads list
//       fetchAds();
//     } else {
//       alert('Error: ' + result.error);
//     }
//   } catch (error) {
//     console.error('Error submitting ad:', error);
//     alert('Failed to submit advertisement');
//   }
// };

//   // Edit advertisement
//   const editAdvertisement = (ad: Advertisement) => {
//     setFormData({
//       stage: ad.stage,
//       heading: ad.heading,
//       guide: ad.guide,
//       companyLogo: ad.companyLogo,
//       companyName: ad.companyName,
//       description: ad.description,
//       advice: ad.advice,
//       banner: ad.banner,
//       callToAction: ad.callToAction,
//     });
//     setEditingAd(ad);
//     setIsEditing(true);
//     setActiveTab(ad.stage);
//   };

//   // Delete advertisement
//   const deleteAdvertisement = (id: string) => {
//     if (confirm('Are you sure you want to delete this advertisement?')) {
//       setAdvertisements(prev => prev.filter(ad => ad.id !== id));
//       if (editingAd?.id === id) {
//         setIsEditing(false);
//         setEditingAd(null);
//       }
//     }
//   };

//   // Delete product from advertisement
//   const deleteProduct = (productId: string) => {
//     if (editingAd) {
//       const updatedAd = {
//         ...editingAd,
//         products: editingAd.products.filter(product => product.id !== productId),
//       };
//       setEditingAd(updatedAd);
//     }
//   };

//   // Render file preview
//   const renderFilePreview = (file: File | string | null, type: 'logo' | 'banner') => {
//     if (!file) return null;
    
//     const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    
//     return (
//       <div className={`relative ${type === 'logo' ? 'w-20 h-20' : 'w-full h-32'} mt-2`}>
//         <Image
//           src={url}
//           alt="Preview"
//           fill
//           className="object-contain rounded"
//         />
//         <button
//           type="button"
//           onClick={() => {
//             if (type === 'logo') {
//               setFormData(prev => ({ ...prev, companyLogo: null }));
//             } else {
//               setFormData(prev => ({ ...prev, banner: null }));
//             }
//           }}
//           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//         >
//           <X size={16} />
//         </button>
//       </div>
//     );
//   };

//   // Render product preview
//   const renderProductPreview = (product: Product) => (
//     <div key={product.id} className="border rounded-lg p-4 mb-2">
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <h4 className="font-semibold">{product.productName}</h4>
//           <p className="text-sm text-gray-600 mt-1">{product.description}</p>
//           <div className="flex gap-4 mt-2">
//             <span className="text-sm line-through text-gray-500">
//               MRP: ₹{product.mrpPrice}
//             </span>
//             <span className="text-sm font-semibold text-green-600">
//               Sale: ₹{product.salesPrice}
//             </span>
//           </div>
//           {product.images && product.images.length > 0 && (
//             <div className="flex gap-2 mt-2">
//               {product.images.map((img, idx) => (
//                 <div key={idx} className="w-16 h-16 relative">
//                   <Image
//                     src={typeof img === 'string' ? img : URL.createObjectURL(img)}
//                     alt={`Product ${idx + 1}`}
//                     fill
//                     className="object-cover rounded"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button
//           onClick={() => deleteProduct(product.id)}
//           className="text-red-500 hover:text-red-700"
//         >
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Advertisement Management</h1>
      
//       {/* Tabs */}
//       <div className="border-b mb-6">
//         <div className="flex space-x-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-2 px-4 font-medium ${
//                 activeTab === tab.id
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Form */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">
//               {isEditing ? 'Edit Advertisement' : 'Create New Advertisement'}
//             </h2>
            
//             {activeTab === 'tab01' && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Stage
//                 </label>
//                 <select
//                   name="stage"
//                   value={formData.stage}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                 >
//                   {stageOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Heading
//                 </label>
//                 <input
//                   type="text"
//                   name="heading"
//                   value={formData.heading}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   placeholder="Enter heading"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Guide
//                 </label>
//                 <input
//                   type="text"
//                   name="guide"
//                   value={formData.guide}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   placeholder="Enter guide"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company Name
//                 </label>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   placeholder="Enter company name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company Logo
//                 </label>
//                 <div className="border-2 border-dashed rounded-md p-4 text-center">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileUpload(e, 'companyLogo')}
//                     className="hidden"
//                     id="companyLogo"
//                   />
//                   <label htmlFor="companyLogo" className="cursor-pointer">
//                     <Upload className="mx-auto mb-2" />
//                     <span className="text-sm text-gray-600">
//                       Upload Logo (Optional)
//                     </span>
//                   </label>
//                 </div>
//                 {renderFilePreview(formData.companyLogo, 'logo')}
//               </div>
//             </div>

//             {/* Description and Advice */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder="Enter description"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Advice
//               </label>
//               <textarea
//                 name="advice"
//                 value={formData.advice}
//                 onChange={handleInputChange}
//                 rows={2}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder="Enter advice"
//               />
//             </div>

//             {/* Banner Upload */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Banner (Optional)
//               </label>
//               <div className="border-2 border-dashed rounded-md p-4 text-center">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileUpload(e, 'banner')}
//                   className="hidden"
//                   id="banner"
//                 />
//                 <label htmlFor="banner" className="cursor-pointer">
//                   <Upload className="mx-auto mb-2" />
//                   <span className="text-sm text-gray-600">
//                     Upload Banner Image
//                   </span>
//                 </label>
//               </div>
//               {renderFilePreview(formData.banner, 'banner')}
//             </div>

//             {/* Call to Action Section */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-3">Call to Action</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Buy Now Link
//                   </label>
//                   <input
//                     type="text"
//                     name="callToAction.buyNowLink"
//                     value={formData.callToAction.buyNowLink}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="https://example.com/buy"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Visit Website Link
//                   </label>
//                   <input
//                     type="text"
//                     name="callToAction.visitWebsiteLink"
//                     value={formData.callToAction.visitWebsiteLink}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="https://example.com"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Call Now Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="callToAction.callNowNumber"
//                     value={formData.callToAction.callNowNumber}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="+1234567890"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     WhatsApp Now Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="callToAction.whatsappNowNumber"
//                     value={formData.callToAction.whatsappNowNumber}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="+1234567890"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="callToAction.price"
//                   value={formData.callToAction.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   placeholder="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Primary Action
//                 </label>
//                 <div className="flex flex-wrap gap-4">
//                   {actionOptions.map((option) => (
//                     <label key={option.value} className="flex items-center">
//                       <input
//                         type="radio"
//                         name="callToAction.selectedAction"
//                         value={option.value}
//                         checked={formData.callToAction.selectedAction === option.value}
//                         onChange={handleInputChange}
//                         className="mr-2"
//                       />
//                       {option.label}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Product Management */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Products</h3>
//                 <button
//                   type="button"
//                   onClick={() => setShowProductForm(true)}
//                   className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 >
//                   <Plus size={18} />
//                   Add Product
//                 </button>
//               </div>

//               {editingAd && editingAd.products.length > 0 && (
//                 <div className="space-y-2">
//                   {editingAd.products.map(renderProductPreview)}
//                 </div>
//               )}

//               {showProductForm && (
//                 <div className="border rounded-lg p-4 mb-4 bg-gray-50">
//                   <div className="flex justify-between items-center mb-4">
//                     <h4 className="font-semibold">Add New Product</h4>
//                     <button
//                       onClick={() => setShowProductForm(false)}
//                       className="text-gray-500"
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Product Images (2-3 images)
//                     </label>
//                     <div className="border-2 border-dashed rounded-md p-4 text-center">
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         multiple
//                         onChange={handleProductImageUpload}
//                         className="hidden"
//                         id="productImages"
//                       />
//                       <label htmlFor="productImages" className="cursor-pointer">
//                         <Upload className="mx-auto mb-2" />
//                         <span className="text-sm text-gray-600">
//                           Upload Product Images/Videos
//                         </span>
//                       </label>
//                     </div>
//                     {currentProduct.images && currentProduct.images.length > 0 && (
//                       <div className="flex gap-2 mt-2 flex-wrap">
//                         {currentProduct.images.map((img, idx) => (
//                           <div key={idx} className="relative w-20 h-20">
//                             <Image
//                               src={typeof img === 'string' ? img : URL.createObjectURL(img)}
//                               alt={`Product ${idx + 1}`}
//                               fill
//                               className="object-cover rounded"
//                             />
//                             <button
//                               onClick={() => removeProductImage(idx)}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                             >
//                               <X size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Product Name
//                       </label>
//                       <input
//                         type="text"
//                         value={currentProduct.productName}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           productName: e.target.value
//                         }))}
//                         className="w-full px-3 py-2 border rounded-md"
//                         placeholder="Enter product name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Description
//                       </label>
//                       <input
//                         type="text"
//                         value={currentProduct.description}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           description: e.target.value
//                         }))}
//                         className="w-full px-3 py-2 border rounded-md"
//                         placeholder="Enter description"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         MRP Price (₹)
//                       </label>
//                       <input
//                         type="number"
//                         value={currentProduct.mrpPrice || ''}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           mrpPrice: parseFloat(e.target.value) || 0
//                         }))}
//                         className="w-full px-3 py-2 border rounded-md"
//                         placeholder="Enter MRP"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Sales Price (₹)
//                       </label>
//                       <input
//                         type="number"
//                         value={currentProduct.salesPrice || ''}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           salesPrice: parseFloat(e.target.value) || 0
//                         }))}
//                         className="w-full px-3 py-2 border rounded-md"
//                         placeholder="Enter sales price"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     onClick={addProduct}
//                     className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
//                   >
//                     Add Product
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end">
//               <button
//                 onClick={submitAdvertisement}
//                 className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
//               >
//                 <Save size={18} />
//                 {isEditing ? 'Update Advertisement' : 'Create Advertisement'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Advertisement List */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Posted Advertisements</h2>
            
//             <div className="space-y-4">
//               {advertisements.map((ad) => (
//                 <div key={ad.id} className="border rounded-lg p-4 hover:bg-gray-50">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-semibold text-lg">{ad.heading}</h3>
//                       <p className="text-sm text-gray-600">{ad.companyName}</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Stage: {ad.stage} • Products: {ad.products.length}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => editAdvertisement(ad)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => deleteAdvertisement(ad.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </div>
                  
//                   {ad.companyLogo && (
//                     <div className="relative w-16 h-16 mt-2">
//                       <Image
//                         src={typeof ad.companyLogo === 'string' ? ad.companyLogo : URL.createObjectURL(ad.companyLogo)}
//                         alt="Company Logo"
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                   )}
                  
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-700 line-clamp-2">{ad.description}</p>
//                   </div>
                  
//                   <div className="mt-3 flex items-center justify-between">
//                     <span className="text-sm font-semibold">
//                       ₹{ad.callToAction.price}
//                     </span>
//                     <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
//                       {ad.callToAction.selectedAction}
//                     </span>
//                   </div>
//                 </div>
//               ))}
              
//               {advertisements.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                   No advertisements posted yet
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAdvertisement;





// components/AdminAdvertisement.tsx
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import { Plus, Edit, Trash2, Eye, Upload, X, Save, Loader2 } from 'lucide-react';

// // Types (matching backend schema)
// interface Product {
//   _id?: string;
//   id: string;
//   images: string[];
//   productName: string;
//   description: string;
//   mrpPrice: number;
//   salesPrice: number;
// }

// interface CallToAction {
//   buyNowLink: string;
//   visitWebsiteLink: string;
//   callNowNumber: string;
//   whatsappNowNumber: string;
//   price: number;
//   selectedAction: 'buyNow' | 'visitWebsite' | 'callNow' | 'whatsappNow';
// }

// interface Advertisement {
//   _id: string;
//   stage: string;
//   tab: string;
//   heading: string;
//   guide: string;
//   companyLogo: string;
//   companyName: string;
//   description: string;
//   advice: string;
//   banner: string;
//   callToAction: CallToAction;
//   products: Product[];
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface TabContent {
//   id: string;
//   label: string;
//   stage: string;
// }

// interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// const AdminAdvertisement: React.FC = () => {
//   // State
//   const [activeTab, setActiveTab] = useState<string>('tab01');
//   const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
//   const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [showProductForm, setShowProductForm] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  
//   const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
//     images: [],
//     productName: '',
//     description: '',
//     mrpPrice: 0,
//     salesPrice: 0,
//   });
  
//   // Form state
//   const [formData, setFormData] = useState({
//     stage: 'stage01',
//     heading: '',
//     guide: '',
//     companyLogo: null as File | string | null,
//     companyName: '',
//     description: '',
//     advice: '',
//     banner: null as File | string | null,
//     callToAction: {
//       buyNowLink: '',
//       visitWebsiteLink: '',
//       callNowNumber: '',
//       whatsappNowNumber: '',
//       price: 0,
//       selectedAction: 'buyNow' as const,
//     },
//   });

//   // Tabs configuration
//   const tabs: TabContent[] = [
//     { id: 'tab01', label: 'Stages Advertisement', stage: 'stage01' },
//     { id: 'tab02', label: 'Crops Care', stage: 'crops_care' },
//     { id: 'tab03', label: 'General Advertisement', stage: 'general' },
//   ];

//   // Stage options for tab 01
//   const stageOptions = [
//     { value: 'stage01', label: 'Stage 01' },
//     { value: 'stage02', label: 'Stage 02' },
//     { value: 'stage03', label: 'Stage 03' },
//     { value: 'stage04', label: 'Stage 04' },
//     { value: 'stage05', label: 'Stage 05' },
//     { value: 'stage06', label: 'Stage 06' },
//     { value: 'stage07', label: 'Stage 07' },
//     { value: 'sale', label: 'Sale' },
//   ];

//   // Action options for radio buttons
//   const actionOptions = [
//     { value: 'buyNow', label: 'Buy Now' },
//     { value: 'visitWebsite', label: 'Visit Website' },
//     { value: 'callNow', label: 'Call Now' },
//     { value: 'whatsappNow', label: 'WhatsApp Now' },
//   ];

//   // Fetch advertisements from API
//   const fetchAdvertisements = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/api/ads?tab=${activeTab}`);
//       const result: ApiResponse<Advertisement[]> = await response.json();
      
//       if (result.success && result.data) {
//         setAdvertisements(result.data);
//       } else {
//         console.error('Error fetching ads:', result.error);
//         setAdvertisements([]);
//       }
//     } catch (error) {
//       console.error('Error fetching advertisements:', error);
//       setAdvertisements([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [activeTab]);

//   // Load advertisements on component mount and tab change
//   useEffect(() => {
//     fetchAdvertisements();
//   }, [fetchAdvertisements]);

//   // Reset form when tab changes
//   useEffect(() => {
//     resetForm();
//   }, [activeTab]);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name.startsWith('callToAction.')) {
//       const actionField = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         callToAction: {
//           ...prev.callToAction,
//           [actionField]: actionField === 'price' ? parseFloat(value) || 0 : value,
//         },
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // Handle file uploads
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (field === 'companyLogo' || field === 'banner') {
//         setFormData(prev => ({
//           ...prev,
//           [field]: file,
//         }));
//       }
//     }
//   };

//   // Handle product image upload
//   const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newImages = Array.from(files).slice(0, 3);
//       setCurrentProduct(prev => ({
//         ...prev,
//         images: [...(prev.images || []), ...newImages],
//       }));
//     }
//   };

//   // Remove product image
//   const removeProductImage = (index: number) => {
//     setCurrentProduct(prev => ({
//       ...prev,
//       images: prev.images?.filter((_, i) => i !== index) || [],
//     }));
//   };

//   // Upload files to server
//   const uploadFiles = async (files: File[]): Promise<string[]> => {
//     if (files.length === 0) return [];
    
//     setUploadingFiles(true);
//     try {
//       const formData = new FormData();
//       files.forEach(file => {
//         formData.append('files', file);
//       });

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
      
//       if (result.success && result.urls) {
//         return result.urls;
//       } else {
//         throw new Error(result.error || 'Failed to upload files');
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//       throw error;
//     } finally {
//       setUploadingFiles(false);
//     }
//   };

//   // Add product to current advertisement
//   const addProduct = async () => {
//     if (!currentProduct.productName || !currentProduct.productName.trim()) {
//       alert('Please enter product name');
//       return;
//     }

//     try {
//       let imageUrls: string[] = [];
      
//       // Upload product images if any
//       if (currentProduct.images && currentProduct.images.length > 0) {
//         const filesToUpload = currentProduct.images.filter(img => img instanceof File) as File[];
//         if (filesToUpload.length > 0) {
//           imageUrls = await uploadFiles(filesToUpload);
//         }
        
//         // Keep existing URLs
//         const existingUrls = currentProduct.images.filter(img => typeof img === 'string') as string[];
//         imageUrls = [...existingUrls, ...imageUrls];
//       }

//       const newProduct: Product = {
//         id: Date.now().toString(),
//         images: imageUrls,
//         productName: currentProduct.productName || '',
//         description: currentProduct.description || '',
//         mrpPrice: currentProduct.mrpPrice || 0,
//         salesPrice: currentProduct.salesPrice || 0,
//       };

//       if (editingAd) {
//         const updatedAd = {
//           ...editingAd,
//           products: [...editingAd.products, newProduct],
//         };
//         setEditingAd(updatedAd);
//       } else {
//         // If creating new ad, add product to local state
//         setEditingAd({
//           _id: 'temp',
//           stage: formData.stage,
//           tab: activeTab,
//           heading: formData.heading,
//           guide: formData.guide,
//           companyLogo: '',
//           companyName: formData.companyName,
//           description: formData.description,
//           advice: formData.advice,
//           banner: '',
//           callToAction: formData.callToAction,
//           products: [newProduct],
//           isActive: true,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         });
//       }

//       // Reset product form
//       setCurrentProduct({
//         images: [],
//         productName: '',
//         description: '',
//         mrpPrice: 0,
//         salesPrice: 0,
//       });
//       setShowProductForm(false);
      
//     } catch (error) {
//       console.error('Error adding product:', error);
//       alert('Failed to add product. Please try again.');
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       stage: activeTab === 'tab01' ? 'stage01' : activeTab === 'tab02' ? 'crops_care' : 'general',
//       heading: '',
//       guide: '',
//       companyLogo: null,
//       companyName: '',
//       description: '',
//       advice: '',
//       banner: null,
//       callToAction: {
//         buyNowLink: '',
//         visitWebsiteLink: '',
//         callNowNumber: '',
//         whatsappNowNumber: '',
//         price: 0,
//         selectedAction: 'buyNow',
//       },
//     });
//     setEditingAd(null);
//     setIsEditing(false);
//     setShowProductForm(false);
//     setCurrentProduct({
//       images: [],
//       productName: '',
//       description: '',
//       mrpPrice: 0,
//       salesPrice: 0,
//     });
//   };

//  // Update the submitAdvertisement function in your AdminAdvertisement.tsx
// const submitAdvertisement = async () => {
//   try {
//     if (!formData.heading.trim()) {
//       alert('Please add a heading');
//       return;
//     }

//     setIsLoading(true);

//     // Upload files if any
//     let companyLogoUrl = '';
//     let bannerUrl = '';

//     try {
//       // Upload company logo
//       if (formData.companyLogo instanceof File) {
//         const logoFormData = new FormData();
//         logoFormData.append('files', formData.companyLogo);
        
//         const logoResponse = await fetch('/api/upload', {
//           method: 'POST',
//           body: logoFormData,
//         });
        
//         const logoResult = await logoResponse.json();
//         if (logoResult.success && logoResult.urls && logoResult.urls.length > 0) {
//           companyLogoUrl = logoResult.urls[0];
//         }
//       } else if (typeof formData.companyLogo === 'string') {
//         companyLogoUrl = formData.companyLogo;
//       }

//       // Upload banner
//       if (formData.banner instanceof File) {
//         const bannerFormData = new FormData();
//         bannerFormData.append('files', formData.banner);
        
//         const bannerResponse = await fetch('/api/upload', {
//           method: 'POST',
//           body: bannerFormData,
//         });
        
//         const bannerResult = await bannerResponse.json();
//         if (bannerResult.success && bannerResult.urls && bannerResult.urls.length > 0) {
//           bannerUrl = bannerResult.urls[0];
//         }
//       } else if (typeof formData.banner === 'string') {
//         bannerUrl = formData.banner;
//       }
//     } catch (uploadError) {
//       console.error('Error uploading files:', uploadError);
//       alert('Warning: Some files failed to upload. Proceeding without them.');
//     }

//     // Prepare data for API
//     const adData = {
//       stage: formData.stage,
//       tab: activeTab,
//       heading: formData.heading,
//       guide: formData.guide || '',
//       companyLogo: companyLogoUrl,
//       companyName: formData.companyName || '',
//       description: formData.description || '',
//       advice: formData.advice || '',
//       banner: bannerUrl,
//       callToAction: {
//         buyNowLink: formData.callToAction.buyNowLink || '',
//         visitWebsiteLink: formData.callToAction.visitWebsiteLink || '',
//         callNowNumber: formData.callToAction.callNowNumber || '',
//         whatsappNowNumber: formData.callToAction.whatsappNowNumber || '',
//         price: formData.callToAction.price || 0,
//         selectedAction: formData.callToAction.selectedAction || 'buyNow',
//       },
//       products: editingAd?.products || [],
//     };

//     console.log('Submitting ad data:', adData);

//     let response;
//     if (isEditing && editingAd && editingAd._id !== 'temp') {
//       // Update existing advertisement
//       response = await fetch(`/api/ads/${editingAd._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(adData),
//       });
//     } else {
//       // Create new advertisement
//       response = await fetch('/api/ads', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(adData),
//       });
//     }

//     const result: ApiResponse = await response.json();

//     if (result.success) {
//       alert(isEditing ? 'Advertisement updated successfully!' : 'Advertisement created successfully!');
//       resetForm();
//       fetchAdvertisements(); // Refresh the list
//     } else {
//       alert('Error: ' + (result.error || 'Unknown error occurred'));
//     }
//   } catch (error) {
//     console.error('Error submitting advertisement:', error);
//     alert('Failed to submit advertisement. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // Edit advertisement
//   const editAdvertisement = (ad: Advertisement) => {
//     setFormData({
//       stage: ad.stage,
//       heading: ad.heading,
//       guide: ad.guide || '',
//       companyLogo: ad.companyLogo || null,
//       companyName: ad.companyName || '',
//       description: ad.description || '',
//       advice: ad.advice || '',
//       banner: ad.banner || null,
//       callToAction: ad.callToAction || {
//         buyNowLink: '',
//         visitWebsiteLink: '',
//         callNowNumber: '',
//         whatsappNowNumber: '',
//         price: 0,
//         selectedAction: 'buyNow',
//       },
//     });
//     setEditingAd(ad);
//     setIsEditing(true);
//     setActiveTab(ad.tab);
//   };

//   // Delete advertisement
//   const deleteAdvertisement = async (id: string) => {
//     if (confirm('Are you sure you want to delete this advertisement?')) {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/ads/${id}`, {
//           method: 'DELETE',
//         });
        
//         const result: ApiResponse = await response.json();
        
//         if (result.success) {
//           alert('Advertisement deleted successfully!');
//           fetchAdvertisements(); // Refresh the list
          
//           if (editingAd?._id === id) {
//             resetForm();
//           }
//         } else {
//           alert('Error: ' + result.error);
//         }
//       } catch (error) {
//         console.error('Error deleting advertisement:', error);
//         alert('Failed to delete advertisement. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   // Delete product from advertisement
//   const deleteProduct = (productId: string) => {
//     if (editingAd) {
//       const updatedAd = {
//         ...editingAd,
//         products: editingAd.products.filter(product => product.id !== productId),
//       };
//       setEditingAd(updatedAd);
//     }
//   };

//   // Render file preview
//   const renderFilePreview = (file: File | string | null, type: 'logo' | 'banner') => {
//     if (!file) return null;
    
//     const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    
//     return (
//       <div className={`relative ${type === 'logo' ? 'w-20 h-20' : 'w-full h-32'} mt-2`}>
//         <Image
//           src={url}
//           alt="Preview"
//           fill
//           className="object-contain rounded"
//           unoptimized={typeof file !== 'string'}
//         />
//         <button
//           type="button"
//           onClick={() => {
//             if (type === 'logo') {
//               setFormData(prev => ({ ...prev, companyLogo: null }));
//             } else {
//               setFormData(prev => ({ ...prev, banner: null }));
//             }
//           }}
//           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//         >
//           <X size={16} />
//         </button>
//       </div>
//     );
//   };

//   // Render product preview
//   const renderProductPreview = (product: Product) => (
//     <div key={product.id} className="border rounded-lg p-4 mb-2 bg-white">
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <h4 className="font-semibold text-gray-800">{product.productName}</h4>
//           <p className="text-sm text-gray-600 mt-1">{product.description}</p>
//           <div className="flex gap-4 mt-2">
//             <span className="text-sm line-through text-gray-500">
//               MRP: ₹{product.mrpPrice}
//             </span>
//             <span className="text-sm font-semibold text-green-600">
//               Sale: ₹{product.salesPrice}
//             </span>
//           </div>
//           {product.images && product.images.length > 0 && (
//             <div className="flex gap-2 mt-2">
//               {product.images.slice(0, 3).map((img, idx) => (
//                 <div key={idx} className="w-16 h-16 relative">
//                   <Image
//                     src={img}
//                     alt={`Product ${idx + 1}`}
//                     fill
//                     className="object-cover rounded border"
//                     unoptimized
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button
//           onClick={() => deleteProduct(product.id)}
//           className="text-red-500 hover:text-red-700 ml-2"
//           disabled={isLoading}
//         >
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Advertisement Management</h1>
      
//       {/* Tabs */}
//       <div className="border-b mb-6">
//         <div className="flex space-x-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-2 px-4 font-medium transition-colors ${
//                 activeTab === tab.id
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               disabled={isLoading}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Form */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {isEditing ? 'Edit Advertisement' : 'Create New Advertisement'}
//               </h2>
//               {isEditing && (
//                 <button
//                   onClick={resetForm}
//                   className="text-sm text-gray-600 hover:text-gray-800"
//                   disabled={isLoading}
//                 >
//                   Cancel Edit
//                 </button>
//               )}
//             </div>
            
//             {activeTab === 'tab01' && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Stage
//                 </label>
//                 <select
//                   name="stage"
//                   value={formData.stage}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   disabled={isLoading}
//                 >
//                   {stageOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Heading *
//                 </label>
//                 <input
//                   type="text"
//                   name="heading"
//                   value={formData.heading}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter heading"
//                   disabled={isLoading}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Guide
//                 </label>
//                 <input
//                   type="text"
//                   name="guide"
//                   value={formData.guide}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter guide"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company Name
//                 </label>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter company name"
//                   disabled={isLoading}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company Logo
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileUpload(e, 'companyLogo')}
//                     className="hidden"
//                     id="companyLogo"
//                     disabled={isLoading || uploadingFiles}
//                   />
//                   <label htmlFor="companyLogo" className="cursor-pointer">
//                     <Upload className="mx-auto mb-2 text-gray-400" />
//                     <span className="text-sm text-gray-600">
//                       {uploadingFiles ? 'Uploading...' : 'Upload Logo (Optional)'}
//                     </span>
//                   </label>
//                 </div>
//                 {renderFilePreview(formData.companyLogo, 'logo')}
//               </div>
//             </div>

//             {/* Description and Advice */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter description"
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Advice
//               </label>
//               <textarea
//                 name="advice"
//                 value={formData.advice}
//                 onChange={handleInputChange}
//                 rows={2}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter advice"
//                 disabled={isLoading}
//               />
//             </div>

//             {/* Banner Upload */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Banner (Optional)
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileUpload(e, 'banner')}
//                   className="hidden"
//                   id="banner"
//                   disabled={isLoading || uploadingFiles}
//                 />
//                 <label htmlFor="banner" className="cursor-pointer">
//                   <Upload className="mx-auto mb-2 text-gray-400" />
//                   <span className="text-sm text-gray-600">
//                     {uploadingFiles ? 'Uploading...' : 'Upload Banner Image'}
//                   </span>
//                 </label>
//               </div>
//               {renderFilePreview(formData.banner, 'banner')}
//             </div>

//             {/* Call to Action Section */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-3 text-gray-800">Call to Action</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Buy Now Link
//                   </label>
//                   <input
//                     type="text"
//                     name="callToAction.buyNowLink"
//                     value={formData.callToAction.buyNowLink}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="https://example.com/buy"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Visit Website Link
//                   </label>
//                   <input
//                     type="text"
//                     name="callToAction.visitWebsiteLink"
//                     value={formData.callToAction.visitWebsiteLink}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="https://example.com"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Call Now Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="callToAction.callNowNumber"
//                     value={formData.callToAction.callNowNumber}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="+1234567890"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     WhatsApp Now Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="callToAction.whatsappNowNumber"
//                     value={formData.callToAction.whatsappNowNumber}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="+1234567890"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="callToAction.price"
//                   value={formData.callToAction.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="0"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Primary Action
//                 </label>
//                 <div className="flex flex-wrap gap-4">
//                   {actionOptions.map((option) => (
//                     <label key={option.value} className="flex items-center">
//                       <input
//                         type="radio"
//                         name="callToAction.selectedAction"
//                         value={option.value}
//                         checked={formData.callToAction.selectedAction === option.value}
//                         onChange={handleInputChange}
//                         className="mr-2"
//                         disabled={isLoading}
//                       />
//                       {option.label}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Product Management */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Products</h3>
//                 <button
//                   type="button"
//                   onClick={() => setShowProductForm(true)}
//                   className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={isLoading || uploadingFiles}
//                 >
//                   <Plus size={18} />
//                   Add Product
//                 </button>
//               </div>

//               {(editingAd?.products || []).length > 0 ? (
//                 <div className="space-y-2">
//                   {editingAd?.products.map(renderProductPreview)}
//                 </div>
//               ) : (
//                 <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg">
//                   No products added yet
//                 </div>
//               )}

//               {showProductForm && (
//                 <div className="border rounded-lg p-4 mb-4 bg-gray-50">
//                   <div className="flex justify-between items-center mb-4">
//                     <h4 className="font-semibold text-gray-800">Add New Product</h4>
//                     <button
//                       onClick={() => setShowProductForm(false)}
//                       className="text-gray-500 hover:text-gray-700"
//                       disabled={isLoading || uploadingFiles}
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Product Images (2-3 images)
//                     </label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         multiple
//                         onChange={handleProductImageUpload}
//                         className="hidden"
//                         id="productImages"
//                         disabled={isLoading || uploadingFiles}
//                       />
//                       <label htmlFor="productImages" className="cursor-pointer">
//                         <Upload className="mx-auto mb-2 text-gray-400" />
//                         <span className="text-sm text-gray-600">
//                           {uploadingFiles ? 'Uploading...' : 'Upload Product Images/Videos'}
//                         </span>
//                       </label>
//                     </div>
//                     {currentProduct.images && currentProduct.images.length > 0 && (
//                       <div className="flex gap-2 mt-2 flex-wrap">
//                         {currentProduct.images.map((img, idx) => (
//                           <div key={idx} className="relative w-20 h-20">
//                             <Image
//                               src={typeof img === 'string' ? img : URL.createObjectURL(img)}
//                               alt={`Product ${idx + 1}`}
//                               fill
//                               className="object-cover rounded border"
//                               unoptimized={typeof img !== 'string'}
//                             />
//                             <button
//                               onClick={() => removeProductImage(idx)}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                               disabled={isLoading}
//                             >
//                               <X size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Product Name *
//                       </label>
//                       <input
//                         type="text"
//                         value={currentProduct.productName}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           productName: e.target.value
//                         }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter product name"
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Description
//                       </label>
//                       <input
//                         type="text"
//                         value={currentProduct.description}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           description: e.target.value
//                         }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter description"
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         MRP Price (₹)
//                       </label>
//                       <input
//                         type="number"
//                         value={currentProduct.mrpPrice || ''}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           mrpPrice: parseFloat(e.target.value) || 0
//                         }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter MRP"
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Sales Price (₹)
//                       </label>
//                       <input
//                         type="number"
//                         value={currentProduct.salesPrice || ''}
//                         onChange={(e) => setCurrentProduct(prev => ({
//                           ...prev,
//                           salesPrice: parseFloat(e.target.value) || 0
//                         }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter sales price"
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={addProduct}
//                       className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={isLoading || uploadingFiles || !currentProduct.productName.trim()}
//                     >
//                       {uploadingFiles ? 'Uploading...' : 'Add Product'}
//                     </button>
//                     <button
//                       onClick={() => setShowProductForm(false)}
//                       className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={isLoading || uploadingFiles}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isLoading}
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={submitAdvertisement}
//                 className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isLoading || uploadingFiles || !formData.heading.trim()}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} />
//                     {isEditing ? 'Update Advertisement' : 'Create Advertisement'}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Advertisement List */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">Posted Advertisements</h2>
//               <button
//                 onClick={fetchAdvertisements}
//                 className="text-sm text-blue-500 hover:text-blue-700"
//                 disabled={isLoading}
//               >
//                 Refresh
//               </button>
//             </div>
            
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <Loader2 className="animate-spin mx-auto mb-2" size={24} />
//                 <p className="text-gray-500">Loading advertisements...</p>
//               </div>
//             ) : advertisements.length > 0 ? (
//               <div className="space-y-4">
//                 {advertisements.map((ad) => (
//                   <div key={ad._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h3 className="font-semibold text-gray-800">{ad.heading}</h3>
//                         <p className="text-sm text-gray-600">{ad.companyName}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {ad.stage} • Products: {ad.products.length}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => editAdvertisement(ad)}
//                           className="text-blue-500 hover:text-blue-700"
//                           disabled={isLoading}
//                           title="Edit"
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button
//                           onClick={() => deleteAdvertisement(ad._id)}
//                           className="text-red-500 hover:text-red-700"
//                           disabled={isLoading}
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
                    
//                     {ad.companyLogo && (
//                       <div className="relative w-16 h-16 mt-2">
//                         <Image
//                           src={ad.companyLogo}
//                           alt="Company Logo"
//                           fill
//                           className="object-contain"
//                           unoptimized
//                         />
//                       </div>
//                     )}
                    
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-700 line-clamp-2">{ad.description}</p>
//                     </div>
                    
//                     <div className="mt-3 flex items-center justify-between">
//                       <span className="text-sm font-semibold">
//                         ₹{ad.callToAction.price}
//                       </span>
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         ad.callToAction.selectedAction === 'buyNow' ? 'bg-green-100 text-green-800' :
//                         ad.callToAction.selectedAction === 'visitWebsite' ? 'bg-blue-100 text-blue-800' :
//                         ad.callToAction.selectedAction === 'callNow' ? 'bg-purple-100 text-purple-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {ad.callToAction.selectedAction}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <p>No advertisements found for this tab.</p>
//                 <p className="text-sm mt-1">Create your first advertisement!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAdvertisement;

// components/AdminAdvertisement.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Upload, X, Save, Loader2 } from 'lucide-react';

// Types (matching backend schema)
interface Product {
  _id?: string;
  id: string;
  images: string[];
  productName: string;
  description: string;
  mrpPrice: number;
  salesPrice: number;
}

interface CallToAction {
  buyNowLink: string;
  visitWebsiteLink: string;
  callNowNumber: string;
  whatsappNowNumber: string;
  price: number;
  selectedAction: 'buyNow' | 'visitWebsite' | 'callNow' | 'whatsappNow';
}

interface Advertisement {
  _id: string;
  stage: string;
  tab: string;
  heading: string;
  guide: string;
  companyLogo: string;
  companyName: string;
  description: string;
  advice: string;
  banner: string;
  callToAction: CallToAction;
  products: Product[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TabContent {
  id: string;
  label: string;
  stage: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const AdminAdvertisement: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>('tab01');
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  
  // Update currentProduct type to handle both strings and Files during upload
  const [currentProduct, setCurrentProduct] = useState<{
    images: (string | File)[];
    productName: string;
    description: string;
    mrpPrice: number;
    salesPrice: number;
  }>({
    images: [],
    productName: '',
    description: '',
    mrpPrice: 0,
    salesPrice: 0,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    stage: 'stage01',
    heading: '',
    guide: '',
    companyLogo: null as File | string | null,
    companyName: '',
    description: '',
    advice: '',
    banner: null as File | string | null,
    callToAction: {
      buyNowLink: '',
      visitWebsiteLink: '',
      callNowNumber: '',
      whatsappNowNumber: '',
      price: 0,
      selectedAction: 'buyNow' as const,
    },
  });

  // Tabs configuration
  const tabs: TabContent[] = [
    { id: 'tab01', label: 'Stages Advertisement', stage: 'stage01' },
    { id: 'tab02', label: 'Crops Care', stage: 'crops_care' },
    { id: 'tab03', label: 'General Advertisement', stage: 'general' },
  ];

  // Stage options for tab 01
  const stageOptions = [
    { value: 'stage01', label: 'Stage 01' },
    { value: 'stage02', label: 'Stage 02' },
    { value: 'stage03', label: 'Stage 03' },
    { value: 'stage04', label: 'Stage 04' },
    { value: 'stage05', label: 'Stage 05' },
    { value: 'stage06', label: 'Stage 06' },
    { value: 'stage07', label: 'Stage 07' },
    { value: 'sale', label: 'Sale' },
  ];

  // Action options for radio buttons
  const actionOptions = [
    { value: 'buyNow', label: 'Buy Now' },
    { value: 'visitWebsite', label: 'Visit Website' },
    { value: 'callNow', label: 'Call Now' },
    { value: 'whatsappNow', label: 'WhatsApp Now' },
  ];

  // Fetch advertisements from API
  const fetchAdvertisements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ads?tab=${activeTab}`);
      const result: ApiResponse<Advertisement[]> = await response.json();
      
      if (result.success && result.data) {
        setAdvertisements(result.data);
      } else {
        console.error('Error fetching ads:', result.error);
        setAdvertisements([]);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setAdvertisements([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Load advertisements on component mount and tab change
  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  // Reset form when tab changes
  useEffect(() => {
    resetForm();
  }, [activeTab]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('callToAction.')) {
      const actionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        callToAction: {
          ...prev.callToAction,
          [actionField]: actionField === 'price' ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === 'companyLogo' || field === 'banner') {
        setFormData(prev => ({
          ...prev,
          [field]: file,
        }));
      }
    }
  };

  // Handle product image upload - Fixed TypeScript error
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3);
      setCurrentProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  // Remove product image
  const removeProductImage = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  // Upload files to server
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    
    setUploadingFiles(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.urls) {
        return result.urls;
      } else {
        throw new Error(result.error || 'Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    } finally {
      setUploadingFiles(false);
    }
  };

  // Add product to current advertisement
  const addProduct = async () => {
    if (!currentProduct.productName || !currentProduct.productName.trim()) {
      alert('Please enter product name');
      return;
    }

    try {
      let imageUrls: string[] = [];
      
      // Upload product images if any
      if (currentProduct.images && currentProduct.images.length > 0) {
        const filesToUpload = currentProduct.images.filter(img => img instanceof File) as File[];
        if (filesToUpload.length > 0) {
          imageUrls = await uploadFiles(filesToUpload);
        }
        
        // Keep existing URLs
        const existingUrls = currentProduct.images.filter(img => typeof img === 'string') as string[];
        imageUrls = [...existingUrls, ...imageUrls];
      }

      const newProduct: Product = {
        id: Date.now().toString(),
        images: imageUrls,
        productName: currentProduct.productName || '',
        description: currentProduct.description || '',
        mrpPrice: currentProduct.mrpPrice || 0,
        salesPrice: currentProduct.salesPrice || 0,
      };

      if (editingAd) {
        const updatedAd = {
          ...editingAd,
          products: [...editingAd.products, newProduct],
        };
        setEditingAd(updatedAd);
      } else {
        // If creating new ad, add product to local state
        setEditingAd({
          _id: 'temp',
          stage: formData.stage,
          tab: activeTab,
          heading: formData.heading,
          guide: formData.guide,
          companyLogo: '',
          companyName: formData.companyName,
          description: formData.description,
          advice: formData.advice,
          banner: '',
          callToAction: formData.callToAction,
          products: [newProduct],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Reset product form
      setCurrentProduct({
        images: [],
        productName: '',
        description: '',
        mrpPrice: 0,
        salesPrice: 0,
      });
      setShowProductForm(false);
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      stage: activeTab === 'tab01' ? 'stage01' : activeTab === 'tab02' ? 'crops_care' : 'general',
      heading: '',
      guide: '',
      companyLogo: null,
      companyName: '',
      description: '',
      advice: '',
      banner: null,
      callToAction: {
        buyNowLink: '',
        visitWebsiteLink: '',
        callNowNumber: '',
        whatsappNowNumber: '',
        price: 0,
        selectedAction: 'buyNow',
      },
    });
    setEditingAd(null);
    setIsEditing(false);
    setShowProductForm(false);
    setCurrentProduct({
      images: [],
      productName: '',
      description: '',
      mrpPrice: 0,
      salesPrice: 0,
    });
  };

  const submitAdvertisement = async () => {
    try {
      if (!formData.heading.trim()) {
        alert('Please add a heading');
        return;
      }

      setIsLoading(true);

      // Upload files if any
      let companyLogoUrl = '';
      let bannerUrl = '';

      try {
        // Upload company logo
        if (formData.companyLogo instanceof File) {
          const logoFormData = new FormData();
          logoFormData.append('files', formData.companyLogo);
          
          const logoResponse = await fetch('/api/upload', {
            method: 'POST',
            body: logoFormData,
          });
          
          const logoResult = await logoResponse.json();
          if (logoResult.success && logoResult.urls && logoResult.urls.length > 0) {
            companyLogoUrl = logoResult.urls[0];
          }
        } else if (typeof formData.companyLogo === 'string') {
          companyLogoUrl = formData.companyLogo;
        }

        // Upload banner
        if (formData.banner instanceof File) {
          const bannerFormData = new FormData();
          bannerFormData.append('files', formData.banner);
          
          const bannerResponse = await fetch('/api/upload', {
            method: 'POST',
            body: bannerFormData,
          });
          
          const bannerResult = await bannerResponse.json();
          if (bannerResult.success && bannerResult.urls && bannerResult.urls.length > 0) {
            bannerUrl = bannerResult.urls[0];
          }
        } else if (typeof formData.banner === 'string') {
          bannerUrl = formData.banner;
        }
      } catch (uploadError) {
        console.error('Error uploading files:', uploadError);
        alert('Warning: Some files failed to upload. Proceeding without them.');
      }

      // Prepare data for API
      const adData = {
        stage: formData.stage,
        tab: activeTab,
        heading: formData.heading,
        guide: formData.guide || '',
        companyLogo: companyLogoUrl,
        companyName: formData.companyName || '',
        description: formData.description || '',
        advice: formData.advice || '',
        banner: bannerUrl,
        callToAction: {
          buyNowLink: formData.callToAction.buyNowLink || '',
          visitWebsiteLink: formData.callToAction.visitWebsiteLink || '',
          callNowNumber: formData.callToAction.callNowNumber || '',
          whatsappNowNumber: formData.callToAction.whatsappNowNumber || '',
          price: formData.callToAction.price || 0,
          selectedAction: formData.callToAction.selectedAction || 'buyNow',
        },
        products: editingAd?.products || [],
      };

      console.log('Submitting ad data:', adData);

      let response;
      if (isEditing && editingAd && editingAd._id !== 'temp') {
        // Update existing advertisement
        response = await fetch(`/api/ads/${editingAd._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adData),
        });
      } else {
        // Create new advertisement
        response = await fetch('/api/ads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adData),
        });
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        alert(isEditing ? 'Advertisement updated successfully!' : 'Advertisement created successfully!');
        resetForm();
        fetchAdvertisements(); // Refresh the list
      } else {
        alert('Error: ' + (result.error || 'Unknown error occurred'));
      }
    } catch (error) {
      console.error('Error submitting advertisement:', error);
      alert('Failed to submit advertisement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit advertisement
  const editAdvertisement = (ad: Advertisement) => {
    setFormData({
      stage: ad.stage,
      heading: ad.heading,
      guide: ad.guide || '',
      companyLogo: ad.companyLogo || null,
      companyName: ad.companyName || '',
      description: ad.description || '',
      advice: ad.advice || '',
      banner: ad.banner || null,
      callToAction: ad.callToAction || {
        buyNowLink: '',
        visitWebsiteLink: '',
        callNowNumber: '',
        whatsappNowNumber: '',
        price: 0,
        selectedAction: 'buyNow',
      },
    });
    setEditingAd(ad);
    setIsEditing(true);
    setActiveTab(ad.tab);
  };

  // Delete advertisement
  const deleteAdvertisement = async (id: string) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/ads/${id}`, {
          method: 'DELETE',
        });
        
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          alert('Advertisement deleted successfully!');
          fetchAdvertisements(); // Refresh the list
          
          if (editingAd?._id === id) {
            resetForm();
          }
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting advertisement:', error);
        alert('Failed to delete advertisement. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete product from advertisement
  const deleteProduct = (productId: string) => {
    if (editingAd) {
      const updatedAd = {
        ...editingAd,
        products: editingAd.products.filter(product => product.id !== productId),
      };
      setEditingAd(updatedAd);
    }
  };

  // Render file preview
  const renderFilePreview = (file: File | string | null, type: 'logo' | 'banner') => {
    if (!file) return null;
    
    const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    
    return (
      <div className={`relative ${type === 'logo' ? 'w-20 h-20' : 'w-full h-32'} mt-2`}>
        <Image
          src={url}
          alt="Preview"
          fill
          className="object-contain rounded"
          unoptimized={typeof file !== 'string'}
        />
        <button
          type="button"
          onClick={() => {
            if (type === 'logo') {
              setFormData(prev => ({ ...prev, companyLogo: null }));
            } else {
              setFormData(prev => ({ ...prev, banner: null }));
            }
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // Render product preview
  const renderProductPreview = (product: Product) => (
    <div key={product.id} className="border rounded-lg p-4 mb-2 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{product.productName}</h4>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-sm line-through text-gray-500">
              MRP: ₹{product.mrpPrice}
            </span>
            <span className="text-sm font-semibold text-green-600">
              Sale: ₹{product.salesPrice}
            </span>
          </div>
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {product.images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="w-16 h-16 relative">
                  <Image
                    src={img}
                    alt={`Product ${idx + 1}`}
                    fill
                    className="object-cover rounded border"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => deleteProduct(product.id)}
          className="text-red-500 hover:text-red-700 ml-2"
          disabled={isLoading}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Advertisement Management</h1>
      
      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              disabled={isLoading}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h2>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="text-sm text-gray-600 hover:text-gray-800"
                  disabled={isLoading}
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            {activeTab === 'tab01' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  {stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading *
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter heading"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guide
                </label>
                <input
                  type="text"
                  name="guide"
                  value={formData.guide}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter guide"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'companyLogo')}
                    className="hidden"
                    id="companyLogo"
                    disabled={isLoading || uploadingFiles}
                  />
                  <label htmlFor="companyLogo" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploadingFiles ? 'Uploading...' : 'Upload Logo (Optional)'}
                    </span>
                  </label>
                </div>
                {renderFilePreview(formData.companyLogo, 'logo')}
              </div>
            </div>

            {/* Description and Advice */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description"
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advice
              </label>
              <textarea
                name="advice"
                value={formData.advice}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter advice"
                disabled={isLoading}
              />
            </div>

            {/* Banner Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'banner')}
                  className="hidden"
                  id="banner"
                  disabled={isLoading || uploadingFiles}
                />
                <label htmlFor="banner" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {uploadingFiles ? 'Uploading...' : 'Upload Banner Image'}
                  </span>
                </label>
              </div>
              {renderFilePreview(formData.banner, 'banner')}
            </div>

            {/* Call to Action Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Call to Action</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buy Now Link
                  </label>
                  <input
                    type="text"
                    name="callToAction.buyNowLink"
                    value={formData.callToAction.buyNowLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/buy"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Website Link
                  </label>
                  <input
                    type="text"
                    name="callToAction.visitWebsiteLink"
                    value={formData.callToAction.visitWebsiteLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call Now Number
                  </label>
                  <input
                    type="tel"
                    name="callToAction.callNowNumber"
                    value={formData.callToAction.callNowNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Now Number
                  </label>
                  <input
                    type="tel"
                    name="callToAction.whatsappNowNumber"
                    value={formData.callToAction.whatsappNowNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="callToAction.price"
                  value={formData.callToAction.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Primary Action
                </label>
                <div className="flex flex-wrap gap-4">
                  {actionOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="callToAction.selectedAction"
                        value={option.value}
                        checked={formData.callToAction.selectedAction === option.value}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Management */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Products</h3>
                <button
                  type="button"
                  onClick={() => setShowProductForm(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || uploadingFiles}
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              {(editingAd?.products || []).length > 0 ? (
                <div className="space-y-2">
                  {editingAd?.products.map(renderProductPreview)}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg">
                  No products added yet
                </div>
              )}

              {showProductForm && (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Add New Product</h4>
                    <button
                      onClick={() => setShowProductForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isLoading || uploadingFiles}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images (2-3 images)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleProductImageUpload}
                        className="hidden"
                        id="productImages"
                        disabled={isLoading || uploadingFiles}
                      />
                      <label htmlFor="productImages" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {uploadingFiles ? 'Uploading...' : 'Upload Product Images/Videos'}
                        </span>
                      </label>
                    </div>
                    {currentProduct.images && currentProduct.images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {currentProduct.images.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20">
                            <Image
                              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                              alt={`Product ${idx + 1}`}
                              fill
                              className="object-cover rounded border"
                              unoptimized={typeof img !== 'string'}
                            />
                            <button
                              onClick={() => removeProductImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              disabled={isLoading}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={currentProduct.productName}
                        onChange={(e) => setCurrentProduct(prev => ({
                          ...prev,
                          productName: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product name"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={currentProduct.description}
                        onChange={(e) => setCurrentProduct(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter description"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MRP Price (₹)
                      </label>
                      <input
                        type="number"
                        value={currentProduct.mrpPrice || ''}
                        onChange={(e) => setCurrentProduct(prev => ({
                          ...prev,
                          mrpPrice: parseFloat(e.target.value) || 0
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter MRP"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sales Price (₹)
                      </label>
                      <input
                        type="number"
                        value={currentProduct.salesPrice || ''}
                        onChange={(e) => setCurrentProduct(prev => ({
                          ...prev,
                          salesPrice: parseFloat(e.target.value) || 0
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter sales price"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addProduct}
                      className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || uploadingFiles || !currentProduct.productName.trim()}
                    >
                      {uploadingFiles ? 'Uploading...' : 'Add Product'}
                    </button>
                    <button
                      onClick={() => setShowProductForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || uploadingFiles}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                onClick={submitAdvertisement}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || uploadingFiles || !formData.heading.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEditing ? 'Update Advertisement' : 'Create Advertisement'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Advertisement List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Posted Advertisements</h2>
              <button
                onClick={fetchAdvertisements}
                className="text-sm text-blue-500 hover:text-blue-700"
                disabled={isLoading}
              >
                Refresh
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                <p className="text-gray-500">Loading advertisements...</p>
              </div>
            ) : advertisements.length > 0 ? (
              <div className="space-y-4">
                {advertisements.map((ad) => (
                  <div key={ad._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{ad.heading}</h3>
                        <p className="text-sm text-gray-600">{ad.companyName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {ad.stage} • Products: {ad.products.length}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editAdvertisement(ad)}
                          className="text-blue-500 hover:text-blue-700"
                          disabled={isLoading}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteAdvertisement(ad._id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isLoading}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {ad.companyLogo && (
                      <div className="relative w-16 h-16 mt-2">
                        <Image
                          src={ad.companyLogo}
                          alt="Company Logo"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 line-clamp-2">{ad.description}</p>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        ₹{ad.callToAction.price}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        ad.callToAction.selectedAction === 'buyNow' ? 'bg-green-100 text-green-800' :
                        ad.callToAction.selectedAction === 'visitWebsite' ? 'bg-blue-100 text-blue-800' :
                        ad.callToAction.selectedAction === 'callNow' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ad.callToAction.selectedAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No advertisements found for this tab.</p>
                <p className="text-sm mt-1">Create your first advertisement!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAdvertisement;