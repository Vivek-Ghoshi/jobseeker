import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'https://api-demo.tecosys.ai/api',
 
  // withCredentials:true
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // dynamically fetch
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const setAuthToken = (token) => {
  if (token) {
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common['Authorization'];
  }
};
export default apiInstance;
