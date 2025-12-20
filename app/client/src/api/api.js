import axios from "axios";
// import process from "process";

const NODE_ENV = "development";

export const baseURL = NODE_ENV === "production" ? "" : "http://localhost:5000";

export const baseAPIURL = `${baseURL}/api/v1`;

export const api = axios.create({ baseURL: baseAPIURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response?.status === 401 && !originalConfig._retry) {
      try {
        originalConfig._retry = true;
        const {
          data: { accessToken },
        } = await api.post("/auth/refresh", {}, { _retry: true });
        
        if (!accessToken) throw err;
        sessionStorage.setItem("accessToken", accessToken);

        return api(originalConfig);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);
