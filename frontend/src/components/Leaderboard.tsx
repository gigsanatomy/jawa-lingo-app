"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

interface ScoreEntry {
  id: string;
  userEmail: string;
  score: number;
  timestamp: Date | string | number | null;
}

export const Leaderboard = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [userScore, setUserScore] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const q = query(collection(db, "quiz_scores"), orderBy("score", "desc"), orderBy("timestamp", "asc"), limit(10));
      const snap = await getDocs(q);
      const data: ScoreEntry[] = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ScoreEntry);
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, []);

  useEffect(() => {
    if (!user) return setUserScore(null);
    const fetchUserScore = async () => {
      const q = query(
        collection(db, "quiz_scores"),
        orderBy("score", "desc"),
        orderBy("timestamp", "asc")
      );
      const snap = await getDocs(q);
      const allScores: ScoreEntry[] = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ScoreEntry);
      const found = allScores.find((s) => s.userEmail === user.email);
      setUserScore(found || null);
    };
    fetchUserScore();
  }, [user]);

  if (loading) return <div className="text-center mt-12">Memuatkan leaderboard...</div>;

  return (
    <div className="max-w-lg mx-auto mt-12">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Leaderboard</h2>
      {user && (
        <div className="mb-6">
          <div className="text-blue-900 font-semibold mb-1">Skor anda:</div>
          {userScore ? (
            <div className="flex items-center justify-between bg-yellow-200 border-2 border-yellow-400 rounded-lg px-4 py-2 mb-2">
              <span className="font-bold">{userScore.userEmail}</span>
              <span className="bg-blue-700 text-white font-bold px-3 py-1 rounded-full">{userScore.score}</span>
            </div>
          ) : (
            <div className="text-gray-500 italic">Belum ada skor</div>
          )}
        </div>
      )}
      <ol className="space-y-2">
        {scores.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
            <span className="font-semibold text-blue-900">{entry.userEmail}</span>
            <span className="bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full">{entry.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}; 