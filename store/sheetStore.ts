import { create } from "zustand";

type SheetState = {
  cells: Record<string, string>;
  setCell: (cellId: string, value: string) => void;
  setCells: (cells: Record<string, string>) => void;
};

export const useSheetStore = create<SheetState>((set) => ({
  cells: {},

  setCell: (cellId, value) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: value,
      },
    })),

  setCells: (cells) => set({ cells }),
}));