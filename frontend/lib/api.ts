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

export const createReport = async (data: {
  agentName: string;
  agentPhone: string;
  description: string;
  area: string;
}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

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

export const searchReports = async (query: string) => {
  const res = await fetch(`${API_BASE_URL}/reports/search?query=${encodeURIComponent(query)}`);
  return res.json();
};

export const getRecentReports = async () => {
  const res = await fetch(`${API_BASE_URL}/reports/recent`);
  return res.json();
};

export const getAgentReports = async (phone: string) => {
  const res = await fetch(`${API_BASE_URL}/reports/agent/${encodeURIComponent(phone)}`);
  return res.json();
};