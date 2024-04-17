import { create } from "zustand";
import { createStatusStore } from "./statusStore";

export const useMainStore = create((...a) => ({
    ...createStatusStore(...a)
}));
