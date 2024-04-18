import { create } from "zustand";
import { createStatusStore } from "./statusStore";
import { createEffortStore } from "./effortStore";

export const useMainStore = create((...a) => ({
    ...createStatusStore(...a),
    ...createEffortStore(...a)
}));
