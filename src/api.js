import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const refreshResponse = await axios.get('http://localhost:3000/auth/refresh', {
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api.request(originalRequest);
        
      } catch (refreshError) {
        console.error('Refresh token expired or invalid. Logging out.');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);