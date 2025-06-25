"use client";
import { AuthForm } from "@/components/AuthForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

interface Progress {
  totalAttempts: number;
  highScore: number;
  streak: number;
}

function calcStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const sorted = dates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const diff = (prev.getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 1.5 && diff > 0.5) {
      streak++;
      prev = sorted[i];
    } else if (diff >= 1.5) {
      break;
    }
  }
  return streak;
}

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    if (!user) return setProgress(null);
    setProgressLoading(true);
    const fetchProgress = async () => {
      const q = query(
        collection(db, "quiz_scores"),
        where("userEmail", "==", user.email),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      const scores = snap.docs.map((doc) => doc.data());
      const totalAttempts = scores.length;
      const highScore = scores.reduce((max, s) => (s.score > max ? s.score : max), 0);
      const dates = scores
        .map((s) => {
          if (s.timestamp && s.timestamp.toDate) return s.timestamp.toDate();
          if (s.timestamp instanceof Date) return s.timestamp;
          return null;
        })
        .filter((d): d is Date => !!d)
        .map((d) => new Date(d.toDateString()));
      // Remove duplicate days
      const uniqueDays = Array.from(new Set(dates.map((d) => d.getTime()))).map((t) => new Date(t));
      const streak = calcStreak(uniqueDays);
      setProgress({ totalAttempts, highScore, streak });
      setProgressLoading(false);
    };
    fetchProgress();
  }, [user]);

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (!user) return <AuthForm />;

  return (
    <div className="flex flex-col items-center gap-8 mt-12">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Selamat Datang ke JawaLingo!</h1>
        <p className="text-blue-900 mb-6">Platform pembelajaran Bahasa Jawa interaktif.</p>
        {progressLoading ? (
          <div className="text-blue-700 mb-4">Memuatkan progress...</div>
        ) : progress ? (
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between bg-blue-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-blue-900">Percubaan Quiz</span>
              <span className="font-bold text-blue-700">{progress.totalAttempts}</span>
            </div>
            <div className="flex justify-between bg-yellow-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-blue-900">Skor Tertinggi</span>
              <span className="font-bold text-yellow-600">{progress.highScore}</span>
            </div>
            <div className="flex justify-between bg-green-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-blue-900">Streak Harian</span>
              <span className="font-bold text-green-600">{progress.streak} hari</span>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-4 mt-4">
          <Link href="/dictionary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">Kamus</Link>
          <Link href="/quiz" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 rounded-lg transition">Quiz</Link>
          <Link href="/leaderboard" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">Leaderboard</Link>
        </div>
      </div>
    </div>
  );
}
