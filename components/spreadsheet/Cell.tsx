"use client";

import { useParams } from "next/navigation";
import { useSheetStore } from "@/store/sheetStore";
import { saveSheet } from "@/lib/firestore";
import { evaluateFormula } from "@/lib/formulaEngine";

export default function Cell({
  cellId,
  activeCell,
  setActiveCell,
  onSaveStatusChange,
}: {
  cellId: string;
  activeCell: string;
  setActiveCell: (id: string) => void;
  onSaveStatusChange?: (status: "saving" | "saved") => void;
}) {

  const active = activeCell === cellId;

  const setCell = useSheetStore((state) => state.setCell);
  const cells = useSheetStore((state: any) => state.cells);

  const params = useParams();
  const sheetId = params.id as string;

  // NEW CELL STRUCTURE SUPPORT
  const cellData = cells[cellId] || { value: "" };

  const rawValue = cellData.value || "";

  let displayValue = rawValue;

  // Evaluate formula when NOT editing
  if (!active && rawValue.startsWith("=")) {
    displayValue = evaluateFormula(rawValue, cells);
  }

  return (
    <div
      className={`relative border border-gray-300 h-full w-full ${
        active ? "z-10" : ""
      }`}
    >
      <input
        data-cell={cellId}   // ⭐ IMPORTANT: used for keyboard navigation focus
        value={active ? rawValue : displayValue}

        onChange={async (e) => {

          const newValue = e.target.value;

          // Saving indicator
          onSaveStatusChange?.("saving");

          setCell(cellId, newValue);

          const updatedCells = {
            ...cells,
            [cellId]: {
              ...cells[cellId],
              value: newValue,
            },
          };

          await saveSheet(sheetId, updatedCells);

          setTimeout(() => {
            onSaveStatusChange?.("saved");
          }, 800);

        }}

        onFocus={() => setActiveCell(cellId)}

        className={`w-full h-full px-2 outline-none bg-white ${
          active ? "border-2 border-blue-500" : "border-none"
        }`}

        style={{
          fontWeight: cellData.bold ? "bold" : "normal",
          fontStyle: cellData.italic ? "italic" : "normal",
          color: cellData.color || "#000000",
        }}
      />

      {active && (
        <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -bottom-1 -right-1"></div>
      )}
    </div>
  );
}