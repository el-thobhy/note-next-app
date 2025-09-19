import api from "@/lib/api";
import { RegisterModel } from "@/model/registerModel";

export const authService = {
  login: async (username: string, password: string) => {
    const { data } = await api.post("/api/Account/login", {
      username,
      password,
    });
    localStorage.setItem("token", data.data.token);
    return data;
  },
  getProfile: async (id: number, userName: string) => {
    const { data } = await api.get(
      `/api/account/getAccountById?id=${id}&userName=${userName}`
    );
    return data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },

  register: async (model: RegisterModel) => {
    const { data } = await api.post("/api/Account/Registration", model);
    localStorage.setItem("email", data.data.email);
    return data;
  },

  verificationEmail: async (otp: string) => {
    const { data } = await api.post("/api/Account/OtpVerification", {
      otp,
    });
    return data;
  },

  sendOtp: async () => {
    const email = localStorage.getItem("email");
    const { data } = await api.post("/api/Account/sendotp", {
      email,
    });
    return data;
  },
};
