import axois from "axios";

let apiClient = axois.create({
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
    console.log("removed interceptor");
  } else {
    console.log("was null");
  }
};

export default apiClient;
