"use client";
import { useState } from "react";
import { LearningPhrases } from "@/components/LearningPhrases";

const TAHAP = [
  { value: "ngoko", label: "Ngoko (Biasa)" },
  { value: "krama", label: "Krama (Halus)" },
];

export default function PembelajaranPage() {
  const [tahap, setTahap] = useState("ngoko");
  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <div className="flex items-center justify-center gap-6 mb-8 sticky top-4 z-10 bg-blue-50 rounded-xl shadow-md py-3 animate-fadeIn">
        <span className={`font-semibold text-lg ${tahap === "ngoko" ? "text-blue-900" : "text-gray-400"}`}>Ngoko</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={tahap === "krama"}
            onChange={() => setTahap(tahap === "ngoko" ? "krama" : "ngoko")}
            className="sr-only peer"
          />
          <div className="w-16 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-yellow-400 transition-colors duration-300"></div>
          <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${tahap === "krama" ? "translate-x-8" : ""}`}></div>
        </label>
        <span className={`font-semibold text-lg ${tahap === "krama" ? "text-blue-900" : "text-gray-400"}`}>Krama</span>
      </div>
      <LearningPhrases tahap={tahap} />
    </div>
  );
} 