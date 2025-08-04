import serviceAccount from "./listing-web-abb-firebase-adminsdk-fbsvc-9661751f63.json" assert { type: "json" };
import admin from "firebase-admin";

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();

// Export the initialized admin object
export default admin;
