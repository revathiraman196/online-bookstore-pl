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

    return config;
  });
}

export default axiosInstance;
