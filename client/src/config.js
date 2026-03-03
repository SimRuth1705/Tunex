// src/config.js
const isProduction = true; 

export const API_BASE_URL = isProduction 
  ? "https://tunex-backend.onrender.com" // ✅ Your actual Render URL
  : "http://localhost:5005";