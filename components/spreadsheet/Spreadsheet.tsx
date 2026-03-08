"use client";

import { useState, useEffect } from "react";
import Row from "./Row";
import { useSheetStore } from "@/store/sheetStore";

const ROWS = 50;
const COLS = 20;

export default function Spreadsheet() {

  // Generate rows and columns
  const rows = Array.from({ length: ROWS }, (_, i) => i + 1);
  const cols = Array.from({ length: COLS }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Get cells from Zustand
  const cells = useSheetStore((state: any) => state.cells);

  // Active cell state
  const [activeCell, setActiveCell] = useState("A1");

  // Keyboard navigation
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {

      const colLetter = activeCell.match(/[A-Z]+/)?.[0] || "A";
      const rowNumber = parseInt(activeCell.match(/\d+/)?.[0] || "1");

      let col = colLetter.charCodeAt(0);
      let row = rowNumber;

      if (e.key === "ArrowRight") col += 1;
      if (e.key === "ArrowLeft") col -= 1;
      if (e.key === "ArrowDown") row += 1;
      if (e.key === "ArrowUp") row -= 1;

      if (e.key === "Enter") row += 1;

      if (e.key === "Tab") {
        e.preventDefault();
        col += 1;
      }

      if (col < 65) col = 65;
      if (row < 1) row = 1;

      const newCell = `${String.fromCharCode(col)}${row}`;

      setActiveCell(newCell);

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [activeCell]);

  // CSV Export
  const exportCSV = () => {

    let csv = "";

    rows.forEach((row) => {

      const rowData = cols.map((col) => {

        const cellId = `${col}${row}`;

        return cells[cellId] || "";

      });

      csv += rowData.join(",") + "\n";

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "spreadsheet.csv";

    a.click();

    URL.revokeObjectURL(url);

  };

  return (
    <div className="w-full h-screen overflow-auto">

      {/* Toolbar */}
      <div className="flex justify-end px-4 py-2">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

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
        <Row
          key={row}
          rowIndex={row}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
      ))}

    </div>
  );
}