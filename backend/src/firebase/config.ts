import * as firebaseAdmin from "firebase-admin";
import { env } from "../env";

const serviceAccount = JSON.parse(env.app.googleService);

export default firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "gallery-e29e9.appspot.com",
});
