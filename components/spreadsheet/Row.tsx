"use client";

import Cell from "./Cell";

const COLS = 20;

export default function Row({
  rowIndex,
  activeCell,
  setActiveCell,
}: {
  rowIndex: number;
  activeCell: string;
  setActiveCell: (id: string) => void;
}) {

  const cols = Array.from({ length: COLS }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div
      className="grid h-5"
      style={{ gridTemplateColumns: `60px repeat(${COLS}, 110px)` }}
    >
      {/* Row number */}
      <div className="border border-gray-300 flex items-center justify-center bg-gray-100 text-gray-700">
        {rowIndex}
      </div>

      {cols.map((col) => (
        <Cell
          key={col}
          cellId={`${col}${rowIndex}`}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
      ))}
    </div>
  );
}