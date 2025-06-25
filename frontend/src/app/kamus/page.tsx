"use client";
import { useState } from "react";
import { DictionaryList } from "@/components/DictionaryList";
import Modal from '@/components/Modal';
import { DictionaryForm } from '@/components/DictionaryForm';

const TAHAP = [
  { value: "ngoko", label: "Ngoko" },
  { value: "krama", label: "Krama" },
];

const KATEGORI = [
  "Semua",
  "Sapaan & Asas",
  "Makan & Minum",
  "Soalan Lazim",
  // Tambah kategori lain jika perlu
];

export default function KamusPage() {
  const [search, setSearch] = useState("");
  const [tahap, setTahap] = useState<string>("");
  const [kategori, setKategori] = useState<string>("Semua");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 animate-fadeIn relative">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Kamus Bahasa Jawa</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari perkataan Jawa atau Melayu..."
          className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={tahap}
          onChange={(e) => setTahap(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Tahap</option>
          {TAHAP.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {KATEGORI.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      <DictionaryList search={search} tahap={tahap} kategori={kategori} />
      {/* FAB */}
      <button
        className="fixed bottom-8 right-8 z-40 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
        aria-label="Tambah Kata"
        onClick={() => setModalOpen(true)}
      >
        <span className="sr-only">Tambah Kata</span>
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 5v14m7-7H5"/></svg>
      </button>
      {/* Modal Tambah Kata */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Kata Baru">
        <DictionaryForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
} 