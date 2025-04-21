import { ROOT_API_URL } from "@/config";
import type { InternalAxiosRequestConfig } from "axios";
import Axios, { AxiosHeaders } from "axios";
import { getCookie, setCookie } from "cookies-next";

import { clearStorage } from "./clearStorage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const handleLogout = () => {
  clearStorage();
  window.location.replace("/auth/login");
};

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getCookie(ACCESS_TOKEN);

  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    (config.headers as AxiosHeaders).set("authorization", `Bearer ${token}`);
  }
  return config;
};

const axios = Axios.create({
  baseURL: ROOT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosRefresh = Axios.create({
  baseURL: ROOT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(authRequestInterceptor);

axios.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }
      if (originalRequest._retryCount >= 3) {
        handleLogout();
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        const token = getCookie(REFRESH_TOKEN);

        if (!token) {
          handleLogout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        originalRequest._retryCount++;

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const response: any = await axiosRefresh.post(
            "/api/auth/v1/token/refresh/",
            {
              refresh: token,
            }
          );

          const tokens = response?.data?.data?.tokens;

          const refreshToken = tokens?.refresh;
          const accessToken = tokens?.access;

          setCookie(REFRESH_TOKEN, refreshToken, {
            secure: false,
            path: "/",
          });
          setCookie(ACCESS_TOKEN, accessToken, {
            secure: false,
            path: "/",
          });

          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }
          (originalRequest.headers as AxiosHeaders).set(
            "authorization",
            `Bearer ${accessToken}`
          );
          originalRequest._retry = false;
          return axios(originalRequest);
        } catch (retryError) {
          originalRequest._retry = false;
          return Promise.reject(retryError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export { axios };
