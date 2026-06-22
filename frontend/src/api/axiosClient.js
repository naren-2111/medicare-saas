import axios from "axios";
import { supabase } from "./supabaseClient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the current Supabase access token to every request
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data?.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

export default api;
