const API_BASE_URL = 'http://localhost:5000/api';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
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