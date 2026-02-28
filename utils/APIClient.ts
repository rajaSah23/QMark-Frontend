import axios from 'axios'
import { notifications } from '@mantine/notifications';
import { getUserData } from './Utility';

// Get the base URL from Vite environment variables
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/api`;
console.log("API_BASE_URL", API_BASE_URL);


// Axios instance with default headers
const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserData()?.token || ''}`,
    },
});

// Request interceptor to dynamically set the latest token
client.interceptors.request.use(
    (config) => {
        const token = getUserData()?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional response interceptor for global error handling
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can add custom error handling logic here
        return Promise.reject(error);
    }
);

// API Call Wrapper
const apiClient = {
    GET: (endpoint: any, params = {}) => client.get(endpoint, { params }),
    POST: (endpoint: any, data: any, config = {}) => client.post(endpoint, data, config),
    PUT: (endpoint: any, data: any) => client.put(endpoint, data),
    PATCH: (endpoint: any, data: any) => client.patch(endpoint, data),
    DELETE: (endpoint: any) => client.delete(endpoint),
};

export default apiClient;


export const reCapchaMatching = async (value: any) => {
    try {
        const response = await client.post("/verify-recapcha", value)
        return response.data;
    } catch (error) {
        return error
    }
}




export const toast = {
    success: (title: String, message = "") => {
        notifications.show({
            position: 'top-right',
            color: "green",
            title: title,
            message: message,
        })
    },
    error: (title: String, message = "") => {
        notifications.show({
            position: 'top-right',
            color: "red",
            title: title,
            message: message,
        })
    },
}