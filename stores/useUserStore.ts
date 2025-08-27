import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: string;
  setUser: (userData: string) => void;
  clearuser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: "",
      setUser: (userData) => set({ user: userData }),
      clearuser: () => set({ user: "" }),
    }),
    {
      name: "user-storage",
    }
  )
);
