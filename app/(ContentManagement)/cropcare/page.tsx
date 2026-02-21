
// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// // Interfaces for TypeScript
// interface Category {
//   _id: string;
//   name: string;
//   image: string;
//   status: 'draft' | 'active' | 'inactive';
//   createdAt: string;
//   updatedAt: string;
// }

// interface SubCategory {
//   _id: string;
//   name: string;
//   image: string;
//   categoryId: string | { _id: string; name: string };
//   status: 'draft' | 'active' | 'inactive';
//   createdAt: string;
//   updatedAt: string;
// }

// interface TargetPestDisease {
//   name: string;
//   image: string;
//   imageFile?: File | null;
// }

// // Updated RecommendedSeed interface with new fields
// interface RecommendedSeed {
//   name: string;
//   image: string;
//   imageFile?: File | null;
//   stock: number;
//   unit: string;
//   customUnit?: string;
//   weight: number;
//   weightUnit: string;
//   listPrice: number;
//   discount: number;
//   profit: number;
//   tax: number;
//   customTax?: number;
//   finalPrice: number;
// }

// interface Product {
//   _id: string;
//   name: string;
//   description?: string;
//   video?: string;
//   subCategoryId: string | {
//     _id: string;
//     name: string;
//     categoryId?: { _id: string; name: string }
//   };
//   targetPestsDiseases: TargetPestDisease[];
//   recommendedSeeds: RecommendedSeed[];
//   status: 'draft' | 'active' | 'inactive';
//   createdAt: string;
//   updatedAt: string;
// }

// const API_BASE_URL = '/api/cropcare';

// // Constants
// const UNIT_OPTIONS = [
//   'kg', 'pound', 'piece', 'box', 'packet', 'gram', 'liter', 'gallon', 'bottle', 'other'
// ];

// const TAX_OPTIONS = [
//   { value: 5, label: '5% GST' },
//   { value: 12, label: '12% GST' },
//   { value: 18, label: '18% GST' },
//   { value: 24, label: '24% GST' },
//   { value: 0, label: 'Other (specify)' }
// ];

// const CropCare: React.FC = () => {
//   // State for active tab
//   const [activeTab, setActiveTab] = useState<'category' | 'subCategory' | 'product' | 'view'>('category');
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [currentEditId, setCurrentEditId] = useState<string>('');

//   // Form states
//   const [categoryName, setCategoryName] = useState('');
//   const [categoryImage, setCategoryImage] = useState<File | null>(null);
//   const [categoryImagePreview, setCategoryImagePreview] = useState('');
//   const [existingCategoryImage, setExistingCategoryImage] = useState('');

//   const [subCategoryName, setSubCategoryName] = useState('');
//   const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
//   const [subCategoryImagePreview, setSubCategoryImagePreview] = useState('');
//   const [existingSubCategoryImage, setExistingSubCategoryImage] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');

//   const [productName, setProductName] = useState('');
//   const [productDescription, setProductDescription] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');

//   const [productVideo, setProductVideo] = useState<File | null>(null);
//   const [productVideoPreview, setProductVideoPreview] = useState('');
//   const [existingProductVideo, setExistingProductVideo] = useState('');
//   const [videoError, setVideoError] = useState('');

//   // Arrays for dynamic fields
//   const [targetPestsDiseases, setTargetPestsDiseases] = useState<TargetPestDisease[]>([
//     { name: '', image: '', imageFile: null }
//   ]);

//   const [recommendedSeeds, setRecommendedSeeds] = useState<RecommendedSeed[]>([
//     {
//       name: '',
//       image: '',
//       imageFile: null,
//       stock: 0,
//       unit: 'kg',
//       customUnit: '',
//       weight: 0,
//       weightUnit: 'kg',
//       listPrice: 0,
//       discount: 0,
//       profit: 0,
//       tax: 18,
//       customTax: undefined,
//       finalPrice: 0
//     }
//   ]);

