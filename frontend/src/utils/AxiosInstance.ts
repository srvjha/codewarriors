import axios from "axios";

const API = axios.create({
  baseURL:`${import.meta.env.VITE_PROD_ENV}/api/v1`,
  withCredentials: true, 
});


let isRefreshing = false;
interface FailedRequestCallback {
    (): void;
}

let failedRequestsQueue: FailedRequestCallback[] = [];


API.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    //console.log(error.response?.data?.error)
   
    if (error.response?.data?.error === "jwt expired" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequestsQueue.push(() => resolve(API(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await API.get("/auth/refresh", {
          withCredentials: true, 
        });

        failedRequestsQueue.forEach((callback) => callback());
        failedRequestsQueue = [];

        return API(originalRequest);
      } catch (refreshError) {
        failedRequestsQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;