import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase";

/*
Load sheet once
*/
export const loadSheet = async (sheetId: string) => {
  const docRef = doc(db, "sheets", sheetId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().cells || {};
  }

  return {};
};

/*
Save sheet
*/
export const saveSheet = async (
  sheetId: string,
  cells: Record<string, string>
) => {
  const docRef = doc(db, "sheets", sheetId);

  await setDoc(
    docRef,
    { cells },
    { merge: true }
  );
};

/*
Realtime listener
*/
export const subscribeSheet = (
  sheetId: string,
  callback: (cells: Record<string, string>) => void
) => {
  const docRef = doc(db, "sheets", sheetId);

  return onSnapshot(docRef, (snapshot) => {
    const data = snapshot.data();

    if (data?.cells) {
      callback(data.cells);
    }
  });
};

/*
Get all sheets
*/
export const getSheets = async () => {
  const snapshot = await getDocs(collection(db, "sheets"));

  const sheets: any[] = [];

  snapshot.forEach((docItem) => {
    sheets.push({
      id: docItem.id,
      ...docItem.data(),
    });
  });

  return sheets;
};

/*
Update sheet name
*/
export const updateSheetName = async (sheetId: string, name: string) => {
  const sheetRef = doc(db, "sheets", sheetId);

  await updateDoc(sheetRef, {
    name: name,
  });
};