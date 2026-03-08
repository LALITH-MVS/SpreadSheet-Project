"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSheetStore } from "@/store/sheetStore";
import { saveSheet } from "@/lib/firestore";
import { evaluateFormula } from "@/lib/formulaEngine";

export default function Cell({ cellId }: { cellId: string }) {

  const [active, setActive] = useState(false);

  const setCell = useSheetStore((state) => state.setCell);
  const cells = useSheetStore((state: any) => state.cells);

  const params = useParams();
  const sheetId = params.id as string;

  const rawValue = cells[cellId] || "";

  let displayValue = rawValue;

  // Only calculate formula when NOT editing
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
        value={active ? rawValue : displayValue}

        onChange={(e) => {
          const newValue = e.target.value;

          setCell(cellId, newValue);

          const updatedCells = {
            ...cells,
            [cellId]: newValue,
          };

          saveSheet(sheetId, updatedCells);

          console.log("Saving cell:", sheetId, cellId, newValue);
        }}

        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}

        className={`w-full h-full px-2 outline-none bg-white text-black ${
          active ? "border-2 border-blue-500" : "border-none"
        }`}
      />

      {active && (
        <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -bottom-1 -right-1"></div>
      )}

    </div>
  );
}