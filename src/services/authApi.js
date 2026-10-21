import { request } from "./http";
export const authApi = {
  me: () => request("/auth/me"),
  options: () => request("/auth/options"),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  forgot: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      timeout: 25000,
    }),
  reset: (body) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  profile: (name) =>
    request("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  export: () => request("/auth/export"),
  deleteAccount: (password) =>
    request("/auth/account", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }),
};
