import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Create a new contact message
export const createContactMessage = async (messageData) => {
  try {
    const messagesRef = collection(db, "contact_messages");

    await addDoc(messagesRef, {
      ...messageData,
      status: "unread",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    throw error;
  }
};
