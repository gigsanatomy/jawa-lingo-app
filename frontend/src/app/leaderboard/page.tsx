"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Leaderboard } from "@/components/Leaderboard";

export default function LeaderboardPage() {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (!user) return <div className="text-center mt-12 text-blue-700 font-bold">Sila log masuk untuk akses leaderboard.</div>;
  return <Leaderboard />;
} 