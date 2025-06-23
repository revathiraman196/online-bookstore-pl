import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically add Basic Auth, but skip in Jest tests
if (!process.env.JEST_WORKER_ID) {
  axiosInstance.interceptors.request.use((config) => {
    const creds = 'katatest:katatest@123';
    const authHeader = 'Basic ' + btoa(creds);
    config.headers = { ...config.headers, Authorization: authHeader };
    return config;
  });
}

export default axiosInstance;
