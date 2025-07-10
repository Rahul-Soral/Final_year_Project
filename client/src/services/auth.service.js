import axios from 'axios';

// For production
// const API_URL = 'https://acko.herokuapp.com';

// For local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

console.log('Using API URL:', API_URL); // Add this line for debugging

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second timeout for slower connections
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('acko_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration (but don't force redirect to login)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear it but don't redirect
      // Users can continue using the app without authentication
      localStorage.removeItem('acko_token');
      localStorage.removeItem('acko_user');
      console.log('Authentication token cleared - continuing without authentication');
    }
    return Promise.reject(error);
  }
);

// Authentication service
const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.data && response.data.data.token) {
        localStorage.setItem('acko_token', response.data.data.token);
        localStorage.setItem('acko_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'ECONNABORTED') {
        throw { message: 'Request timed out. Please try again.' };
      } else if (!error.response) {
        throw { message: 'Network error. Please check your connection and try again.' };
      }
      throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
  },

  // Login a user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.data && response.data.data.token) {
        localStorage.setItem('acko_token', response.data.data.token);
        localStorage.setItem('acko_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ECONNABORTED') {
        throw { message: 'Request timed out. Please try again.' };
      } else if (!error.response) {
        throw { message: 'Network error. Please check your connection and try again.' };
      }
      throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem('acko_token');
    localStorage.removeItem('acko_user');
    localStorage.removeItem('ackoUserId');
    localStorage.removeItem('ackoid');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('acko_user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('acko_token');
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/user/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default AuthService; 