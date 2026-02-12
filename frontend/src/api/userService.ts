import type { ProfileResponse } from "../types/profile";
import api from "./api";
export const getUserProfile = async (userId: string): Promise<ProfileResponse> => {
    const token = sessionStorage.getItem("accessToken");

    const res = await api.get(`/api/user/getUserProfile/${userId}`, {
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

export const updateUserProfile = async (userId: string, profileData: any) => {
    const token = sessionStorage.getItem("accessToken");
    return api.put(`/api/user/updateUserProfile/${userId}`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}