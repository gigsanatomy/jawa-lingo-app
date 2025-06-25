"use client";
import { SentenceBuilder } from "@/components/SentenceBuilder";

export default function BuilderPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4 animate-fadeIn">
      <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center">Pembina Ayat Dikuasakan AI ✨</h1>
      <p className="text-center text-gray-600 mb-8">Tulis ayat dalam Bahasa Melayu dan AI akan terjemahkannya ke Bahasa Jawa untuk anda.</p>
      <SentenceBuilder />
    </div>
  );
} 