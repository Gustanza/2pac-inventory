import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

axiosClient.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${window.localStorage.getItem('auth_token')}`
    return config;
})

export default axiosClient;