import { createRequire } from "module";
import admin from "firebase-admin";

const require = createRequire(import.meta.url);
const config = require("../FIREBASE-CREDS.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(config),
});

export default admin;
