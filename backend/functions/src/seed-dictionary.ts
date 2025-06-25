import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { dictionary } from "./dictionary-data";
import * as path from "path";

const serviceAccount = require(path.resolve(__dirname, "../../serviceAccountKey.json")) as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

async function seed() {
  for (const entry of dictionary) {
    await db.collection("dictionary").add({
      word: entry.jawa,
      meaning: entry.melayu,
      examples: [entry.example],
      type: entry.jawa.match(/(Krama)/i) ? "krama" : "ngoko",
      createdAt: new Date(),
      source: "manual-seed",
    });
  }
  console.log("Seed selesai!");
  process.exit(0);
}

seed();
