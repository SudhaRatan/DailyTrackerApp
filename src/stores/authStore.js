import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useAuthStore = create(
  persist(
    (set) => ({
      loggedIn: false,
      name: null,
      role: null,
      userId:null,
      employeeId:null,
      login: ({ name, role, userId, employeeId }) =>
        set((state) => ({ loggedIn: true, name: name, role: role, userId: userId, employeeId: employeeId })),
      logout: () =>
        set((state) => ({ loggedIn: false, name: null, role: null, userId: null, employeeId: null  })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
