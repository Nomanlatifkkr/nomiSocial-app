import axios from "axios";
import { Access_token, getitem, removeitem, setitem } from "./Localstorage";

const AXiosClient = axios.create({
  baseURL: "http://localhost:8080", // Replace with your API base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous token refresh calls
let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// Axios Request Interceptor
AXiosClient.interceptors.request.use(
  (request) => {
    const accessToken = getitem(Access_token); // Get the access token from localStorage
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Axios Response Interceptor
AXiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 errors and if the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return AXiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.get("http://localhost:8080/token", {
          withCredentials: true,
        });

        const newAccessToken = response.data.token;

        setitem(Access_token, newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return AXiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);

        removeitem(Access_token);
        processQueue(refreshError, null);
        window.location.replace("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default AXiosClient;
