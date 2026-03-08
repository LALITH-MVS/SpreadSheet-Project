import { create } from "zustand";

type CellData = {
  value: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

type SheetState = {
  cells: Record<string, CellData>;

  setCell: (cellId: string, value: string) => void;

  setFormat: (
    cellId: string,
    format: Partial<Omit<CellData, "value">>
  ) => void;

  setCells: (cells: Record<string, CellData>) => void;
};

export const useSheetStore = create<SheetState>((set) => ({
  cells: {},

  setCell: (cellId, value) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: {
          ...state.cells[cellId],
          value,
        },
      },
    })),

  setFormat: (cellId, format) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: {
          ...state.cells[cellId],
          ...format,
        },
      },
    })),

  setCells: (cells) => set({ cells }),
}));