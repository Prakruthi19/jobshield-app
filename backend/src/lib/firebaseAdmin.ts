// backend/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";
import serviceAccountJson from "./serviceAccountKey.json"; // adjust path


if (!admin.apps.length) {
  admin.initializeApp({
       credential: admin.credential.cert(serviceAccountJson as admin.ServiceAccount),
  });
}

export async function verifyIdToken(idToken: string) {
  try {
    console.log(serviceAccountJson);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken; // contains uid, email, etc.
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    throw new Error("Unauthorized");
  }
}
export { admin };