//   // Data storage
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [summary, setSummary] = useState({
//     categories: 0,
//     subCategories: 0,
//     products: 0
//   });

//   // Ref for file inputs
//   const categoryFileInputRef = useRef<HTMLInputElement>(null);
//   const subCategoryFileInputRef = useRef<HTMLInputElement>(null);
//   const pestImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const seedImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   // Collapsible state for view tab
//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchAllData();
//   }, []);


//   // Handle product video upload
//   // Handle product video upload
//   const handleProductVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check file type
//       if (!file.type.startsWith('video/')) {
//         alert('❌ Please upload a valid video file (MP4, WebM, MOV)');
//         if (videoInputRef.current) {
//           videoInputRef.current.value = '';
//         }
//         return;
//       }

//       // Check file size (2MB = 2 * 1024 * 1024 bytes)
//       const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//       if (file.size > maxSize) {
//         alert(`❌ Video file size is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Please upload a video less than 2MB.`);
//         if (videoInputRef.current) {
//           videoInputRef.current.value = '';
//         }
//         return;
//       }

//       setProductVideo(file);
//       const previewUrl = URL.createObjectURL(file);
//       setProductVideoPreview(previewUrl);
//     }
//   };


//   // Clean up object URLs on unmount
//   useEffect(() => {
//     return () => {
//       if (categoryImagePreview) URL.revokeObjectURL(categoryImagePreview);
//       if (subCategoryImagePreview) URL.revokeObjectURL(subCategoryImagePreview);


//       targetPestsDiseases.forEach(pest => {
//         if (pest.image && pest.image.startsWith('blob:')) {
//           URL.revokeObjectURL(pest.image);
//         }
//       });

//       recommendedSeeds.forEach(seed => {
//         if (seed.image && seed.image.startsWith('blob:')) {
//           URL.revokeObjectURL(seed.image);
//         }
//       });
//     };
//   }, [categoryImagePreview, subCategoryImagePreview, targetPestsDiseases, recommendedSeeds]);

//   // Fetch all data
//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/categories`),
//         axios.get(`${API_BASE_URL}/subcategories`),
//         axios.get(`${API_BASE_URL}/products`)
//       ]);

//       // Safely set data with validation
//       if (categoriesRes.data?.success) {
//         setCategories(categoriesRes.data.data || []);
//       }

//       if (subcategoriesRes.data?.success) {
//         setSubCategories(subcategoriesRes.data.data || []);
//       }

//       if (productsRes.data?.success) {
//         // Filter out any null products
//         const validProducts = (productsRes.data.data || []).filter((product: Product) =>
//           product && product._id
//         );
//         setProducts(validProducts);
//       }

//       // Calculate summary
//       setSummary({
//         categories: categoriesRes.data?.success ? (categoriesRes.data.data || []).length : 0,
//         subCategories: subcategoriesRes.data?.success ? (subcategoriesRes.data.data || []).length : 0,
//         products: productsRes.data?.success ? (productsRes.data.data || []).length : 0
//       });
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       alert('Failed to fetch data. Please check console for details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle category image upload
//   const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCategoryImage(file);
//       const previewUrl = URL.createObjectURL(file);
//       setCategoryImagePreview(previewUrl);
//     }
//   };

//   // Handle subcategory image upload
//   const handleSubCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSubCategoryImage(file);
//       const previewUrl = URL.createObjectURL(file);
//       setSubCategoryImagePreview(previewUrl);
//     }
//   };

//   // Handle pest image upload
//   const handlePestImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const newPests = [...targetPestsDiseases];
//       newPests[index] = {
//         ...newPests[index],
//         imageFile: file,
//         image: URL.createObjectURL(file)
//       };
//       setTargetPestsDiseases(newPests);
//     }
//   };

//   // Handle seed image upload
//   const handleSeedImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const newSeeds = [...recommendedSeeds];
//       newSeeds[index] = {
//         ...newSeeds[index],
//         imageFile: file,
//         image: URL.createObjectURL(file)
//       };
//       setRecommendedSeeds(newSeeds);
//     }
//   };

//   // Add new target pest/disease field
//   const addTargetPestDisease = () => {
//     setTargetPestsDiseases([
//       ...targetPestsDiseases,
//       { name: '', image: '', imageFile: null }
//     ]);
//   };

//   // Remove target pest/disease field
//   const removeTargetPestDisease = (index: number) => {
//     if (targetPestsDiseases.length > 1) {
//       const newPests = [...targetPestsDiseases];
//       newPests.splice(index, 1);
//       setTargetPestsDiseases(newPests);
//     }
//   };

//   // Handle target pest/disease change
//   const handleTargetPestDiseaseChange = (index: number, field: keyof TargetPestDisease, value: string) => {
//     const newPests = [...targetPestsDiseases];
//     newPests[index] = { ...newPests[index], [field]: value };
//     setTargetPestsDiseases(newPests);
//   };

//   // Add new recommended seed field
//   const addRecommendedSeed = () => {
//     setRecommendedSeeds([
//       ...recommendedSeeds,
//       {
//         name: '',
//         image: '',
//         imageFile: null,
//         stock: 0,
//         unit: 'kg',
//         customUnit: '',
//         weight: 0,
//         weightUnit: 'kg',
//         listPrice: 0,
//         discount: 0,
//         profit: 0,
//         tax: 18,
//         customTax: undefined,
//         finalPrice: 0
//       }
//     ]);
//   };

//   // Remove recommended seed field
//   const removeRecommendedSeed = (index: number) => {
//     if (recommendedSeeds.length > 1) {
//       const newSeeds = [...recommendedSeeds];
//       newSeeds.splice(index, 1);
//       setRecommendedSeeds(newSeeds);
//     }
//   };

//   // Handle recommended seed change with auto-calculation
//   const handleRecommendedSeedChange = (index: number, field: keyof RecommendedSeed, value: string | number) => {
//     const newSeeds = [...recommendedSeeds];
//     newSeeds[index] = { ...newSeeds[index], [field]: value };

//     // Auto-calculate final price when pricing fields change
//     if (['listPrice', 'discount', 'profit', 'tax', 'customTax'].includes(field)) {
//       const seed = newSeeds[index];
//       const discountAmount = (seed.listPrice * seed.discount) / 100;
//       const priceAfterDiscount = seed.listPrice - discountAmount;
//       const profitAmount = (priceAfterDiscount * seed.profit) / 100;
//       const basePrice = priceAfterDiscount + profitAmount;

//       // Use custom tax if tax is 0 (other option)
//       const taxRate = seed.tax === 0 ? (seed.customTax || 0) : seed.tax;
//       const taxAmount = (basePrice * taxRate) / 100;

//       const finalPrice = basePrice + taxAmount;
//       newSeeds[index].finalPrice = parseFloat(finalPrice.toFixed(2));
//     }

//     setRecommendedSeeds(newSeeds);
//   };

//   // Clear category form
//   const clearCategoryForm = () => {
//     setCategoryName('');
//     setCategoryImage(null);
//     setCategoryImagePreview('');
//     setExistingCategoryImage('');
//     setEditMode(false);
//     setCurrentEditId('');
//     if (categoryFileInputRef.current) {
//       categoryFileInputRef.current.value = '';
//     }
//   };

//   // Clear subcategory form
//   const clearSubCategoryForm = () => {
//     setSubCategoryName('');
//     setSubCategoryImage(null);
//     setSubCategoryImagePreview('');
//     setExistingSubCategoryImage('');
//     setSelectedCategory('');
//     setEditMode(false);
//     setCurrentEditId('');
//     if (subCategoryFileInputRef.current) {
//       subCategoryFileInputRef.current.value = '';
//     }
//   };

//   // Clear product form
//   const clearProductForm = () => {
//     setProductName('');
//     setProductDescription('');
//     setProductVideo(null); // Add this
//     setProductVideoPreview(''); // Add this
//     setExistingProductVideo(''); // Add this
//     setVideoError('');
//     setSelectedSubCategory('');
//     setTargetPestsDiseases([{ name: '', image: '', imageFile: null }]);
//     setRecommendedSeeds([{
//       name: '',
//       image: '',
//       imageFile: null,
//       stock: 0,
//       unit: 'kg',
//       customUnit: '',
//       weight: 0,
//       weightUnit: 'kg',
//       listPrice: 0,
//       discount: 0,
//       profit: 0,
//       tax: 18,
//       customTax: undefined,
//       finalPrice: 0
//     }]);
//     setEditMode(false);
//     setCurrentEditId('');

//     if (videoInputRef.current) {
//       videoInputRef.current.value = '';
//     }
//   };

//   // Handle edit category
//   const handleEditCategory = (category: Category) => {
//     setCategoryName(category.name);
//     setCategoryImagePreview(category.image || '');
//     setExistingCategoryImage(category.image || '');
//     setEditMode(true);
//     setCurrentEditId(category._id);
//     setActiveTab('category');
//   };

//   // Handle edit subcategory
//   const handleEditSubCategory = (subCategory: SubCategory) => {
//     setSubCategoryName(subCategory.name);
//     setSubCategoryImagePreview(subCategory.image || '');
//     setExistingSubCategoryImage(subCategory.image || '');
//     setSelectedCategory(typeof subCategory.categoryId === 'string' ? subCategory.categoryId : subCategory.categoryId._id);
//     setEditMode(true);
//     setCurrentEditId(subCategory._id);
//     setActiveTab('subCategory');
//   };

//   // Handle edit product
//   const handleEditProduct = (product: Product) => {
//     setProductName(product.name);
//     setProductDescription(product.description || '');
//     setProductVideoPreview(product.video || ''); // Add this
//     setExistingProductVideo(product.video || ''); // Add this
//     setSelectedSubCategory(typeof product.subCategoryId === 'string' ? product.subCategoryId : product.subCategoryId._id);
//     setTargetPestsDiseases(product.targetPestsDiseases.length > 0 ? product.targetPestsDiseases.map(p => ({ ...p, imageFile: null })) : [{ name: '', image: '', imageFile: null }]);

//     // Update recommended seeds mapping
//     setRecommendedSeeds(product.recommendedSeeds.length > 0 ? product.recommendedSeeds.map(s => ({
//       ...s,
//       imageFile: null,
//       stock: s.stock || 0,
//       unit: s.unit || 'kg',
//       customUnit: s.customUnit || '',
//       weight: s.weight || 0,
//       weightUnit: s.weightUnit || 'kg',
//       listPrice: s.listPrice || 0,
//       discount: s.discount || 0,
//       profit: s.profit || 0,
//       tax: s.tax || 18,
//       customTax: s.customTax || undefined,
//       finalPrice: s.finalPrice || 0
//     })) : [{
//       name: '',
//       image: '',
//       imageFile: null,
//       stock: 0,
//       unit: 'kg',
//       customUnit: '',
//       weight: 0,
//       weightUnit: 'kg',
//       listPrice: 0,
//       discount: 0,
//       profit: 0,
//       tax: 18,
//       customTax: undefined,
//       finalPrice: 0
//     }]);

//     setEditMode(true);
//     setCurrentEditId(product._id);
//     setActiveTab('product');
//   };

//   // Handle status change
//   const handleStatusChange = async (type: 'category' | 'subcategory' | 'product', id: string, status: 'draft' | 'active' | 'inactive') => {
//     if (!confirm(`Are you sure you want to change status to ${status}?`)) return;

//     try {
//       setLoading(true);
//       const endpoint = `${API_BASE_URL}/${type}s?id=${id}`;
//       const response = await axios.patch(endpoint, { status });

//       if (response.data.success) {
//         alert(`Status updated successfully to ${status}`);
//         fetchAllData();
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error updating status:', error);
//       alert(`Failed to update status: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async (type: 'category' | 'subcategory' | 'product', id: string, name: string) => {
//     if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

//     try {
//       setLoading(true);

//       // Map to the correct API endpoints under /api/cropcare/
//       const endpointMap = {
//         'category': `${API_BASE_URL}/categories?id=${id}`,
//         'subcategory': `${API_BASE_URL}/subcategories?id=${id}`,
//         'product': `${API_BASE_URL}/products?id=${id}`
//       };

//       const endpoint = endpointMap[type];

//       console.log('Deleting:', { type, id, endpoint }); // Debug log

//       const response = await axios.delete(endpoint);

//       if (response.data.success) {
//         alert(`"${name}" deleted successfully`);
//         fetchAllData(); // Refresh data
//       } else {
//         throw new Error(response.data.message || 'Delete failed');
//       }
//     } catch (error: any) {
//       console.error('Error deleting:', error);

//       // Better error message
//       const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
//       alert(`Failed to delete: ${errorMsg}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add/Update Category
//   const handleAddCategory = async () => {
//     if (!categoryName.trim()) {
//       alert('Please enter category name');
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', categoryName.trim());
//       formData.append('status', 'active');

//       if (categoryImage) {
//         formData.append('image', categoryImage);
//       }

//       if (editMode) {
//         formData.append('existingImage', existingCategoryImage);
//       }

//       let response;
//       if (editMode && currentEditId) {
//         response = await axios.put(`${API_BASE_URL}/categories?id=${currentEditId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         response = await axios.post(`${API_BASE_URL}/categories`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }

//       if (response.data.success) {
//         alert(`Category ${editMode ? 'updated' : 'added'} successfully!`);
//         clearCategoryForm();
//         fetchAllData();
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error saving category:', error);
//       alert(`Failed to ${editMode ? 'update' : 'add'} category: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add/Update Sub Category
//   const handleAddSubCategory = async () => {
//     if (!subCategoryName.trim() || !selectedCategory) {
//       alert('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', subCategoryName.trim());
//       formData.append('categoryId', selectedCategory);
//       formData.append('status', 'active');

//       if (subCategoryImage) {
//         formData.append('image', subCategoryImage);
//       }

//       if (editMode) {
//         formData.append('existingImage', existingSubCategoryImage);
//       }

//       let response;
//       if (editMode && currentEditId) {
//         response = await axios.put(`${API_BASE_URL}/subcategories?id=${currentEditId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         response = await axios.post(`${API_BASE_URL}/subcategories`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }

//       if (response.data.success) {
//         alert(`Sub Category ${editMode ? 'updated' : 'added'} successfully!`);
//         clearSubCategoryForm();
//         fetchAllData();
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error saving subcategory:', error);
//       alert(`Failed to ${editMode ? 'update' : 'add'} subcategory: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add/Update Product
//   const handleAddProduct = async () => {
//     if (!productName.trim() || !selectedSubCategory) {
//       alert('Please fill all required fields');
//       return;
//     }

//     // Validate target pests/diseases
//     const validPests = targetPestsDiseases.filter(pest => pest.name.trim());
//     if (validPests.length === 0) {
//       alert('Please add at least one target pest/disease');
//       return;
//     }

//     // Validate recommended seeds
//     const validSeeds = recommendedSeeds.filter(seed => seed.name.trim());
//     if (validSeeds.length === 0) {
//       alert('Please add at least one recommended seed');
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', productName.trim());
//       formData.append('description', productDescription.trim());
//       formData.append('subCategoryId', selectedSubCategory);
//       formData.append('status', 'active');

//       // Add video to formData - THIS WAS MISSING!
//       if (productVideo) {
//         formData.append('video', productVideo);
//       }

//       if (editMode && existingProductVideo) {
//         formData.append('existingVideo', existingProductVideo);
//       }

//       // Append pest data with images as files
//       validPests.forEach((pest, index) => {
//         formData.append(`pestName_${index}`, pest.name.trim());

//         if (pest.imageFile) {
//           // New image file
//           formData.append(`pestImage_${index}`, pest.imageFile);
//         } else if (pest.image && !pest.image.startsWith('blob:')) {
//           // Existing image URL (for edit mode)
//           formData.append(`existingPestImage_${index}`, pest.image);
//         }
//       });

//       // Append seed data with new fields
//       validSeeds.forEach((seed, index) => {
//         formData.append(`seedName_${index}`, seed.name.trim());
//         formData.append(`stock_${index}`, seed.stock.toString());
//         formData.append(`unit_${index}`, seed.unit);
//         if (seed.customUnit) {
//           formData.append(`customUnit_${index}`, seed.customUnit);
//         }
//         formData.append(`weight_${index}`, seed.weight.toString());
//         formData.append(`weightUnit_${index}`, seed.weightUnit);
//         formData.append(`listPrice_${index}`, seed.listPrice.toString());
//         formData.append(`discount_${index}`, seed.discount.toString());
//         formData.append(`profit_${index}`, seed.profit.toString());
//         formData.append(`tax_${index}`, seed.tax.toString());
//         if (seed.customTax !== undefined) {
//           formData.append(`customTax_${index}`, seed.customTax.toString());
//         }
//         formData.append(`finalPrice_${index}`, seed.finalPrice.toString());

//         if (seed.imageFile) {
//           formData.append(`seedImage_${index}`, seed.imageFile);
//         } else if (seed.image && !seed.image.startsWith('blob:')) {
//           formData.append(`existingSeedImage_${index}`, seed.image);
//         }
//       });

//       let response;
//       if (editMode && currentEditId) {
//         response = await axios.put(`${API_BASE_URL}/products?id=${currentEditId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         response = await axios.post(`${API_BASE_URL}/products`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }

//       if (response.data.success) {
//         alert(`Product ${editMode ? 'updated' : 'added'} successfully!`);
//         clearProductForm();
//         fetchAllData();
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error saving product:', error);
//       alert(`Failed to ${editMode ? 'update' : 'add'} product: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get category name by ID
//   const getCategoryName = (categoryId: string) => {
//     if (!categoryId) return 'Unknown';
//     const category = categories.find(cat => cat._id === categoryId);
//     return category ? category.name : 'Unknown';
//   };

//   // Get subcategory name by ID
//   const getSubCategoryName = (subCategoryId: string) => {
//     if (!subCategoryId) return 'Unknown';

//     // First check in subCategories array
//     const subCategory = subCategories.find(sub => sub._id === subCategoryId);
//     if (subCategory) return subCategory.name;

//     // Then check in products (for cases where subCategory might not be loaded separately)
//     const product = products.find(prod => {
//       if (!prod || !prod.subCategoryId) return false;
//       if (typeof prod.subCategoryId === 'string') {
//         return prod.subCategoryId === subCategoryId;
//       } else {
//         return prod.subCategoryId && prod.subCategoryId._id === subCategoryId;
//       }
//     });

//     return product && product.subCategoryId && typeof product.subCategoryId !== 'string'
//       ? product.subCategoryId.name
//       : 'Unknown';
//   };

//   // Count subcategories for a category
//   const countSubCategoriesForCategory = (catId: string) => {
//     if (!catId) return 0;

//     return subCategories.filter(sub => {
//       if (!sub || !sub.categoryId) return false;

//       if (typeof sub.categoryId === 'string') {
//         return sub.categoryId === catId;
//       } else {
//         return sub.categoryId && sub.categoryId._id === catId;
//       }
//     }).length;
//   };

//   // Count products for a subcategory
//   const countProductsForSubCategory = (subCategoryId: string) => {
//     if (!subCategoryId) return 0;

//     return products.filter(prod => {
//       if (!prod || !prod.subCategoryId) return false;

//       if (typeof prod.subCategoryId === 'string') {
//         return prod.subCategoryId === subCategoryId;
//       } else {
//         return prod.subCategoryId && prod.subCategoryId._id === subCategoryId;
//       }
//     }).length;
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get status badge color
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return '#28a745';
//       case 'inactive': return '#dc3545';
//       case 'draft': return '#6c757d';
//       default: return '#6c757d';
//     }
//   };

//   const toggleCategory = (categoryId: string) => {
//     const newExpanded = new Set(expandedCategories);
//     if (newExpanded.has(categoryId)) {
//       newExpanded.delete(categoryId);
//     } else {
//       newExpanded.add(categoryId);
//     }
//     setExpandedCategories(newExpanded);
//   };

//   return (
//     <div className="crop-care-container">
//       <h1 className="main-title">🌱 Crop Care Management System</h1>
//       <p className="subtitle">Admin Panel - Manage Crop Care Medicines & Recommendations</p>

//       {loading && (
//         <div className="loading-overlay">
//           <div className="spinner"></div>
//           <p>Loading...</p>
//         </div>
//       )}

//       {/* Tabs Navigation */}
//       <div className="tabs-container">
//         <button
//           className={`tab-btn ${activeTab === 'category' ? 'active' : ''}`}
//           onClick={() => setActiveTab('category')}
//           disabled={loading}
//         >
//           📁 {editMode && activeTab === 'category' ? 'Edit' : 'Add'} Category
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'subCategory' ? 'active' : ''}`}
//           onClick={() => setActiveTab('subCategory')}
//           disabled={loading}
//         >
//           📂 {editMode && activeTab === 'subCategory' ? 'Edit' : 'Add'} Sub Category
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'product' ? 'active' : ''}`}
//           onClick={() => setActiveTab('product')}
//           disabled={loading}
//         >
//           📦 {editMode && activeTab === 'product' ? 'Edit' : 'Add'} Product
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
//           onClick={() => setActiveTab('view')}
//           disabled={loading}
//         >
//           👁️ View All Data
//         </button>
//       </div>

//       {/* Category Tab (Unchanged) */}
//       {activeTab === 'category' && (
//         <div className="tab-content">
//           <h2>{editMode ? 'Edit' : 'Add New'} Category</h2>
//           <div className="form-card">
//             <div className="form-group">
//               <label htmlFor="categoryName">Category Name *</label>
//               <input
//                 type="text"
//                 id="categoryName"
//                 value={categoryName}
//                 onChange={(e) => setCategoryName(e.target.value)}
//                 placeholder="e.g., Pesticides, Fertilizers, Growth Promoters"
//                 disabled={loading}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="categoryImage">Category Image</label>
//               <div className="image-upload-container">
//                 <input
//                   type="file"
//                   id="categoryImage"
//                   ref={categoryFileInputRef}
//                   onChange={handleCategoryImageUpload}
//                   accept="image/*"
//                   className="file-input"
//                   disabled={loading}
//                 />
//                 <div className="upload-area" onClick={() => !loading && categoryFileInputRef.current?.click()}>
//                   {categoryImagePreview || existingCategoryImage ? (
//                     <div className="image-preview">
//                       <img src={categoryImagePreview || existingCategoryImage} alt="Preview" />
//                     </div>
//                   ) : (
//                     <div className="upload-placeholder">
//                       <div className="upload-icon">📁</div>
//                       <p>Click to upload image</p>
//                       <p className="upload-hint">Supports: JPG, PNG, WebP</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="form-actions">
//               <button
//                 className="submit-btn"
//                 onClick={handleAddCategory}
//                 disabled={loading}
//               >
//                 {editMode ? '🔄 Update' : '➕ Add'} Category
//               </button>
//               <button
//                 className="clear-btn"
//                 onClick={clearCategoryForm}
//                 disabled={loading}
//               >
//                 🗑️ {editMode ? 'Cancel Edit' : 'Clear Form'}
//               </button>
//             </div>
//           </div>

//           {/* Categories List */}
//           <div className="data-section">
//             <div className="section-header">
//               <h3>Existing Categories ({categories.length})</h3>
//               <button
//                 className="refresh-btn"
//                 onClick={fetchAllData}
//                 disabled={loading}
//               >
//                 🔄 Refresh
//               </button>
//             </div>

//             {categories.length === 0 ? (
//               <p className="no-data">No categories added yet.</p>
//             ) : (
//               <div className="table-container">
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Image</th>
//                       <th>Status</th>
//                       <th>Sub Categories</th>
//                       <th>Created</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {categories.map((category) => (
//                       <tr key={category._id}>
//                         <td>
//                           <div className="item-name">{category.name}</div>
//                         </td>
//                         <td>
//                           {category.image ? (
//                             <img src={category.image} alt={category.name} className="table-image" />
//                           ) : (
//                             <span className="no-image">No Image</span>
//                           )}
//                         </td>
//                         <td>
//                           <select
//                             value={category.status}
//                             onChange={(e) => handleStatusChange('category', category._id, e.target.value as any)}
//                             className="status-select"
//                             style={{ backgroundColor: getStatusColor(category.status) }}
//                             disabled={loading}
//                           >
//                             <option value="draft">Draft</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                           </select>
//                         </td>
//                         <td>
//                           <span className="count-badge">
//                             {countSubCategoriesForCategory(category._id)}
//                           </span>
//                         </td>
//                         <td>
//                           {formatDate(category.createdAt)}
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button
//                               className="edit-btn"
//                               onClick={() => handleEditCategory(category)}
//                               disabled={loading}
//                               title="Edit"
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDelete('category', category._id, category.name)}
//                               disabled={loading}
//                               title="Delete"
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Sub Category Tab (Unchanged) */}
//       {activeTab === 'subCategory' && (
//         <div className="tab-content">
//           <h2>{editMode ? 'Edit' : 'Add New'} Sub Category</h2>
//           <div className="form-card">
//             <div className="form-group">
//               <label htmlFor="parentCategory">Select Parent Category *</label>
//               <select
//                 id="parentCategory"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 disabled={loading || categories.length === 0}
//               >
//                 <option value="">-- Select Category --</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name} ({category.status})
//                   </option>
//                 ))}
//               </select>
//               {categories.length === 0 && (
//                 <p className="form-hint">No categories available. Please add a category first.</p>
//               )}
//             </div>

//             <div className="form-group">
//               <label htmlFor="subCategoryName">Sub Category Name *</label>
//               <input
//                 type="text"
//                 id="subCategoryName"
//                 value={subCategoryName}
//                 onChange={(e) => setSubCategoryName(e.target.value)}
//                 placeholder="e.g., Insecticides, Fungicides, Weedicides"
//                 disabled={loading}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="subCategoryImage">Sub Category Image</label>
//               <div className="image-upload-container">
//                 <input
//                   type="file"
//                   id="subCategoryImage"
//                   ref={subCategoryFileInputRef}
//                   onChange={handleSubCategoryImageUpload}
//                   accept="image/*"
//                   className="file-input"
//                   disabled={loading}
//                 />
//                 <div className="upload-area" onClick={() => !loading && subCategoryFileInputRef.current?.click()}>
//                   {subCategoryImagePreview || existingSubCategoryImage ? (
//                     <div className="image-preview">
//                       <img src={subCategoryImagePreview || existingSubCategoryImage} alt="Preview" />
//                     </div>
//                   ) : (
//                     <div className="upload-placeholder">
//                       <div className="upload-icon">📂</div>
//                       <p>Click to upload image</p>
//                       <p className="upload-hint">Supports: JPG, PNG, WebP</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="form-actions">
//               <button
//                 className="submit-btn"
//                 onClick={handleAddSubCategory}
//                 disabled={loading || !selectedCategory}
//               >
//                 {editMode ? '🔄 Update' : '➕ Add'} Sub Category
//               </button>
//               <button
//                 className="clear-btn"
//                 onClick={clearSubCategoryForm}
//                 disabled={loading}
//               >
//                 🗑️ {editMode ? 'Cancel Edit' : 'Clear Form'}
//               </button>
//             </div>
//           </div>

