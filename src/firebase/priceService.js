import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getPrices = async () => {
  const ref = doc(db, "prices", "default");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Prices document not found");
  }

  return snap.data();
};

export const updatePrices = async (newPrices) => {
  const ref = doc(db, "prices", "default");
  await updateDoc(ref, newPrices);
};