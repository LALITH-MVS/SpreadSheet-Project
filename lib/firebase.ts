import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAPt0o-qHLF7kdPUdj4OFtmeXGiIaFrsfY",
  authDomain: "spreadsheet-b106c.firebaseapp.com",
  projectId: "spreadsheet-b106c",
  storageBucket: "spreadsheet-b106c.firebasestorage.app",
  messagingSenderId: "808122160190",
  appId: "1:808122160190:web:64e8d5050dd108d6a66d6f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);