import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", 
});

axiosClient.interceptors.request.use((config)=>{
  const accessToken = sessionStorage.getItem('access_token');
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
})

export default axiosClient;