"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

interface DictionaryEntry {
  id: string;
  word: string;
  meaning: string;
  type: string;
  examples: string[];
}

interface DictionaryFormProps {
  onSuccess?: () => void;
  initialData?: DictionaryEntry;
}

export const DictionaryForm = ({ onSuccess, initialData }: DictionaryFormProps) => {
  const [word, setWord] = useState(initialData?.word || "");
  const [meaning, setMeaning] = useState(initialData?.meaning || "");
  const [type, setType] = useState(initialData?.type || "");
  const [examples, setExamples] = useState(initialData ? initialData.examples.join('; ') : "");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim() || !type.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      if (isEdit && initialData) {
        await updateDoc(doc(db, "dictionary", initialData.id), {
          word,
          meaning,
          type,
          examples: examples.split(';').map((s) => s.trim()).filter(Boolean),
        });
        setSuccess("Kata berjaya dikemaskini!");
      } else {
        await addDoc(collection(db, "dictionary"), {
          word,
          meaning,
          type,
          examples: examples.split(';').map((s) => s.trim()).filter(Boolean),
          createdAt: Timestamp.now(),
          user: user?.email || null,
        });
        setSuccess("Kata berjaya ditambah!");
        setWord("");
        setMeaning("");
        setType("");
        setExamples("");
      }
      onSuccess?.();
    } catch {
      setSuccess("Gagal kemaskini kata.");
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
      <h2 className="text-xl font-bold text-blue-700 text-center mb-2">{isEdit ? 'Edit Kata' : 'Tambah Kata Baru'}</h2>
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
        placeholder="Contoh ayat (pisahkan dengan ; )"
        value={examples}
        onChange={(e) => setExamples(e.target.value)}
        rows={3}
      />
      {success && <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 text-sm text-center">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Sila tunggu..." : isEdit ? "Simpan Perubahan" : "Tambah Kata"}
      </button>
    </form>
  );
}; 