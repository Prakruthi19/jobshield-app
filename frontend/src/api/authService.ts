import api from "./api";

// User registration
export const registerUser = (data: any) => {
  return api.post("/api/auth/register", data);
};
export const loginUser = (data: any) => {
  return api.post("/api/auth/login", data);
};
