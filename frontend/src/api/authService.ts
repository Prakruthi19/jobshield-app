import type { GoogleAuthResponse } from "../types/auth";
import api from "./api";
// User registration
export const registerUser = (data: any) => {
  return api.post("/api/auth/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return api.post("/api/auth/login", data);
};

export const logoutUser = async () => {
  const token = sessionStorage.getItem("accessToken");
  return api.post("/api/auth/logout", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const googleLogin = async (credential: string, role: string): Promise<GoogleAuthResponse> => {
  const res = await api.post<GoogleAuthResponse>("/api/auth/google-login", {
   token:  credential,
   loginType: role,
  });

  return res.data;
};


export const adminEnter = (endpoint: "/admin/login" | "/admin/register", data: any) => {
  return api.post("/api" + endpoint, data);
};
