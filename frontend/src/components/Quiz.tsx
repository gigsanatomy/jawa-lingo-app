"use client";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Modal from './Modal';

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
  const [user] = useAuthState(auth);
  const [saveError, setSaveError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Simpan skor ke Firestore bila quiz tamat
  useEffect(() => {
    if (finished && user && score > 0) {
      const saveScore = async () => {
        try {
          await addDoc(collection(db, "quiz_scores"), {
            userEmail: user.email,
            score,
            timestamp: serverTimestamp(),
          });
        } catch (err: unknown) {
          let message = "Gagal simpan skor.";
          if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
            message = (err as { message: string }).message;
          }
          setSaveError(message);
        }
      };
      saveScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === 'Enter' && feedback) handleNext();
      if (e.key === 'ArrowRight' && feedback) handleNext();
      if (e.key === 'ArrowLeft' && current > 0 && !feedback) setCurrent((c) => c - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedback, finished, current]);

  // Swipe navigation (mobile)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let endX = 0;
    const handleTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      if (endX - startX < -50 && feedback) handleNext(); // swipe left for next
      if (endX - startX > 50 && current > 0 && !feedback) setCurrent((c) => c - 1); // swipe right for prev
    };
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [feedback, finished, current]);

  if (loading) return (
    <div className="max-w-lg w-full mx-auto mt-12">
      <div className="h-4 w-1/2 mx-auto mb-8 bg-blue-100 rounded animate-pulse" />
      <div className="bg-white shadow-xl rounded-xl p-8 flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-1/3 bg-blue-100 rounded mb-4" />
        <div className="h-8 w-2/3 bg-blue-200 rounded mb-6" />
        <div className="h-12 w-full bg-blue-100 rounded mb-4" />
        <div className="h-10 w-1/2 bg-blue-200 rounded mx-auto" />
      </div>
    </div>
  );
  if (questions.length === 0) return <div className="text-center mt-12 text-blue-700">Tiada data untuk quiz.</div>;

  // Modal result
  const showResult = finished;

  const q = questions[current];
  const isJawaToBm = direction === "jawa-bm";
  const questionText = isJawaToBm ? q.word : q.meaning;
  const answerText = isJawaToBm ? q.meaning : q.word;

  // Progress bar
  const progress = ((current + (feedback ? 1 : 0)) / questions.length) * 100;

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
    <div ref={containerRef} className="bg-white shadow-xl rounded-xl p-4 sm:p-8 max-w-md w-full mx-auto mt-6 sm:mt-12 text-center relative select-none flex flex-col items-center justify-center">
      {/* Progress Bar */}
      <div className="sticky top-0 z-20 w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-4">
        <div className="h-2 bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      {/* Modal Result */}
      <Modal open={showResult} onClose={() => { setFinished(false); setCurrent(0); setScore(0); setFeedback(null); setAnswer(""); setQuestions(shuffle(questions)); setSaveError(""); }} title="Quiz Tamat!">
        <div className="text-lg mb-4">Skor anda: <span className="font-bold text-green-600">{score} / {questions.length}</span></div>
        {saveError && <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2">{saveError}</div>}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition mt-4 w-full"
          onClick={() => { setFinished(false); setCurrent(0); setScore(0); setFeedback(null); setAnswer(""); setQuestions(shuffle(questions)); setSaveError(""); }}
        >
          Mula Semula
        </button>
      </Modal>
      {/* Soalan & Jawapan */}
      {!showResult && (
        <>
          <div className="mb-4 text-blue-700 font-bold text-base sm:text-lg">Soalan {current + 1} / {questions.length}</div>
          <div className="mb-6">
            <div className="text-lg text-blue-900 mb-2 font-semibold">
              {isJawaToBm ? "Apa maksud kata Jawa ini?" : "Apa kata Jawa untuk maksud ini?"}
            </div>
            <div className="text-2xl font-extrabold text-blue-700 mb-2 animate-fadeIn transition-all duration-300">{questionText}</div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            <input
              type="text"
              className="border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs text-center text-lg"
              placeholder="Jawapan anda..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!feedback}
              autoFocus
            />
            {feedback && (
              <div className={feedback === "betul"
                ? "bg-green-100 text-green-700 rounded-lg px-4 py-2 text-base font-semibold animate-bounceIn"
                : "bg-red-100 text-red-700 rounded-lg px-4 py-2 text-base font-semibold animate-shake"
              }>
                {feedback === "betul" ? "Betul!" : `Salah. Jawapan: ${answerText}`}
              </div>
            )}
            <button
              type={feedback ? "button" : "submit"}
              className={feedback
                ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg transition w-full"
                : "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition w-full"
              }
              onClick={feedback ? handleNext : undefined}
            >
              {feedback ? (current + 1 < questions.length ? "Soalan Seterusnya" : "Tamat") : "Semak Jawapan"}
            </button>
          </form>
          <div className="mt-6 text-blue-700 text-base">Skor: <span className="font-bold">{score}</span></div>
        </>
      )}
    </div>
  );
}; 