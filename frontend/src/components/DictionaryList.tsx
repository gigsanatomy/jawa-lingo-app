"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Modal from './Modal';
import { DictionaryForm } from './DictionaryForm';
import toast from 'react-hot-toast';

interface DictionaryEntry {
  id: string;
  word: string;
  meaning: string;
  type: string;
  examples: string[];
}

interface DictionaryListProps {
  search?: string;
  tahap?: string;
  kategori?: string;
}

export const DictionaryList = ({ search = "", tahap = "", kategori = "Semua" }: DictionaryListProps) => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<DictionaryEntry | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    const q = query(collection(db, "dictionary"), orderBy("word"));
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DictionaryEntry));
    if (search.trim()) {
      data = data.filter((d) => d.word.toLowerCase().includes(search.trim().toLowerCase()));
    }
    if (tahap.trim()) {
      data = data.filter((d) => d.type.toLowerCase().includes(tahap.trim().toLowerCase()));
    }
    if (kategori !== "Semua") {
      data = data.filter((d) => d.type === kategori);
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
  }, [search, tahap, kategori]);

  const handleEdit = (entry: DictionaryEntry) => {
    setEditEntry(entry);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Padam kata ini?")) return;
    try {
      await deleteDoc(doc(db, "dictionary", id));
      fetchEntries();
      toast.success("Kata berjaya dipadam.");
    } catch {
      toast.error("Gagal padam kata.");
    }
  };

  const handlePlayAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'jv-ID';
      window.speechSynthesis.speak(utter);
    }
  };

  function highlightText(text: string, keyword: string) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-blue-900 px-1 rounded">{part}</mark> : part
    );
  }

  // Filter entries sebelum render
  const filteredEntries = entries.filter((entry) => {
    const matchSearch =
      entry.word.toLowerCase().includes(search.toLowerCase()) ||
      entry.meaning.toLowerCase().includes(search.toLowerCase());
    const matchTahap = !tahap || (entry.type && entry.type.toLowerCase().includes(tahap.toLowerCase()));
    const matchKategori = kategori === "Semua" || entry.type === kategori;
    return matchSearch && matchTahap && matchKategori;
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          placeholder="Cari perkataan Jawa atau Melayu..."
          defaultValue={search}
        />
        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
      </div>
      {/* Card Grid */}
      {loading ? (
        <div className="text-center text-green-700 py-16">Memuatkan data...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <i className="fa-solid fa-magnifying-glass text-4xl text-gray-300 mb-4"></i>
          <p className="text-lg">Maaf, tiada hasil ditemui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left mx-auto w-full max-w-md min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                    {highlightText(entry.word, search)}
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(entry.word)}
                      aria-label={`Dengar sebutan ${entry.word}`}
                      className="text-gray-400 hover:text-green-500 transition-colors ml-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                      tabIndex={0}
                    >
                      <i className="fa-solid fa-volume-up fa-lg"></i>
                    </button>
                  </h3>
                </div>
                <p className="text-gray-700 mt-1">{highlightText(entry.meaning, search)}</p>
              </div>
              <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Contoh: <em className="italic">{entry.examples?.[0] || '-'}</em></p>
                <div className="flex gap-2 items-center">
                  <button
                    className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors flex items-center gap-1"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Jelaskan Kata ✨</span>
                  </button>
                  {user && (
                    <>
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold px-3 py-1 rounded-lg border border-yellow-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1 rounded-lg border border-red-200 transition"
                      >
                        Padam
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal Edit Kata */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Kata">
        {editEntry && (
          <DictionaryForm
            key={editEntry.id}
            initialData={editEntry}
            onSuccess={() => {
              setEditModalOpen(false);
              setEditEntry(null);
              fetchEntries();
            }}
          />
        )}
      </Modal>
    </div>
  );
}; 