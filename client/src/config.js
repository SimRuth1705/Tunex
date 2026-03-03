// src/config.js
const isProduction = import.meta.env.PROD; // Auto-detects if running on Vercel

export const API_BASE_URL = isProduction 
  ? "https://tunex-backend-abc1.onrender.com" 
  : "http://localhost:5005";