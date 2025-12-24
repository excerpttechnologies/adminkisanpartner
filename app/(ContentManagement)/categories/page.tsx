"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Tag, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  List 
} from "lucide-react";

interface Category {
  _id: string;
  categoryId: string;
  categoryName: string;
  image: string;
}

const CategoryPage: React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories on load
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/category");
      setCategories(res.data.category || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setResponseMsg("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMsg("");
    setLoading(true);

    const formData = new FormData();
    formData.append("categoryName", categoryName.trim());
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post("/api/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponseMsg(res.data.message || "Category added successfully");
      setCategoryName("");
      setImage(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      fetchCategories(); // refresh list
    } catch (err: any) {
      setResponseMsg(err.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditName(cat.categoryName);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Save edit
  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      setResponseMsg("Category name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/category/${id}`, {
        categoryName: editName.trim(),
      });
      setEditingId(null);
      fetchCategories();
      setResponseMsg("Category updated successfully");
    } catch (err: any) {
      setResponseMsg(err.response?.data?.message || "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/category/${id}`);
      fetchCategories();
      setResponseMsg("Category deleted successfully");
    } catch (err: any) {
      setResponseMsg(err.response?.data?.message || "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  // Get image URL - handle both local and uploaded images
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.png";
    
    // If it's a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a filename, assume it's in /uploads
    return `/uploads/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Category Management
              </h1>
              <p className="text-gray-600 mt-1">
                Organize and manage your product categories
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <List className="h-4 w-4 text-blue-600" />
              </div>
              <span>Total Categories: <strong className="text-gray-800">{categories.length}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              <span>Supports image uploads</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Edit2 className="h-4 w-4 text-purple-600" />
              </div>
              <span>Inline editing available</span>
            </div>
          </div>
        </div>

        {/* Response Message */}
        {responseMsg && (
          <div className={`mb-6 p-4 rounded-xl border-2 shadow-sm animate-fadeIn ${
            responseMsg.includes("Error") 
              ? "bg-red-50 border-red-200 text-red-800" 
              : "bg-green-50 border-green-200 text-green-800"
          }`}>
            <div className="flex items-center gap-3">
              {responseMsg.includes("Error") ? (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              )}
              <p className="font-medium">{responseMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Category Image <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: JPG, PNG, GIF, WebP • Max 5MB
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !categoryName.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add Category
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Category List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* List Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                      <List className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Category List</h2>
                      <p className="text-sm text-gray-600">
                        {categories.length} category{categories.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                  {loading && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                </div>
              </div>

              {/* Category Table */}
              <div className="overflow-x-auto">
                {loading && categories.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full mb-4">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Categories</h3>
                    <p className="text-gray-500">Please wait while we fetch your categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full mb-4">
                      <Tag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Categories Found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Get started by adding your first category using the form on the left.
                    </p>
                    <button
                      onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Category
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          ID & Details
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Category Name
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Image
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {categories.map((cat) => (
                        <tr 
                          key={cat._id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* ID & Details */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                                  <span className="text-sm font-bold text-blue-600">#{cat.categoryId}</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">ID: {cat._id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>

                          {/* Category Name */}
                          <td className="py-4 px-6">
                            {editingId === cat._id ? (
                              <div className="space-y-3">
                                <input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  disabled={loading}
                                  className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:bg-gray-100"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveEdit(cat._id)}
                                    disabled={loading || !editName.trim()}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                                  >
                                    {loading ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Save className="h-3 w-3" />
                                    )}
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                                  >
                                    <X className="h-3 w-3" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="group">
                                <span className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {cat.categoryName}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Image */}
                          <td className="py-4 px-6">
                            <div className="relative group">
                              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                                <img
                                  src={getImageUrl(cat.image)}
                                  alt={cat.categoryName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder-image.png";
                                  }}
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ImageIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6">
                            {editingId !== cat._id && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(cat)}
                                  disabled={loading}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all transform hover:-translate-y-0.5 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteCategory(cat._id)}
                                  disabled={loading}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all transform hover:-translate-y-0.5 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Manage all your product categories in one place. Add, edit, or delete categories as needed.
          </p>
        </div>
      </div>

      {/* Add some global styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;