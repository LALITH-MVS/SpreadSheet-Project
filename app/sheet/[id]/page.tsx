"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spreadsheet from "@/components/spreadsheet/Spreadsheet";
import { subscribeSheet, updateSheetName } from "@/lib/firestore";
import { useSheetStore } from "@/store/sheetStore";

export default function SheetPage() {

  const params = useParams();
  const sheetId = params.id as string;

  const setCells = useSheetStore((state) => state.setCells);

  const [name, setName] = useState("Untitled Sheet");

  useEffect(() => {

    // Clear old sheet data
    setCells({});

    // Start realtime listener
    const unsubscribe = subscribeSheet(
      sheetId,
      (cells: Record<string, string>) => {
        setCells(cells);
      }
    );

    return () => unsubscribe();

  }, [sheetId, setCells]);

  const handleNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const newName = e.target.value;

    setName(newName);

    await updateSheetName(sheetId, newName);

  };

  return (
    <div>

      {/* Editable Sheet Name */}
      <input
        value={name}
        onChange={handleNameChange}
        className="text-xl p-4 font-semibold outline-none border-b"
      />

      <Spreadsheet />

    </div>
  );
}