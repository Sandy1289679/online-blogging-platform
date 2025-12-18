// src/helper/getenv.js
export const getEnv = (envname) => import.meta.env[envname];

// Auto-detect API base URL based on environment
export const getApiBaseUrl = () => {
  // In production (deployed on Vercel)
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_PROD_URL || 'https://online-blogging-platform-black.vercel.app/api';
  }
  // In development (localhost)
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
};
