import axios from "axios";

const API_URL = "http://localhost:9090/api";

const api = axios.create({
  baseURL: API_URL,
});

const getTokenSubject = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(paddedPayload)).sub ?? null;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId
    && storedUserId !== "undefined"
    && storedUserId !== "null"
    ? storedUserId
    : token
      ? getTokenSubject(token)
      : null;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["X-User-ID"] = userId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed:", {
      status: error.response?.status,
      data: typeof error.response?.data === "object"
        ? JSON.stringify(error.response.data)
        : error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  },
);

export const getActivity = () => api.get("/activities");
export const addActivity = (activity) => {
  console.log("Sending activity:", JSON.stringify(activity, null, 2));
  return api.post("/activities", activity);
};
export const getActivityDetail = (id) =>
  api.get(`/recommendations/activity/${id}`);
