"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { getSheets } from "@/lib/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {

  const router = useRouter();

  const [sheets, setSheets] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [search, setSearch] = useState("");

  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Protect dashboard
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


  // Load sheets
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


  const renameSheet = async (sheetId: string) => {

    if (!editingName.trim()) return;

    try {

      await updateDoc(doc(db, "sheets", sheetId), {
        name: editingName
      });

      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === sheetId ? { ...sheet, name: editingName } : sheet
        )
      );

      setEditingSheetId(null);

    } catch (error) {
      console.error("Rename error:", error);
    }

  };


  const formatDate = (timestamp: any) => {

    if (!timestamp) return "Just now";

    const date = timestamp.toDate();
    return date.toLocaleString();

  };


  // Filter + Sort sheets
  const filteredSheets = sheets
    .filter((sheet) =>
      sheet.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });


  return (

    <div className="min-h-screen bg-white">

      {/* HEADER */}

      <div className="flex justify-between items-center bg-green-600 px-10 py-4 shadow">

        <h1 className="text-2xl font-semibold text-black">
          Sheets
        </h1>

        <div className="flex items-center gap-6">

          <input
            type="text"
            placeholder="Search sheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-1 rounded border w-64 text-black"
          />

          <span className="text-black font-medium">
            {userName}
          </span>

          <button
            onClick={logout}
            className="bg-white text-black px-4 py-1 rounded shadow hover:bg-gray-100"
          >
            Logout
          </button>

        </div>

      </div>


      {/* CREATE NEW */}

      <div className="px-10 py-8">

        <h2 className="text-xl font-semibold text-black mb-4">
          Start a new spreadsheet
        </h2>

        <div
          onClick={createSheet}
          className="w-44 h-32 border-2 border-dashed border-green-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition"
        >

          <span className="text-4xl text-green-600">
            +
          </span>

          <p className="text-black mt-2">
            Blank Spreadsheet
          </p>

        </div>

      </div>


      {/* MY SHEETS */}

      <div className="px-10 pb-10">

        <h2 className="text-xl font-semibold text-black mb-6">
          My Sheets
        </h2>

        {filteredSheets.length === 0 && (
          <p className="text-gray-500">
            No sheets found
          </p>
        )}

        <div className="grid grid-cols-4 gap-6">

          {filteredSheets.map((sheet) => (

            <div
              key={sheet.id}
              onClick={() => router.push(`/sheet/${sheet.id}`)}
              className="bg-white border rounded-lg shadow hover:shadow-lg hover:bg-green-50 transition cursor-pointer"
            >

              <div className="h-32 bg-green-100 flex items-center justify-center text-4xl">
                📊
              </div>

              <div className="p-4">

                {editingSheetId === sheet.id ? (

                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => renameSheet(sheet.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameSheet(sheet.id);
                    }}
                    autoFocus
                    className="border px-2 py-1 w-full text-black"
                  />

                ) : (

                  <p
                    className="font-semibold text-black truncate"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingSheetId(sheet.id);
                      setEditingName(sheet.name || "Untitled Sheet");
                    }}
                  >
                    {sheet.name || "Untitled Sheet"}
                  </p>

                )}

                <p className="text-sm text-gray-600 mt-1">
                  Created: {formatDate(sheet.createdAt)}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}