"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spreadsheet from "@/components/spreadsheet/Spreadsheet";
import { subscribeSheet, updateSheetName } from "@/lib/firestore";
import { useSheetStore } from "@/store/sheetStore";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

/* NEW IMPORTS */
import { registerPresence, subscribePresence, removePresence } from "@/lib/presence";
import { getRandomColor } from "@/lib/userColor";

export default function SheetPage() {

  const params = useParams();
  const router = useRouter();
  const sheetId = params.id as string;

  const setCells = useSheetStore((state) => state.setCells);

  const [name, setName] = useState("Untitled Sheet");

  /* ACTIVE USERS STATE */
  const [users, setUsers] = useState<any[]>([]);

  /* SAVE STATUS STATE */
  const [saveStatus, setSaveStatus] = useState("saved");

  // 🔒 Protect sheet (login required)
  useEffect(() => {

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {

      if (!user) {
        router.push("/login");
      }

    });

    return () => unsubscribeAuth();

  }, [router]);

  // 📡 Load sheet cells + saving indicator
  useEffect(() => {

    setCells({});

    const unsubscribe = subscribeSheet(
      sheetId,
      (cells: Record<string, string>) => {

        setSaveStatus("saving");

        setCells(cells);

        // delay saved indicator so user can see it
        setTimeout(() => {
          setSaveStatus("saved");
        }, 1000);

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

    return () => {
      removePresence(sheetId, user.uid);
    };

  }, [sheetId]);

  /* REMOVE USER WHEN BROWSER CLOSES */
  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const handleUnload = () => {
      removePresence(sheetId, user.uid);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };

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

      {/* HEADER WITH SAVE STATUS */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">

        <input
          value={name}
          onChange={handleNameChange}
          className="text-xl font-semibold outline-none"
        />

        {/* SAVE STATUS UI */}
        <div className="flex items-center gap-2 text-sm font-medium">

          {saveStatus === "saving" && (
            <>
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-orange-500">Saving...</span>
            </>
          )}

          {saveStatus === "saved" && (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-green-600">Saved</span>
            </>
          )}

        </div>

      </div>

      {/* ACTIVE USERS UI */}
      <div className="flex gap-4 p-3 items-center">

        <p className="text-xs text-black font-bold px-3">
          Active users
        </p>

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