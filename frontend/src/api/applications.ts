import api from "./api";
export const fetchEmployerApplications = async () => {
  const token = sessionStorage.getItem("accessToken");
  return api.get(`/api/applications/getEmployerApplications`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};