//           {/* Sub Categories List */}
//           <div className="data-section">
//             <div className="section-header">
//               <h3>Existing Sub Categories ({subCategories.length})</h3>
//               <button
//                 className="refresh-btn"
//                 onClick={fetchAllData}
//                 disabled={loading}
//               >
//                 🔄 Refresh
//               </button>
//             </div>

//             {subCategories.length === 0 ? (
//               <p className="no-data">No sub categories added yet.</p>
//             ) : (
//               <div className="table-container">
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Parent Category</th>
//                       <th>Image</th>
//                       <th>Status</th>
//                       <th>Products</th>
//                       <th>Created</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subCategories.map((subCategory) => (
//                       <tr key={subCategory._id}>
//                         <td>
//                           <div className="item-name">{subCategory.name}</div>
//                         </td>
//                         <td>
//                           {typeof subCategory.categoryId === 'string'
//                             ? getCategoryName(subCategory.categoryId)
//                             : (subCategory.categoryId?.name || "Unassigned")
//                           }
//                         </td>
//                         <td>
//                           {subCategory.image ? (
//                             <img src={subCategory.image} alt={subCategory.name} className="table-image" />
//                           ) : (
//                             <span className="no-image">No Image</span>
//                           )}
//                         </td>
//                         <td>
//                           <select
//                             value={subCategory.status}
//                             onChange={(e) => handleStatusChange('subcategory', subCategory._id, e.target.value as any)}
//                             className="status-select"
//                             style={{ backgroundColor: getStatusColor(subCategory.status) }}
//                             disabled={loading}
//                           >
//                             <option value="draft">Draft</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                           </select>
//                         </td>
//                         <td>
//                           <span className="count-badge">
//                             {countProductsForSubCategory(subCategory._id)}
//                           </span>
//                         </td>
//                         <td>
//                           {formatDate(subCategory.createdAt)}
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button
//                               className="edit-btn"
//                               onClick={() => handleEditSubCategory(subCategory)}
//                               disabled={loading}
//                               title="Edit"
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDelete('subcategory', subCategory._id, subCategory.name)}
//                               disabled={loading}
//                               title="Delete"
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* UPDATED: Product Tab with new fields */}
//       {activeTab === 'product' && (
//         <div className="tab-content">
//           <h2>{editMode ? 'Edit' : 'Add New'} Product</h2>
//           <div className="form-card">
//             <div className="form-group">
//               <label htmlFor="productName">Product Name *</label>
//               <input
//                 type="text"
//                 id="productName"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 placeholder="e.g., Neem Oil, NPK Fertilizer, etc."
//                 disabled={loading}
//               />
//             </div>

//             {/* NEW: Product Description Field */}
//             <div className="form-group">
//               <label htmlFor="productDescription">Product Description</label>
//               <textarea
//                 id="productDescription"
//                 value={productDescription}
//                 onChange={(e) => setProductDescription(e.target.value)}
//                 placeholder="Enter detailed description about the product..."
//                 rows={4}
//                 disabled={loading}
//               />
//             </div>




//             {/* Product Video Upload Field - SIMPLIFIED VERSION */}
//             <div className="form-group">
//               <label htmlFor="productVideo">Product Video (Max 2MB)</label>
//               <div className="image-upload-container">
//                 <input
//                   type="file"
//                   id="productVideo"
//                   ref={videoInputRef}
//                   onChange={handleProductVideoUpload}
//                   accept="video/*"
//                   className="file-input"
//                   disabled={loading}
//                 />
//                 <div className="upload-area" onClick={() => !loading && videoInputRef.current?.click()}>
//                   {productVideoPreview || existingProductVideo ? (
//                     <div className="image-preview">
//                       <div className="selected-file">
//                         <div className="file-icon">🎬</div>
//                         <div className="file-info">
//                           <p className="file-name">
//                             {productVideo?.name || 'Video selected'}
//                           </p>
//                           <p className="file-size">
//                             {productVideo?.size ? `Size: ${(productVideo.size / (1024 * 1024)).toFixed(2)} MB` : 'Video ready'}
//                           </p>
//                           <p className="upload-hint">Click to change video</p>
//                         </div>
//                         <div className="checkmark">✓</div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="upload-placeholder">
//                       <div className="upload-icon">🎬</div>
//                       <p>Click to upload video</p>
//                       <p className="upload-hint">Max size: 2MB | Supports: MP4, WebM, MOV</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>












//             <div className="form-group">
//               <label htmlFor="subCategorySelect">Select Sub Category *</label>
//               <select
//                 id="subCategorySelect"
//                 value={selectedSubCategory}
//                 onChange={(e) => setSelectedSubCategory(e.target.value)}
//                 disabled={loading || subCategories.length === 0}
//               >
//                 <option value="">-- Select Sub Category --</option>
//                 {subCategories.map((subCategory) => (
//                   <option key={subCategory._id} value={subCategory._id}>
//                     {subCategory.name} ({typeof subCategory.categoryId === 'string'
//                       ? getCategoryName(subCategory.categoryId)
//                       : subCategory.categoryId.name
//                     })
//                   </option>
//                 ))}
//               </select>
//               {subCategories.length === 0 && (
//                 <p className="form-hint">No sub categories available. Please add a sub category first.</p>
//               )}
//             </div>

//             {/* Target Pests/Diseases Section */}
//             <div className="dynamic-section">
//               <h3>Target Pests/Diseases *</h3>
//               {targetPestsDiseases.map((pest, index) => (
//                 <div key={index} className="dynamic-field-group">
//                   <div className="form-group">
//                     <label>Pest/Disease Name</label>
//                     <input
//                       type="text"
//                       value={pest.name}
//                       onChange={(e) => handleTargetPestDiseaseChange(index, 'name', e.target.value)}
//                       placeholder="e.g., Aphids, Powdery Mildew"
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Image</label>
//                     <div className="image-upload-container">
//                       <input
//                         type="file"
//                         ref={(el) => {
//                           pestImageInputRefs.current[index] = el;
//                         }}
//                         onChange={(e) => handlePestImageUpload(index, e)}
//                         accept="image/*"
//                         className="file-input"
//                         disabled={loading}
//                       />
//                       <div
//                         className="upload-area small"
//                         onClick={() =>
//                           !loading && pestImageInputRefs.current[index]?.click()
//                         }
//                       >
//                         {pest.image ? (
//                           <div className="image-preview">
//                             <img src={pest.image} alt="Preview" />
//                           </div>
//                         ) : (
//                           <div className="upload-placeholder">
//                             <div className="upload-icon">🖼️</div>
//                             <p className="upload-hint">Click to upload</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   {targetPestsDiseases.length > 1 && (
//                     <button
//                       type="button"
//                       className="remove-btn"
//                       onClick={() => removeTargetPestDisease(index)}
//                       disabled={loading}
//                     >
//                       🗑️ Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="add-btn"
//                 onClick={addTargetPestDisease}
//                 disabled={loading}
//               >
//                 ➕ Add Another Pest/Disease
//               </button>
//             </div>

//             {/* UPDATED: Recommended Seeds Section with new fields */}
//             <div className="dynamic-section">
//               <h3>Recommended Seeds *</h3>
//               {recommendedSeeds.map((seed, index) => (
//                 <div key={index} className="dynamic-field-group">
//                   <div className="seed-section-header">
//                     <h4>Seed #{index + 1}</h4>
//                     {recommendedSeeds.length > 1 && (
//                       <button
//                         type="button"
//                         className="remove-btn"
//                         onClick={() => removeRecommendedSeed(index)}
//                         disabled={loading}
//                       >
//                         🗑️ Remove Seed
//                       </button>
//                     )}
//                   </div>

//                   <div className="grid-container">
//                     {/* Row 1: Basic Info */}
//                     <div className="form-group">
//                       <label>Seed Name *</label>
//                       <input
//                         type="text"
//                         value={seed.name}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'name', e.target.value)}
//                         placeholder="e.g., Hybrid Maize, Bt Cotton"
//                         disabled={loading}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Stock Quantity</label>
//                       <input
//                         type="number"
//                         value={seed.stock}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'stock', parseInt(e.target.value) || 0)}
//                         placeholder="0"
//                         min="0"
//                         disabled={loading}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Unit *</label>
//                       <select
//                         value={seed.unit}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'unit', e.target.value)}
//                         disabled={loading}
//                       >
//                         {UNIT_OPTIONS.map(unit => (
//                           <option key={unit} value={unit}>
//                             {unit.charAt(0).toUpperCase() + unit.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                       {seed.unit === 'other' && (
//                         <input
//                           type="text"
//                           value={seed.customUnit || ''}
//                           onChange={(e) => handleRecommendedSeedChange(index, 'customUnit', e.target.value)}
//                           placeholder="Enter custom unit"
//                           className="custom-unit-input"
//                           disabled={loading}
//                         />
//                       )}
//                     </div>

//                     <div className="form-group">
//                       <label>Image</label>
//                       <div className="image-upload-container">
//                         <input
//                           type="file"
//                           ref={(el) => {
//                             seedImageInputRefs.current[index] = el;
//                           }}
//                           onChange={(e) => handleSeedImageUpload(index, e)}
//                           accept="image/*"
//                           className="file-input"
//                           disabled={loading}
//                         />
//                         <div
//                           className="upload-area small"
//                           onClick={() =>
//                             !loading && seedImageInputRefs.current[index]?.click()
//                           }
//                         >
//                           {seed.image ? (
//                             <div className="image-preview">
//                               <img src={seed.image} alt="Preview" />
//                             </div>
//                           ) : (
//                             <div className="upload-placeholder">
//                               <div className="upload-icon">🖼️</div>
//                               <p className="upload-hint">Click to upload</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid-container">
//                     {/* Row 2: Weight */}
//                     <div className="form-group">
//                       <label>Weight</label>
//                       <div className="weight-input-group">
//                         <input
//                           type="number"
//                           value={seed.weight}
//                           onChange={(e) => handleRecommendedSeedChange(index, 'weight', parseFloat(e.target.value) || 0)}
//                           placeholder="0"
//                           min="0"
//                           step="0.01"
//                           disabled={loading}
//                         />
//                         <select
//                           value={seed.weightUnit}
//                           onChange={(e) => handleRecommendedSeedChange(index, 'weightUnit', e.target.value)}
//                           disabled={loading}
//                           className="weight-unit-select"
//                         >
//                           <option value="kg">kg</option>
//                           <option value="gram">gram</option>
//                           <option value="pound">pound</option>
//                           <option value="liter">liter</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="form-group">
//                       <label>List Price (₹) *</label>
//                       <input
//                         type="number"
//                         value={seed.listPrice}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'listPrice', parseFloat(e.target.value) || 0)}
//                         placeholder="0.00"
//                         min="0"
//                         step="0.01"
//                         disabled={loading}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Discount (%)</label>
//                       <input
//                         type="number"
//                         value={seed.discount}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'discount', parseFloat(e.target.value) || 0)}
//                         placeholder="0"
//                         min="0"
//                         max="100"
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>

//                   <div className="grid-container">
//                     {/* Row 3: Profit & Tax */}
//                     <div className="form-group">
//                       <label>Profit (%)</label>
//                       <input
//                         type="number"
//                         value={seed.profit}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'profit', parseFloat(e.target.value) || 0)}
//                         placeholder="0"
//                         min="0"
//                         disabled={loading}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Tax (%) *</label>
//                       <select
//                         value={seed.tax}
//                         onChange={(e) => handleRecommendedSeedChange(index, 'tax', parseInt(e.target.value) || 0)}
//                         disabled={loading}
//                       >
//                         {TAX_OPTIONS.map(tax => (
//                           <option key={tax.value} value={tax.value}>
//                             {tax.label}
//                           </option>
//                         ))}
//                       </select>
//                       {seed.tax === 0 && (
//                         <input
//                           type="number"
//                           value={seed.customTax || ''}
//                           onChange={(e) => handleRecommendedSeedChange(index, 'customTax', parseFloat(e.target.value) || 0)}
//                           placeholder="Enter tax percentage"
//                           min="0"
//                           step="0.01"
//                           className="custom-tax-input"
//                           disabled={loading}
//                         />
//                       )}
//                     </div>

//                     <div className="form-group">
//                       <label>Final Price (₹)</label>
//                       <div className="final-price-display">
//                         ₹ {seed.finalPrice.toFixed(2)}
//                         <div className="price-breakdown">
//                           <small>
//                             List: ₹{seed.listPrice.toFixed(2)} |
//                             After {seed.discount}% Discount: ₹{(seed.listPrice - (seed.listPrice * seed.discount / 100)).toFixed(2)} |
//                             After {seed.profit}% Profit: ₹{((seed.listPrice - (seed.listPrice * seed.discount / 100)) + ((seed.listPrice - (seed.listPrice * seed.discount / 100)) * seed.profit / 100)).toFixed(2)} |
//                             Tax: {(seed.tax === 0 ? seed.customTax || 0 : seed.tax)}%
//                           </small>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="add-btn"
//                 onClick={addRecommendedSeed}
//                 disabled={loading}
//               >
//                 ➕ Add Another Recommended Seed
//               </button>
//             </div>

//             <div className="form-actions">
//               <button
//                 className="submit-btn"
//                 onClick={handleAddProduct}
//                 disabled={loading || !selectedSubCategory}
//               >
//                 {editMode ? '🔄 Update' : '🚀 Add'} Product
//               </button>
//               <button
//                 className="clear-btn"
//                 onClick={clearProductForm}
//                 disabled={loading}
//               >
//                 🗑️ {editMode ? 'Cancel Edit' : 'Clear Form'}
//               </button>
//             </div>
//           </div>

//           {/* Products List */}
//           <div className="data-section">
//             <div className="section-header">
//               <h3>Existing Products ({products.length})</h3>
//               <button
//                 className="refresh-btn"
//                 onClick={fetchAllData}
//                 disabled={loading}
//               >
//                 🔄 Refresh
//               </button>
//             </div>

//             {products.length === 0 ? (
//               <p className="no-data">No products added yet.</p>
//             ) : (
//               <div className="table-container">
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Description</th>
//                       <th>Sub Category</th>
//                       <th>Pests/Diseases</th>
//                       <th>Recommended Seeds</th>
//                       <th>Status</th>
//                       <th>Created</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map((product) => (
//                       <tr key={product._id}>
//                         <td>
//                           <div className="item-name">{product.name}</div>
//                         </td>
//                         <td>
//                           <div className="item-description">
//                             {product.description ? (
//                               product.description.length > 50
//                                 ? `${product.description.substring(0, 50)}...`
//                                 : product.description
//                             ) : (
//                               <span className="no-data">No description</span>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           {product.subCategoryId ? (
//                             typeof product.subCategoryId === 'string'
//                               ? getSubCategoryName(product.subCategoryId)
//                               : (product.subCategoryId.name || "Unassigned")
//                           ) : "Unassigned"}
//                         </td>
//                         <td>
//                           <span className="count-badge">
//                             {product.targetPestsDiseases?.length || 0}
//                           </span>
//                         </td>
//                         <td>
//                           <span className="count-badge">
//                             {product.recommendedSeeds?.length || 0}
//                           </span>
//                         </td>
//                         <td>
//                           <select
//                             value={product.status}
//                             onChange={(e) => handleStatusChange('product', product._id, e.target.value as any)}
//                             className="status-select"
//                             style={{ backgroundColor: getStatusColor(product.status) }}
//                             disabled={loading}
//                           >
//                             <option value="draft">Draft</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                           </select>
//                         </td>
//                         <td>
//                           {formatDate(product.createdAt)}
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button
//                               className="edit-btn"
//                               onClick={() => handleEditProduct(product)}
//                               disabled={loading}
//                               title="Edit"
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDelete('product', product._id, product.name)}
//                               disabled={loading}
//                               title="Delete"
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* View Data Tab (Unchanged) */}
//       {activeTab === 'view' && (
//         <div className="tab-content">
//           <div className="section-header">
//             <h2>View All Data</h2>
//             <button
//               className="refresh-btn"
//               onClick={fetchAllData}
//               disabled={loading}
//             >
//               🔄 Refresh Data
//             </button>
//           </div>

