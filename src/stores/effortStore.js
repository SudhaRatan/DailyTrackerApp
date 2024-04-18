import axios from "axios";
import { API_URL } from "../config";

export const createEffortStore = (set, get) => ({
  efforts: [],
  setEfforts: (e) => set((state) => ({ efforts: [...e] })),
  tempEfforts: [],
  setTempEfforts: (e) => set((state) => ({ tempEfforts: [...e] })),
  gettingEfforts: false,
  setGettingEfforts: (e) => set((state) => ({ gettingEfforts: e })),
  getEfforts: async () => {
    const setGettingEfforts = get().setGettingEfforts;
    const setTempEfforts = get().setTempEfforts;
    const setEfforts = get().setEfforts;
    try {
      setGettingEfforts(true);
      const res = await axios.get(`${API_URL}/api/Efforts`);
      setTempEfforts([...res.data.efforts]);
      setEfforts([...res.data.efforts]);
      setGettingEfforts(false);
    } catch (error) {
      setGettingEfforts(false);
      console.log(error);
    }
  },
});
