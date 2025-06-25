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
    // No server-side search, so filter client-side for now
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
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          placeholder="Cari kata Jawa..."
          defaultValue={search}
        />
        <input
          type="text"
          className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
          placeholder="Filter jenis kata..."
          defaultValue={tahap}
        />
      </div>
      {loading ? (
        <div className="text-center text-blue-700">Memuatkan data...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center text-blue-700 col-span-2">Tiada kata dijumpai.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 justify-center items-center">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white shadow rounded-xl p-6 flex flex-col gap-2 relative transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl mx-auto w-full max-w-md items-center text-center"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  {highlightText(entry.word, search)}
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(entry.word)}
                    aria-label={`Dengar sebutan ${entry.word}`}
                    className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    tabIndex={0}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M5 9v6h4l5 5V4l-5 5H5z"/><path stroke="#2563eb" strokeWidth="2" d="M15 9.354v5.292a3 3 0 000-5.292z"/></svg>
                  </button>
                </span>
                {user && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded"
                    >
                      Padam
                    </button>
                  </div>
                )}
              </div>
              <div className="text-blue-900 mb-1">{highlightText(entry.meaning, search)}</div>
              <div className="text-xs text-blue-500 mb-1">Jenis: {entry.type}</div>
              <div className="text-sm text-gray-700">{entry.examples.length > 0 && (
                <>
                  <span className="font-semibold">Contoh:</span> {entry.examples.join('; ')}
                </>
              )}</div>
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