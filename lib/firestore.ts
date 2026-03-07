import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

import { app } from "./firebase";

export const db = getFirestore(app);

/*
  Save a single cell to Firestore
*/
export const saveCell = async (cellId: string, value: string) => {
  await setDoc(doc(db, "cells", cellId), {
    value,
  });
};

/*
  Listen to all cells in realtime
*/
export const subscribeCells = (callback: (cells: Record<string, string>) => void) => {
  const cellsRef = collection(db, "cells");

  return onSnapshot(cellsRef, (snapshot) => {
    const cells: Record<string, string> = {};

    snapshot.forEach((document) => {
      const data = document.data();
      cells[document.id] = data.value;
    });

    callback(cells);
  });
};