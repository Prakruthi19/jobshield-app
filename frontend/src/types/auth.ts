export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: "EMPLOYER" | "JOBSEEKER" | "ADMIN";
}

export interface RegisterResponse {
  message: string;
  role: string;
  userId: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface GoogleAuthResponse  {
  token: string;
  userId: string;
  role: "JOBSEEKER" | "EMPLOYER";
  userName: string;
  userEmail: string;
  profileComplete: boolean;
  isNewUser?: boolean;
  message?: string;
};
