"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spreadsheet from "@/components/spreadsheet/Spreadsheet";
import { subscribeSheet, updateSheetName } from "@/lib/firestore";
import { useSheetStore } from "@/store/sheetStore";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

/* NEW IMPORTS */
import { registerPresence, subscribePresence } from "@/lib/presence";
import { getRandomColor } from "@/lib/userColor";

export default function SheetPage() {

  const params = useParams();
  const router = useRouter();
  const sheetId = params.id as string;

  const setCells = useSheetStore((state) => state.setCells);

  const [name, setName] = useState("Untitled Sheet");

  /* NEW STATE FOR ACTIVE USERS */
  const [users, setUsers] = useState<any[]>([]);

  // 🔒 Protect sheet (login required)
  useEffect(() => {

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {

      if (!user) {
        router.push("/login");
      }

    });

    return () => unsubscribeAuth();

  }, [router]);

  // Load sheet cells
  useEffect(() => {

    setCells({});

    const unsubscribe = subscribeSheet(
      sheetId,
      (cells: Record<string, string>) => {
        setCells(cells);
      }
    );

    return () => unsubscribe();

  }, [sheetId, setCells]);

  /* REGISTER USER PRESENCE */
  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const color = getRandomColor();

    registerPresence(
      sheetId,
      user.uid,
      user.displayName || "User",
      color
    );

  }, [sheetId]);

  /* LISTEN FOR ACTIVE USERS */
  useEffect(() => {

    const unsubscribe = subscribePresence(sheetId, (users) => {
      setUsers(users);
    });

    return () => unsubscribe();

  }, [sheetId]);

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

      {/* ACTIVE USERS UI */}
      <div className="flex gap-4 p-3 items-center">

        {users.map((user, index) => (

          <div
            key={index}
            className="flex items-center gap-2 text-sm font-medium text-black"
          >

            <div
              style={{ backgroundColor: user.color }}
              className="w-3 h-3 rounded-full"
            />

            <span className="text-black">{user.name}</span>

          </div>

        ))}

      </div>

      <Spreadsheet />

    </div>
  );
}