import admin from "firebase-admin";
import { firebaseConfig } from "./firebaseConfig";

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: firebaseConfig.storageBucket,
});

export default app;
