"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getSheets } from "@/lib/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {

  const router = useRouter();

  const [sheets, setSheets] = useState<any[]>([]);
  const [userName, setUserName] = useState("");

  // Protect dashboard (login required)
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (!user) {
        router.push("/login");
      } else {
        setUserName(user.displayName || "User");
      }

    });

    return () => unsubscribe();

  }, [router]);

  // Load sheets when dashboard opens
  useEffect(() => {

    const loadSheets = async () => {
      const data = await getSheets();
      setSheets(data);
    };

    loadSheets();

  }, []);

  const createSheet = async () => {

    try {

      const docRef = await addDoc(collection(db, "sheets"), {
        name: "Untitled Sheet",
        createdAt: serverTimestamp(),
        cells: {}
      });

      router.push(`/sheet/${docRef.id}`);

    } catch (error) {
      console.error("Error creating sheet:", error);
    }

  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Sheets Clone Dashboard
        </h1>

        <div className="flex items-center gap-4">

          <span className="text-gray-700">
            {userName}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>

      </div>

      <button
        onClick={createSheet}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        + New Spreadsheet
      </button>

      <div className="bg-white rounded shadow p-4">

        <h2 className="text-xl font-semibold mb-4">
          My Sheets
        </h2>

        {sheets.length === 0 && (
          <p className="text-gray-500">No sheets yet</p>
        )}

        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            onClick={() => router.push(`/sheet/${sheet.id}`)}
            className="border p-3 rounded mb-2 hover:bg-gray-100 cursor-pointer"
          >
            {sheet.name || "Untitled Sheet"}
          </div>
        ))}

      </div>

    </div>
  );
}