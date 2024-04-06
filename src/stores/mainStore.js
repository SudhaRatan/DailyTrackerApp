import { create } from "zustand";
import { createAuthStore } from "./authStore";

export const useMainStore = create((...a) => ({
  ...createAuthStore(...a),
}));
