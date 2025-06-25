"use client";
import { useEffect, useState } from "react";

interface Phrase {
  jawa: string;
  melayu: string;
}

interface PhrasesByCategory {
  [category: string]: Phrase[];
}

interface LearningPhrasesProps {
  tahap: "ngoko" | "krama";
}

// Fallback data (boleh ganti dengan fetch Firestore jika mahu)
const PHRASES: Record<"ngoko" | "krama", PhrasesByCategory> = {
  ngoko: {
    "Sapaan & Asas": [
      { jawa: "Piye kabare?", melayu: "Apa khabar?" },
      { jawa: "Apik-apik wae.", melayu: "Khabar baik." },
      { jawa: "Sopo jenengmu?", melayu: "Siapa nama awak?" },
      { jawa: "Jenengku...", melayu: "Nama saya..." },
      { jawa: "Suwun yo.", melayu: "Terima kasih ya." },
      { jawa: "Podo-podo.", melayu: "Sama-sama." },
    ],
    "Makan & Minum": [
      { jawa: "Ayo mangan.", melayu: "Jom makan." },
      { jawa: "Enak tenan!", melayu: "Sedap betul!" },
      { jawa: "Aku luwe.", melayu: "Saya lapar." },
      { jawa: "Aku wis wareg.", melayu: "Saya sudah kenyang." },
      { jawa: "Iki regane piro?", melayu: "Ini harganya berapa?" },
    ],
    "Soalan Lazim": [
      { jawa: "Omahmu nandi?", melayu: "Rumah awak di mana?" },
      { jawa: "Kowe arep nandi?", melayu: "Awak nak ke mana?" },
      { jawa: "Iki opo?", melayu: "Ini apa?" },
    ],
  },
  krama: {
    "Sapaan & Asas": [
      { jawa: "Pripun kabaripun?", melayu: "Apa khabar? (formal)" },
      { jawa: "Sae-sae kemawon.", melayu: "Khabar baik sahaja." },
      { jawa: "Sinten asmanipun panjenengan?", melayu: "Siapa nama anda?" },
      { jawa: "Asma kulo...", melayu: "Nama saya..." },
      { jawa: "Matur nuwun sanget.", melayu: "Terima kasih banyak." },
      { jawa: "Sami-sami.", melayu: "Sama-sama." },
    ],
    "Makan & Minum": [
      { jawa: "Monggo, kita dhahar.", melayu: "Jemput, kita makan." },
      { jawa: "Raosipun eco sanget.", melayu: "Rasanya sangat sedap." },
      { jawa: "Kulo luwe.", melayu: "Saya lapar." },
      { jawa: "Kulo sampun tuwuk.", melayu: "Saya sudah kenyang." },
      { jawa: "Niki reginipun pinten?", melayu: "Ini harganya berapa?" },
    ],
    "Soalan Lazim": [
      { jawa: "Dalemipun panjenengan wonten pundi?", melayu: "Rumah anda di mana?" },
      { jawa: "Panjenengan badhe tindak pundi?", melayu: "Anda hendak ke mana?" },
      { jawa: "Menika punapa?", melayu: "Ini apa?" },
    ],
  },
};

function speak(text: string) {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((v) => v.lang === "jv-ID") || voices.find((v) => v.lang === "id-ID") || null;
  utterance.lang = utterance.voice ? utterance.voice.lang : "id-ID";
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

export const LearningPhrases = ({ tahap }: LearningPhrasesProps) => {
  const [phrases, setPhrases] = useState<PhrasesByCategory>({});

  useEffect(() => {
    // TODO: fetch dari Firestore jika mahu, fallback ke static
    setPhrases(PHRASES[tahap]);
  }, [tahap]);

  if (!phrases || Object.keys(phrases).length === 0) {
    return <div className="text-center text-blue-700">Tiada data frasa.</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {Object.entries(phrases).map(([category, list]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">{category}</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 justify-center items-center">
            {list.map((phrase, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg mx-auto w-full max-w-md text-center"
              >
                <div>
                  <p className="font-semibold text-lg text-blue-900">{phrase.jawa}</p>
                  <p className="text-sm text-gray-600">{phrase.melayu}</p>
                </div>
                <button
                  onClick={() => speak(phrase.jawa)}
                  className="text-blue-600 hover:text-blue-900 transition-colors ml-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`Dengar sebutan: ${phrase.jawa}`}
                  tabIndex={0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 