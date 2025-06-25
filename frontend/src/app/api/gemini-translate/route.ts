import { NextRequest, NextResponse } from "next/server";

const GEMINI_GENKIT_URL = process.env.GEMINI_GENKIT_URL; // Contoh: 'https://your-genkit-endpoint/translate'
const GEMINI_GENKIT_KEY = process.env.GEMINI_GENKIT_KEY; // Optional, jika perlu auth

export async function POST(req: NextRequest) {
  try {
    const { text, tahap } = await req.json();
    if (!text || !tahap) {
      return NextResponse.json({ error: "Input tidak lengkap." }, { status: 400 });
    }
    if (!GEMINI_GENKIT_URL) {
      return NextResponse.json({ error: "Konfigurasi endpoint AI tidak lengkap." }, { status: 500 });
    }
    // Hantar ke Gemini Genkit endpoint
    const res = await fetch(GEMINI_GENKIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(GEMINI_GENKIT_KEY ? { Authorization: `Bearer ${GEMINI_GENKIT_KEY}` } : {}),
      },
      body: JSON.stringify({ text, tahap }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Gagal hubungi AI." }, { status: 502 });
    }
    const data = await res.json();
    if (!data.result) {
      return NextResponse.json({ error: "Tiada hasil dari AI." }, { status: 502 });
    }
    return NextResponse.json({ result: data.result });
  } catch (err: unknown) {
    let message = "Ralat pelayan.";
    if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
      message = (err as { message: string }).message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 