//           {/* Summary Section */}
//           <div className="summary-section">
//             <h3>📊 System Summary</h3>
//             <div className="summary-cards">
//               <div className="summary-card">
//                 <div className="summary-icon">📁</div>
//                 <div className="summary-info">
//                   <h4>Categories</h4>
//                   <p>{summary.categories}</p>
//                 </div>
//               </div>
//               <div className="summary-card">
//                 <div className="summary-icon">📂</div>
//                 <div className="summary-info">
//                   <h4>Sub Categories</h4>
//                   <p>{summary.subCategories}</p>
//                 </div>
//               </div>
//               <div className="summary-card">
//                 <div className="summary-icon">📦</div>
//                 <div className="summary-info">
//                   <h4>Products</h4>
//                   <p>{summary.products}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Hierarchical View */}
//           <div className="hierarchical-view">
//             <h3>🌿 Hierarchical Structure</h3>
//             {categories.length === 0 ? (
//               <p className="no-data">No data available. Start by adding a category.</p>
//             ) : (
//               <div className="tree-view">
//                 {categories.map((category) => {
//                   const categorySubCategories = subCategories.filter(sub => {
//                     if (!sub || !sub.categoryId) return false;

//                     if (typeof sub.categoryId === 'string') {
//                       return sub.categoryId === category._id;
//                     } else {
//                       return sub.categoryId && sub.categoryId._id === category._id;
//                     }
//                   });

//                   return (
//                     <div key={category._id} className="tree-node">
//                       <div className="node-header" onClick={() => toggleCategory(category._id)} style={{ cursor: 'pointer' }}>
//                         <div className="node-title">
//                           <span className="node-icon">{expandedCategories.has(category._id) ? '📂' : '📁'}</span>
//                           <strong>{category.name}</strong>
//                           <span className="node-status" style={{ color: getStatusColor(category.status) }}>
//                             ({category.status})
//                           </span>
//                           <span className="count-badge" style={{ marginLeft: '10px' }}>
//                             {categorySubCategories.length} sub categories
//                           </span>
//                         </div>
//                         <div className="node-actions">
//                           <button
//                             className="action-btn small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleEditCategory(category);
//                             }}
//                             disabled={loading}
//                             title="Edit"
//                           >
//                             ✏️
//                           </button>
//                           <button
//                             className="action-btn small delete"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete('category', category._id, category.name);
//                             }}
//                             disabled={loading}
//                             title="Delete"
//                           >
//                             🗑️
//                           </button>
//                           <button
//                             className="action-btn small"
//                             onClick={() => toggleCategory(category._id)}
//                             disabled={loading}
//                             title={expandedCategories.has(category._id) ? 'Collapse' : 'Expand'}
//                           >
//                             {expandedCategories.has(category._id) ? '⬆️' : '⬇️'}
//                           </button>
//                         </div>
//                       </div>

//                       {expandedCategories.has(category._id) && (
//                         <div className="node-children">
//                           {categorySubCategories.length > 0 ? (
//                             categorySubCategories.map((subCategory) => {
//                               const subCategoryProducts = products.filter(prod => {
//                                 if (!prod || !prod.subCategoryId) return false;

//                                 if (typeof prod.subCategoryId === 'string') {
//                                   return prod.subCategoryId === subCategory._id;
//                                 } else {
//                                   return prod.subCategoryId && prod.subCategoryId._id === subCategory._id;
//                                 }
//                               });

//                               return (
//                                 <div key={subCategory._id} className="tree-node level-2">
//                                   <div className="node-header">
//                                     <div className="node-title">
//                                       <span className="node-icon">📂</span>
//                                       <span>{subCategory.name}</span>
//                                       <span className="node-status" style={{ color: getStatusColor(subCategory.status) }}>
//                                         ({subCategory.status})
//                                       </span>
//                                       <span className="count-badge" style={{ marginLeft: '10px' }}>
//                                         {subCategoryProducts.length} products
//                                       </span>
//                                     </div>
//                                     <div className="node-actions">
//                                       <button
//                                         className="action-btn small"
//                                         onClick={() => handleEditSubCategory(subCategory)}
//                                         disabled={loading}
//                                         title="Edit"
//                                       >
//                                         ✏️
//                                       </button>
//                                       <button
//                                         className="action-btn small delete"
//                                         onClick={() => handleDelete('subcategory', subCategory._id, subCategory.name)}
//                                         disabled={loading}
//                                         title="Delete"
//                                       >
//                                         🗑️
//                                       </button>
//                                     </div>
//                                   </div>

//                                   <div className="node-children">
//                                     {subCategoryProducts.length > 0 ? (
//                                       subCategoryProducts.map((product) => (
//                                         <div key={product._id} className="tree-node level-3">
//                                           <div className="node-header">
//                                             <div className="node-title">
//                                               <span className="node-icon">📦</span>
//                                               <span>{product.name}</span>
//                                               <span className="node-status" style={{ color: getStatusColor(product.status) }}>
//                                                 ({product.status})
//                                               </span>
//                                             </div>
//                                             <div className="node-actions">
//                                               <button
//                                                 className="action-btn small"
//                                                 onClick={() => handleEditProduct(product)}
//                                                 disabled={loading}
//                                                 title="Edit"
//                                               >
//                                                 ✏️
//                                               </button>
//                                               <button
//                                                 className="action-btn small delete"
//                                                 onClick={() => handleDelete('product', product._id, product.name)}
//                                                 disabled={loading}
//                                                 title="Delete"
//                                               >
//                                                 🗑️
//                                               </button>
//                                             </div>
//                                           </div>

