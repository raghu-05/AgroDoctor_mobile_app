import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://agrodoctor-backend.onrender.com", // backend IP
  timeout: 20000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
