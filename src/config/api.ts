// Production API base URL if defined, otherwise localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  SITE_CONTENT: `${API_BASE_URL}/api/site-content`,
  UPLOAD: `${API_BASE_URL}/api/upload/image`,
  CHAT: `${API_BASE_URL}/api/chat`,
  UPDATE_SITE_CONTENT: `${API_BASE_URL}/api/site-content`,
};
