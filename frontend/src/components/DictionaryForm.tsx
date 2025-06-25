"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export const DictionaryForm = () => {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [type, setType] = useState("");
  const [examples, setExamples] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!word.trim() || !meaning.trim() || !type.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, "dictionary"), {
        word: word.trim(),
        meaning: meaning.trim(),
        type: type.trim(),
        examples: examples.split("\n").map((ex) => ex.trim()).filter(Boolean),
        createdBy: user?.email || null,
        createdAt: Timestamp.now(),
      });
      setWord("");
      setMeaning("");
      setType("");
      setExamples("");
      setSuccess("Kata berjaya ditambah!");
    } catch (err: unknown) {
      let message = "Gagal tambah kata.";
      if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        message = (err as { message: string }).message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full mx-auto mt-8 flex flex-col gap-5 border border-blue-100"
    >
      <h2 className="text-xl font-bold text-blue-700 text-center mb-2">Tambah Kata Baru</h2>
      <input
        type="text"
        className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Kata Jawa"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        required
      />
      <input
        type="text"
        className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Maksud (BM/BI)"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        required
      />
      <input
        type="text"
        className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Jenis Kata (nama, kerja, adjektif, dll)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />
      <textarea
        className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Contoh ayat (satu per baris, opsyenal)"
        value={examples}
        onChange={(e) => setExamples(e.target.value)}
        rows={3}
      />
      {error && <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm text-center">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 text-sm text-center">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Sila tunggu..." : "Tambah Kata"}
      </button>
    </form>
  );
}; 