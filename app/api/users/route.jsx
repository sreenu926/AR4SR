import { db } from "@/configs/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userEmail, userName } = await req.json();
  try {
    // If user already exist
    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      // Insert new user
      const data = {
        name: userName,
        email: userEmail,
        credits: 3,
      };
      await setDoc(doc(db, "users", userEmail), {
        ...data,
      });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in POST /api/users:", error); // Log for debugging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
