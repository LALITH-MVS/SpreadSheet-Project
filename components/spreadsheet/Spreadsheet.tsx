"use client";

import { useEffect } from "react";
import Row from "./Row";
import { subscribeCells } from "@/lib/firestore";
import { useSheetStore } from "@/store/sheetStore";

const ROWS = 50;
const COLS = 20;

export default function Spreadsheet() {

  const rows = Array.from({ length: ROWS }, (_, i) => i + 1);
  const cols = Array.from({ length: COLS }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const setCells = useSheetStore((state) => state.setCells);

  // 🔹 Realtime Firestore listener
  useEffect(() => {
    const unsubscribe = subscribeCells((cells) => {
      setCells(cells);
    });

    return () => unsubscribe();
  }, [setCells]);

  return (
    <div className="w-full h-screen overflow-auto">

      {/* Column Headers */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `60px repeat(${COLS}, 110px)` }}
      >
        <div className="bg-gray-100 border border-gray-300"></div>

        {cols.map((col) => (
          <div
            key={col}
            className="border border-gray-300 h-10 flex items-center justify-center bg-gray-100 font-medium text-gray-700"
          >
            {col}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row) => (
        <Row key={row} rowIndex={row} />
      ))}

    </div>
  );
}