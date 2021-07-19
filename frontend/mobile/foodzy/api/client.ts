import axios from "axios";

let apiClient = axios.create({
  baseURL: "https://foodzy-backend.herokuapp.com/api/v1",
});

let tokenInterceptor: any = null;

export const setClientToken = (token: string) => {
  tokenInterceptor = apiClient.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export const removeClientTokenInterceptor = () => {
  if (tokenInterceptor !== null) {
    apiClient.interceptors.request.eject(tokenInterceptor);
  }
};

export default apiClient;
