import * as functions from "firebase-functions/v2";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fetch from "node-fetch";

// Inisialisasi Firebase Admin
initializeApp({
  credential: cert(require("../serviceAccountKey.json")),
});
const db = getFirestore();

const GEMINI_GENKIT_URL = process.env.GEMINI_GENKIT_URL!;
const GEMINI_GENKIT_KEY = process.env.GEMINI_GENKIT_KEY!;

export const gatherAndSeedJawa = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    // Prompt AI
    const prompt = `Senaraikan 100 kata Bahasa Jawa (Ngoko dan Krama), setiap satu dengan:
- kata_jawa
- maksud_bm
- contoh_jawa
- contoh_bm
Formatkan sebagai array JSON.`;

    // Panggil Gemini Genkit endpoint
    const res = await fetch(GEMINI_GENKIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_GENKIT_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("Gagal hubungi Gemini Genkit");
    const data = await res.json();

    let inserted = 0;
    for (const entry of data.result) {
      // Elak duplikasi
      const exists = await db
        .collection("dictionary")
        .where("word", "==", entry.kata_jawa)
        .get();
      if (exists.empty) {
        await db.collection("dictionary").add({
          word: entry.kata_jawa,
          meaning: entry.maksud_bm,
          examples: [entry.contoh_jawa],
          example_translation: entry.contoh_bm,
          type: entry.tahap || "ngoko",
          source: "AI",
          createdAt: new Date(),
        });
        inserted++;
      }
    }
    // Log batch
    await db.collection("gather_logs").add({
      timestamp: new Date(),
      inserted,
      total: data.result.length,
    });
    return null;
  });