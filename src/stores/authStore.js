export const createAuthStore = (set) => ({
  token: null,
  name: null,
  role: null,
  login: ({ token, name, role }) =>
    set((state) => ({ token: token, name: name, role: role })),
  logout: () => set((state) => ({ token: null, name: null, role: null })),
});
