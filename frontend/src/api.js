import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Set to true if using cookies/sessions
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);
// Create different axios instances for different endpoints
export const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Or try with different base URL
export const ticketsApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Support API endpoints
export const supportApi = {
  createTicket: (ticketData) => {
    console.log('Creating ticket:', ticketData);
    return apiClient.post('/support/tickets', ticketData);
  },
  
  getUserTickets: (userId) => {
    return apiClient.get(`/support/tickets/user/${userId}`);
  },
  
  getAllTickets: () => {
    return apiClient.get('/support/tickets/all');
  },
  
  getOpenTickets: () => {
    return apiClient.get('/support/tickets/open');
  },
  
  getTicketById: (ticketId) => {
    return apiClient.get(`/support/tickets/${ticketId}`);
  },
  
  updateTicketStatus: (ticketId, status) => {
    return apiClient.put(`/support/tickets/${ticketId}/status`, { status });
  },
  
  addMessageToTicket: (ticketId, messageData) => {
    return apiClient.post(`/support/tickets/${ticketId}/messages`, messageData);
  },
  
  getTicketMessages: (ticketId) => {
    return apiClient.get(`/support/tickets/${ticketId}/messages`);
  },
  
  getUserNotifications: (userId, userRole) => {
    return apiClient.get(`/support/notifications/${userId}/${userRole}`);
  },
  
  markNotificationAsRead: (notificationId) => {
    return apiClient.put(`/support/notifications/${notificationId}/read`);
  },
  
  markAllNotificationsAsRead: (userId, userRole) => {
    return apiClient.put(`/support/notifications/read-all/${userId}/${userRole}`);
  },
  
  getSupportStats: () => {
    return apiClient.get('/support/stats');
  }
};

// Other APIs
export const cropApi = {
  getAllCrops: () => apiClient.get('/crops'),
  getCropById: (id) => apiClient.get(`/crops/${id}`),
};

export const batchApi = {
  getBatchById: (batchId) => apiClient.get(`/batches/${batchId}`),
  getBatchTrace: (batchId) => apiClient.get(`/batches/${batchId}/trace`),
};

export const traceApi = {
  getTraceByBatchId: (batchId) => apiClient.get(`/trace/${batchId}`),
};

// Default export for backward compatibility
export default {
  // Direct axios methods
  get: (url) => apiClient.get(url),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
  
  // Named APIs
  cropApi,
  batchApi,
  traceApi,
  supportApi,
};