"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

interface DictionaryEntry {
  id: string;
  word: string;
  meaning: string;
  type: string;
  examples: string[];
}

export const DictionaryList = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const q = query(collection(db, "dictionary"), orderBy("word"));
    // No server-side search, so filter client-side for now
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DictionaryEntry));
    if (search.trim()) {
      data = data.filter((d) => d.word.toLowerCase().includes(search.trim().toLowerCase()));
    }
    if (typeFilter.trim()) {
      data = data.filter((d) => d.type.toLowerCase().includes(typeFilter.trim().toLowerCase()));
    }
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          placeholder="Cari kata Jawa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
          placeholder="Filter jenis kata..."
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-center text-blue-700">Memuatkan data...</div>
      ) : entries.length === 0 ? (
        <div className="text-center text-blue-700">Tiada kata dijumpai.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white shadow-lg rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-blue-700">{entry.word}</span>
                <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full ml-2">{entry.type}</span>
              </div>
              <div className="text-blue-900 mb-2">{entry.meaning}</div>
              {entry.examples && entry.examples.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-blue-500 font-semibold mb-1">Contoh ayat:</div>
                  <ul className="list-disc list-inside text-sm text-blue-800">
                    {entry.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 