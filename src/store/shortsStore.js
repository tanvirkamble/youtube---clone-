import { create } from 'zustand';

const useShortsStore = create((set) => ({
  shorts: [],
  initialVideoId: null,

  setShorts: (data) => set({ shorts: data }),
  setInitialVideoId: (id) => set({ initialVideoId: id }),

  clearShorts: () => set({ shorts: [], initialVideoId: null }),
}));

export default useShortsStore;
