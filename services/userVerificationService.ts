// services/userVerificationService.ts

// IUser is the shape returned by the API (after .lean() — _id is serialized as string)
export interface IUser {
  _id: string;                  // ✅ string here because JSON serializes ObjectId as string
  mobileNumber: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  name: string;
  email?: string;
  address?: string;
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  role: string;
  isActive: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = '/api/users';

// GET /api/users — fetch all users (optional ?status= filter)
export const getUsers = async (status?: string) => {
  try {
    const url = status ? `${BASE_URL}?status=${status}` : BASE_URL;
    const res = await fetch(url);
    const data = await res.json();
    return data; // { success: boolean, data: IUser[] }
  } catch {
    return { success: false, message: 'Failed to fetch users' };
  }
};

// GET /api/users/:id
export const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Failed to fetch user' };
  }
};

// PATCH /api/users/:id — verify or reject
export const updateUserVerificationStatus = async (
  id: string,
  status: 'verified' | 'rejected',
  rejectionReason?: string
) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason, verifiedBy: 'Admin' }),
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Failed to update verification status' };
  }
};

// DELETE /api/users/:id
export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Failed to delete user' };
  }
};