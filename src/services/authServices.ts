import api from "@/lib/api";

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
};
