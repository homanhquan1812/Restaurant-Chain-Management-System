import axios from 'axios';
import config from '../constants/config';

const axiosInstance = axios.create({
  baseURL: config.BASE_API_URL,
  timeout: 30000, // 10 giây timeout sau nhớ chỉnh lại 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor (tự động attach token vào header nếu có)
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem('token');
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (xử lý lỗi chung)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu có lỗi từ server trả về
    if (error.response) {
      const status = error.response.status;

      // Ví dụ: Unauthorized -> Token hết hạn -> Xử lý logout hoặc redirect
      if (status === 401) {
        console.warn("Unauthorized - Token hết hạn hoặc không hợp lệ.");
        // Có thể thêm logic logout hoặc redirect ở đây
      }

      console.error(
        `API Error [${status}]:`,
        error.response.data?.message || error.message
      );
    } else {
      // Lỗi mạng hoặc không kết nối được
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
