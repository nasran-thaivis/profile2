import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Profile API
export const profileAPI = {
  getByUsername: (username: string) =>
    api.get(`/users/${username}/profile`),
  update: (data: FormData) =>
    api.patch('/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Portfolio API
export const portfolioAPI = {
  getByUsername: (username: string) =>
    api.get(`/users/${username}/portfolio`),
  create: (data: FormData) =>
    api.post('/portfolio', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: number, data: FormData) =>
    api.patch(`/portfolio/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: number) =>
    api.delete(`/portfolio/${id}`),
};

// Education API
export const educationAPI = {
  getByUsername: (username: string) =>
    api.get(`/users/${username}/educations`),
  create: (data: {
    type: 'education' | 'internship';
    institution: string;
    degree: string;
    field?: string;
    period?: string;
    location?: string;
    description?: string;
    gpa?: string;
    skills?: string;
  }) =>
    api.post('/educations', data),
  update: (id: number, data: {
    type?: 'education' | 'internship';
    institution?: string;
    degree?: string;
    field?: string;
    period?: string;
    location?: string;
    description?: string;
    gpa?: string;
    skills?: string;
  }) =>
    api.patch(`/educations/${id}`, data),
  delete: (id: number) =>
    api.delete(`/educations/${id}`),
};

// About API
export const aboutAPI = {
  getByUsername: (username: string) =>
    api.get(`/users/${username}/about`),
  update: (data: { content?: string }) =>
    api.patch('/about', data),
};

// Contact API
export const contactAPI = {
  sendMessage: (data: { userId: number; senderName: string; senderEmail: string; message: string }) =>
    api.post('/contact', data),
  getMessages: (userId: number) =>
    api.get(`/contact/${userId}`),
  getMyMessages: () =>
    api.get('/contact'),
};

// Theme API
export const themeAPI = {
  getTheme: () =>
    api.get('/profile/theme'),
  updateTheme: (theme: any) =>
    api.patch('/profile/theme', theme),
};

export default api;

