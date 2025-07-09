import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  selectedCategory: 'New',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetCategory: () => set({ selectedCategory: 'New' }),
}));

export default useSidebarStore;
