"use client";
import { useState } from "react";

const TAHAP = [
  { value: "ngoko", label: "Ngoko (Biasa)" },
  { value: "krama", label: "Krama (Halus)" },
];

export const SentenceBuilder = () => {
  const [input, setInput] = useState("");
  const [tahap, setTahap] = useState("ngoko");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    setError("");
    setResult("");
    if (!input.trim()) {
      setError("Sila masukkan ayat dahulu.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gemini-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tahap }),
      });
      if (!res.ok) throw new Error("Gagal hubungi AI. Cuba lagi.");
      const data = await res.json();
      if (!data.result) throw new Error("Tiada hasil dari AI.");
      setResult(data.result);
    } catch (err: unknown) {
      let message = "Gagal terjemah ayat.";
      if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        message = (err as { message: string }).message;
      }
      setError(message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto animate-fadeIn">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        rows={4}
        placeholder="Contoh: Saya hendak pergi ke pasar untuk membeli sayur."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Pilih Tahap Bahasa:</label>
        <select
          value={tahap}
          onChange={(e) => setTahap(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        >
          {TAHAP.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="loader border-green-600"></span>
        ) : (
          <>
            <span>Terjemah</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-7.5A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h7.5a2.25 2.25 0 002.25-2.25v-3.75m-6-2.25h8.25m0 0l-2.25-2.25m2.25 2.25l-2.25 2.25" />
            </svg>
          </>
        )}
      </button>
      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mt-4">{error}</div>
      )}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Hasil Terjemahan:</h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-lg text-gray-900">{result}</div>
        </div>
      )}
    </div>
  );
}; 