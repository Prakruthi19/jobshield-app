import api from "./api";

export const fetchAllUsers = async () => {
  const token = sessionStorage.getItem("accessToken");
  const response = await api.get("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
}

export const fetchAllJobs = async () => {
const token = sessionStorage.getItem("accessToken");
  const response = await api.get("/api/admin/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const fetchStatstics = async () => {
  const token = sessionStorage.getItem("accessToken");
  const response = await api.get("/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}