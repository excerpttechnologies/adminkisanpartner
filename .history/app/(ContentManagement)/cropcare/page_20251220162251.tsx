


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
}

interface RecommendedSeed {
  name: string;
  image: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  subCategoryId: string | { 
    _id: string; 
    name: string; 
    categoryId: { _id: string; name: string } 
  };
  targetPestsDiseases: TargetPestDisease[];
  recommendedSeeds: RecommendedSeed[];
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Update the API_BASE_URL
const API_BASE_URL = '/api/cropcare';

// Keep all other code the same...
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
  
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [subCategoryImagePreview, setSubCategoryImagePreview] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [productName, setProductName] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  
  // Arrays for dynamic fields
  const [targetPestsDiseases, setTargetPestsDiseases] = useState<TargetPestDisease[]>([
    { name: '', image: '' }
  ]);
  
  const [recommendedSeeds, setRecommendedSeeds] = useState<RecommendedSeed[]>([
    { name: '', image: '', price: 0 }
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

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data
const fetchAllData = async () => {
  setLoading(true);
  try {
    const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/categories`),
      axios.get(`${API_BASE_URL}/subcategories`),
      axios.get(`${API_BASE_URL}/products`)
    ]);

    if (categoriesRes.data.success) {
      setCategories(categoriesRes.data.data);
      console.log('Categories loaded:', categoriesRes.data.data);
    }
    
    if (subcategoriesRes.data.success) {
      setSubCategories(subcategoriesRes.data.data);
      console.log('SubCategories loaded:', subcategoriesRes.data.data);
    }
    
    if (productsRes.data.success) {
      setProducts(productsRes.data.data);
      console.log('Products loaded:', productsRes.data.data);
    }
    
    // Calculate summary
    setSummary({
      categories: categoriesRes.data.success ? categoriesRes.data.data.length : 0,
      subCategories: subcategoriesRes.data.success ? subcategoriesRes.data.data.length : 0,
      products: productsRes.data.success ? productsRes.data.data.length : 0
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

  // Add new target pest/disease field
  const addTargetPestDisease = () => {
    setTargetPestsDiseases([
      ...targetPestsDiseases,
      { name: '', image: '' }
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
      { name: '', image: '', price: 0 }
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

  // Handle recommended seed change
  const handleRecommendedSeedChange = (index: number, field: keyof RecommendedSeed, value: string | number) => {
    const newSeeds = [...recommendedSeeds];
    newSeeds[index] = { ...newSeeds[index], [field]: value };
    setRecommendedSeeds(newSeeds);
  };

  // Clear category form
  const clearCategoryForm = () => {
    setCategoryName('');
    setCategoryImage(null);
    setCategoryImagePreview('');
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
    setSelectedSubCategory('');
    setTargetPestsDiseases([{ name: '', image: '' }]);
    setRecommendedSeeds([{ name: '', image: '', price: 0 }]);
    setEditMode(false);
    setCurrentEditId('');
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setCategoryName(category.name);
    setCategoryImagePreview(category.image || '');
    setEditMode(true);
    setCurrentEditId(category._id);
    setActiveTab('category');
  };

  // Handle edit subcategory
  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSubCategoryName(subCategory.name);
    setSubCategoryImagePreview(subCategory.image || '');
    setSelectedCategory(typeof subCategory.categoryId === 'string' ? subCategory.categoryId : subCategory.categoryId._id);
    setEditMode(true);
    setCurrentEditId(subCategory._id);
    setActiveTab('subCategory');
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setProductName(product.name);
    setSelectedSubCategory(typeof product.subCategoryId === 'string' ? product.subCategoryId : product.subCategoryId._id);
    setTargetPestsDiseases(product.targetPestsDiseases.length > 0 ? product.targetPestsDiseases : [{ name: '', image: '' }]);
    setRecommendedSeeds(product.recommendedSeeds.length > 0 ? product.recommendedSeeds : [{ name: '', image: '', price: 0 }]);
    setEditMode(true);
    setCurrentEditId(product._id);
    setActiveTab('product');
  };

  // Handle status change
  const handleStatusChange = async (type: 'category' | 'subcategory' | 'product', id: string, status: 'draft' | 'active' | 'inactive') => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;

    try {
      setLoading(true);
      const endpoint = `${API_BASE_URL}/${type}s?id=${id}`;
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
      const endpoint = `${API_BASE_URL}/${type}s?id=${id}`;
      const response = await axios.delete(endpoint);
      
      if (response.data.success) {
        alert(`"${name}" deleted successfully`);
        fetchAllData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error deleting:', error);
      alert(`Failed to delete: ${error.message}`);
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
      const categoryData = {
        name: categoryName.trim(),
        image: categoryImagePreview || '',
        status: 'active'
      };

      let response;
      if (editMode && currentEditId) {
        response = await axios.put(`${API_BASE_URL}/categories?id=${currentEditId}`, categoryData);
      } else {
        response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
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
      const subCategoryData = {
        name: subCategoryName.trim(),
        image: subCategoryImagePreview || '',
        categoryId: selectedCategory,
        status: 'active'
      };

      let response;
      if (editMode && currentEditId) {
        response = await axios.put(`${API_BASE_URL}/subcategories?id=${currentEditId}`, subCategoryData);
      } else {
        response = await axios.post(`${API_BASE_URL}/subcategories`, subCategoryData);
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
      const productData = {
        name: productName.trim(),
        subCategoryId: selectedSubCategory,
        targetPestsDiseases: validPests,
        recommendedSeeds: validSeeds,
        status: 'active'
      };

      let response;
      if (editMode && currentEditId) {
        response = await axios.put(`${API_BASE_URL}/products?id=${currentEditId}`, productData);
      } else {
        response = await axios.post(`${API_BASE_URL}/products`, productData);
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
    if (!category) {
      const subCategory = subCategories.find(sub => 
        typeof sub.categoryId !== 'string' && sub.categoryId._id === categoryId
      );
      return subCategory ? (subCategory.categoryId as any).name : 'Unknown';
    }
    return category.name;
  };

  // Get subcategory name by ID
  const getSubCategoryName = (subCategoryId: string) => {
    if (!subCategoryId) return 'Unknown';
    const subCategory = subCategories.find(sub => sub._id === subCategoryId);
    if (!subCategory) {
      const product = products.find(prod => 
        typeof prod.subCategoryId !== 'string' && prod.subCategoryId._id === subCategoryId
      );
      return product ? (product.subCategoryId as any).name : 'Unknown';
    }
    return subCategory.name;
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
    switch(status) {
      case 'active': return '#28a745';
      case 'inactive': return '#dc3545';
      case 'draft': return '#6c757d';
      default: return '#6c757d';
    }
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

      {/* Category Tab */}
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
              <label htmlFor="categoryImage">Category Image</label>
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
                  {categoryImagePreview ? (
                    <div className="image-preview">
                      <img src={categoryImagePreview} alt="Preview" />
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
                            {category?.?.length || 0}
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

      {/* Sub Category Tab */}
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
                  {subCategoryImagePreview ? (
                    <div className="image-preview">
                      <img src={subCategoryImagePreview} alt="Preview" />
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
                            : subCategory.categoryId.name
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
                            {subCategory?.products?.length || 0}
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

      {/* Product Tab */}
      {activeTab === 'product' && (
        <div className="tab-content">
          <h2>{editMode ? 'Edit' : 'Add New'} Product</h2>
          <div className="form-card">
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
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={pest.image}
                      onChange={(e) => handleTargetPestDiseaseChange(index, 'image', e.target.value)}
                      placeholder="https://example.com/pest-image.jpg"
                      disabled={loading}
                    />
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

            {/* Recommended Seeds Section */}
            <div className="dynamic-section">
              <h3>Recommended Seeds *</h3>
              {recommendedSeeds.map((seed, index) => (
                <div key={index} className="dynamic-field-group">
                  <div className="form-group">
                    <label>Seed Name</label>
                    <input
                      type="text"
                      value={seed.name}
                      onChange={(e) => handleRecommendedSeedChange(index, 'name', e.target.value)}
                      placeholder="e.g., Hybrid Maize, Bt Cotton"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={seed.image}
                      onChange={(e) => handleRecommendedSeedChange(index, 'image', e.target.value)}
                      placeholder="https://example.com/seed-image.jpg"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={seed.price}
                      onChange={(e) => handleRecommendedSeedChange(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  {recommendedSeeds.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeRecommendedSeed(index)}
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
                          {typeof product.subCategoryId === 'string'
                            ? getSubCategoryName(product.subCategoryId)
                            : product.subCategoryId.name
                          }
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

      {/* View Data Tab */}
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
                {categories.map((category) => (
                  <div key={category._id} className="tree-node">
                    <div className="node-header">
                      <div className="node-title">
                        <span className="node-icon">📁</span>
                        <strong>{category.name}</strong>
                        <span className="node-status" style={{ color: getStatusColor(category.status) }}>
                          ({category.status})
                        </span>
                      </div>
                      <div className="node-actions">
                        <button
                          className="action-btn small"
                          onClick={() => handleEditCategory(category)}
                          disabled={loading}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn small delete"
                          onClick={() => handleDelete('category', category._id, category.name)}
                          disabled={loading}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="node-children">
                      {subCategories
                        .filter(sub => typeof sub.categoryId === 'string' 
                          ? sub.categoryId === category._id 
                          : sub.categoryId._id === category._id
                        )
                        .map((subCategory) => (
                          <div key={subCategory._id} className="tree-node level-2">
                            <div className="node-header">
                              <div className="node-title">
                                <span className="node-icon">📂</span>
                                <span>{subCategory.name}</span>
                                <span className="node-status" style={{ color: getStatusColor(subCategory.status) }}>
                                  ({subCategory.status})
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
                              {products
                                .filter(prod => typeof prod.subCategoryId === 'string'
                                  ? prod.subCategoryId === subCategory._id
                                  : prod.subCategoryId._id === subCategory._id
                                )
                                .map((product) => (
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
                                      <div className="detail-section">
                                        <strong>🎯 Target Pests/Diseases:</strong>
                                        {product.targetPestsDiseases.map((pest, idx) => (
                                          <div key={idx} className="detail-item">
                                            {pest.name}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="detail-section">
                                        <strong>🌱 Recommended Seeds:</strong>
                                        {product.recommendedSeeds.map((seed, idx) => (
                                          <div key={idx} className="detail-item">
                                            {seed.name} - ₹{seed.price.toFixed(2)}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              {products.filter(prod => typeof prod.subCategoryId === 'string'
                                ? prod.subCategoryId === subCategory._id
                                : prod.subCategoryId._id === subCategory._id
                              ).length === 0 && (
                                <div className="no-children">
                                  No products in this sub category
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      {subCategories.filter(sub => typeof sub.categoryId === 'string' 
                        ? sub.categoryId === category._id 
                        : sub.categoryId._id === category._id
                      ).length === 0 && (
                        <div className="no-children">
                          No sub categories in this category
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-group input:disabled,
        .form-group select:disabled {
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
        }
      `}</style>
    </div>
  );
};

export default CropCare;