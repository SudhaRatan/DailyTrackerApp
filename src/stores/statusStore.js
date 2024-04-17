export const createStatusStore = (set) => ({
    statuses:[],
    setStatuses:(statuses) => set((state) => ({statuses:[{id:0, name:"Select status"}, ...statuses]}))
})