import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../utils/constants';
import { store } from '../store/store';
import { logout, setAccessToken } from '../store/slices/authSlice';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const accessToken = state.auth.accessToken;

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data.data;
                store.dispatch(setAccessToken(accessToken));

                // Retry the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                store.dispatch(logout());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