//                                           <div className="product-details">
//                                             {product.description && (
//                                               <div className="detail-section">
//                                                 <strong>📝 Description:</strong>
//                                                 <div className="detail-item">
//                                                   {product.description}
//                                                 </div>
//                                               </div>
//                                             )}
//                                             <div className="detail-section">
//                                               <strong>🎯 Target Pests/Diseases:</strong>
//                                               {product.targetPestsDiseases && product.targetPestsDiseases.map((pest, idx) => (
//                                                 <div key={idx} className="detail-item">
//                                                   {pest.image && (
//                                                     <img
//                                                       src={pest.image}
//                                                       alt={pest.name}
//                                                       style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '4px' }}
//                                                     />
//                                                   )}
//                                                   {pest.name}
//                                                 </div>
//                                               ))}
//                                             </div>
//                                             <div className="detail-section">
//                                               <strong>🌱 Recommended Seeds:</strong>
//                                               {product.recommendedSeeds && product.recommendedSeeds.map((seed, idx) => (
//                                                 <div key={idx} className="detail-item">
//                                                   {seed.image && (
//                                                     <img
//                                                       src={seed.image}
//                                                       alt={seed.name}
//                                                       style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '4px' }}
//                                                     />
//                                                   )}
//                                                   <div>
//                                                     <strong>{seed.name}</strong>
//                                                     <div>
//                                                       Stock: {seed.stock} | Unit: {seed.unit} {seed.customUnit && `(${seed.customUnit})`}
//                                                     </div>
//                                                     <div>
//                                                       Weight: {seed.weight} {seed.weightUnit} | List Price: ₹{seed.listPrice.toFixed(2)}
//                                                     </div>
//                                                     <div>
//                                                       Discount: {seed.discount}% | Profit: {seed.profit}% | Tax: {seed.tax}%
//                                                     </div>
//                                                     <div>
//                                                       <strong>Final Price: ₹{seed.finalPrice.toFixed(2)}</strong>
//                                                     </div>
//                                                   </div>
//                                                 </div>
//                                               ))}
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))
//                                     ) : (
//                                       <div className="no-children">
//                                         No products in this sub category
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             })
//                           ) : (
//                             <div className="no-children">
//                               No sub categories in this category
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .crop-care-container {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 20px;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
//           background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//           min-height: 100vh;
//           position: relative;
//         }

//         .main-title {
//           text-align: center;
//           color: #2c3e50;
//           margin-bottom: 10px;
//           font-size: 2.5rem;
//         }

//         .subtitle {
//           text-align: center;
//           color: #7f8c8d;
//           margin-bottom: 30px;
//           font-size: 1.1rem;
//         }

//         .loading-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(255, 255, 255, 0.9);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//         }

//         .spinner {
//           border: 5px solid #f3f3f3;
//           border-top: 5px solid #3498db;
//           border-radius: 50%;
//           width: 50px;
//           height: 50px;
//           animation: spin 1s linear infinite;
//           margin-bottom: 20px;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .tabs-container {
//           display: flex;
//           gap: 10px;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           justify-content: center;
//         }

//         .tab-btn {
//           padding: 12px 24px;
//           border: none;
//           background: white;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 16px;
//           font-weight: 600;
//           color: #555;
//           transition: all 0.3s ease;
//           box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//         }

//         .tab-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 8px rgba(0,0,0,0.15);
//         }

//         .tab-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .tab-btn.active {
//           background: #3498db;
//           color: white;
//           box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
//         }

//         .tab-content {
//           background: white;
//           padding: 30px;
//           border-radius: 12px;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//         }

//         .tab-content h2 {
//           color: #2c3e50;
//           margin-bottom: 25px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #eee;
//         }

//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .refresh-btn {
//           background: #6c757d;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 14px;
//           font-weight: 600;
//           transition: all 0.3s;
//         }

//         .refresh-btn:hover:not(:disabled) {
//           background: #5a6268;
//           transform: translateY(-2px);
//         }

//         .refresh-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .form-card {
//           background: #f8f9fa;
//           padding: 25px;
//           border-radius: 10px;
//           margin-bottom: 30px;
//           border: 1px solid #e9ecef;
//         }

//         .form-group {
//           margin-bottom: 20px;
//         }

//         .form-group label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 600;
//           color: #495057;
//         }

//         .form-group input,
//         .form-group select,
//         .form-group textarea {
//           width: 100%;
//           padding: 12px;
//           border: 2px solid #dee2e6;
//           border-radius: 6px;
//           font-size: 16px;
//           transition: border-color 0.3s;
//         }

//         .form-group input:focus,
//         .form-group select:focus,
//         .form-group textarea:focus {
//           outline: none;
//           border-color: #3498db;
//         }

//         .form-group input:disabled,
//         .form-group select:disabled,
//         .form-group textarea:disabled {
//           background: #e9ecef;
//           cursor: not-allowed;
//         }

//         .form-hint {
//           margin-top: 5px;
//           font-size: 14px;
//           color: #6c757d;
//           font-style: italic;
//         }

//         .image-upload-container {
//           position: relative;
//           width: 100%;
//         }

//         .file-input {
//           display: none;
//         }

//         .upload-area {
//           width: 100%;
//           height: 200px;
//           border: 3px dashed #dee2e6;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s;
//           background: white;
//           overflow: hidden;
//         }

//         .upload-area.small {
//           height: 120px;
//         }

//         .upload-area:hover:not(:disabled) {
//           border-color: #3498db;
//           background: #f8f9fa;
//         }

//         .upload-area:disabled {
//           cursor: not-allowed;
//           opacity: 0.6;
//         }

//         .upload-placeholder {
//           text-align: center;
//           color: #6c757d;
//         }

//         .upload-icon {
//           font-size: 3rem;
//           margin-bottom: 10px;
//         }

//         .upload-placeholder p {
//           margin: 5px 0;
//           font-size: 14px;
//         }

//         .upload-hint {
//           font-size: 12px !important;
//           color: #adb5bd;
//         }

//         .image-preview {
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .image-preview img {
//           max-width: 100%;
//           max-height: 100%;
//           object-fit: contain;
//           border-radius: 6px;
//         }

//         .form-actions {
//           display: flex;
//           gap: 15px;
//           margin-top: 30px;
//         }

//         .submit-btn {
//           flex: 1;
//           background: #3498db;
//           color: white;
//           border: none;
//           padding: 15px 30px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 16px;
//           font-weight: 600;
//           transition: all 0.3s;
//         }

//         .submit-btn:hover:not(:disabled) {
//           background: #2980b9;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
//         }

//         .submit-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .clear-btn {
//           flex: 1;
//           background: #6c757d;
//           color: white;
//           border: none;
//           padding: 15px 30px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 16px;
//           font-weight: 600;
//           transition: all 0.3s;
//         }

//         .clear-btn:hover:not(:disabled) {
//           background: #5a6268;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
//         }

//         .clear-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .dynamic-section {
//           margin: 30px 0;
//           padding: 20px;
//           background: #fff;
//           border-radius: 8px;
//           border: 1px solid #e9ecef;
//         }

//         .dynamic-section h3 {
//           color: #2c3e50;
//           margin-bottom: 20px;
//           font-size: 1.3rem;
//         }

//         .dynamic-field-group {
//           background: #f8f9fa;
//           padding: 15px;
//           border-radius: 6px;
//           margin-bottom: 15px;
//           border: 1px solid #e9ecef;
//         }

//         /* NEW STYLES FOR RECOMMENDED SEEDS */
//         .seed-section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 15px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #e9ecef;
//         }

//         .seed-section-header h4 {
//           margin: 0;
//           color: #2c3e50;
//         }

//         .grid-container {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//           gap: 15px;
//           margin-bottom: 20px;
//         }

//         .weight-input-group {
//           display: flex;
//           gap: 10px;
//         }

//         .weight-input-group input {
//           flex: 3;
//         }

//         .weight-unit-select {
//           flex: 1;
//           min-width: 80px;
//         }

//         .custom-unit-input,
//         .custom-tax-input {
//           margin-top: 8px;
//           width: 100%;
//           padding: 8px 12px;
//           border: 1px solid #ced4da;
//           border-radius: 4px;
//           font-size: 14px;
//         }

//         .custom-unit-input:focus,
//         .custom-tax-input:focus {
//           outline: none;
//           border-color: #3498db;
//         }

//         .final-price-display {
//           padding: 12px;
//           background: #e8f4f8;
//           border-radius: 6px;
//           border: 2px solid #3498db;
//           font-weight: bold;
//           font-size: 18px;
//           color: #2c3e50;
//           text-align: center;
//         }

//         .price-breakdown {
//           margin-top: 8px;
//           color: #6c757d;
//           font-size: 12px;
//         }

//         .add-btn {
//           background: #28a745;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 14px;
//           font-weight: 600;
//           transition: background 0.3s;
//         }

//         .add-btn:hover:not(:disabled) {
//           background: #218838;
//         }

//         .add-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .remove-btn {
//           background: #dc3545;
//           color: white;
//           border: none;
//           padding: 8px 15px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 13px;
//           margin-top: 10px;
//           transition: background 0.3s;
//         }

//         .remove-btn:hover:not(:disabled) {
//           background: #c82333;
//         }

//         .remove-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .data-section {
//           margin-top: 40px;
//         }

//         .data-section h3 {
//           color: #2c3e50;
//           margin-bottom: 20px;
//         }

//         .table-container {
//           overflow-x: auto;
//           margin-top: 20px;
//           border-radius: 8px;
//           border: 1px solid #e9ecef;
//         }

//         .data-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .data-table th {
//           background: #f8f9fa;
//           padding: 15px;
//           text-align: left;
//           font-weight: 600;
//           color: #495057;
//           border-bottom: 2px solid #dee2e6;
//           white-space: nowrap;
//         }

//         .data-table td {
//           padding: 15px;
//           border-bottom: 1px solid #e9ecef;
//           vertical-align: middle;
//         }

//         .data-table tr:hover {
//           background: #f8f9fa;
//         }

//         .item-name {
//           font-weight: 600;
//           color: #2c3e50;
//         }

//         .item-description {
//           max-width: 200px;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }

//         .table-image {
//           width: 50px;
//           height: 50px;
//           object-fit: cover;
//           border-radius: 6px;
//           border: 1px solid #dee2e6;
//         }

//         .no-image {
//           color: #6c757d;
//           font-style: italic;
//           font-size: 14px;
//         }

//         .status-select {
//           padding: 6px 12px;
//           border: none;
//           border-radius: 4px;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .status-select:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .count-badge {
//           background: #6c757d;
//           color: white;
//           padding: 4px 12px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .action-buttons {
//           display: flex;
//           gap: 8px;
//         }

//         .edit-btn, .delete-btn {
//           background: none;
//           border: none;
//           padding: 8px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 16px;
//           transition: all 0.3s;
//         }

//         .edit-btn {
//           background: #ffc107;
//           color: white;
//         }

//         .edit-btn:hover:not(:disabled) {
//           background: #e0a800;
//           transform: scale(1.1);
//         }

//         .delete-btn {
//           background: #dc3545;
//           color: white;
//         }

//         .delete-btn:hover:not(:disabled) {
//           background: #c82333;
//           transform: scale(1.1);
//         }

//         .edit-btn:disabled,
//         .delete-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .no-data {
//           text-align: center;
//           color: #6c757d;
//           font-style: italic;
//           padding: 40px;
//           background: #f8f9fa;
//           border-radius: 8px;
//           border: 2px dashed #dee2e6;
//         }

//         .summary-section {
//           margin-bottom: 40px;
//         }

//         .summary-cards {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 20px;
//           margin-top: 20px;
//         }

//         .summary-card {
//           background: white;
//           padding: 25px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           gap: 20px;
//           border: 1px solid #e9ecef;
//           box-shadow: 0 3px 10px rgba(0,0,0,0.08);
//         }

//         .summary-icon {
//           font-size: 2.5rem;
//         }

//         .summary-info h4 {
//           margin: 0;
//           color: #6c757d;
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .summary-info p {
//           margin: 5px 0 0 0;
//           font-size: 2rem;
//           font-weight: 700;
//           color: #2c3e50;
//         }

//         .hierarchical-view {
//           margin-top: 40px;
//         }

//         .tree-view {
//           margin-top: 20px;
//         }

//         .tree-node {
//           margin-bottom: 20px;
//           background: white;
//           border-radius: 8px;
//           border: 1px solid #e9ecef;
//           overflow: hidden;
//         }

//         .tree-node.level-2 {
//           margin-left: 30px;
//           background: #f8f9fa;
//         }

//         .tree-node.level-3 {
//           margin-left: 60px;
//           background: #fff;
//         }

//         .node-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 15px;
//           background: #f8f9fa;
//           border-bottom: 1px solid #e9ecef;
//         }

//         .node-title {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           font-size: 16px;
//         }

//         .node-icon {
//           font-size: 20px;
//         }

//         .node-status {
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .node-actions {
//           display: flex;
//           gap: 5px;
//         }

//         .action-btn {
//           background: none;
//           border: none;
//           padding: 6px;
//           border-radius: 4px;
//           cursor: pointer;
//           font-size: 14px;
//           transition: all 0.3s;
//         }

//         .action-btn.small {
//           padding: 4px 8px;
//           font-size: 12px;
//         }

//         .action-btn:hover:not(:disabled) {
//           transform: scale(1.1);
//         }

//         .action-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .action-btn.delete {
//           color: #dc3545;
//         }

//         .node-children {
//           padding: 15px;
//         }

//         .no-children {
//           padding: 15px;
//           text-align: center;
//           color: #6c757d;
//           font-style: italic;
//           background: white;
//           margin: 10px;
//           border-radius: 6px;
//           border: 1px dashed #dee2e6;
//         }

//         .product-details {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 20px;
//           padding: 15px;
//           background: white;
//           margin: 10px;
//           border-radius: 6px;
//           border: 1px solid #e9ecef;
//         }

//         .detail-section {
//           background: #f8f9fa;
//           padding: 15px;
//           border-radius: 6px;
//         }

//         .detail-section strong {
//           display: block;
//           margin-bottom: 10px;
//           color: #495057;
//         }

//         .detail-item {
//           padding: 8px 12px;
//           background: white;
//           border-radius: 4px;
//           margin-bottom: 8px;
//           font-size: 14px;
//           border: 1px solid #e9ecef;
//           display: flex;
//           align-items: center;
//         }

//         @media (max-width: 768px) {
//           .tabs-container {
//             flex-direction: column;
//           }
          
//           .tab-btn {
//             width: 100%;
//             text-align: center;
//           }
          
//           .form-actions {
//             flex-direction: column;
//           }
          
//           .section-header {
//             flex-direction: column;
//             gap: 10px;
//             align-items: flex-start;
//           }
          
//           .data-table {
//             font-size: 14px;
//           }
          
//           .data-table th,
//           .data-table td {
//             padding: 10px;
//           }
          
//           .action-buttons {
//             flex-direction: column;
//             gap: 5px;
//           }
          
//           .summary-cards {
//             grid-template-columns: 1fr;
//           }
          
//           .tree-node.level-2,
//           .tree-node.level-3 {
//             margin-left: 15px;
//           }
          
//           .product-details {
//             grid-template-columns: 1fr;
//           }
          
//           .node-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 10px;
//           }
          
//           .node-actions {
//             align-self: flex-end;
//           }
          
//           .grid-container {
//             grid-template-columns: 1fr;
//           }
          
//           .weight-input-group {
//             flex-direction: column;
//           }
          
//           .weight-unit-select {
//             min-width: 100%;
//           }
          
//           .seed-section-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 10px;
//           }
//             /* Video Upload Styles */
// .video-upload-container {
//   position: relative;
//   width: 100%;
// }

// .video-upload-area {
//   width: 100%;
//   height: 200px;
//   border: 3px dashed #dee2e6;
//   border-radius: 8px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   transition: all 0.3s;
//   background: #f8f9fa;
//   overflow: hidden;
// }

// .video-upload-area:hover:not(:disabled) {
//   border-color: #3498db;
//   background: #e8f4f8;
// }

// .video-upload-area:disabled {
//   cursor: not-allowed;
//   opacity: 0.6;
// }

// .video-upload-placeholder {
//   text-align: center;
//   color: #6c757d;
// }

// .video-upload-placeholder .upload-icon {
//   font-size: 3rem;
//   margin-bottom: 10px;
// }

// .video-preview {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   position: relative;
// }

// .video-player {
//   max-width: 100%;
//   max-height: 140px;
//   border-radius: 6px;
//   background: #000;
// }

// .video-info {
//   margin-top: 10px;
//   text-align: center;
// }

// .video-info p {
//   margin: 5px 0;
//   font-size: 14px;
// }

// .error-message {
//   color: #dc3545 !important;
//   font-size: 14px;
//   margin-top: 5px;
// }

// .success-message {
//   color: #28a745 !important;
//   font-size: 14px;
//   margin-top: 5px;
// }

// /* Update table to show video */
// .table-video {
//   width: 80px;
//   height: 60px;
//   object-fit: cover;
//   border-radius: 4px;
//   border: 1px solid #dee2e6;
//   cursor: pointer;
// }

// .video-modal {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.8);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 2000;
// }

// .video-modal-content {
//   max-width: 90%;
//   max-height: 90%;
//   background: white;
//   border-radius: 8px;
//   padding: 20px;
// }

// .video-modal-content video {
//   max-width: 100%;
//   max-height: 70vh;
// }

// .close-modal {
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background: white;
//   border: none;
//   border-radius: 50%;
//   width: 30px;
//   height: 30px;
//   font-size: 20px;
//   cursor: pointer;
//   z-index: 2001;
// }

// @media (max-width: 768px) {
//   .video-upload-area {
//     height: 150px;
//   }
  
//   .video-player {
//     max-height: 100px;
//   }
//     /* Add these styles to your existing CSS */

// .selected-file {
//   display: flex;
//   align-items: center;
//   padding: 15px;
//   background: #e8f5e9;
//   border-radius: 6px;
//   border: 2px solid #4caf50;
//   width: 100%;
// }

// .file-icon {
//   font-size: 2.5rem;
//   margin-right: 15px;
//   color: #4caf50;
// }

// .file-info {
//   flex: 1;
// }

// .file-name {
//   font-weight: 600;
//   color: #2c3e50;
//   margin: 0 0 5px 0;
//   word-break: break-word;
// }

// .file-size {
//   color: #6c757d;
//   font-size: 14px;
//   margin: 0 0 5px 0;
// }

// .checkmark {
//   color: #4caf50;
//   font-size: 1.5rem;
//   font-weight: bold;
//   margin-left: 10px;
// }

// /* Make video upload area match image upload area */
// .video-upload-area {
//   width: 100%;
//   height: 200px;
//   border: 3px dashed #dee2e6;
//   border-radius: 8px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   transition: all 0.3s;
//   background: white;
//   overflow: hidden;
// }

// .video-upload-area:hover:not(:disabled) {
//   border-color: #3498db;
//   background: #f8f9fa;
// }

// /* Remove old video styles */
// .video-preview, .video-player, .video-info {
//   display: none;
// }

// .error-message, .success-message {
//   display: none;
// }
// }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CropCare;
























"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Interfaces for TypeScript
interface Category {
  _id: string;
  name: string;
  image: string;
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  _id: string;
  name: string;
  image: string;
  categoryId: string | { _id: string; name: string };
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TargetPestDisease {
  name: string;
  image: string;
  imageFile?: File | null;
}

// Updated RecommendedSeed interface with new fields
interface RecommendedSeed {
  name: string;
  image: string;
  imageFile?: File | null;
  stock: number;
  unit: string;
  customUnit?: string;
  weight: number;
  weightUnit: string;
  listPrice: number;
  discount: number;
  profit: number;
  tax: number;
  customTax?: number;
  finalPrice: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  video?: string;
  subCategoryId: string | {
    _id: string;
    name: string;
    categoryId?: { _id: string; name: string }
  };
  targetPestsDiseases: TargetPestDisease[];
  recommendedSeeds: RecommendedSeed[];
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = '/api/cropcare';

// Constants
const UNIT_OPTIONS = [
  'kg', 'pound', 'piece', 'box', 'packet', 'gram', 'liter', 'gallon', 'bottle', 'other'
];

const TAX_OPTIONS = [
  { value: 5, label: '5% GST' },
  { value: 12, label: '12% GST' },
  { value: 18, label: '18% GST' },
  { value: 24, label: '24% GST' },
  { value: 0, label: 'Other (specify)' }
];

const CropCare: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'category' | 'subCategory' | 'product' | 'view'>('category');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string>('');

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState('');
  const [existingCategoryImage, setExistingCategoryImage] = useState('');

  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [subCategoryImagePreview, setSubCategoryImagePreview] = useState('');
  const [existingSubCategoryImage, setExistingSubCategoryImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [productVideo, setProductVideo] = useState<File | null>(null);
  const [productVideoPreview, setProductVideoPreview] = useState('');
  const [existingProductVideo, setExistingProductVideo] = useState('');
  const [videoError, setVideoError] = useState('');

  // Arrays for dynamic fields
  const [targetPestsDiseases, setTargetPestsDiseases] = useState<TargetPestDisease[]>([
    { name: '', image: '', imageFile: null }
  ]);

  const [recommendedSeeds, setRecommendedSeeds] = useState<RecommendedSeed[]>([
    {
      name: '',
      image: '',
      imageFile: null,
      stock: 0,
      unit: 'kg',
      customUnit: '',
      weight: 0,
      weightUnit: 'kg',
      listPrice: 0,
      discount: 0,
      profit: 0,
      tax: 18,
      customTax: undefined,
      finalPrice: 0
    }
  ]);

  // Data storage
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState({
    categories: 0,
    subCategories: 0,
    products: 0
  });

  // Ref for file inputs
  const categoryFileInputRef = useRef<HTMLInputElement>(null);
  const subCategoryFileInputRef = useRef<HTMLInputElement>(null);
  const pestImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const seedImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Collapsible state for view tab
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);


  // Handle product video upload
  // Handle product video upload
  const handleProductVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('❌ Please upload a valid video file (MP4, WebM, MOV)');
        if (videoInputRef.current) {
          videoInputRef.current.value = '';
        }
        return;
      }

      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        alert(`❌ Video file size is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Please upload a video less than 2MB.`);
        if (videoInputRef.current) {
          videoInputRef.current.value = '';
        }
        return;
      }

      setProductVideo(file);
      const previewUrl = URL.createObjectURL(file);
      setProductVideoPreview(previewUrl);
    }
  };


  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (categoryImagePreview) URL.revokeObjectURL(categoryImagePreview);
      if (subCategoryImagePreview) URL.revokeObjectURL(subCategoryImagePreview);


      targetPestsDiseases.forEach(pest => {
        if (pest.image && pest.image.startsWith('blob:')) {
          URL.revokeObjectURL(pest.image);
        }
      });

      recommendedSeeds.forEach(seed => {
        if (seed.image && seed.image.startsWith('blob:')) {
          URL.revokeObjectURL(seed.image);
        }
      });
    };
  }, [categoryImagePreview, subCategoryImagePreview, targetPestsDiseases, recommendedSeeds]);

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/subcategories`),
        axios.get(`${API_BASE_URL}/products`)
      ]);

      // Safely set data with validation
      if (categoriesRes.data?.success) {
        setCategories(categoriesRes.data.data || []);
      }

      if (subcategoriesRes.data?.success) {
        setSubCategories(subcategoriesRes.data.data || []);
      }

      if (productsRes.data?.success) {
        // Filter out any null products
        const validProducts = (productsRes.data.data || []).filter((product: Product) =>
          product && product._id
        );
        setProducts(validProducts);
      }

      // Calculate summary
      setSummary({
        categories: categoriesRes.data?.success ? (categoriesRes.data.data || []).length : 0,
        subCategories: subcategoriesRes.data?.success ? (subcategoriesRes.data.data || []).length : 0,
        products: productsRes.data?.success ? (productsRes.data.data || []).length : 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category image upload
  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCategoryImagePreview(previewUrl);
    }
  };

  // Handle subcategory image upload
  const handleSubCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      setSubCategoryImagePreview(previewUrl);
    }
  };

  // Handle pest image upload
  const handlePestImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPests = [...targetPestsDiseases];
      newPests[index] = {
        ...newPests[index],
        imageFile: file,
        image: URL.createObjectURL(file)
      };
      setTargetPestsDiseases(newPests);
    }
  };

  // Handle seed image upload
  const handleSeedImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSeeds = [...recommendedSeeds];
      newSeeds[index] = {
        ...newSeeds[index],
        imageFile: file,
        image: URL.createObjectURL(file)
      };
      setRecommendedSeeds(newSeeds);
    }
  };

  // Add new target pest/disease field
  const addTargetPestDisease = () => {
    setTargetPestsDiseases([
      ...targetPestsDiseases,
      { name: '', image: '', imageFile: null }
    ]);
  };

  // Remove target pest/disease field
  const removeTargetPestDisease = (index: number) => {
    if (targetPestsDiseases.length > 1) {
      const newPests = [...targetPestsDiseases];
      newPests.splice(index, 1);
      setTargetPestsDiseases(newPests);
    }
  };

  // Handle target pest/disease change
  const handleTargetPestDiseaseChange = (index: number, field: keyof TargetPestDisease, value: string) => {
    const newPests = [...targetPestsDiseases];
    newPests[index] = { ...newPests[index], [field]: value };
    setTargetPestsDiseases(newPests);
  };

  // Add new recommended seed field
  const addRecommendedSeed = () => {
    setRecommendedSeeds([
      ...recommendedSeeds,
      {
        name: '',
        image: '',
        imageFile: null,
        stock: 0,
        unit: 'kg',
        customUnit: '',
        weight: 0,
        weightUnit: 'kg',
        listPrice: 0,
        discount: 0,
        profit: 0,
        tax: 18,
        customTax: undefined,
        finalPrice: 0
      }
    ]);
  };

  // Remove recommended seed field
  const removeRecommendedSeed = (index: number) => {
    if (recommendedSeeds.length > 1) {
      const newSeeds = [...recommendedSeeds];
      newSeeds.splice(index, 1);
      setRecommendedSeeds(newSeeds);
    }
  };

  // Handle recommended seed change with auto-calculation
  const handleRecommendedSeedChange = (index: number, field: keyof RecommendedSeed, value: string | number) => {
    const newSeeds = [...recommendedSeeds];
    newSeeds[index] = { ...newSeeds[index], [field]: value };

    // Auto-calculate final price when pricing fields change
    if (['listPrice', 'discount', 'profit', 'tax', 'customTax'].includes(field)) {
      const seed = newSeeds[index];
      const discountAmount = (seed.listPrice * seed.discount) / 100;
      const priceAfterDiscount = seed.listPrice - discountAmount;
      const profitAmount = (priceAfterDiscount * seed.profit) / 100;
      const basePrice = priceAfterDiscount + profitAmount;

      // Use custom tax if tax is 0 (other option)
      const taxRate = seed.tax === 0 ? (seed.customTax || 0) : seed.tax;
      const taxAmount = (basePrice * taxRate) / 100;

      const finalPrice = basePrice + taxAmount;
      newSeeds[index].finalPrice = parseFloat(finalPrice.toFixed(2));
    }

    setRecommendedSeeds(newSeeds);
  };

  // Clear category form
  const clearCategoryForm = () => {
    setCategoryName('');
    setCategoryImage(null);
    setCategoryImagePreview('');
    setExistingCategoryImage('');
    setEditMode(false);
    setCurrentEditId('');
    if (categoryFileInputRef.current) {
      categoryFileInputRef.current.value = '';
    }
  };

  // Clear subcategory form
  const clearSubCategoryForm = () => {
    setSubCategoryName('');
    setSubCategoryImage(null);
    setSubCategoryImagePreview('');
    setExistingSubCategoryImage('');
    setSelectedCategory('');
    setEditMode(false);
    setCurrentEditId('');
    if (subCategoryFileInputRef.current) {
      subCategoryFileInputRef.current.value = '';
    }
  };

  // Clear product form
  const clearProductForm = () => {
    setProductName('');
    setProductDescription('');
    setProductVideo(null); // Add this
    setProductVideoPreview(''); // Add this
    setExistingProductVideo(''); // Add this
    setVideoError('');
    setSelectedSubCategory('');
    setTargetPestsDiseases([{ name: '', image: '', imageFile: null }]);
    setRecommendedSeeds([{
      name: '',
      image: '',
      imageFile: null,
      stock: 0,
      unit: 'kg',
      customUnit: '',
      weight: 0,
      weightUnit: 'kg',
      listPrice: 0,
      discount: 0,
      profit: 0,
      tax: 18,
      customTax: undefined,
      finalPrice: 0
    }]);
    setEditMode(false);
    setCurrentEditId('');

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setCategoryName(category.name);
    setCategoryImagePreview(category.image || '');
    setExistingCategoryImage(category.image || '');
    setEditMode(true);
    setCurrentEditId(category._id);
    setActiveTab('category');
  };

  // Handle edit subcategory
  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSubCategoryName(subCategory.name);
    setSubCategoryImagePreview(subCategory.image || '');
    setExistingSubCategoryImage(subCategory.image || '');
    setSelectedCategory(typeof subCategory.categoryId === 'string' ? subCategory.categoryId : subCategory.categoryId._id);
    setEditMode(true);
    setCurrentEditId(subCategory._id);
    setActiveTab('subCategory');
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setProductName(product.name);
    setProductDescription(product.description || '');
    setProductVideoPreview(product.video || ''); // Add this
    setExistingProductVideo(product.video || ''); // Add this
    setSelectedSubCategory(typeof product.subCategoryId === 'string' ? product.subCategoryId : product.subCategoryId._id);
    setTargetPestsDiseases(product.targetPestsDiseases.length > 0 ? product.targetPestsDiseases.map(p => ({ ...p, imageFile: null })) : [{ name: '', image: '', imageFile: null }]);

    // Update recommended seeds mapping
    setRecommendedSeeds(product.recommendedSeeds.length > 0 ? product.recommendedSeeds.map(s => ({
      ...s,
      imageFile: null,
      stock: s.stock || 0,
      unit: s.unit || 'kg',
      customUnit: s.customUnit || '',
      weight: s.weight || 0,
      weightUnit: s.weightUnit || 'kg',
      listPrice: s.listPrice || 0,
      discount: s.discount || 0,
      profit: s.profit || 0,
      tax: s.tax || 18,
      customTax: s.customTax || undefined,
      finalPrice: s.finalPrice || 0
    })) : [{
      name: '',
      image: '',
      imageFile: null,
      stock: 0,
      unit: 'kg',
      customUnit: '',
      weight: 0,
      weightUnit: 'kg',
      listPrice: 0,
      discount: 0,
      profit: 0,
      tax: 18,
      customTax: undefined,
      finalPrice: 0
    }]);

    setEditMode(true);
    setCurrentEditId(product._id);
    setActiveTab('product');
  };

  // Handle status change
  const handleStatusChange = async (type: 'category' | 'subcategory' | 'product', id: string, status: 'draft' | 'active' | 'inactive') => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;

    try {
      setLoading(true);
      // const endpoint = `${API_BASE_URL}/${type}s?id=${id}`;
      // Fix the endpoint to match the correct API route structure
const endpoint = `${API_BASE_URL}/${type === 'category' ? 'categories' : type === 'subcategory' ? 'subcategories' : 'products'}?id=${id}`;
      const response = await axios.patch(endpoint, { status });

      if (response.data.success) {
        alert(`Status updated successfully to ${status}`);
        fetchAllData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (type: 'category' | 'subcategory' | 'product', id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      setLoading(true);

      // Map to the correct API endpoints under /api/cropcare/
      const endpointMap = {
        'category': `${API_BASE_URL}/categories?id=${id}`,
        'subcategory': `${API_BASE_URL}/subcategories?id=${id}`,
        'product': `${API_BASE_URL}/products?id=${id}`
      };

      const endpoint = endpointMap[type];

      console.log('Deleting:', { type, id, endpoint }); // Debug log

      const response = await axios.delete(endpoint);

      if (response.data.success) {
        alert(`"${name}" deleted successfully`);
        fetchAllData(); // Refresh data
      } else {
        throw new Error(response.data.message || 'Delete failed');
      }
    } catch (error: any) {
      console.error('Error deleting:', error);

      // Better error message
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to delete: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Add/Update Category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter category name');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', categoryName.trim());
      formData.append('status', 'active');

      if (categoryImage) {
        formData.append('image', categoryImage);
      }

      if (editMode) {
        formData.append('existingImage', existingCategoryImage);
      }

      let response;
      if (editMode && currentEditId) {
        response = await axios.put(`${API_BASE_URL}/categories?id=${currentEditId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/categories`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        alert(`Category ${editMode ? 'updated' : 'added'} successfully!`);
        clearCategoryForm();
        fetchAllData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(`Failed to ${editMode ? 'update' : 'add'} category: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add/Update Sub Category
  const handleAddSubCategory = async () => {
    if (!subCategoryName.trim() || !selectedCategory) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', subCategoryName.trim());
      formData.append('categoryId', selectedCategory);
      formData.append('status', 'active');

      if (subCategoryImage) {
        formData.append('image', subCategoryImage);
      }

      if (editMode) {
        formData.append('existingImage', existingSubCategoryImage);
      }

      let response;
      if (editMode && currentEditId) {
        response = await axios.put(`${API_BASE_URL}/subcategories?id=${currentEditId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/subcategories`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        alert(`Sub Category ${editMode ? 'updated' : 'added'} successfully!`);
        clearSubCategoryForm();
        fetchAllData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error saving subcategory:', error);
      alert(`Failed to ${editMode ? 'update' : 'add'} subcategory: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add/Update Product
  const handleAddProduct = async () => {
    if (!productName.trim() || !selectedSubCategory) {
      alert('Please fill all required fields');
      return;
    }

    // Validate target pests/diseases
    const validPests = targetPestsDiseases.filter(pest => pest.name.trim());
    if (validPests.length === 0) {
      alert('Please add at least one target pest/disease');
      return;
    }

    // Validate recommended seeds
    const validSeeds = recommendedSeeds.filter(seed => seed.name.trim());
    if (validSeeds.length === 0) {
      alert('Please add at least one recommended seed');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', productName.trim());
      formData.append('description', productDescription.trim());
      formData.append('subCategoryId', selectedSubCategory);
      formData.append('status', 'active');

      // Add video to formData - THIS WAS MISSING!
      if (productVideo) {
        formData.append('video', productVideo);
      }

      if (editMode && existingProductVideo) {
        formData.append('existingVideo', existingProductVideo);
      }

      // Append pest data with images as files
      validPests.forEach((pest, index) => {
        formData.append(`pestName_${index}`, pest.name.trim());

        if (pest.imageFile) {
          // New image file
          formData.append(`pestImage_${index}`, pest.imageFile);
        } else if (pest.image && !pest.image.startsWith('blob:')) {
          // Existing image URL (for edit mode)
          formData.append(`existingPestImage_${index}`, pest.image);
        }
      });

      // Append seed data with new fields
      validSeeds.forEach((seed, index) => {
        formData.append(`seedName_${index}`, seed.name.trim());
        formData.append(`stock_${index}`, seed.stock.toString());
        formData.append(`unit_${index}`, seed.unit);
        if (seed.customUnit) {
          formData.append(`customUnit_${index}`, seed.customUnit);
        }
        formData.append(`weight_${index}`, seed.weight.toString());
        formData.append(`weightUnit_${index}`, seed.weightUnit);
        formData.append(`listPrice_${index}`, seed.listPrice.toString());
        formData.append(`discount_${index}`, seed.discount.toString());
        formData.append(`profit_${index}`, seed.profit.toString());
        formData.append(`tax_${index}`, seed.tax.toString());
        if (seed.customTax !== undefined) {
          formData.append(`customTax_${index}`, seed.customTax.toString());
        }
        formData.append(`finalPrice_${index}`, seed.finalPrice.toString());

        if (seed.imageFile) {
          formData.append(`seedImage_${index}`, seed.imageFile);
        } else if (seed.image && !seed.image.startsWith('blob:')) {
          formData.append(`existingSeedImage_${index}`, seed.image);
        }
      });

      let response;
      if (editMode && currentEditId) {
        response = await axios.put(`${API_BASE_URL}/products?id=${currentEditId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        alert(`Product ${editMode ? 'updated' : 'added'} successfully!`);
        clearProductForm();
        fetchAllData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Failed to ${editMode ? 'update' : 'add'} product: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return 'Unknown';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Get subcategory name by ID
  const getSubCategoryName = (subCategoryId: string) => {
    if (!subCategoryId) return 'Unknown';

    // First check in subCategories array
    const subCategory = subCategories.find(sub => sub._id === subCategoryId);
    if (subCategory) return subCategory.name;

    // Then check in products (for cases where subCategory might not be loaded separately)
    const product = products.find(prod => {
      if (!prod || !prod.subCategoryId) return false;
      if (typeof prod.subCategoryId === 'string') {
        return prod.subCategoryId === subCategoryId;
      } else {
        return prod.subCategoryId && prod.subCategoryId._id === subCategoryId;
      }
    });

    return product && product.subCategoryId && typeof product.subCategoryId !== 'string'
      ? product.subCategoryId.name
      : 'Unknown';
  };

  // Count subcategories for a category
  const countSubCategoriesForCategory = (catId: string) => {
    if (!catId) return 0;

    return subCategories.filter(sub => {
      if (!sub || !sub.categoryId) return false;

      if (typeof sub.categoryId === 'string') {
        return sub.categoryId === catId;
      } else {
        return sub.categoryId && sub.categoryId._id === catId;
      }
    }).length;
  };

  // Count products for a subcategory
  const countProductsForSubCategory = (subCategoryId: string) => {
    if (!subCategoryId) return 0;

    return products.filter(prod => {
      if (!prod || !prod.subCategoryId) return false;

      if (typeof prod.subCategoryId === 'string') {
        return prod.subCategoryId === subCategoryId;
      } else {
        return prod.subCategoryId && prod.subCategoryId._id === subCategoryId;
      }
    }).length;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'inactive': return '#dc3545';
      case 'draft': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="crop-care-container">
      <h1 className="main-title">🌱 Crop Care Management System</h1>
      <p className="subtitle">Admin Panel - Manage Crop Care Medicines & Recommendations</p>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'category' ? 'active' : ''}`}
          onClick={() => setActiveTab('category')}
          disabled={loading}
        >
          📁 {editMode && activeTab === 'category' ? 'Edit' : 'Add'} Category
        </button>
        <button
          className={`tab-btn ${activeTab === 'subCategory' ? 'active' : ''}`}
          onClick={() => setActiveTab('subCategory')}
          disabled={loading}
        >
          📂 {editMode && activeTab === 'subCategory' ? 'Edit' : 'Add'} Sub Category
        </button>
        <button
          className={`tab-btn ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
          disabled={loading}
        >
          📦 {editMode && activeTab === 'product' ? 'Edit' : 'Add'} Product
        </button>
        <button
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
          disabled={loading}
        >
          👁️ View All Data
        </button>
      </div>

      {/* Category Tab (Unchanged) */}
      {activeTab === 'category' && (
        <div className="tab-content">
          <h2>{editMode ? 'Edit' : 'Add New'} Category</h2>
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="categoryName">Category Name *</label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Pesticides, Fertilizers, Growth Promoters"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryImage">Category Image (Max 1mb) </label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="categoryImage"
                  ref={categoryFileInputRef}
                  onChange={handleCategoryImageUpload}
                  accept="image/*"
                  className="file-input"
                  disabled={loading}
                />
                <div className="upload-area" onClick={() => !loading && categoryFileInputRef.current?.click()}>
                  {categoryImagePreview || existingCategoryImage ? (
                    <div className="image-preview">
                      <img src={categoryImagePreview || existingCategoryImage} alt="Preview" />
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📁</div>
                      <p>Click to upload image</p>
                      <p className="upload-hint">Supports: JPG, PNG, WebP</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={handleAddCategory}
                disabled={loading}
              >
                {editMode ? '🔄 Update' : '➕ Add'} Category
              </button>
              <button
                className="clear-btn"
                onClick={clearCategoryForm}
                disabled={loading}
              >
                🗑️ {editMode ? 'Cancel Edit' : 'Clear Form'}
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="data-section">
            <div className="section-header">
              <h3>Existing Categories ({categories.length})</h3>
              <button
                className="refresh-btn"
                onClick={fetchAllData}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="no-data">No categories added yet.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Sub Categories</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td>
                          <div className="item-name">{category.name}</div>
                        </td>
                       
                        <td>
                        
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="table-image" />
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                        </td>
                        <td>
                          <select
                            value={category.status}
                            onChange={(e) => handleStatusChange('category', category._id, e.target.value as any)}
                            className="status-select"
                            style={{ backgroundColor: getStatusColor(category.status) }}
                            disabled={loading}
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td>
                          <span className="count-badge">
                            {countSubCategoriesForCategory(category._id)}
                          </span>
                        </td>
                        <td>
                          {formatDate(category.createdAt)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditCategory(category)}
                              disabled={loading}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete('category', category._id, category.name)}
                              disabled={loading}
                              title="Delete"
                            >
                              🗑️
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
      )}

      {/* Sub Category Tab (Unchanged) */}
      {activeTab === 'subCategory' && (
        <div className="tab-content">
          <h2>{editMode ? 'Edit' : 'Add New'} Sub Category</h2>
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="parentCategory">Select Parent Category *</label>
              <select
                id="parentCategory"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={loading || categories.length === 0}
              >
                <option value="">-- Select Category --</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name} ({category.status})
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="form-hint">No categories available. Please add a category first.</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subCategoryName">Sub Category Name *</label>
              <input
                type="text"
                id="subCategoryName"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="e.g., Insecticides, Fungicides, Weedicides"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subCategoryImage">Sub Category Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="subCategoryImage"
                  ref={subCategoryFileInputRef}
                  onChange={handleSubCategoryImageUpload}
                  accept="image/*"
                  className="file-input"
                  disabled={loading}
                />
                <div className="upload-area" onClick={() => !loading && subCategoryFileInputRef.current?.click()}>
                  {subCategoryImagePreview || existingSubCategoryImage ? (
                    <div className="image-preview">
                      <img src={subCategoryImagePreview || existingSubCategoryImage} alt="Preview" />
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📂</div>
                      <p>Click to upload image</p>
                      <p className="upload-hint">Supports: JPG, PNG, WebP</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={handleAddSubCategory}
                disabled={loading || !selectedCategory}
              >
                {editMode ? '🔄 Update' : '➕ Add'} Sub Category
              </button>
              <button
                className="clear-btn"
                onClick={clearSubCategoryForm}
                disabled={loading}
              >
                🗑️ {editMode ? 'Cancel Edit' : 'Clear Form'}
              </button>
            </div>
          </div>

          {/* Sub Categories List */}
          <div className="data-section">
            <div className="section-header">
              <h3>Existing Sub Categories ({subCategories.length})</h3>
              <button
                className="refresh-btn"
                onClick={fetchAllData}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            </div>

            {subCategories.length === 0 ? (
              <p className="no-data">No sub categories added yet.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Parent Category</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Products</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories.map((subCategory) => (
                      <tr key={subCategory._id}>
                        <td>
                          <div className="item-name">{subCategory.name}</div>
                        </td>
                        <td>
                          {typeof subCategory.categoryId === 'string'
                            ? getCategoryName(subCategory.categoryId)
                            : (subCategory.categoryId?.name || "Unassigned")
                          }
                        </td>
                        <td>
                          {subCategory.image ? (
                            <img src={subCategory.image} alt={subCategory.name} className="table-image" />
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                        </td>
                        <td>
                          <select
                            value={subCategory.status}
                            onChange={(e) => handleStatusChange('subcategory', subCategory._id, e.target.value as any)}
                            className="status-select"
                            style={{ backgroundColor: getStatusColor(subCategory.status) }}
                            disabled={loading}
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td>
                          <span className="count-badge">
                            {countProductsForSubCategory(subCategory._id)}
                          </span>
                        </td>
                        <td>
                          {formatDate(subCategory.createdAt)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditSubCategory(subCategory)}
                              disabled={loading}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete('subcategory', subCategory._id, subCategory.name)}
                              disabled={loading}
                              title="Delete"
                            >
                              🗑️
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
      )}

      {/* UPDATED: Product Tab with new fields */}
      {activeTab === 'product' && (
        <div className="tab-content">
          <h2>{editMode ? 'Edit' : 'Add New'} Product</h2>
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="productName">Product Name *</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Neem Oil, NPK Fertilizer, etc."
                disabled={loading}
              />
            </div>

            {/* NEW: Product Description Field */}
            <div className="form-group">
              <label htmlFor="productDescription">Product Description</label>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Enter detailed description about the product..."
                rows={4}
                disabled={loading}
              />
            </div>




            {/* Product Video Upload Field - SIMPLIFIED VERSION */}
            <div className="form-group">
              <label htmlFor="productVideo">Product Video (Max 1MB)</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="productVideo"
                  ref={videoInputRef}
                  onChange={handleProductVideoUpload}
                  accept="video/*"
                  className="file-input"
                  disabled={loading}
                />
                <div className="upload-area" onClick={() => !loading && videoInputRef.current?.click()}>
                  {productVideoPreview || existingProductVideo ? (
                    <div className="image-preview">
                      <div className="selected-file">
                        <div className="file-icon">🎬</div>
                        <div className="file-info">
                          <p className="file-name">
                            {productVideo?.name || 'Video selected'}
                          </p>
                          <p className="file-size">
                            {productVideo?.size ? `Size: ${(productVideo.size / (1024 * 1024)).toFixed(2)} MB` : 'Video ready'}
                          </p>
                          <p className="upload-hint">Click to change video</p>
                        </div>
                        <div className="checkmark">✓</div>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">🎬</div>
                      <p>Click to upload video</p>
                      <p className="upload-hint">Max size: 2MB | Supports: MP4, WebM, MOV</p>
                    </div>
                  )}
                </div>
              </div>
            </div>












            <div className="form-group">
              <label htmlFor="subCategorySelect">Select Sub Category *</label>
              <select
                id="subCategorySelect"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={loading || subCategories.length === 0}
              >
                <option value="">-- Select Sub Category --</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name} ({typeof subCategory.categoryId === 'string'
                      ? getCategoryName(subCategory.categoryId)
                      : subCategory.categoryId.name
                    })
                  </option>
                ))}
              </select>
              {subCategories.length === 0 && (
                <p className="form-hint">No sub categories available. Please add a sub category first.</p>
              )}
            </div>

            {/* Target Pests/Diseases Section */}
            <div className="dynamic-section">
              <h3>Target Pests/Diseases *</h3>
              {targetPestsDiseases.map((pest, index) => (
                <div key={index} className="dynamic-field-group">
                  <div className="form-group">
                    <label>Pest/Disease Name</label>
                    <input
                      type="text"
                      value={pest.name}
                      onChange={(e) => handleTargetPestDiseaseChange(index, 'name', e.target.value)}
                      placeholder="e.g., Aphids, Powdery Mildew"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        ref={(el) => {
                          pestImageInputRefs.current[index] = el;
                        }}
                        onChange={(e) => handlePestImageUpload(index, e)}
                        accept="image/*"
                        className="file-input"
                        disabled={loading}
                      />
                      <div
                        className="upload-area small"
                        onClick={() =>
                          !loading && pestImageInputRefs.current[index]?.click()
                        }
                      >
                        {pest.image ? (
                          <div className="image-preview">
                            <img src={pest.image} alt="Preview" />
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <div className="upload-icon">🖼️</div>
                            <p className="upload-hint">Click to upload</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {targetPestsDiseases.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeTargetPestDisease(index)}
                      disabled={loading}
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={addTargetPestDisease}
                disabled={loading}
              >
                ➕ Add Another Pest/Disease
              </button>
            </div>

            {/* UPDATED: Recommended Seeds Section with new fields */}
            <div className="dynamic-section">
              <h3>Recommended Seeds *</h3>
              {recommendedSeeds.map((seed, index) => (
                <div key={index} className="dynamic-field-group">
                  <div className="seed-section-header">
                    <h4>Seed #{index + 1}</h4>
                    {recommendedSeeds.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeRecommendedSeed(index)}
                        disabled={loading}
                      >
                        🗑️ Remove Seed
                      </button>
                    )}
                  </div>

                  <div className="grid-container">
                    {/* Row 1: Basic Info */}
                    <div className="form-group">
                      <label>Seed Name *</label>
                      <input
                        type="text"
                        value={seed.name}
                        onChange={(e) => handleRecommendedSeedChange(index, 'name', e.target.value)}
                        placeholder="e.g., Hybrid Maize, Bt Cotton"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input
                        type="number"
                        value={seed.stock}
                        onChange={(e) => handleRecommendedSeedChange(index, 'stock', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Unit *</label>
                      <select
                        value={seed.unit}
                        onChange={(e) => handleRecommendedSeedChange(index, 'unit', e.target.value)}
                        disabled={loading}
                      >
                        {UNIT_OPTIONS.map(unit => (
                          <option key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </option>
                        ))}
                      </select>
                      {seed.unit === 'other' && (
                        <input
                          type="text"
                          value={seed.customUnit || ''}
                          onChange={(e) => handleRecommendedSeedChange(index, 'customUnit', e.target.value)}
                          placeholder="Enter custom unit"
                          className="custom-unit-input"
                          disabled={loading}
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label>Image</label>
                      <div className="image-upload-container">
                        <input
                          type="file"
                          ref={(el) => {
                            seedImageInputRefs.current[index] = el;
                          }}
                          onChange={(e) => handleSeedImageUpload(index, e)}
                          accept="image/*"
                          className="file-input"
                          disabled={loading}
                        />
                        <div
                          className="upload-area small"
                          onClick={() =>
                            !loading && seedImageInputRefs.current[index]?.click()
                          }
                        >
                          {seed.image ? (
                            <div className="image-preview">
                              <img src={seed.image} alt="Preview" />
                            </div>
                          ) : (
                            <div className="upload-placeholder">
                              <div className="upload-icon">🖼️</div>
                              <p className="upload-hint">Click to upload</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-container">
                    {/* Row 2: Weight */}
                    <div className="form-group">
                      <label>Weight</label>
                      <div className="weight-input-group">
                        <input
                          type="number"
                          value={seed.weight}
                          onChange={(e) => handleRecommendedSeedChange(index, 'weight', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          disabled={loading}
                        />
                        <select
                          value={seed.weightUnit}
                          onChange={(e) => handleRecommendedSeedChange(index, 'weightUnit', e.target.value)}
                          disabled={loading}
                          className="weight-unit-select"
                        >
                          <option value="kg">kg</option>
                          <option value="gram">gram</option>
                          <option value="pound">pound</option>
                          <option value="liter">liter</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>List Price (₹) *</label>
                      <input
                        type="number"
                        value={seed.listPrice}
                        onChange={(e) => handleRecommendedSeedChange(index, 'listPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Discount (%)</label>
                      <input
                        type="number"
                        value={seed.discount}
                        onChange={(e) => handleRecommendedSeedChange(index, 'discount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        max="100"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid-container">
                    {/* Row 3: Profit & Tax */}
                    <div className="form-group">
                      <label>Profit (%)</label>
                      <input
                        type="number"
                        value={seed.profit}
                        onChange={(e) => handleRecommendedSeedChange(index, 'profit', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Tax (%) *</label>
                      <select
                        value={seed.tax}
                        onChange={(e) => handleRecommendedSeedChange(index, 'tax', parseInt(e.target.value) || 0)}
                        disabled={loading}
                      >
                        {TAX_OPTIONS.map(tax => (
                          <option key={tax.value} value={tax.value}>
                            {tax.label}
                          </option>
                        ))}
                      </select>
                      {seed.tax === 0 && (
                        <input
                          type="number"
                          value={seed.customTax || ''}
                          onChange={(e) => handleRecommendedSeedChange(index, 'customTax', parseFloat(e.target.value) || 0)}
                          placeholder="Enter tax percentage"
                          min="0"
                          step="0.01"
                          className="custom-tax-input"
                          disabled={loading}
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label>Final Price (₹)</label>
                      <div className="final-price-display">
                        ₹ {seed.finalPrice.toFixed(2)}
                        <div className="price-breakdown">
                          <small>
                            List: ₹{seed.listPrice.toFixed(2)} |
                            After {seed.discount}% Discount: ₹{(seed.listPrice - (seed.listPrice * seed.discount / 100)).toFixed(2)} |
                            After {seed.profit}% Profit: ₹{((seed.listPrice - (seed.listPrice * seed.discount / 100)) + ((seed.listPrice - (seed.listPrice * seed.discount / 100)) * seed.profit / 100)).toFixed(2)} |
                            Tax: {(seed.tax === 0 ? seed.customTax || 0 : seed.tax)}%
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={addRecommendedSeed}
                disabled={loading}
              >
                ➕ Add Another Recommended Seed
              </button>
            </div>

            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={handleAddProduct}
                disabled={loading || !selectedSubCategory}
              >
                {editMode ? '🔄 Update' : '🚀 Add'} Product
              </button>
              <button
                className="clear-btn"
                onClick={clearProductForm}
                disabled={loading}
              >
                🗑️ {editMode ? 'Cancel Edit' : 'Clear Form'}
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className="data-section">
            <div className="section-header">
              <h3>Existing Products ({products.length})</h3>
              <button
                className="refresh-btn"
                onClick={fetchAllData}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            </div>

            {products.length === 0 ? (
              <p className="no-data">No products added yet.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Sub Category</th>
                      <th>Pests/Diseases</th>
                      <th>Recommended Seeds</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="item-name">{product.name}</div>
                        </td>
                        <td>
                          <div className="item-description">
                            {product.description ? (
                              product.description.length > 50
                                ? `${product.description.substring(0, 50)}...`
                                : product.description
                            ) : (
                              <span className="no-data">No description</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {product.subCategoryId ? (
                            typeof product.subCategoryId === 'string'
                              ? getSubCategoryName(product.subCategoryId)
                              : (product.subCategoryId.name || "Unassigned")
                          ) : "Unassigned"}
                        </td>
                        <td>
                          <span className="count-badge">
                            {product.targetPestsDiseases?.length || 0}
                          </span>
                        </td>
                        <td>
                          <span className="count-badge">
                            {product.recommendedSeeds?.length || 0}
                          </span>
                        </td>
                        <td>
                          <select
                            value={product.status}
                            onChange={(e) => handleStatusChange('product', product._id, e.target.value as any)}
                            className="status-select"
                            style={{ backgroundColor: getStatusColor(product.status) }}
                            disabled={loading}
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td>
                          {formatDate(product.createdAt)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditProduct(product)}
                              disabled={loading}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete('product', product._id, product.name)}
                              disabled={loading}
                              title="Delete"
                            >
                              🗑️
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
      )}

      {/* View Data Tab (Unchanged) */}
      {activeTab === 'view' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>View All Data</h2>
            <button
              className="refresh-btn"
              onClick={fetchAllData}
              disabled={loading}
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* Summary Section */}
          <div className="summary-section">
            <h3>📊 System Summary</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">📁</div>
                <div className="summary-info">
                  <h4>Categories</h4>
                  <p>{summary.categories}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📂</div>
                <div className="summary-info">
                  <h4>Sub Categories</h4>
                  <p>{summary.subCategories}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📦</div>
                <div className="summary-info">
                  <h4>Products</h4>
                  <p>{summary.products}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hierarchical View */}
          <div className="hierarchical-view">
            <h3>🌿 Hierarchical Structure</h3>
            {categories.length === 0 ? (
              <p className="no-data">No data available. Start by adding a category.</p>
            ) : (
              <div className="tree-view">
                {categories.map((category) => {
                  const categorySubCategories = subCategories.filter(sub => {
                    if (!sub || !sub.categoryId) return false;

                    if (typeof sub.categoryId === 'string') {
                      return sub.categoryId === category._id;
                    } else {
                      return sub.categoryId && sub.categoryId._id === category._id;
                    }
                  });

                  return (
                    <div key={category._id} className="tree-node">
                      <div className="node-header" onClick={() => toggleCategory(category._id)} style={{ cursor: 'pointer' }}>
                        <div className="node-title">
                          <span className="node-icon">{expandedCategories.has(category._id) ? '📂' : '📁'}</span>
                          <strong>{category.name}</strong>
                          <span className="node-status" style={{ color: getStatusColor(category.status) }}>
                            ({category.status})
                          </span>
                          <span className="count-badge" style={{ marginLeft: '10px' }}>
                            {categorySubCategories.length} sub categories
                          </span>
                        </div>
                        <div className="node-actions">
                          <button
                            className="action-btn small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category);
                            }}
                            disabled={loading}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn small delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete('category', category._id, category.name);
                            }}
                            disabled={loading}
                            title="Delete"
                          >
                            🗑️
                          </button>
                          <button
                            className="action-btn small"
                            onClick={() => toggleCategory(category._id)}
                            disabled={loading}
                            title={expandedCategories.has(category._id) ? 'Collapse' : 'Expand'}
                          >
                            {expandedCategories.has(category._id) ? '⬆️' : '⬇️'}
                          </button>
                        </div>
                      </div>

                      {expandedCategories.has(category._id) && (
                        <div className="node-children">
                          {categorySubCategories.length > 0 ? (
                            categorySubCategories.map((subCategory) => {
                              const subCategoryProducts = products.filter(prod => {
                                if (!prod || !prod.subCategoryId) return false;

                                if (typeof prod.subCategoryId === 'string') {
                                  return prod.subCategoryId === subCategory._id;
                                } else {
                                  return prod.subCategoryId && prod.subCategoryId._id === subCategory._id;
                                }
                              });

                              return (
                                <div key={subCategory._id} className="tree-node level-2">
                                  <div className="node-header">
                                    <div className="node-title">
                                      <span className="node-icon">📂</span>
                                      <span>{subCategory.name}</span>
                                      <span className="node-status" style={{ color: getStatusColor(subCategory.status) }}>
                                        ({subCategory.status})
                                      </span>
                                      <span className="count-badge" style={{ marginLeft: '10px' }}>
                                        {subCategoryProducts.length} products
                                      </span>
                                    </div>
                                    <div className="node-actions">
                                      <button
                                        className="action-btn small"
                                        onClick={() => handleEditSubCategory(subCategory)}
                                        disabled={loading}
                                        title="Edit"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        className="action-btn small delete"
                                        onClick={() => handleDelete('subcategory', subCategory._id, subCategory.name)}
                                        disabled={loading}
                                        title="Delete"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>

                                  <div className="node-children">
                                    {subCategoryProducts.length > 0 ? (
                                      subCategoryProducts.map((product) => (
                                        <div key={product._id} className="tree-node level-3">
                                          <div className="node-header">
                                            <div className="node-title">
                                              <span className="node-icon">📦</span>
                                              <span>{product.name}</span>
                                              <span className="node-status" style={{ color: getStatusColor(product.status) }}>
                                                ({product.status})
                                              </span>
                                            </div>
                                            <div className="node-actions">
                                              <button
                                                className="action-btn small"
                                                onClick={() => handleEditProduct(product)}
                                                disabled={loading}
                                                title="Edit"
                                              >
                                                ✏️
                                              </button>
                                              <button
                                                className="action-btn small delete"
                                                onClick={() => handleDelete('product', product._id, product.name)}
                                                disabled={loading}
                                                title="Delete"
                                              >
                                                🗑️
                                              </button>
                                            </div>
                                          </div>

                                          <div className="product-details">
                                            {product.description && (
                                              <div className="detail-section">
                                                <strong>📝 Description:</strong>
                                                <div className="detail-item">
                                                  {product.description}
                                                </div>
                                              </div>
                                            )}
                                            <div className="detail-section">
                                              <strong>🎯 Target Pests/Diseases:</strong>
                                              {product.targetPestsDiseases && product.targetPestsDiseases.map((pest, idx) => (
                                                <div key={idx} className="detail-item">
                                                  {pest.image && (
                                                    <img
                                                      src={pest.image}
                                                      alt={pest.name}
                                                      style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '4px' }}
                                                    />
                                                  )}
                                                  {pest.name}
                                                </div>
                                              ))}
                                            </div>
                                            <div className="detail-section">
                                              <strong>🌱 Recommended Seeds:</strong>
                                              {product.recommendedSeeds && product.recommendedSeeds.map((seed, idx) => (
                                                <div key={idx} className="detail-item">
                                                  {seed.image && (
                                                    <img
                                                      src={seed.image}
                                                      alt={seed.name}
                                                      style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '4px' }}
                                                    />
                                                  )}
                                                  <div>
                                                    <strong>{seed.name}</strong>
                                                    <div>
                                                      Stock: {seed.stock} | Unit: {seed.unit} {seed.customUnit && `(${seed.customUnit})`}
                                                    </div>
                                                    <div>
                                                      Weight: {seed.weight} {seed.weightUnit} | List Price: ₹{seed.listPrice.toFixed(2)}
                                                    </div>
                                                    <div>
                                                      Discount: {seed.discount}% | Profit: {seed.profit}% | Tax: {seed.tax}%
                                                    </div>
                                                    <div>
                                                      <strong>Final Price: ₹{seed.finalPrice.toFixed(2)}</strong>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="no-children">
                                        No products in this sub category
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="no-children">
                              No sub categories in this category
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .crop-care-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          position: relative;
        }

        .main-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 2.5rem;
        }

        .subtitle {
          text-align: center;
          color: #7f8c8d;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .tab-btn {
          padding: 12px 24px;
          border: none;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #555;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .tab-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .tab-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tab-btn.active {
          background: #3498db;
          color: white;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .tab-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .tab-content h2 {
          color: #2c3e50;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #eee;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .refresh-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-card {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #495057;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          background: #e9ecef;
          cursor: not-allowed;
        }

        .form-hint {
          margin-top: 5px;
          font-size: 14px;
          color: #6c757d;
          font-style: italic;
        }

        .image-upload-container {
          position: relative;
          width: 100%;
        }

        .file-input {
          display: none;
        }

        .upload-area {
          width: 100%;
          height: 200px;
          border: 3px dashed #dee2e6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
          overflow: hidden;
        }

        .upload-area.small {
          height: 120px;
        }

        .upload-area:hover:not(:disabled) {
          border-color: #3498db;
          background: #f8f9fa;
        }

        .upload-area:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .upload-placeholder {
          text-align: center;
          color: #6c757d;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .upload-placeholder p {
          margin: 5px 0;
          font-size: 14px;
        }

        .upload-hint {
          font-size: 12px !important;
          color: #adb5bd;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .submit-btn {
          flex: 1;
          background: #3498db;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-btn {
          flex: 1;
          background: #6c757d;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .clear-btn:hover:not(:disabled) {
          background: #5a6268;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        }

        .clear-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dynamic-section {
          margin: 30px 0;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .dynamic-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .dynamic-field-group {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 15px;
          border: 1px solid #e9ecef;
        }

        /* NEW STYLES FOR RECOMMENDED SEEDS */
        .seed-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e9ecef;
        }

        .seed-section-header h4 {
          margin: 0;
          color: #2c3e50;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .weight-input-group {
          display: flex;
          gap: 10px;
        }

        .weight-input-group input {
          flex: 3;
        }

        .weight-unit-select {
          flex: 1;
          min-width: 80px;
        }

        .custom-unit-input,
        .custom-tax-input {
          margin-top: 8px;
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .custom-unit-input:focus,
        .custom-tax-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .final-price-display {
          padding: 12px;
          background: #e8f4f8;
          border-radius: 6px;
          border: 2px solid #3498db;
          font-weight: bold;
          font-size: 18px;
          color: #2c3e50;
          text-align: center;
        }

        .price-breakdown {
          margin-top: 8px;
          color: #6c757d;
          font-size: 12px;
        }

        .add-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.3s;
        }

        .add-btn:hover:not(:disabled) {
          background: #218838;
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          margin-top: 10px;
          transition: background 0.3s;
        }

        .remove-btn:hover:not(:disabled) {
          background: #c82333;
        }

        .remove-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .data-section {
          margin-top: 40px;
        }

        .data-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .table-container {
          overflow-x: auto;
          margin-top: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
          white-space: nowrap;
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          vertical-align: middle;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        .item-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .item-description {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .table-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }

        .no-image {
          color: #6c757d;
          font-style: italic;
          font-size: 14px;
        }

        .status-select {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .status-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .count-badge {
          background: #6c757d;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .edit-btn, .delete-btn {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
        }

        .edit-btn {
          background: #ffc107;
          color: white;
        }

        .edit-btn:hover:not(:disabled) {
          background: #e0a800;
          transform: scale(1.1);
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover:not(:disabled) {
          background: #c82333;
          transform: scale(1.1);
        }

        .edit-btn:disabled,
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .no-data {
          text-align: center;
          color: #6c757d;
          font-style: italic;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #dee2e6;
        }

        .summary-section {
          margin-bottom: 40px;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .summary-card {
          background: white;
          padding: 25px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid #e9ecef;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }

        .summary-icon {
          font-size: 2.5rem;
        }

        .summary-info h4 {
          margin: 0;
          color: #6c757d;
          font-size: 14px;
          font-weight: 600;
        }

        .summary-info p {
          margin: 5px 0 0 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .hierarchical-view {
          margin-top: 40px;
        }

        .tree-view {
          margin-top: 20px;
        }

        .tree-node {
          margin-bottom: 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          overflow: hidden;
        }

        .tree-node.level-2 {
          margin-left: 30px;
          background: #f8f9fa;
        }

        .tree-node.level-3 {
          margin-left: 60px;
          background: #fff;
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .node-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
        }

        .node-icon {
          font-size: 20px;
        }

        .node-status {
          font-size: 12px;
          font-weight: 600;
        }

        .node-actions {
          display: flex;
          gap: 5px;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .action-btn.small {
          padding: 4px 8px;
          font-size: 12px;
        }

        .action-btn:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.delete {
          color: #dc3545;
        }

        .node-children {
          padding: 15px;
        }

        .no-children {
          padding: 15px;
          text-align: center;
          color: #6c757d;
          font-style: italic;
          background: white;
          margin: 10px;
          border-radius: 6px;
          border: 1px dashed #dee2e6;
        }

        .product-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 15px;
          background: white;
          margin: 10px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .detail-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
        }

        .detail-section strong {
          display: block;
          margin-bottom: 10px;
          color: #495057;
        }

        .detail-item {
          padding: 8px 12px;
          background: white;
          border-radius: 4px;
          margin-bottom: 8px;
          font-size: 14px;
          border: 1px solid #e9ecef;
          display: flex;
          align-items: center;
        }

        @media (max-width: 768px) {
          .tabs-container {
            flex-direction: column;
          }
          
          .tab-btn {
            width: 100%;
            text-align: center;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .section-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          
          .data-table {
            font-size: 14px;
          }
          
          .data-table th,
          .data-table td {
            padding: 10px;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 5px;
          }
          
          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          .tree-node.level-2,
          .tree-node.level-3 {
            margin-left: 15px;
          }
          
          .product-details {
            grid-template-columns: 1fr;
          }
          
          .node-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .node-actions {
            align-self: flex-end;
          }
          
          .grid-container {
            grid-template-columns: 1fr;
          }
          
          .weight-input-group {
            flex-direction: column;
          }
          
          .weight-unit-select {
            min-width: 100%;
          }
          
          .seed-section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
            /* Video Upload Styles */
.video-upload-container {
  position: relative;
  width: 100%;
}

.video-upload-area {
  width: 100%;
  height: 200px;
  border: 3px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
  overflow: hidden;
}

.video-upload-area:hover:not(:disabled) {
  border-color: #3498db;
  background: #e8f4f8;
}

.video-upload-area:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.video-upload-placeholder {
  text-align: center;
  color: #6c757d;
}

.video-upload-placeholder .upload-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.video-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.video-player {
  max-width: 100%;
  max-height: 140px;
  border-radius: 6px;
  background: #000;
}

.video-info {
  margin-top: 10px;
  text-align: center;
}

.video-info p {
  margin: 5px 0;
  font-size: 14px;
}

.error-message {
  color: #dc3545 !important;
  font-size: 14px;
  margin-top: 5px;
}

.success-message {
  color: #28a745 !important;
  font-size: 14px;
  margin-top: 5px;
}

/* Update table to show video */
.table-video {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  cursor: pointer;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.video-modal-content {
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.video-modal-content video {
  max-width: 100%;
  max-height: 70vh;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  cursor: pointer;
  z-index: 2001;
}

@media (max-width: 768px) {
  .video-upload-area {
    height: 150px;
  }
  
  .video-player {
    max-height: 100px;
  }
    /* Add these styles to your existing CSS */

.selected-file {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 6px;
  border: 2px solid #4caf50;
  width: 100%;
}

.file-icon {
  font-size: 2.5rem;
  margin-right: 15px;
  color: #4caf50;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
  word-break: break-word;
}

.file-size {
  color: #6c757d;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.checkmark {
  color: #4caf50;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 10px;
}

/* Make video upload area match image upload area */
.video-upload-area {
  width: 100%;
  height: 200px;
  border: 3px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  overflow: hidden;
}

.video-upload-area:hover:not(:disabled) {
  border-color: #3498db;
  background: #f8f9fa;
}

/* Remove old video styles */
.video-preview, .video-player, .video-info {
  display: none;
}

.error-message, .success-message {
  display: none;
}
}
        }
      `}</style>
    </div>
  );
};

export default CropCare;