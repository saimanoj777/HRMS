const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.onrender.com/api'
    : 'http://localhost:10000/api');

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized - Please log in again');
    }

    // Handle 404 Not Found
    if (res.status === 404) {
      throw new Error('Resource not found');
    }

    // Handle 500 Server errors
    if (res.status >= 500) {
      throw new Error('Server error - Please try again later');
    }

    const text = await res.text();
    
    // Handle empty responses
    if (!text) {
      return {};
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error('Invalid response format from server');
    }

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    // Network errors or other fetch issues
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error - Please check your connection');
    }
    
    // Re-throw other errors
    throw error;
  }
};

export default api;