import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const bookingRef = collection(db, "bookings");

    const docRef = await addDoc(bookingRef, {
      ...bookingData,
      status: bookingData.status || "pending",
      paymentStatus: bookingData.paymentStatus || "pending",
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Get all bookings (for admin)
export const getAllBookings = async () => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting bookings:", error);
    throw error;
  }
};

// Get booking by payment reference
export const getBookingByReference = async (reference) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("paymentReference", "==", reference));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error getting booking by reference:", error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

// Delete booking
export const deleteBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

// Get bookings by customer email (for user order history)
export const getBookingsByEmail = async (email) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("customer.email", "==", email),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting bookings by email:", error);
    throw error;
  }
};
