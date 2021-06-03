import axois from "axios";

let apiClient = axois.create({
  baseURL: "https://foodzy-backend.herokuapp.com/api/v1",
});

export const setClientToken = (token: string) => {
  apiClient.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default apiClient;
