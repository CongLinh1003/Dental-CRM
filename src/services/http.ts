import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
  timeout: 15000,
});

// Attach Authorization header from localStorage
http.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Debugging: log outgoing requests and incoming responses to help trace why login may be failing
http.interceptors.request.use((config) => {
  try {
    const method = config.method?.toUpperCase() || 'GET';
    // Log URL, method, params, and a short preview of body
    const info = {
      method,
      url: (config.baseURL || '') + (config.url || ''),
      params: config.params,
      data: config.data,
      headers: config.headers && (typeof (config.headers as Record<string, string>).Authorization === 'string'
        ? { Authorization: (config.headers as Record<string, string>).Authorization }
        : {}),
      timestamp: Date.now(),
    };
    console.debug('[http] Request ->', info);
    try { 
      (window as Window & { __lastHttpLog?: { request?: unknown; response?: unknown; error?: unknown } }).__lastHttpLog = { 
        ...((window as Window & { __lastHttpLog?: { request?: unknown; response?: unknown; error?: unknown } }).__lastHttpLog || {}), 
        request: info 
      }; 
    } catch (e) {}
  } catch (e) {
    // ignore logging errors
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    try {
      const info = {
        url: (response.config.baseURL || '') + (response.config.url || ''),
        status: response.status,
        data: response.data,
        timestamp: Date.now(),
      };
      console.debug('[http] Response <-', info);
      try { ((window as Window & { __lastHttpLog?: { request?: unknown; response?: unknown; error?: unknown } }).__lastHttpLog = { ...((window as Window & { __lastHttpLog?: { request?: unknown; response?: unknown; error?: unknown } }).__lastHttpLog || {}), response: info }); } catch (e) {}
    } catch (e) {}
    return response;
  },
  (error) => {
    try {
      const resp = error?.response;
      const info = {
        url: resp?.config && ((resp.config.baseURL || '') + (resp.config.url || '')),
        status: resp?.status,
        data: resp?.data,
        message: error.message,
        timestamp: Date.now(),
      };
      console.error('[http] Response error <-', info);
      try { 
        (window as Window & { __lastHttpLog?: { request?: unknown; response?: unknown; error?: unknown } }).__lastHttpLog = { 
          ...((window as Window & { __lastHttpLog?: { request?: unknown; response?: unknown; error?: unknown } }).__lastHttpLog || {}), 
          error: info 
        }; 
      } catch (e) {}
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default http;
