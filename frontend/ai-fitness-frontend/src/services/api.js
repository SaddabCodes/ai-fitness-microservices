import axios from "axios";

const API_URL = "http://localhost:9090/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["X-User-ID"] = userId;
    }

    return config;
});

export const getActivity = () => api.get("/activities");
export const addActivity = (activity) => {
  console.log("Sending activity:", JSON.stringify(activity, null, 2));
  return api.post("/activities", activity);
};
export const getActivityDetail = (id) =>
  api.get(`/recommendations/activities/${id}`);
