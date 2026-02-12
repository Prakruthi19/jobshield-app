import type { ProfileResponse } from "../types/profile";
import api from "./api";
export const getUserProfile = async (): Promise<ProfileResponse> => {
    const token = sessionStorage.getItem("accessToken");
    const res = await api.get(`/api/user/getUserProfile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const u = res.data.user;
      console.log("API Response:", res.data);
      console.log("User data:", u); 
    return {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        role: u.role,
    };
};

export const updateUserProfile = async (profileData: any) => {
    const token = sessionStorage.getItem("accessToken");
    return api.put(`/api/user/updateUserProfile`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}