"use client";

import { useState } from "react";
import { useSheetStore } from "@/store/sheetStore";

export default function Cell({ cellId }: { cellId: string }) {
  const [active, setActive] = useState(false);

  const value = useSheetStore((state) => state.cells[cellId] || "");
  const setCell = useSheetStore((state) => state.setCell);
  const cells = useSheetStore((state: any) => state.cells);
  

  return (
    <div
      className={`relative border border-gray-300 h-full w-full ${
        active ? "z-10" : ""
      }`}
    >
      <input
        value={value}
        onChange={(e) => setCell(cellId, e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={`w-full h-full px-2 outline-none bg-white text-black ${
          active ? "border-2 border-blue-500" : "border-none"
        }`}
      />

      {/* Fill Handle */}
      {active && (
        <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -bottom-1 -right-1"></div>
      )}
    </div>
  );
}