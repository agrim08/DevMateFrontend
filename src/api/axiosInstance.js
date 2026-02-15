import axios from "axios";
import { BASE_URL } from "../utils/constants";
import appStore from "../store";
import { setLoading, setError } from "../store/slices/uiSlice";
import { removeUser } from "../store/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Only set loading if not explicitly disabled in the request config
    if (config.showLoader !== false) {
      appStore.dispatch(setLoading(true));
    }
    return config;
  },
  (error) => {
    appStore.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    appStore.dispatch(setLoading(false));
    return response;
  },
  (error) => {
    appStore.dispatch(setLoading(false));
    
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - clear user if not already cleared
      appStore.dispatch(removeUser());
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error("Access forbidden");
    } else if (error.response?.status >= 500) {
      // Server error
      appStore.dispatch(setError("Server error. Please try again later."));
    }
    
    // If we want to show global toast error, we could do it here
    // or let the component handle it by rejecting the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
