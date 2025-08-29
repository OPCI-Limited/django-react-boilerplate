import axios, { AxiosDefaults, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { createTokenCookies, getRefreshToken, getToken, removeTokenCookies } from '../utils/tokenCookies';
import { api } from './api';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface IFailedRequestQueue {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

let isRefreshing = false;
let failedRequestQueue: IFailedRequestQueue[] = [];

export function setAuthorizationHeader(request: AxiosDefaults | AxiosRequestConfig | any, token: string) {
  if (!request.headers) request.headers = {};
  request.headers.Authorization = `Bearer ${token}`;
}

function handleRefreshToken(refreshToken: string) {
  isRefreshing = true;

  // DRF SimpleJWT refresh endpoint
  api.post('/token/refresh/', { refresh: refreshToken })
    .then(response => {
      const access = (response.data as any).access;
      const newRefresh = (response.data as any).refresh || refreshToken;

      // Save rotated refresh if provided, otherwise keep current one
      createTokenCookies(access, newRefresh);
      setAuthorizationHeader(api.defaults, access);

      failedRequestQueue.forEach(request => request.onSuccess(access));
      failedRequestQueue = [];
    })
    .catch(error => {
      failedRequestQueue.forEach(request => request.onFailure(error));
      failedRequestQueue = [];

      removeTokenCookies();
    })
    .finally(() => {
      isRefreshing = false;
    });
}

function onRequest(config: AxiosRequestConfig): AxiosRequestConfig {
  const token = getToken();
  token && setAuthorizationHeader(config, token);
  return config;
}

function onRequestError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error);
}

function onResponse(response: AxiosResponse): AxiosResponse {
  return response;
}

function onResponseError(error: AxiosError): Promise<AxiosError | AxiosResponse> {
  if (error?.response?.status === 401) {
    const originalConfig = error.config;
    const refreshToken = getRefreshToken();

    // Avoid infinite loop on refresh/login endpoints
    const url = (originalConfig?.url || '').toString();
    const isAuthEndpoint = url.includes('/login/') || url.includes('/token/refresh/');

    if (refreshToken && !isAuthEndpoint) {
      if (!isRefreshing) handleRefreshToken(refreshToken);

      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: (token: string) => {
            setAuthorizationHeader(originalConfig, token);
            resolve(api(originalConfig));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          }
        });
      });
    }

    // No refresh token or auth endpoint failed: clear session
    removeTokenCookies();
  }

  return Promise.reject(error);
}

export function setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
