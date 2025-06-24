// src/api/axios.ts
import axios from 'axios';
import { logger } from '../utils/logger';

const creds = `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`;
const authHeader = 'Basic ' + btoa(creds);

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically add Basic Auth, but skip in Jest tests
if (!process.env.JEST_WORKER_ID) {
  axiosInstance.interceptors.request.use((config) => {
    // Add auth header
    if (config.headers) {
      // Try using .set() if available (AxiosHeaders)
      if (typeof (config.headers as any).set === 'function') {
        (config.headers as any).set('Authorization', authHeader);
      } else {
        // Otherwise, directly mutate the headers object
        (config.headers as any)['Authorization'] = authHeader;
      }
    } else {
      // headers is undefined, assign a new headers object (cast to any to avoid error)
      config.headers = { Authorization: authHeader } as any;
    }

    // Add logging here
    logger.info('Request:', config.method?.toUpperCase(), config.url, config.data);

    return config;
  });

  // Add response interceptor for logging
  axiosInstance.interceptors.response.use(
    (response) => {
      logger.info('Response:', response.config.url, response.data);
      return response;
    },
    (error) => {
      logger.error('Response error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
