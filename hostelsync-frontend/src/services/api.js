import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostelsync_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('hostelsync_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            { refreshToken }
          );

          if (res.data.success) {
            localStorage.setItem(
              'hostelsync_access_token',
              res.data.data.accessToken
            );

            api.defaults.headers.common.Authorization =
              `Bearer ${res.data.data.accessToken}`;

            return api(originalRequest);
          }
        } catch (e) {
          localStorage.removeItem('hostelsync_access_token');
          localStorage.removeItem('hostelsync_refresh_token');
          localStorage.removeItem('hostelsync_user');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;