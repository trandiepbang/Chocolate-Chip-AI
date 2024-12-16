import axios from 'axios';
import { API_BASE_URL } from "@/constants/api";

const instance = axios.create({
  baseURL: API_BASE_URL
});

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      const data = error.response.data;
      if (data) {
        if (data.error) return Promise.reject(data.error.toString());
        return Promise.reject(data.toString());
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

