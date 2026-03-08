import { db } from "./firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";

/* Register user presence */

export const registerPresence = async (
  sheetId: string,
  userId: string,
  name: string,
  color: string
) => {

  await setDoc(
    doc(db, "presence", sheetId, "users", userId),
    {
      name,
      color,
      lastActive: serverTimestamp()
    }
  );

};

/* Listen for active users */

export const subscribePresence = (
  sheetId: string,
  callback: (users: any[]) => void
) => {

  const ref = collection(db, "presence", sheetId, "users");

  return onSnapshot(ref, (snapshot) => {

    const users: any[] = [];

    snapshot.forEach((doc) => {
      users.push(doc.data());
    });

    callback(users);

  });

};

/* Remove user presence when leaving */

export const removePresence = async (
  sheetId: string,
  userId: string
) => {

  await deleteDoc(
    doc(db, "presence", sheetId, "users", userId)
  );

};