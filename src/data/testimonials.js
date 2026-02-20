import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export const getTestimonials = async () => {
  const testimonialsRef = collection(db, "testimonials");
  const snapshot = await getDocs(testimonialsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addTestimonial = async (testimonialData) => {
  const testimonialsRef = collection(db, "testimonials");
  const docRef = await addDoc(testimonialsRef, {
    ...testimonialData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTestimonial = async (id, testimonialData) => {
  const testimonialRef = doc(db, "testimonials", id);
  await updateDoc(testimonialRef, {
    ...testimonialData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTestimonial = async (id) => {
  const testimonialRef = doc(db, "testimonials", id);
  await deleteDoc(testimonialRef);
};