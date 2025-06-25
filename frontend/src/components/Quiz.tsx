"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface DictionaryEntry {
  id: string;
  word: string;
  meaning: string;
  type: string;
  examples: string[];
}

type QuizDirection = "jawa-bm" | "bm-jawa";

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => [Math.random(), v] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export const Quiz = () => {
  const [questions, setQuestions] = useState<DictionaryEntry[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<QuizDirection>("jawa-bm");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "dictionary"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DictionaryEntry));
      setQuestions(shuffle(data).slice(0, 10));
      setCurrent(0);
      setScore(0);
      setFinished(false);
      setFeedback(null);
      setAnswer("");
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    // Randomize direction for each question
    setDirection(Math.random() < 0.5 ? "jawa-bm" : "bm-jawa");
    setAnswer("");
    setFeedback(null);
  }, [current]);

  if (loading) return <div className="text-center mt-12">Memuatkan soalan...</div>;
  if (questions.length === 0) return <div className="text-center mt-12 text-blue-700">Tiada data untuk quiz.</div>;
  if (finished)
    return (
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Quiz Tamat!</h2>
        <div className="text-lg mb-4">Skor anda: <span className="font-bold text-green-600">{score} / {questions.length}</span></div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition mt-4"
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setFinished(false);
            setFeedback(null);
            setAnswer("");
            setQuestions(shuffle(questions));
          }}
        >
          Mula Semula
        </button>
      </div>
    );

  const q = questions[current];
  const isJawaToBm = direction === "jawa-bm";
  const questionText = isJawaToBm ? q.word : q.meaning;
  const answerText = isJawaToBm ? q.meaning : q.word;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) return;
    if (answer.trim().toLowerCase() === answerText.trim().toLowerCase()) {
      setFeedback("betul");
      setScore((s) => s + 1);
    } else {
      setFeedback("salah");
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full mx-auto mt-12 text-center">
      <div className="mb-4 text-blue-700 font-bold">Soalan {current + 1} / {questions.length}</div>
      <div className="mb-6">
        <div className="text-lg text-blue-900 mb-2 font-semibold">
          {isJawaToBm ? "Apa maksud kata Jawa ini?" : "Apa kata Jawa untuk maksud ini?"}
        </div>
        <div className="text-2xl font-extrabold text-blue-700 mb-2">{questionText}</div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        <input
          type="text"
          className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs text-center"
          placeholder="Jawapan anda..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!feedback}
          autoFocus
        />
        {feedback && (
          <div className={feedback === "betul"
            ? "bg-green-100 text-green-700 rounded-lg px-4 py-2 text-sm"
            : "bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm"
          }>
            {feedback === "betul" ? "Betul!" : `Salah. Jawapan: ${answerText}`}
          </div>
        )}
        <button
          type={feedback ? "button" : "submit"}
          className={feedback
            ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-lg transition"
            : "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          }
          onClick={feedback ? handleNext : undefined}
        >
          {feedback ? (current + 1 < questions.length ? "Soalan Seterusnya" : "Tamat") : "Semak Jawapan"}
        </button>
      </form>
      <div className="mt-6 text-blue-700">Skor: <span className="font-bold">{score}</span></div>
    </div>
  );
}; 