const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper wrapper around fetch for API calls
 */
const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle body formatting
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// Authentication Services
export const loginUser = (credentials) =>
  fetchApi('/auth/login', { method: 'POST', body: credentials });

export const registerUser = (userData) =>
  fetchApi('/auth/register', { method: 'POST', body: userData });

export const getMe = () => fetchApi('/auth/me', { method: 'GET' });

// Resource Services
export const getResources = (queryParams = '') =>
  fetchApi(`/resources${queryParams ? `?${queryParams}` : ''}`, { method: 'GET' });

export const getResourceById = (id) =>
  fetchApi(`/resources/${id}`, { method: 'GET' });

export const downloadResource = (id) =>
  fetchApi(`/resources/${id}/download`, { method: 'GET' });

export const uploadResource = (formData) =>
  fetchApi('/resources', { method: 'POST', body: formData });

export const deleteResource = (id) =>
  fetchApi(`/resources/${id}`, { method: 'DELETE' });

// Ratings
export const rateResource = (id, rating) =>
  fetchApi(`/resources/${id}/rating`, { method: 'POST', body: { rating } });

export const deleteRating = (id) =>
  fetchApi(`/resources/${id}/rating`, { method: 'DELETE' });

// Bookmarks
export const bookmarkResource = (id) =>
  fetchApi(`/resources/${id}/bookmark`, { method: 'POST' });

export const removeBookmark = (id) =>
  fetchApi(`/resources/${id}/bookmark`, { method: 'DELETE' });

export const getUserBookmarks = () =>
  fetchApi('/users/me/bookmarks', { method: 'GET' });

// Reports
export const reportResource = (id, reason) =>
  fetchApi(`/resources/${id}/report`, { method: 'POST', body: { reason } });

// Admin Services
export const getAdminStats = () => fetchApi('/admin/stats', { method: 'GET' });

export const getAdminResources = (queryParams = '') =>
  fetchApi(`/admin/resources${queryParams ? `?${queryParams}` : ''}`, { method: 'GET' });

export const updateResourceStatus = (id, status) =>
  fetchApi(`/admin/resources/${id}/status`, { method: 'PATCH', body: { status } });

export const adminDeleteResource = (id) =>
  fetchApi(`/admin/resources/${id}`, { method: 'DELETE' });

export const getAdminReports = (queryParams = '') =>
  fetchApi(`/admin/reports${queryParams ? `?${queryParams}` : ''}`, { method: 'GET' });

export const updateReportStatus = (id, status) =>
  fetchApi(`/admin/reports/${id}/status`, { method: 'PATCH', body: { status } });

export const getAdminUsers = (queryParams = '') =>
  fetchApi(`/admin/users${queryParams ? `?${queryParams}` : ''}`, { method: 'GET' });
