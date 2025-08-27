import { create } from "zustand";

interface BearState {
  open: boolean;
  setOpen: () => void;
}

export const useDialogStore = create<BearState>()((set) => ({
  open: false,
  setOpen: () => set((state) => ({ open: !state.open })),
}));
