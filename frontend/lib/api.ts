const API_BASE_URL = 'http://localhost:5000/api';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'AGENT';
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: LoginData) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getListings = async (filters?: {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.location) params.append('location', filters.location);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms);

  const res = await fetch(`${API_BASE_URL}/listings?${params.toString()}`);
  return res.json();
};

export const getListingById = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/listings/${id}`);
  return res.json();
};

export const createListing = async (data: {
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  images: string[];
}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMyListings = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/listings/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const deleteListing = async (id: number) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};