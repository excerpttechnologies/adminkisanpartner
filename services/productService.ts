// const API_BASE_URL = '/api';

// export interface IProductItem {
//   _id?: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   imageUrl: string;
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Fetch all products
// export async function getProducts(params?: {
//   page?: number;
//   limit?: number;
//   search?: string;
//   category?: string;
//   status?: string;
// }) {
//   const queryParams = new URLSearchParams();
//   if (params?.page) queryParams.append('page', params.page.toString());
//   if (params?.limit) queryParams.append('limit', params.limit.toString());
//   if (params?.search) queryParams.append('search', params.search);
//   if (params?.category) queryParams.append('category', params.category);
//   if (params?.status) queryParams.append('status', params.status);
  
//   const url = `${API_BASE_URL}/product-items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
//   const response = await fetch(url);
//   return response.json();
// }

// // Fetch single product by ID
// export async function getProduct(id: string) {
//   const response = await fetch(`${API_BASE_URL}/product-items/${id}`);
//   return response.json();
// }

// // Create product
// export async function createProduct(productData: Omit<IProductItem, '_id' | 'createdAt' | 'updatedAt'>) {
//   const response = await fetch(`${API_BASE_URL}/product-items`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(productData),
//   });
//   return response.json();
// }

// // Update product by ID
// export async function updateProduct(id: string, productData: Partial<IProductItem>) {
//   const response = await fetch(`${API_BASE_URL}/product-items/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(productData),
//   });
//   return response.json();
// }

// // Delete product by ID
// export async function deleteProduct(id: string) {
//   const response = await fetch(`${API_BASE_URL}/product-items/${id}`, {
//     method: 'DELETE',
//   });
//   return response.json();
// }

// // Get dashboard stats
// export async function getProductStats() {
//   const response = await fetch(`${API_BASE_URL}/product-stats`);
//   return response.json();
// }












































const API_BASE_URL = '/api';

export interface IProductItem {
  _id?: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  images: string[];
  minOrderQty: number;
  unit: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);

  const url = `${API_BASE_URL}/product-items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await fetch(url);
  return response.json();
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/product-items/${id}`);
  return response.json();
}

export async function createProduct(productData: Omit<IProductItem, '_id' | 'createdAt' | 'updatedAt'>) {
  const response = await fetch(`${API_BASE_URL}/product-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return response.json();
}

export async function updateProduct(id: string, productData: Partial<IProductItem>) {
  const response = await fetch(`${API_BASE_URL}/product-items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/product-items/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function getProductStats() {
  const response = await fetch(`${API_BASE_URL}/product-stats`);
  return response.json();
}